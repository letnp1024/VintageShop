import axios from 'axios'
import type { ProductDTO } from '@/types/productDTO'
import type { ProductDetailDTO, Style } from '@/types/productDetailDTO'
import type { ProductInfo } from '@/types/productInfo'
const SHOP_API_URL = 'http://localhost:8080/api/shop'

export const getShopProductDetails = (productCode: string) =>
  axios.get<ProductDetailDTO[]>(`${SHOP_API_URL}/${productCode}`)

export const getShopProductById = (productCode: string) =>
  axios.get<ProductDTO>(`${SHOP_API_URL}/${productCode}/product`)

export const getSelectedProductDetail = (productCode: string, size: string, style: string) =>
  axios.get<ProductDetailDTO>(`${SHOP_API_URL}/${productCode}/filter`, {
    params: { size, style },
  })

export const getColorsOptions = (productCode: string) =>
  axios.get<Style[]>(`${SHOP_API_URL}/${productCode}/styles`)

export const getSizesOptions = (productCode: string) =>
  axios.get<string[]>(`${SHOP_API_URL}/${productCode}/sizes`)

// Lấy sản phẩm liên quan theo productId
export const getRelatedProducts = (productCode: string) =>
  axios.get<ProductInfo[]>(`${SHOP_API_URL}/${productCode}/related`)
