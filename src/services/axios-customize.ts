import axios, { AxiosInstance } from 'axios';
import { Mutex } from "async-mutex";
import { callRefreshTokenApi } from './api';

// Define the base URL from environment variables
const baseURL: string = import.meta.env.VITE_BACKEND_URL as string;

// Create an Axios instance with default configurations
const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true
});

const NO_RETRY_HEADER = 'x-no-retry';
const mutex = new Mutex();

const handleRefreshToken = async (): Promise<string | null> => {
  return await mutex.runExclusive(async () => {
      const res = await callRefreshTokenApi()
      if (res && res.data) return res.data.data?.accessToken as string;
      else return null;
  });
};

axiosInstance.interceptors.request.use(function (config) {
  if (typeof window !== "undefined" && window && window.localStorage && window.localStorage.getItem('access_token')) {
      config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('access_token');
  }
  if (!config.headers.Accept && config.headers["Content-Type"]) {
      config.headers.Accept = "application/json";
      config.headers["Content-Type"] = "application/json; charset=utf-8";
  }
  return config;
});

// Response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.config && error.response
      && +error.response.data.status === 401
      && error.config.url !== '/api/v1/auth/login'
      && !error.config.headers[NO_RETRY_HEADER]
    ) {
      const access_token = await handleRefreshToken();
      error.config.headers[NO_RETRY_HEADER] = 'true'
      if (access_token) {
        error.config.headers['Authorization'] = `Bearer ${access_token}`;
        localStorage.setItem('access_token', access_token)
        return axiosInstance.request(error.config);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
