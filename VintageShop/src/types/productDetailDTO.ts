export interface ProductDetailDTO {
  id: number | null
  productDetailCode: string
  productCode: string | null
  productName: string | null
  productPrice: number | null
  style: string
  size: string
  inventoryQuantity: number
  imgUrl: string
  status: number
}
export interface Style {
  color: string
  imageUrl: string
  selected?: boolean // Optional, default false when creating object
}
