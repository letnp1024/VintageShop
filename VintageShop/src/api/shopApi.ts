import axios from 'axios'
import type { ProductInfo } from '@/types/productInfo'
import type { Category } from '@/types/productDTO'

const API_URL = 'http://localhost:8080/api/shop'

// Lấy tất cả sản phẩm (ProductInfo)
export const getAllProductInfo = () => axios.get<ProductInfo[]>(`${API_URL}`)

// Lấy tất cả danh mục (CategoryDTO)
export const getAllCategories = () => axios.get<Category[]>(`${API_URL}/categories`)
