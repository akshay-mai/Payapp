import React, { createContext, ReactNode, useContext, useState } from 'react';
import { ApiResponseType } from './ContextType';
import { useCustomToast } from './CustomToastContext';
import { paymentInstance } from '../api';

type ICompanyContext = {
  getCompanyDetails: (companyId: string) => Promise<ApiResponseType<any>>;
  companyDetails: any;
  isLoading: boolean;
};

const CompanyContext = createContext<ICompanyContext | undefined>(undefined);

type ICompanyProviderProps = {
  children: ReactNode;
};

export const useCompanyContext = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompanyContext must be used within a CompanyProvider');
  }
  return context;
};

export const CompanyProvider: React.FC<ICompanyProviderProps> = ({ children }) => {
  const { setMessage } = useCustomToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [companyDetails, setCompanyDetails] = useState<any>(null);

  const getCompanyDetails = async (companyId: string): Promise<ApiResponseType<any>> => {
    try {
      setIsLoading(true);
      const response = await paymentInstance.get(`/company/${companyId}`);
      setCompanyDetails(response.data.result);
      return {
        success: true,
        data: response.data.result,
        message: response.data.message
      };
    } catch (e: any) {
      setIsLoading(false);
      return {
        success: false,
        message: e?.response?.data?.message,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: ICompanyContext = {
    getCompanyDetails,
    companyDetails,
    isLoading
  };

  return (
    <CompanyContext.Provider value={contextValue}>
      {children}
    </CompanyContext.Provider>
  );
};
