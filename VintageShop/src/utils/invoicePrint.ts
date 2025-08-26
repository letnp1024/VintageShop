import jsPDF from "jspdf"
import type { InvoiceDTO } from "@/types/invoiceDTO"
import type { InvoiceDetailDTO } from "@/types/invoiceDetailDTO"
import { addRobotoFont } from "@/utils/fonts/roboto" // file font convert sẵn

function formatCurrency(amount: string | number) {
  const num = typeof amount === "string" ? parseFloat(amount) : amount
  return num.toLocaleString("vi-VN") + " ₫"
}

export function exportInvoicePDF(invoice: InvoiceDTO, details: InvoiceDetailDTO[]) {
  const doc = new jsPDF()

  // Đăng ký font Roboto Unicode
  addRobotoFont(doc)
  doc.setFont("Roboto-Regular") // dùng font vừa add

  doc.setFontSize(14)
  doc.text("HÓA ĐƠN BÁN HÀNG", 105, 15, { align: "center" })

  doc.setFontSize(11)
  doc.text(`Mã hóa đơn: ${invoice.invoiceCode}`, 14, 30)
  doc.text(`Ngày tạo: ${new Date(invoice.creationDate).toLocaleString("vi-VN")}`, 14, 38)
  doc.text(`Khách hàng: ${invoice.fullname}`, 14, 46)
  doc.text(`SĐT: ${invoice.phonenumber}`, 14, 54)
  doc.text(`Email: ${invoice.email}`, 14, 62)
  doc.text(`Địa chỉ: ${invoice.deliveryAddress}`, 14, 70)

  let paymentMethod = "Không rõ"
  if (invoice.paymentMethodId === 1) paymentMethod = "Thanh toán khi nhận hàng (COD)"
  if (invoice.paymentMethodId === 2) paymentMethod = "Chuyển khoản"
  if (invoice.paymentMethodId === 3) paymentMethod = "Ví điện tử"
  doc.text(`Phương thức thanh toán: ${paymentMethod}`, 14, 78)

  // Danh sách sản phẩm dạng list
  let y = 95
  doc.setFontSize(12)
  doc.text("Danh sách sản phẩm:", 14, y)
  y += 8

  details.forEach((d, idx) => {
    const line = `${idx + 1}. ${d.productName} (${d.style}, ${d.size}) x${d.quantity} - ${formatCurrency(d.totalPrice)}`
    doc.text(line, 20, y)
    y += 8
  })

  // Tổng kết
  y += 10
  doc.setFontSize(11)
  doc.text(`Tổng số sản phẩm: ${details.length}`, 14, y)
  y += 8
  const totalQuantity = details.reduce((sum, d) => sum + d.quantity, 0)
  doc.text(`Tổng số lượng: ${totalQuantity}`, 14, y)
  y += 8
  doc.text(`Tổng tiền hàng: ${formatCurrency(invoice.totalAmount)}`, 14, y)
  y += 8
  doc.text(`Phí vận chuyển: ${formatCurrency(invoice.shippingFee)}`, 14, y)
  y += 8
  doc.text(`Giảm giá: ${formatCurrency(invoice.discountAmount)}`, 14, y)
  y += 12

  doc.setFontSize(12)
  doc.text(`TỔNG THANH TOÁN: ${formatCurrency(invoice.totalAmount)}`, 14, y)

  doc.save(`HoaDon_${invoice.invoiceCode}.pdf`)
}
