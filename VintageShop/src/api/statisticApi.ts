import axios from 'axios'

const API_URL = 'http://localhost:8080/api/statistics'

// Lấy tổng quan doanh thu
export const getSummary = () => axios.get(`${API_URL}/summary`)

// Lấy doanh thu hôm nay
export const getRevenueToday = () => axios.get(`${API_URL}/revenue-today`)

// Lấy doanh thu theo tháng
export const getRevenueByMonth = (month: number, year: number) =>
  axios.get(`${API_URL}/revenue-month`, { params: { month, year } })

// Lấy doanh thu theo năm
export const getRevenueByYear = (year: number) =>
  axios.get(`${API_URL}/revenue-year`, { params: { year } })

// Lấy doanh thu theo khoảng thời gian
export const getRevenueByDate = (startDate: string, endDate: string) =>
  axios.get(`${API_URL}/revenue-date`, { params: { startDate, endDate } })

// Lấy sản phẩm bán chạy nhất
export const getTopSellingProducts = (limit: number) =>
  axios.get(`${API_URL}/top-selling`, { params: { limit } })

// Lấy sản phẩm bán ít nhất
export const getLowestSellingProducts = (limit: number) =>
  axios.get(`${API_URL}/lowest-selling`, { params: { limit } })

// Lấy sản phẩm bán chạy nhất theo khoảng thời gian
export const getTopSellingProductsByDate = (startDate: string, endDate: string, limit: number) =>
  axios.get(`${API_URL}/top-selling-by-date`, { params: { startDate, endDate, limit } })

// Lấy sản phẩm bán ít nhất theo khoảng thời gian
export const getLowestSellingProductsByDate = (startDate: string, endDate: string, limit: number) =>
  axios.get(`${API_URL}/lowest-selling-by-date`, { params: { startDate, endDate, limit } })

// Lấy sản phẩm tồn kho thấp
export const getLowStockProducts = (threshold: number) =>
  axios.get(`${API_URL}/low-stock`, { params: { threshold } })

// Helper function để format date cho API
export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().slice(0, 19) // Format: YYYY-MM-DDTHH:mm:ss
}
