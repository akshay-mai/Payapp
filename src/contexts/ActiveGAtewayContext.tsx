import React, { useState, createContext, ReactNode, useContext, useEffect } from 'react';
import { paymentInstance, sandboxInstance } from '../api';
import { Gateway ,ApiResponse } from '../types/paymentGateway.type';

type IContext = {
  gateways: Gateway[];
  setGateways: (data: Gateway[]) => void;
  getActiveGateways: () => void;
  isGatewaysLoading: boolean;
  setSelectedGatewayContext:(data:Gateway)=>void;
  selectedGatewayContext:any
};

const ActiveGatewayContext = createContext<IContext | undefined>(undefined);

export const useActiveGatewayContext = () => {
  const context = useContext(ActiveGatewayContext);
  if (!context) {
    throw new Error('useActiveGatewayContext must be used within an ActiveGatewayProvider');
  }
  return context;
};

type IContextProviderProps = {
  children: ReactNode;
};

const ActiveGatewayProvider: React.FC<IContextProviderProps> = ({ children }) => {
  const [isGatewaysLoading, setIsGatewaysLoading] = useState<boolean>(true);
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [selectedGatewayContext, setSelectedGatewayContext] = useState<Gateway|null>(null);
  useEffect(()=>{
    if(localStorage.getItem('getwayId')){

      
    }
  },[])

  const getStatus=async()=>{
    const platformId = localStorage.getItem('platformId');

    try{
      let response=await sandboxInstance.get(`/gateway?appId=${platformId}&status=true&gatewayId=${localStorage.getItem('getwayId')}`)
      
      if(response.status===200){
        // @ts-ignore
        setSelectedGatewayContext(response.data.result[0])
       


      }
    }catch(err){
      console.log(err)
    }

  }
  const getActiveGateways = async (): Promise<ApiResponse<Gateway[]>> => {
    try {
      setIsGatewaysLoading(true);
      const platformId = localStorage.getItem('platformId') || '';
      const response = await paymentInstance.get(`/paymentGateway/getActiveGatewayWithToken?platformId=${platformId}&allGateways=true`);
      setGateways(response.data.result);
      return {
        status: response.status,
        message: response.data.message,
        result: response.data.result
      };
    } catch (e: any) {
      setIsGatewaysLoading(false);
      return {
        status: e.response?.status,
        message: e.response?.data?.message,
        result: []
      };
    } finally {
      setIsGatewaysLoading(false);
    }
  };

  // useEffect(() => {
  //   getActiveGateways();
  // }, []);

  const contextValue = {
    gateways,
    setGateways,
    getActiveGateways,
    isGatewaysLoading,
    setSelectedGatewayContext,
    selectedGatewayContext
  };

  return (
    <ActiveGatewayContext.Provider value={contextValue}>
      {children}
    </ActiveGatewayContext.Provider>
  );
};

export default ActiveGatewayProvider;
