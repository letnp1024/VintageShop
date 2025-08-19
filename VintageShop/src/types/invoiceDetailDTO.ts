export interface InvoiceDetailDTO {
  id: number
  invoiceCode: number
  productName
  productDetailCode: string
  imgUrl: string
  size: string
  style: string
  quantity: number
  price: string // BigDecimal as string
  totalPrice: string // BigDecimal as string
  status: number
}
