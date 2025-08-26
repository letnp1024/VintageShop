import axios from 'axios'
import type { ChartItem } from '@/types/chartItem'

const API_URL = 'http://localhost:8080/api/statistics'

// Tổng quan doanh thu
export const getSummary = () => axios.get<ChartItem>(`${API_URL}/summary`)

// Doanh thu hôm nay
export const getRevenueToday = () => axios.get<ChartItem>(`${API_URL}/revenue-today`)

// Doanh thu theo tháng
export const getRevenueByMonth = (month: number, year: number) =>
  axios.get<ChartItem>(`${API_URL}/revenue-month`, { params: { month, year } })

// Doanh thu theo năm
export const getRevenueByYear = (year: number) =>
  axios.get<ChartItem>(`${API_URL}/revenue-year`, { params: { year } })

// Doanh thu theo ngày
export const getRevenueByDate = (startDate: string, endDate: string) =>
  axios.get<ChartItem>(`${API_URL}/revenue-date`, { params: { startDate, endDate } })

// Chart doanh thu tổng
export const getAllRevenueChart = () =>
  axios.get<ChartItem[]>(`${API_URL}/chart-all`)

// Chart doanh thu theo tháng
export const getRevenueMonthChart = () =>
  axios.get<ChartItem[]>(`${API_URL}/chart-month`)

// Chart doanh thu theo năm
export const getRevenueYearChart = (year: number) =>
  axios.get<ChartItem[]>(`${API_URL}/chart-year`, { params: { year } })

// Chart doanh thu theo ngày
export const getRevenueByDateChart = (startDate: string, endDate: string) =>
  axios.get<ChartItem[]>(`${API_URL}/chart-date`, { params: { startDate, endDate } })

// Chart doanh thu theo giờ
export const getRevenueHourChart = () =>
  axios.get<ChartItem[]>(`${API_URL}/chart-hour`)

// Sản phẩm bán chạy nhất
export const getTopSellingProducts = (limit: number) =>
  axios.get(`${API_URL}/top-selling`, { params: { limit } })

// Sản phẩm bán ít nhất
export const getLowestSellingProducts = (limit: number) =>
  axios.get(`${API_URL}/lowest-selling`, { params: { limit } })

// Sản phẩm bán chạy nhất theo ngày
export const getTopSellingProductsByDate = (startDate: string, endDate: string, limit: number) =>
  axios.get(`${API_URL}/top-selling-by-date`, { params: { startDate, endDate, limit } })

// Sản phẩm bán ít nhất theo ngày
export const getLowestSellingProductsByDate = (startDate: string, endDate: string, limit: number) =>
  axios.get(`${API_URL}/lowest-selling-by-date`, { params: { startDate, endDate, limit } })

// Sản phẩm tồn kho thấp
export const getLowStockProducts = (threshold: number) =>
  axios.get(`${API_URL}/low-stock`, { params: { threshold } })

// Helper function để format date cho API
export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().slice(0, 19) // Format: YYYY-MM-DDTHH:mm:ss
}
