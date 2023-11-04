import axios, { AxiosInstance } from 'axios';
import { HttpClient } from './http-client';

export class AxiosHttpClient implements HttpClient {
  private readonly axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({ baseURL });
  }

  async get(url: string, config?: any): Promise<any> {
    const response = await this.axiosInstance.get(url, config);
    return response.data;
  }

  async post(url: string, data: any, config?: any): Promise<any> {
    const response = await this.axiosInstance.post(url, data, config);
    return response.data;
  }
}
