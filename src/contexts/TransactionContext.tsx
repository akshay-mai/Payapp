import React, { createContext, ReactNode, useContext, useState } from 'react';
import { ApiResponseType, PaginationType } from './ContextType';
import  { paymentInstance } from '../api';

type ITransactionContext = {
  getAllTransaction: (
    paginationDetails: PaginationType,
    platformId: string,
    fromDate: string,
    toDate: string,
    search?: string,
    filters?: any) => Promise<ApiResponseType<any[]>>;
  allTransaction: any[];
  getDownloadTransaction: (fromDate: string, toDate: string, platformId: string) => Promise<ApiResponseType<any>>;
  totalData: number;
  isLoading: boolean;
};

const TransactionContext = createContext<ITransactionContext | undefined>(undefined);

type ITransactionProviderProps = {
  children: ReactNode;
};

export const useTransactionContext = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTheme must be used within a TransactionProvider');
  }
  return context;
};

export const TransactionProvider: React.FC<ITransactionProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allTransaction, setAllTransaction] = useState<any[]>([]);
  const [totalData, setTotalData] = useState<number>(0);

  const getAllTransaction = async (
    paginationDetails: PaginationType,
    platformId: string,
    fromDate: string,
    toDate: string,
    search?: string,
    filters?: any
  ) =>  {
    try {
      setIsLoading(true);
      let url = `/orders/getAll/${platformId}?limit=${paginationDetails.limit}&page=${paginationDetails.page}&fromDate=${fromDate}&toDate=${toDate}`;
      if(search) {
        url += `&keyword=${search}`
      }
      Object.entries(filters || {}).forEach(([key, value]) => {
        if (key && value) {
          url += `&${key}=${value}`;
        }
      });
      const response = await paymentInstance.get(url);
      setAllTransaction(response?.data?.result[0]);
      setTotalData(response?.data?.result[1]);
      return {
        success: response?.status === 201,
        data: response?.data?.result[0],
        message: response?.data?.message
      }
    } catch (e: any) {
      setIsLoading(false);
      return {
        success: false,
        data: null,
        message: e?.response?.data?.message,
      };
    } finally {
      setIsLoading(false);
    }
  }

  const getDownloadTransaction = async (fromDate: string, toDate: string, platformId: string) => {
    try {
      setIsLoading(true);
      let url = `/orders/downloadTransactionReport/${platformId}?&fromDate=${fromDate}&toDate=${toDate}`;
      const response: any = await paymentInstance.get(url, { responseType: 'blob', headers: {
          'Content-Type': 'text/csv'
        }});
      return {
        success: response?.status === 201,
        data: response?.data,
        message: response?.data?.message
      }
    } catch (e: any) {
      setIsLoading(false);
      return {
        success: false,
        data: null,
        message: e?.response?.data?.message,
      };
    } finally {
      setIsLoading(false)
    }
  };

  const contextValue: ITransactionContext = {
    getAllTransaction,
    getDownloadTransaction,
    allTransaction,
    totalData,
    isLoading
  };

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  )
}
