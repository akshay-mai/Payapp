import React, { createContext, ReactNode, useContext, useState } from 'react';
import { ApiResponse, ApiResponseType } from './ContextType';
import { axiosInstance } from '../api';

type ILocationContext = {
  getAllCountry: (search?: string) => Promise<ApiResponseType<ApiResponse>>;
  getAllStatesByCountryId: (countryId?: string, search?: string) => Promise<ApiResponseType<ApiResponse>>;
  getCountryByCountryId: (countryId: string) => Promise<ApiResponseType<ApiResponse>>;
  allCountry: any[];
  allStates: any[];
  countryDataById: any;
  isLoading: boolean;
};

const LocationContext = createContext<ILocationContext | undefined>(undefined);

type ILocationProviderProps = {
  children: ReactNode;
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider: React.FC<ILocationProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allCountry, setAllCountry] = useState<any[]>([]);
  const [allStates, setAllStates] = useState<any[]>([]);
  const [countryDataById, setCountryDataById] = useState<any>({ id: '', label: '' });

  const getAllCountry = async (search?: string): Promise<ApiResponseType<ApiResponse>> => {
    try {
      setIsLoading(true);
      let url = `/country`;
      if(search) {
        url += `&key=${search}`
      }
      const response: any = await axiosInstance.get(url);
      // const resultArray = response.data.result.map(function (el: any) {
      //   return { id: el.id, label: el.countryName, value: el.countryName };
      // });

      setAllCountry( response.data.result);
      return {
        success: true,
        data: response?.data,
        message: response?.data?.message
      }
      // const response: any = await paymentInstance.get(url);
      setAllCountry(response.data.result[0]);
      return { success: true, data: response?.data, message: response?.data?.message };
    } catch (e: any) {
      return { success: false, message: e?.response?.data?.message };
    } finally {
      setIsLoading(false);
    }
  };

  const getAllStatesByCountryId = async (countryId?: string, search?: string): Promise<ApiResponseType<ApiResponse>> => {
    try {
      setIsLoading(true);
      let url = `/state/${countryId}`;
      if(search) {
        url += `&key=${search}`
      }
      const response: any = await axiosInstance.get(url);
      const resultArray = response.data.result.map(function (el: any) {
        return { label: el?.stateName, id: el?.id, value: el?.stateName, countryId: el?.countryId };
      });
      setAllStates(response.data.result[0]);
      return {
        success: true,
        data: response?.data,
        message: response?.data?.message
      }
      // const response: any = await axiosInstance.get(url);
      setAllStates(response.data.result[0]);
      return { success: true, data: response?.data, message: response?.data?.message };
    } catch (e: any) {
      return { success: false, message: e?.response?.data?.message };
    } finally {
      setIsLoading(false);
    }
  };

  const getCountryByCountryId = async (countryId?: string): Promise<ApiResponseType<ApiResponse>> => {
    try {
      setIsLoading(true);
      const response: any = await axiosInstance.get(`/countryById/${countryId}`);
      const el = response?.data?.result;
      setCountryDataById({ id: el?.id, label: el?.countryName });
      return { success: true, data: response?.data, message: response?.data?.message };
    } catch (e: any) {
      return { success: false, message: e?.response?.data?.message };
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: ILocationContext = {
    getAllCountry,
    getAllStatesByCountryId,
    getCountryByCountryId,
    allCountry,
    allStates,
    countryDataById,
    isLoading,
  };

  return <LocationContext.Provider value={contextValue}>{children}</LocationContext.Provider>;
};
