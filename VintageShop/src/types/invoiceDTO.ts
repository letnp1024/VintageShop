export interface InvoiceDTO {
  id: number
  invoiceCode: string
  userId: number
  fullname: string
  phonenumber: string
  email: string
  deliveryAddress: string
  description: string
  paymentMethodId: number
  creationDate: string // ISO string, use Date if you want to parse
  shippingFee: number // BigDecimal as string
  voucherId: number | null
  discountAmount: number // BigDecimal as string
  totalAmount: number // BigDecimal as string
  assignedStaffId: number | null
  imageFirstProduct: string
  status: number
}
