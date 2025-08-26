import axios from 'axios'
import type { Category } from '@/types/productDTO'

const API_URL = 'http://localhost:8080/api/category'

// Tạo danh mục
export const createCategory = (category: Category) => axios.post(`${API_URL}`, category)

// Lấy tất cả danh mục (DTO)
export const getAllCategories = () => axios.get<Category[]>(`${API_URL}/all`)

// Lấy danh mục theo id
export const getCategoryById = (id: number) => axios.get<Category>(`${API_URL}/${id}`)

// Sửa danh mục
export const updateCategory = (category: Category) => axios.put(`${API_URL}/update/${category.id}`, category)

// Xóa (soft delete) danh mục
export const deleteCategory = (id: number) => axios.delete(`${API_URL}/delete/${id}`)

// Lấy danh mục theo trạng thái
export const getCategoriesByStatus = (status: number) => axios.get<Category[]>(`${API_URL}/status/${status}`)
