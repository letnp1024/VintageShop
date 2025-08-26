export interface InvoiceStatus {
  icon?: string
  value: number
  labelClient: string
  labelAdmin: string
  color?: string
}

export const allInvoiceStatus: InvoiceStatus[] = [
  {
    icon: 'mdi-cancel',
    value: 0,
    labelClient: 'Đã hủy',
    labelAdmin: 'Khách hàng đã hủy đơn',
    color: 'gray', // đỏ
  },
  {
    icon: 'mdi-clock-outline',
    value: 1,
    labelClient: 'Chờ xác nhận',
    labelAdmin: 'Đã nhận được đơn hàng',
    color: 'primary', // vàng
  },
  {
    icon: 'mdi-package-variant-closed',
    value: 2,
    labelClient: 'Đang được chuẩn bị',
    labelAdmin: 'Đã gửi đơn hàng cho đơn vị vận chuyển',
    color: 'purple', // cam
  },
  {
    icon: 'mdi-truck-delivery-outline',
    value: 3,
    labelClient: 'Đang giao hàng',
    labelAdmin: 'Khách hàng đã nhận được đơn hàng',
    color: 'orange', // xanh dương
  },
  {
    icon: 'mdi-account',
    value: 4,
    labelClient: 'Kiểm tra đơn hàng',
    labelAdmin: 'Khách hàng đã kiểm tra đơn hàng',
    color: 'orange', // xanh lá
  },
  {
    icon: 'mdi-cash',
    value: 5,
    labelClient: 'Thanh toán thành công',
    labelAdmin: 'Khách hàng đã thanh toán đơn hàng',
    color: 'success', // xanh lá
  },
]
