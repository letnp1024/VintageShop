import axios from 'axios'
import type { InvoiceDTO } from '@/types/invoiceDTO'
import type { InvoiceDetailDTO } from '@/types/invoiceDetailDTO'

const API_URL = 'http://localhost:8080/api/userinvoices'

export const getInvoiceDetails = (invoiceCode: string) =>
  axios.get<InvoiceDetailDTO[]>(`${API_URL}/${invoiceCode}/detail`)

export const getInvoiceByCode = (invoiceCode: string) =>
  axios.get<InvoiceDTO>(`${API_URL}/${invoiceCode}/invoice`)

export const cancelInvoice = (invoiceCode: string) => axios.get(`${API_URL}/${invoiceCode}/cancel`)

export const updateInvoiceAddress = (invoiceCode: string, address: string, phone: string) =>
  axios.get(`${API_URL}/${invoiceCode}/address`, { params: { address, phone } })
