// src/domain/services/authService.ts
import { httpClient } from '../../infrastructure/api/httpClient';
import { LoginRequest, LoginResponse } from '../models/AuthModels';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    // ✅ درخواست به Gateway (پورت 9000)
    const response = await httpClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },
};
