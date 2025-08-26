import axios from 'axios'
import type { Voucher } from '@/types/voucher'

const API_URL = 'http://localhost:8080/api/admin/voucher'

// Lấy tất cả voucher
export const getAllVouchers = () => axios.get<Voucher[]>(`${API_URL}/all`)

// Thêm voucher mới
export const addVoucher = (voucher: Voucher) => axios.post<Voucher>(`${API_URL}/add`, voucher)

// Cập nhật voucher
export const updateVoucher = (id: number, voucher: Voucher) => axios.put<Voucher>(`${API_URL}/update/${id}`, voucher)

// Lấy voucher theo id
export const getVoucherById = (id: number) => axios.get<Voucher>(`${API_URL}/${id}`)

// Xóa voucher (soft delete)
export const deleteVoucher = (id: number) => axios.delete<string>(`${API_URL}/delete/${id}`)
