import axios from 'axios'
import type { ProductDetailDTO } from '@/types/productDetailDTO'

const API_URL = 'http://localhost:8080/api/product'

export const getProductDetails = (productId: number | string) =>
  axios.get<ProductDetailDTO[]>(`${API_URL}/${productId}/details`)

export const getProductDetailById = (productId: number | string, detailId: number | string) =>
  axios.get<ProductDetailDTO>(`${API_URL}/${productId}/details/${detailId}`)

export const addProductDetail = (productId: number | string, detail: Partial<ProductDetailDTO>) =>
  axios.post<ProductDetailDTO>(`${API_URL}/${productId}/details/add`, detail)

export const updateProductDetail = (
  productId: number | string,
  detailId: number | string,
  detail: Partial<ProductDetailDTO>,
) => axios.put<ProductDetailDTO>(`${API_URL}/${productId}/details/update/${detailId}`, detail)

export const deleteProductDetail = (productId: number | string, detailId: number | string) =>
  axios.delete(`${API_URL}/${productId}/details/delete/${detailId}`)
