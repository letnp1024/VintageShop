// CategoryDTO tương ứng với backend Java
export interface Category {
  id: number
  categoryName: string
}
export interface ImageDTO {
  id: number
  imageUrl: string
  status: number
}

export interface ProductDTO {
  id: number
  productCode: string
  productName: string
  brand: string
  categoryId: number
  categoryName: string
  userType: string
  material: string
  description: string
  price: number
  isFeatured: boolean
  imageUrls: ImageDTO[] // danh sách ảnh (object)
}
