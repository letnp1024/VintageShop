import axios from 'axios'

const API_URL = 'http://localhost:8080/api/auth'

// Types for request/response
export interface LoginRequestDTO {
  username: string
  password: string
}

export interface RegisterRequestDTO {
  username: string
  password: string
  fullname: string
  gender: boolean
  phonenumber: string
  address: string
  email: string
}

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
}

export interface LoginResponse {
  token: string
  username: string
  role: string
}

export interface ApiResponse {
  message?: string
  error?: string
}

// Auth API functions
export const login = (loginRequest: LoginRequestDTO) =>
  axios.post<LoginResponse>(`${API_URL}/login`, loginRequest)

export const register = (registerRequest: RegisterRequestDTO) =>
  axios.post<ApiResponse>(`${API_URL}/register`, registerRequest)

export const verifyEmail = (token: string) =>
  axios.get<ApiResponse>(`${API_URL}/verify?token=${token}`)

export const changePassword = (request: ChangePasswordRequest) =>
  axios.post<ApiResponse>(`${API_URL}/change-password`, request, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

export const forgotPassword = (email: string) =>
  axios.post<ApiResponse>(`${API_URL}/forgot-password`, { email })

export const resetPassword = (token: string, newPassword: string) =>
  axios.post<ApiResponse>(`${API_URL}/reset-password?token=${token}`, { newPassword })
