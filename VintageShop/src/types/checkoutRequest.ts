export interface InvoiceInfo {
  fullname: string
  phonenumber: string
  email: string
  description: string
  deliveryAddress: string
  paymentMethodId: number
  voucherId?: number | null
  assignedStaffId?: number | null
}

export interface InputCartItem {
  productDetailCode: string
  quantity: number
  selected?: boolean
}

export interface CheckoutRequest {
  invoiceInfo: InvoiceInfo
  items: InputCartItem[]
}
