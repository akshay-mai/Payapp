import React, { useState, createContext, ReactNode, useContext } from 'react';
import { ApiResponseType, IUserProfile } from './ContextType';
import { axiosInstance, paymentInstance } from '../api';

type IContext = {
  user: IUserProfile;
  setUser: (data: IUserProfile) => void;
  getUserProfile: () => void;
  isProfileLoading: boolean;
}

const UserContext = createContext<IContext | undefined>(undefined);

export const useDefaultContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useTheme must be used within a CustomToastProvider');
  }
  return context;
};

type IContextProviderProps = {
  children: ReactNode;
};

export const UserContextProvider: React.FC<IContextProviderProps> = ({children}) => {
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(true);
  const [user, setUser] = useState<IUserProfile>({
    id: '',
    type: '',
    businessEmail: '',
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    company: {},
    lastLoginAt: '',
    profileImage: '',
    companyId: '',
  });

  const getUserProfile = async (): Promise<ApiResponseType<IUserProfile>> => {
    try {
      setIsProfileLoading(true);
      const response = await axiosInstance.get('/user');
      setUser(response.data.result);
      return {
        success: true,
        data: response.data,
        message: response.data.message
      }
    } catch (e: any) {
      setIsProfileLoading(false);
      return {
        success: false,
        message: e.response?.data?.message
      }
    } finally {
      setIsProfileLoading(false);
    }
  };

  const contextValue = {
    user: user,
    setUser: setUser,
    getUserProfile,
    isProfileLoading
  }

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}
