import React, { createContext, ReactNode, useContext, useState } from 'react';
import {
  ApiResponseType,
  IRegisterUserResponse,
  IVerifyOtpResponseType,
  IRegister,
  IVerifyOtp,
  ILogin,
  ILoginResponse,
  ApiResponse,
} from './ContextType';
import { authInstance, axiosInstance } from '../api';
import { useCustomToast } from './CustomToastContext';

type IAuthContext = {
  registerUser: (data: IRegister) => Promise<ApiResponseType<IRegisterUserResponse>>
  verifyEmail: (data: IVerifyOtp) => Promise<ApiResponseType<IVerifyOtpResponseType>>
  resendOtp: (data: string | null) => Promise<ApiResponseType<any>>
  loginUser: (data: ILogin) => Promise<ApiResponseType<ILoginResponse>>;
  logoutUser: () => Promise<ApiResponseType<ApiResponse>>;
  isLoading: boolean;
};

const AuthContext = createContext<IAuthContext | undefined>(undefined);

type IAuthProviderProps = {
  children: ReactNode;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useTheme must be used within a AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<IAuthProviderProps> = ({children}) => {
  const {setMessage} = useCustomToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const registerUser = async (data: IRegister): Promise<ApiResponseType<IRegisterUserResponse>> => {
    try {
      setIsLoading(true);
      const { first_name, last_name, businessEmail } = data;
      const payload = {
        first_name: first_name,
        last_name: last_name,
        businessEmail: businessEmail,
      };
      const response = await axiosInstance.post('/user/createTempUser', payload);
      const applicantData = {
        firstName: first_name,
        lastName: last_name,
        email: businessEmail,
      };
      localStorage.setItem('applicantData', JSON.stringify(applicantData));
      localStorage.setItem('temp_token', response?.data?.result.access_token);
      setMessage({
        text: response.data.result.message,
        show: true,
        success: true,
      });
      return {
        success: true,
        data: response.data.result,
        message: response.data.message
      }
    } catch (e: any) {
      setIsLoading(false);
      setMessage({
        text: e.response.message,
        show: true,
        success: false
      })
      return {
        success: false,
        message: e.response.message
      }
    } finally {
      setIsLoading(false);
    }
  }

  const verifyEmail = async (data: IVerifyOtp): Promise<ApiResponseType<IVerifyOtpResponseType>> => {
    try {
      setIsLoading(true);
      const { email, otp }  = data;
      const payload = {
        email: email,
        otp: otp,
      }
      const response = await axiosInstance.post('/user/verify-email-otp', payload)
      setMessage({
        text: response.data.message,
        success: true,
        show: true
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
        success: false,
        show: true
      })
      return {
        success: false,
        message: e.response.message
      }
    } finally {
      setIsLoading(false);
    }
  }

  const resendOtp = async (email: string | null): Promise<ApiResponseType<any>> => {
    try {
      setIsLoading(true);
      const payload = {
        emailTo: email,
      }
      const response = await axiosInstance.post("/user/send-email-otp", payload)
      setMessage({
        text: response.data.message,
        success: true,
        show: true
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
        success: false,
        show: true
      })
      return {
        success: false,
        message: e.response.message
      }
    } finally {
      setIsLoading(false);
    }
  }

  const loginUser = async (data: ILogin): Promise<ApiResponseType<ILoginResponse>> => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/login', data);
      localStorage.setItem('access_token', response.data.result.access_token);
      localStorage.setItem('refresh_token', response.data.result.refresh_token);
      setMessage({
        text: "login successfully",
        show: true,
        success: true,
      });
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

  const logoutUser = async (): Promise<ApiResponseType<ApiResponse>> => {
    try {
      setIsLoading(true);
      const response = await authInstance.get('/login/session/destroy');

     

      if(response?.data?.isOk){

        localStorage.clear();
        window.location.href = `${process.env.REACT_APP_REDIRECT_AUTH_URL}?redirect_url=${process.env.REACT_APP_FRONTEND_URL}`;
      }

      return {
        success: true,
        data: response.data,
        message: response.data.message
      }
    } catch (e: any) {
      setIsLoading(false);
      // if(e.response.status===401){
      //   localStorage.clear();
      //   window.location.href = `${process.env.REACT_APP_REDIRECT_AUTH_URL}?redirect_url=${process.env.REACT_APP_FRONTEND_URL}`;
  

      // }
      return {
        success: false,
        message: e.response?.data?.message || 'Please try again!'
      }
    } finally {
      setIsLoading(false);
    }
  }

  const contextValue: IAuthContext = {
    registerUser,
    verifyEmail,
    resendOtp,
    loginUser,
    logoutUser,
    isLoading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}
