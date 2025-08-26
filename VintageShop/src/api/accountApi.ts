import axios from 'axios'
import type { UserDTO } from '@/types/userDTO'


const API_URL = 'http://localhost:8080/api/user/profile'

// Lấy thông tin profile người dùng
export const getProfile = () => axios.get<UserDTO>(`${API_URL}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

// Cập nhật thông tin profile người dùng
export const updateProfile = (dto: UserDTO) =>
  axios.put<UserDTO>(`${API_URL}/update`, dto, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
