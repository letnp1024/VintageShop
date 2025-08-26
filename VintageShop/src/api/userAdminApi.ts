import axios from 'axios'
import type { UserDTO } from '@/types/userDTO'

const API_URL = 'http://localhost:8080/api/user/admin'

// Lấy danh sách tất cả người dùng
export const getUserList = () => axios.get<UserDTO[]>(`${API_URL}/list`)

// Thêm người dùng mới
export const addUser = (user: UserDTO) => axios.post<UserDTO>(`${API_URL}/add`, user)

// Cập nhật thông tin người dùng
export const updateUser = (id: number, user: UserDTO) => axios.put<UserDTO>(`${API_URL}/update/${id}`, user)

// Lấy người dùng theo id
export const getUserById = (id: number) => axios.get<UserDTO>(`${API_URL}/${id}`)

// Xóa người dùng
export const deleteUser = (id: number) => axios.delete<string>(`${API_URL}/delete/${id}`)

// Lấy danh sách nhân viên
export const getStaffList = () => axios.get<UserDTO[]>(`${API_URL}/staff-list`)

// Lấy danh sách khách hàng
export const getCustomerList = () => axios.get<UserDTO[]>(`${API_URL}/customer-list`)

// Tìm kiếm nhân viên
export const searchStaff = (keyword: string) => axios.get<UserDTO[]>(`${API_URL}/staff-search`, { params: { keyword } })

// Tìm kiếm khách hàng
export const searchCustomer = (keyword: string) => axios.get<UserDTO[]>(`${API_URL}/customer-search`, { params: { keyword } })

// Bật/tắt trạng thái người dùng
export const toggleUserStatus = (id: number) => axios.put(`${API_URL}/toggle-status/${id}`)

// Thay đổi quyền của người dùng
export const changeUserRole = (id: number, roleId: number) => axios.put(`${API_URL}/change-role/${id}`, null, { params: { roleId } })

// Thống kê số lượng nhân viên và khách hàng
export const getUserStatistics = () => axios.get<{ staff: number; customer: number }>(`${API_URL}/statistics-user`)

// Lấy danh sách người dùng có status = 1
export const getStatusOneUsers = () => axios.get<UserDTO[]>(`${API_URL}/statusOne`)
