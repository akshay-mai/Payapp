export type IUserProfile = {
  id: string;
  type: string;
  businessEmail: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  company?: any;
  lastLoginAt: string;
  profileImage?: string;
  companyId: string;
}

export type IRegister = {
  first_name: string;
  last_name: string;
  businessEmail: string;
}

export type IRegisterUserResponse = {
 result:{
   access_token: string,
   id: string;
   message: string
 }
}

export type IVerifyOtpResponseType = {
  success: boolean,
  data: any,
  message: string,
}

export type IVerifyOtp = {
  email: string | null;
  otp: string;
}

export type ILogin = {
  email: string;
  password: string
}

export type ILoginResponse = {
  access_token: string;
  refresh_token: string;
  id: string;
}

export type PaginationType = {
  limit: number;
  page: number;
};

export type OptionType = {
  id: string;
  label: string;
  value: string;
}

export type ApiResponse = {
  success: boolean;
  message: string;
  data: any;
}

export type ApiSuccess<T> = {
  success: true;
  message?: string;
  data: T;
}

export type ApiError = {
  success: boolean;
  message: string;
}

export type ApiResponseType<T> = ApiSuccess<T> | ApiError
