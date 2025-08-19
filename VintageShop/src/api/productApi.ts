import axios from 'axios'
import type { ProductDTO, Category } from '@/types/productDTO'

const API_URL = 'http://localhost:8080/api/products'

export const getAllProducts = () => axios.get<ProductDTO[]>(`${API_URL}/all`)
export const getAllCategory = () => axios.get<Category[]>(`${API_URL}/categories`)
export const getProductById = (id: number | string) =>
  axios.get<ProductDTO>(`${API_URL}/detail/${id}`)
export const createProduct = (product: Partial<ProductDTO>) =>
  axios.post<ProductDTO>(`${API_URL}/add`, product)
export const updateProduct = (id: number | string, product: Partial<ProductDTO>) =>
  axios.put<ProductDTO>(`${API_URL}/update/${id}`, product)
export const deleteProduct = (id: number | string) => axios.delete(`${API_URL}/delete/${id}`)
export const featureProduct = (id: number | string) => axios.put(`${API_URL}/feature/${id}`)
export const unFeatureProduct = (id: number | string) => axios.put(`${API_URL}/unfeature/${id}`)
