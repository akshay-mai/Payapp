import React, { createContext, ReactNode, useContext, useState } from 'react';
import { ApiResponse, ApiResponseType, PaginationType } from './ContextType';
import { RegisterApp, IRegisterAppResponse, UpdateAppDetails } from '../types/appoverview.type';
import { useCustomToast } from './CustomToastContext';
import { axiosInstance, paymentInstance } from '../api';

type IAppOverviewContext = {
  getAppDetails: (
    paginationDetails?: PaginationType,
    search?: string
  ) => Promise<ApiResponseType<IRegisterAppResponse>>;
  getCurrencyDetails: () => Promise<ApiResponseType<ApiResponse>>;
  onAppRegister: (data: RegisterApp) => Promise<ApiResponseType<IRegisterAppResponse>>;
  onAppDetailsUpdate: (data: UpdateAppDetails) => Promise<ApiResponseType<IRegisterAppResponse>>;
  onUpdateAppStatus: (platformId: string,enable:boolean) => Promise<ApiResponseType<ApiResponse>>;
  totalData: number;
  appDetails: IRegisterAppResponse[];
  currencyData: any[];
  isLoading: boolean;
  singleAppDetails:any
  getSingleAppDetail:()=>Promise<ApiResponseType<IRegisterAppResponse>>;
};

const AppOverviewContext = createContext<IAppOverviewContext | undefined>(undefined);

type IAppOverviewProviderProps = {
  children: ReactNode;
};

export const useAppOverviewContext = () => {
  const context = useContext(AppOverviewContext);
  if (!context) {
    throw new Error('useTheme must be used within a AppOverviewProvider');
  }
  return context;
};

export const AppOverviewProvider: React.FC<IAppOverviewProviderProps> = ({ children }) => {
  const { setMessage } = useCustomToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [appDetails, setAppDetails] = useState<IRegisterAppResponse[]>([]);
  const [singleAppDetails, setSingleAppDetails] = useState<IRegisterAppResponse|null>(null);

  const [currencyData, setCurrencyData] = useState<any[]>([]);
  const [totalData, setTotalData] = useState<number>(0);

  const getCurrencyDetails = async (): Promise<ApiResponseType<ApiResponse>> => {
    try {
      setIsLoading(true);
      const response = await paymentInstance.get('/currency');
      const resultArray = response?.data?.result?.map(function (el: any) {
        return { id: el?.id, label: el?.code, value: el.code };
      });
      setCurrencyData(resultArray);
      return {
        success: true,
        data: response?.data,
        message: response?.data?.message
      }
    } catch (e: any) {
      setIsLoading(false);
      return {
        success: false,
        message: e?.response?.data?.message,
      };
    } finally {
      setIsLoading(false)
    }
  };

  const getAppDetails = async (
    paginationDetails?: PaginationType,
    search?: string,
  ): Promise<ApiResponseType<IRegisterAppResponse>> => {
   
    const CompanyId = localStorage.getItem('CompanyId');
  
    if (!CompanyId) {
      return {
        success: false,
        message: 'CompanyId is missing in local storage.',
      };
    }
  
    try {
      setIsLoading(true);
  
      let url = `/app/company/${CompanyId}?page=${paginationDetails?.page || 1}&limit=${paginationDetails?.limit || 10}&sortField=name&sortOrder=ASC`;
  
      if (search && search.trim() !== '') {
        url += `&search=${search}`;
      }
  
      const response = await axiosInstance.get(url);
  
      setAppDetails(response?.data?.result?.apps);
      setTotalData(response?.data?.result?.totalCount);
  
      return {
        success: true,
        data: response?.data?.result,
        message: response?.data?.message,
      };
    } catch (e: any) {
      setIsLoading(false);
      return {
        success: false,
        message: e?.response?.data?.message || 'An error occurred while fetching app details.',
      };
    } finally {
      setIsLoading(false);
    }
  };
  
  const getSingleAppDetail = async (
    paginationDetails?: PaginationType,
    search?: string,
  ): Promise<ApiResponseType<IRegisterAppResponse>> => {
    let platformId = localStorage.getItem('platformId')

    try {
      setIsLoading(true);
     
      const response = await axiosInstance.get(`/app/${platformId}`);
      setSingleAppDetails(response?.data?.result);
    
      return {
        success: true,
        data: response?.data.result,
        message: response?.data?.message
      }
    } catch (e: any) {
      setIsLoading(false);
      return {
        success: false,
        message: e?.response?.data?.message,
      };
    } finally {
      setIsLoading(false)
    }
  };

  const onAppRegister = async (values: RegisterApp): Promise<ApiResponseType<IRegisterAppResponse>> => {
    try {
      setIsLoading(true);
      const {
        email,
        name,
        address,
        country,
        state,
        zipCode,
        logo,
        city,
        taxNumber,
        taxName,
        domain,
        redirectUrl,
        phone
      } = values;
      let data = new FormData();
      data.append('name', name);
      data.append('address', address);
      data.append('state', state);
      data.append('zipCode', zipCode);
      data.append('country', country);
      data.append('domain', domain);
      data.append('taxName', taxName);
      data.append('taxNumber', taxNumber);
      data.append('email', email);
      if(phone){

        data.append('phone', phone || '');
      }

    
      data.append('city', city);
      // data.append('taxNumber', taxName);
      if (redirectUrl) {
        data.append('redirectUrl', redirectUrl);
      }
    
      if (logo) {
        data.append('logo', logo);
      }
      const response = await paymentInstance.post('/app', data, { headers: {
        'Content-Type': 'multipart/form-data'}
      });
      setMessage({
        text: `New Application '${name} has been successfully registered'`,
        show: true,
        success: true,
      })
      return {
        success: response?.data.status,
        data: response?.data?.result,
        message: response?.data?.message
      }
    } catch (e: any) {
      setIsLoading(false);
      setMessage({
        text: e.response.data.message,
        show: true,
        success: false,
      })
      return {
        success: false,
        message: e?.response?.data?.message,
      };
    } finally {
      setIsLoading(false);
    }
  }

  const onAppDetailsUpdate = async (values: UpdateAppDetails): Promise<ApiResponseType<IRegisterAppResponse>> => {
    try {
      setIsLoading(true);
      const {
        email,
        name,
        address,
        country,
        state,
        zipCode,
        logo,
        city,
        taxName,
        taxNumber,
        domain,
        redirectUrl,
        platformId,
        phone
      } = values;
      let data = new FormData();
      
      data.append('name', name);
      data.append('email', email);
      data.append('country', country);
      data.append('address', address);
      data.append('state', state);
      data.append('city', city);
      data.append('zipCode', zipCode);
      data.append('taxName', taxName);
      data.append('taxNumber', taxNumber);
      data.append('phone', phone || '');

      if (logo) {
        data.append('logo', logo);
      }
      if (domain) {
        data.append('domain', domain);
      }
      if (redirectUrl) {
        data.append('redirectUrl', redirectUrl);
      }
    
    
      const response = await paymentInstance.patch(`/app/${platformId}`, data, { headers: {
        'Content-Type': 'multipart/form-data'}
      });
      setMessage({
        text: 'App updated successfully',
        show: true,
        success: true,
      })
      return {
        success: response?.data.status,
        data: response?.data?.result,
        message: response?.data?.message
      }
    } catch (e: any) {
      setIsLoading(false);
      setMessage({
        text: e.response.data.message,
        show: true,
        success: false,
      })
      return {
        success: false,
        message: e?.response?.data?.message,
      };
    } finally {
      setIsLoading(false);
    }
  }

  const onUpdateAppStatus = async (platformId: string, enable: boolean): Promise<ApiResponseType<ApiResponse>> => {
    try {
      setIsLoading(true);
      const response = await paymentInstance.patch(`/app/status/${platformId}`, { IsActive: enable });
      setMessage({
        text: `${enable ? 'App Enabled' : 'App Disabled'}`,
        show: true,
        success: true,
      });
  
      return {
        success: response?.data.status,
        data: response?.data?.result,
        message: response?.data?.message,
      };
    } catch (e: any) {
      setIsLoading(false);
      setMessage({
        text: e.response.data.message.fieldErrors.error,
        show: true,
        success: false,
      });
      return {
        success: false,
        message: e?.response?.data?.message,
      };
    } finally {
      setIsLoading(false);
    }
  };
  

  const contextValue: IAppOverviewContext = {
    getAppDetails,
    getCurrencyDetails,
    onAppRegister,
    onAppDetailsUpdate,
    onUpdateAppStatus,
    totalData,
    appDetails,
    currencyData,
    isLoading,
    singleAppDetails,
    getSingleAppDetail
  };

  return (
    <AppOverviewContext.Provider value={contextValue}>
      {children}
    </AppOverviewContext.Provider>
  )
}
