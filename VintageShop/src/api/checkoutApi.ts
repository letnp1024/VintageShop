import axios from 'axios'
import type { ProductDetailDTO } from '@/types/productDetailDTO'
import type { Voucher } from '@/types/voucher'
import type { CheckoutRequest, InvoiceInfo, InputCartItem } from '@/types/checkoutRequest'

import type { UserDTO } from '@/types/userDTO'
const API_URL = 'http://localhost:8080/api/checkout'

//lấy thông tin voucher theo mã
export const getVoucherByCode = (code: string) =>
  axios.get<Voucher>(`${API_URL}/get-voucher`, { params: { code } })

export const getProductDetailByCode = (productDetailCode: string) =>
  axios.get<ProductDetailDTO>(`${API_URL}/get-product-detail`, { params: { productDetailCode } })

// Gửi yêu cầu checkout
export const checkoutOrder = (request: CheckoutRequest) =>
  axios.post(`${API_URL}/add`, request, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

// Lấy thông tin tài khoản hiện tại
export const getMyInfo = () =>
  axios.get<UserDTO>(`${API_URL}/my-info`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
