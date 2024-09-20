import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export const getTempAccessToken = () => localStorage.getItem("temp_token");

export const getAccessToken = () => localStorage.getItem("access_token");

export const getRefreshToken = () => localStorage.getItem("refresh_token");

export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
};

export const clearTokens = () => {
  localStorage.clear();
};

let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

const createAxiosInstance = (baseURL) => {
  let refreshingToken = false;
  let isRefreshing = false;

  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    async (config) => {
      let accessToken = localStorage.getItem("access_token");
      const decodedToken = accessToken ? jwtDecode(accessToken) : "";
      const currentTime = Date.now() / 1000;

      if (config?.url !== "/auth/refresh-token" && refreshingToken) {
        return;
      }

      if (decodedToken?.exp && decodedToken.exp < currentTime && config?.url !== "/auth/refresh-token") {
        try {
          const refreshToken = localStorage.getItem("refresh_token");
          if (refreshToken) {
            const headers = {
              Authorization: refreshToken,
            };
            refreshingToken = true;
            const res = await axios.post(
              `${process.env.REACT_APP_BASE_URL}auth/refresh-token`, {},
              { headers }
            );

            if (res) {
              localStorage.setItem("access_token", res.data?.result.accessToken);
              localStorage.setItem("refresh_token", res.data?.result.refreshToken);
              accessToken = res.data?.result?.accessToken;
            }
          }
        } catch (err) {
          console.log("Error refreshing access token:", err);
        } finally {
          refreshingToken = false;
        }
      }

      if (accessToken) {
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

      if (error?.response?.status === 401) {
        if ((error?.response?.data?.statusCode === 401 || error?.response?.data?.httpStatus === 401) && !originalRequest._retry) {
          originalRequest._retry = true;

          if (!isRefreshing) {
            isRefreshing = true;

            try {
              const response = await axios.post(
                `${process.env.REACT_APP_BASE_URL}auth/refresh-token`, {},
                {
                  headers: {
                    refresh_token: getRefreshToken(),
                    'Content-Type': 'application/json',
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

              return instance(originalRequest);
            } catch (err) {
              isRefreshing = false;
              clearTokens();
              window.location.href = `${process.env.REACT_APP_FRONTEND_URL}`;
              return Promise.reject(err);
            }
          } else {
            return new Promise((resolve) => {
              subscribeTokenRefresh((token) => {
                originalRequest.headers['Authorization'] = 'Bearer ' + token;
                resolve(instance(originalRequest));
              });
            });
          }
        }
      } else if (error?.InvalidTokenError) {
        clearTokens();
        window.location.href = `${process.env.REACT_APP_FRONTEND_URL}`;
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const axiosInstance = createAxiosInstance(process.env.REACT_APP_BASE_URL);
