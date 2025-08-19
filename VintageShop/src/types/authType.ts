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
