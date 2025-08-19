import axios from 'axios'
import type { InvoiceDTO } from '@/types/invoiceDTO'

const API_URL = 'http://localhost:8080/api/invoice'

export const getAllInvoices = () => axios.get<InvoiceDTO[]>(`${API_URL}/all`)
export const getTodayInvoices = () => axios.get<InvoiceDTO[]>(`${API_URL}/today`)
export const getInvoiceById = (id: number | string) => axios.get<InvoiceDTO>(`${API_URL}/${id}`)
export const updateInvoiceStatus = (id: number | string, status: number) =>
  axios.put(`${API_URL}/${id}/update-status`, null, { params: { status } })
