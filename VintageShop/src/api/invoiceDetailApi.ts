import axios from 'axios'
import type { InvoiceDetailDTO } from '@/types/invoiceDetailDTO'
import type { InvoiceDTO } from '@/types/invoiceDTO'

const API_URL = 'http://localhost:8080/api/invoice'

export const getInvoiceDetails = (invoiceCode: number | string) =>
  axios.get<InvoiceDetailDTO[]>(`${API_URL}/${invoiceCode}/detail`)

export const getInvoiceDetailById = (invoiceCode: number | string, detailId: number | string) =>
  axios.get<InvoiceDetailDTO>(`${API_URL}/${invoiceCode}/detail/${detailId}`)

// Lấy thông tin hóa đơn theo mã hóa đơn
export const getInvoiceByCode = (invoiceCode: string) =>
  axios.get<InvoiceDTO>(`${API_URL}/${invoiceCode}/detail/invoice`)

// Cập nhật trạng thái hóa đơn
export const updateInvoiceStatus = (invoiceCode: string, status: number) =>
  axios.put(`${API_URL}/${invoiceCode}/detail/status?status=${status}`)
