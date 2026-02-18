import { API_ENDPOINTS } from '@/constants';
import type { ApiResponse, LoginResponse, StatusResponse } from '@/types';
import httpClient from './http';

export const controlService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    return httpClient.post(API_ENDPOINTS.LOGIN, { username, password });
  },

  logout: async (): Promise<ApiResponse> => {
    return httpClient.post(API_ENDPOINTS.LOGOUT);
  },

  getStatus: async (detailed?: boolean): Promise<StatusResponse> => {
    const params = detailed ? { detailed: 'true' } : {};
    return httpClient.get(API_ENDPOINTS.STATUS, { params });
  },

  startRound: async (): Promise<ApiResponse> => {
    return httpClient.post(API_ENDPOINTS.START_ROUND);
  },

  closeBetting: async (roundId: string): Promise<ApiResponse> => {
    return httpClient.post(API_ENDPOINTS.CLOSE_BETTING, { roundId });
  },

  inputResult: async (roundId: string, result: number[]): Promise<ApiResponse> => {
    return httpClient.post(API_ENDPOINTS.INPUT_RESULT, { roundId, result });
  },

  confirmResult: async (roundId: string): Promise<ApiResponse> => {
    return httpClient.post(API_ENDPOINTS.CONFIRM_RESULT, { roundId });
  },

  getLogs: async (page?: number, limit?: number): Promise<unknown> => {
    return httpClient.get(API_ENDPOINTS.LOGS, { params: { page, limit } });
  },
};
