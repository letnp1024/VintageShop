import axios from 'axios'
const API_URL = 'http://localhost:8080/api/payment'

// Tạo link thanh toán VNPay
export const createVNPayPayment = (totalAmount: number, vnpReturnUrl: string) =>
  axios.get<string>(`${API_URL}/createVNPay`, {
    params: {
      total_amount: totalAmount,
      vnp_returnUrl: vnpReturnUrl,
    },
  })
