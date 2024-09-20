import React, { createContext, useContext, ReactNode } from 'react';
import { axiosInstance } from '../api';

type UpdateGatewayStatusResponse = {
  status: number;
  message: string;
};

type UpdateGatewayStatusContextType = {
  updateGatewayStatus: (platformId: string, gatewayId: string, accessToken: string) => Promise<UpdateGatewayStatusResponse>;
};

const UpdateGatewayStatusContext = createContext<UpdateGatewayStatusContextType | undefined>(undefined);

export const useUpdateGatewayStatusContext = () => {
  const context = useContext(UpdateGatewayStatusContext);
  if (!context) {
    throw new Error('useUpdateGatewayStatusContext must be used within an UpdateGatewayStatusProvider');
  }
  return context;
};

type UpdateGatewayStatusProviderProps = {
  children: ReactNode;
};

export const UpdateGatewayStatusProvider: React.FC<UpdateGatewayStatusProviderProps> = ({ children }) => {
  const updateGatewayStatus = async (platformId: string, gatewayId: string, accessToken: string): Promise<UpdateGatewayStatusResponse> => {
    try {
      const response = await axiosInstance.patch(`/withdrawals/updateGatewayStatus/${platformId}/${gatewayId}`, null, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      return {
        status: response.status,
        message: response.data.message,
      };
    } catch (error: any) {
      return {
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'An error occurred',
      };
    }
  };

  return (
    <UpdateGatewayStatusContext.Provider value={{ updateGatewayStatus }}>
      {children}
    </UpdateGatewayStatusContext.Provider>
  );
};
