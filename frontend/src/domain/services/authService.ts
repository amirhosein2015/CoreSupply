import { httpClient } from '../../infrastructure/api/httpClient';
import { LoginRequest, LoginResponse } from '../models/AuthModels';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    // آدرس دقیق اندپوینت لاگین در Ocelot: /auth/login
    // (طبق فایل ocelot.json شما: /auth/{everything} -> identity-api)
    const response = await httpClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },
};
