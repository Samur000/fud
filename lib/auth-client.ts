import { api } from './api';
import { User } from './store';

export interface LoginFormData {
  phone: string;
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  phone: string;
  email: string;
  password: string;
  accept_terms: boolean;
  role: 'buyer' | 'seller';
}

export interface LoginResponse {
  user: User;
  session: {
    id: string;
    expiresAt: string;
  };
}

export interface SignupResponse {
  user: User;
  email_verification_required?: boolean;
  phone_verification_required?: boolean;
}

export const authClient = {
  async login(data: LoginFormData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/email/login', data);
    if (response.error) {
      throw new Error(response.error.message);
    }
    return response.data!;
  },

  async signup(data: SignupFormData): Promise<SignupResponse> {
    const response = await api.post<SignupResponse>('/auth/email/signup', data);
    if (response.error) {
      throw new Error(response.error.message);
    }
    return response.data!;
  },

  async sendPhoneVerification(): Promise<void> {
    const response = await api.post('/auth/phone/send-verify', {});
    if (response.error) {
      throw new Error(response.error.message);
    }
  },

  async verifyPhoneOtp(code: string): Promise<void> {
    const response = await api.post('/auth/phone/verify', { code });
    if (response.error) {
      throw new Error(response.error.message);
    }
  },

  async me(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    if (response.error) {
      throw new Error(response.error.message);
    }
    return response.data!;
  },

  async logout(): Promise<void> {
    const response = await api.post('/auth/logout', {});
    if (response.error) {
      throw new Error(response.error.message);
    }
  },

  async refresh(): Promise<void> {
    const response = await api.post('/auth/refresh', {});
    if (response.error) {
      throw new Error(response.error.message);
    }
  },

  async sendEmailVerification(): Promise<void> {
    const response = await api.post('/auth/email/send-verify', {});
    if (response.error) {
      throw new Error(response.error.message);
    }
  },
}; 