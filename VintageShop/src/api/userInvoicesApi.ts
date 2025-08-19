import { InvoiceDTO } from '@/types/invoiceDTO'
import axios from 'axios'

const API_URL = 'http://localhost:8080/api/userinvoices'

// API function để lấy danh sách hóa đơn của user hiện tại
export const getMyInvoices = () =>
  axios.get<InvoiceDTO[]>(`${API_URL}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
