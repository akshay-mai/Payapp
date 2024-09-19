import axios from 'axios';
// import { path } from '../constants';
import { jwtDecode } from "jwt-decode";


export const getTempAccessToken = () => localStorage.getItem("temp_token");

export const getAccessToken = () => localStorage.getItem("access_token");

export const getRefreshToken = () => localStorage.getItem("refresh_token");

export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
};

export const clearTokens = () => {
  localStorage.clear();
};
let refreshSubscribers:any = [];
 
const subscribeTokenRefresh = (cb:any) => {
  refreshSubscribers.push(cb);
};
const onRefreshed = (token:any) => {
  refreshSubscribers.map((cb:any) => cb(token));
  refreshSubscribers = [];
};

const createAxiosInstance = (baseURL: string | undefined) => {
let refreshingToken = false;
let isRefreshing = false;


  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    async(config:any) => {
      let accessToken = localStorage.getItem("access_token");
      const decodedToken: any = accessToken ? jwtDecode(accessToken) : "";
      const currentTime = Date.now() / 1000;
      if (config?.url !== "/auth/refresh-token" && refreshingToken) {
        return;
      }
      if (
        decodedToken?.exp &&
        decodedToken.exp < currentTime &&
        config?.url !== "/auth/refresh-token"
      ) {
        try {
          const refreshToken = localStorage.getItem("refresh_token");
          if (refreshToken) {
            const headers = {
              Authorization: refreshToken,
            };
            refreshingToken = true;
            const res = await axios.post(
              `${process.env.REACT_APP_BASE_URL}auth/refresh-token`,{},
              {headers}
            );
          
          
            if(res){

              localStorage.setItem("access_token", res.data?.result.accessToken);
              localStorage.setItem("refresh_token", res.data?.result.refreshToken);
              accessToken = res.data?.result?.accessToken;
            }
          
          }
        } catch (err) {
         
          // localStorage.clear();
          // if (process.env.REACT_APP_FRONTEND_BASE_URL) {    
          //   window.location.href = process.env.REACT_APP_FRONTEND_BASE_URL;
           
          // }
          console.log("Error refreshing access token:", err);
        } finally {
          refreshingToken = false;
        }
      }
     

      if (accessToken) {
        // console.log('config  in access token ==== ',config)
        config.headers["Authorization"] = "Bearer " + accessToken;
      }
     
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      // const refreshToken = getRefreshToken();
     

      // if (error.response && error.response.data.httpStatus === 404) {
      //   // window.location.href = path.PAGE_NOT_FOUND;
      // } else if (
      //   refreshToken &&
      //   error.response &&
      //   (error.response.data.statusCode === 401||error.response.data.httpStatus === 401 )&&
      //   !originalRequest._retry
      // ) {
      //   originalRequest._retry = true;
      //   try {
      //     const headers = { 
      //       refresh_token: `${refreshToken}`,
      //     };
      //     const res = await axios.post(`${process.env.REACT_APP_BASE_URL}refresh-token`, {},{ headers });
      //     if(res?.data?.result?.access_token){

      //       setTokens(res.data.result.access_token, res.data.result.refresh_token);
      //     }
      //     originalRequest.headers.Authorization = `Bearer ${res.data.result.access_token}`;
      //     return axios(originalRequest);
      //   } catch (error) {
      //     // clearTokens();
      //     // window.location.href = `${process.env.REACT_APP_REDIRECT_AUTH_URL}?redirect_url=${process.env.REACT_APP_FRONTEND_URL}`;
      //   }
      // }
      // return Promise.reject(error);

      // amit login 
      let err=JSON.stringify(error)
   console.log('err==', err)
      if (error?.response?.status === 401) {
        if (
          (error?.response?.data?.statusCode===401||error?.response?.data?.httpStatus===401) &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
   
          if (!isRefreshing) {
            isRefreshing = true;
          
   
            try {
              const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}auth/refresh-token`,{},
                {
                  headers: {
                    refresh_token: getRefreshToken(),
                    'content-type': 'application/json',
                  },
                }
              );
   
              const {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
              } = response.data.result;
   
              localStorage.setItem('access_token', newAccessToken);
              localStorage.setItem('refresh_token', newRefreshToken);
   
              isRefreshing = false;
              onRefreshed(newAccessToken);
   
              return axiosInstance(originalRequest);
            } catch (err) {
              isRefreshing = false;
              // clearStorageAndRedirect();
              clearTokens()
              window.location.href = `${process.env.REACT_APP_FRONTEND_URL}`;
              return Promise.reject(err);
            }
          } else {
            return new Promise((resolve) => {
              subscribeTokenRefresh((token:any) => {
                originalRequest.headers['Authorization'] = 'Bearer ' + token;
                resolve(axiosInstance(originalRequest));
              });
            });
          }
        }
      }else if(error?.InvalidTokenError){
      
        clearTokens()
        window.location.href = `${process.env.REACT_APP_FRONTEND_URL}`

      }
      return Promise.reject(error);


    }
  );

  return instance;
};

let env= localStorage.getItem('env')
export const axiosInstance = createAxiosInstance(process.env.REACT_APP_BASE_URL);
