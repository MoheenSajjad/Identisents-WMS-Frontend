import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { apiUrl } from '@/config';

interface RequestOptions {
  signal?: AbortSignal;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';
}

abstract class BaseApiClient {
  protected instance: AxiosInstance;

  constructor(baseURL: string, timeout: number = 60000) {
    this.instance = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  protected setupInterceptors(): void {
    this.instance.interceptors.request.use(config => {
      const token = sessionStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.instance.interceptors.response.use(
      response => response,
      error => {
        const { status } = error.response || {};
        if (status === 401 || status === 403) {
          sessionStorage.removeItem('authData');
          sessionStorage.removeItem('token');
          window.location.href = '/login';
        }
        if (axios.isCancel(error)) {
          return Promise.reject({ name: 'AbortError', message: 'Request was cancelled' });
        }
        return Promise.reject(error);
      }
    );
  }

  protected buildConfig(options?: RequestOptions): AxiosRequestConfig {
    const config: AxiosRequestConfig = {};

    if (options?.signal) {
      config.signal = options.signal;
    }

    if (options?.headers) {
      config.headers = { ...config.headers, ...options.headers };
    }

    if (options?.responseType) {
      config.responseType = options.responseType;
    }

    return config;
  }

  protected async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.request(config);
    return response.data;
  }
}

class ApiClient extends BaseApiClient {
  constructor() {
    super(apiUrl || '', 60000);
  }

  async get<T>(url: string, options?: RequestOptions): Promise<T> {
    const config = this.buildConfig(options);
    return this.request<T>({
      method: 'GET',
      url,
      params: options?.params,

      ...config,
    });
  }

  async post<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    const config = this.buildConfig(options);
    return this.request<T>({
      method: 'POST',
      url,
      data,
      ...config,
    });
  }

  async put<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    const config = this.buildConfig(options);
    return this.request<T>({
      method: 'PUT',
      url,
      data,
      ...config,
    });
  }

  async patch<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    const config = this.buildConfig(options);
    return this.request<T>({
      method: 'PATCH',
      url,
      data,
      ...config,
    });
  }

  async delete<T>(url: string, options?: RequestOptions): Promise<T> {
    const config = this.buildConfig(options);
    return this.request<T>({
      method: 'DELETE',
      url,
      ...config,
    });
  }
}

export const apiClient = new ApiClient();
export { ApiClient, type RequestOptions };
