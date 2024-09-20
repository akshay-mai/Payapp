import React, { createContext, ReactNode, useContext, useState } from 'react';
import { ApiResponse, ApiResponseType, OptionType } from './ContextType';
import {
  AddPaymentGatewayType,
  IAllPaymentGatewayResponse, UpdateActiveGatewayPriorityType,
  UpdatePaymentGatewayType,

} from '../types/paymentGateway.type';
import { useCustomToast } from './CustomToastContext';
import { paymentInstance } from '../api';

type ISettingsContext = {
  onGenerateApiKey: (platformId: string) => Promise<ApiResponseType<ApiResponse>>;
  onDeleteApiKey: (platformId: string) => Promise<ApiResponseType<ApiResponse>>;
  onGetPaymentGatewayList: (platformId: string) => Promise<ApiResponseType<ApiResponse>>;
  onGetAllPaymentMethodList: (gatewayName: string) => Promise<ApiResponseType<ApiResponse>>;
  getAllActiveGateway: (platformId: string) => Promise<ApiResponseType<IAllPaymentGatewayResponse>>;
  getAllActiveGatewayPriority: (
    platformId: string,
    methodId: string | undefined
  ) => Promise<ApiResponseType<ApiResponse>>;
  onAddPaymentGateway: (
    values: AddPaymentGatewayType
  ) => Promise<ApiResponseType<IAllPaymentGatewayResponse>>;
  onUpdatePaymentGateway: (
    values: UpdatePaymentGatewayType
  ) => Promise<ApiResponseType<IAllPaymentGatewayResponse>>;
  onUpdatePaymentGatewayStatus: (
    platformId: string,
    gatewayId: string
  ) => Promise<ApiResponseType<ApiResponse>>;
  onUpdateActivePaymentGatewayPriority: (
    platformId: string,
    values: UpdateActiveGatewayPriorityType[]
  ) => Promise<ApiResponseType<ApiResponse>>;
  apiKey: string;
  paymentGatewayList: OptionType[];
  paymentMethodList: OptionType[];
  activeGatewayPriorityData: any[];
  allPaymentGatewayData: IAllPaymentGatewayResponse[];
  isLoading: boolean;
};

const SettingsContext = createContext<ISettingsContext | undefined>(undefined);

type ISettingsProviderProps = {
  children: ReactNode;
};

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useTheme must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<ISettingsProviderProps> = ({ children }) => {
  const { setMessage } = useCustomToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [paymentGatewayList, setPaymentGatewayList] = useState<OptionType[]>([]);
  const [paymentMethodList, setPaymentMethodList] = useState<OptionType[]>([]);
  const [activeGatewayPriorityData, setActiveGatewayPriorityData] = useState<any[]>([]);
  const [allPaymentGatewayData, setAllPaymentGatewayData] = useState<IAllPaymentGatewayResponse[]>([]);

  const onGenerateApiKey = async (platformId: string): Promise<ApiResponseType<ApiResponse>> => {
    try {
      setIsLoading(true);
      const payload = {
        platformId: platformId,
      };
      const response = await paymentInstance.post('/platform/genearateApiKey', payload);
      setApiKey(response?.data?.result);
      setMessage({
        text: response.data.message,
        show: true,
        success: true,
      })
      return {
        success: true,
        data: response?.data,
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
      setIsLoading(false)
    }
  };

  const onDeleteApiKey = async (platformId: string): Promise<ApiResponseType<ApiResponse>> => {
    try {
      setIsLoading(true);
      const payload = {
        platformId: platformId,
      };
      const response = await paymentInstance.post('/platform/deleteApiKey', payload);
      setMessage({
        text: response.data.message,
        show: true,
        success: true,
      })
      return {
        success: true,
        data: response?.data,
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
      setIsLoading(false)
    }
  };

  const onGetPaymentGatewayList = async (
    platformId: string
  ): Promise<ApiResponseType<ApiResponse>> => {
    try {
      setIsLoading(true);
      const response = await paymentInstance.get(`/paymentGateway/list?platformId=${platformId}`);
      const paymentGatewayData = Object?.entries(response?.data?.result)?.map(([id, label]) => ({
        id,
        label: label as string,
        value: label as string
      }));
      setPaymentGatewayList(paymentGatewayData);
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

  const onGetAllPaymentMethodList = async (
    gatewayName: string
  ): Promise<ApiResponseType<ApiResponse>> => {
    try {
      setIsLoading(true);
      const response = await paymentInstance.get(`/paymentMethod/list?gatewayName=${gatewayName}`);
      setPaymentMethodList(response?.data?.result);
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

  const getAllActiveGateway = async (
    platformId: string
  ): Promise<ApiResponseType<IAllPaymentGatewayResponse>> => {
    try {
      setIsLoading(true);
      let url = `/paymentGateway/getActiveGatewayWithToken?platformId=${platformId}&allGateways=true`;
      const response = await paymentInstance.get(url);
      setAllPaymentGatewayData(response?.data?.result);
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

  const getAllActiveGatewayPriority = async (
    platformId: string,
    methodId: string | undefined
  ): Promise<ApiResponseType<ApiResponse>> => {
    try {
      setIsLoading(true);
      let url = `/paymentGateway/getActiveGatewayPriority?platformId=${platformId}&methodId=${methodId}`
      const response = await paymentInstance.get(url);
      const responseData = response?.data?.result;
      const sortedData = responseData.sort((a: any, b: any) => a.priority - b.priority);
      setActiveGatewayPriorityData(sortedData);
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

  const onAddPaymentGateway = async (
    values: AddPaymentGatewayType
  ): Promise<ApiResponseType<IAllPaymentGatewayResponse>> => {
    try {
      setIsLoading(true);
      const { accessKey, accessSecret, merchantId, redirectUrl, gatewayName, mode, paymentMethods, platformId } = values;
      const payload = {
        accessKey: accessKey,
        ...(accessSecret && { accessSecret: accessSecret }),
        redirectUrl: redirectUrl,
        gatewayName: gatewayName,
        paymentMethods: paymentMethods,
        ...(merchantId && { merchantId: merchantId }),
        mode: mode,
        platformId: platformId,
      };
      const response = await paymentInstance.post('/paymentGateway/addPaymentGateway', payload);
      setMessage({
        text: response.data.message,
        show: true,
        success: true,
      })
      return {
        success: true,
        data: response.data.result,
        message: response.data.message
      }
    } catch (e: any) {
      setIsLoading(false);
      setMessage({
        text: e.response.data.message,
        show: true,
        success: false
      })
      return {
        success: false,
        message: e.response.data.message
      }
    } finally {
      setIsLoading(false);
    }
  }

  const onUpdatePaymentGateway = async (
    values: UpdatePaymentGatewayType
  ): Promise<ApiResponseType<IAllPaymentGatewayResponse>> => {
    try {
      setIsLoading(true);
      const { accessKey, accessSecret, merchantId, redirectUrl, id, platformId, mode, paymentMethods } = values;
      const payload = {
        id: id,
        accessKey: accessKey,
        ...(accessSecret && { accessSecret: accessSecret, }),
        redirectUrl: redirectUrl,
        merchantId: merchantId,
        paymentMethods: paymentMethods,
        mode: mode,
      };
      const response = await paymentInstance.patch(`/paymentGateway/editGateway?platformId=${platformId}`, payload);
      setMessage({
        text: response.data.message,
        show: true,
        success: true,
      })
      return {
        success: true,
        data: response.data.result,
        message: response.data.message
      }
    } catch (e: any) {
      setIsLoading(false);
      setMessage({
        text: e.response.data.message,
        show: true,
        success: false
      })
      return {
        success: false,
        message: e.response.data.message
      }
    } finally {
      setIsLoading(false);
    }
  }

  const onUpdatePaymentGatewayStatus = async (
    platformId: string,
    gatewayId: string
  ): Promise<ApiResponseType<ApiResponse>> => {
    try {
      setIsLoading(true);
      const url = `/paymentGateway/updateGatewayStatus/${platformId}/${gatewayId}`;
      const response = await paymentInstance.patch(url);
      setMessage({
        text: response.data.message,
        show: true,
        success: true,
      })
      return {
        success: true,
        data: response.data.result,
        message: response.data.message
      }
    } catch (e: any) {
      setIsLoading(false);
      setMessage({
        text: e.response.data.message,
        show: true,
        success: false
      })
      return {
        success: false,
        message: e.response.data.message
      }
    } finally {
      setIsLoading(false);
    }
  }

  const onUpdateActivePaymentGatewayPriority = async (
    platformId: string,
    values: UpdateActiveGatewayPriorityType[]
  ): Promise<ApiResponseType<ApiResponse>> => {
    try {
      setIsLoading(true);
      const payload = values;
      const url = `paymentGateway/updateActiveGatewayPriority?platformId=${platformId}`;
      const response = await paymentInstance.patch(url, payload);
      setMessage({
        text: response.data.message,
        show: true,
        success: true,
      })
      return {
        success: true,
        data: response.data.result,
        message: response.data.message
      }
    } catch (e: any) {
      setIsLoading(false);
      setMessage({
        text: e.response.data.message,
        show: true,
        success: false
      })
      return {
        success: false,
        message: e.response.data.message
      }
    } finally {
      setIsLoading(false);
    }
  }

  const contextValue: ISettingsContext = {
    onGenerateApiKey,
    onDeleteApiKey,
    onAddPaymentGateway,
    onUpdatePaymentGateway,
    onUpdatePaymentGatewayStatus,
    onUpdateActivePaymentGatewayPriority,
    onGetPaymentGatewayList,
    getAllActiveGatewayPriority,
    onGetAllPaymentMethodList,
    getAllActiveGateway,
    paymentGatewayList,
    paymentMethodList,
    activeGatewayPriorityData,
    allPaymentGatewayData,
    apiKey,
    isLoading
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  )
}
