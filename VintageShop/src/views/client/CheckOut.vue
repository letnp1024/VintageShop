<template>
  <v-overlay :model-value="isUploading" persistent class="align-center justify-center">
    <v-progress-circular indeterminate size="64" color="primary" />
  </v-overlay>
  <v-alert
    v-if="alert.show"
    :color="alert.type === 'success' ? 'success' : 'error'"
    :icon="alert.type === 'success' ? '$success' : '$error'"
    :title="alert.type === 'success' ? 'Thành công' : 'Lỗi'"
    :text="alert.message"
    class="mb-4"
    variant="tonal"
    border="start"
  />

  <!-- Checkout Section Begin -->
  <div class="checkout spad">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <h6 class="coupon__link">
            <span class="icon_tag_alt"></span> <a href="#">Bạn có mã giảm giá?</a> Nhấp vào đây để
            nhập mã.
          </h6>
        </div>
      </div>
      <form @submit.prevent="submitCheckout" class="checkout__form">
        <div class="row">
          <div class="col-lg-6">
            <h5>Bạn có voucher</h5>
            <div class="discount__content">
              <v-text-field
                rounded="pill"
                variant="outlined"
                type="text"
                placeholder="Nhập mã voucher"
                append-inner-icon=""
                v-model="voucherCode"
              >
                <template #append-inner>
                  <v-btn color="#ffc857" class="ml-2" size="large" rounded @click="applyVoucher">
                    <v-icon>mdi-tag </v-icon>
                    <span class="ml-2">Sử dụng</span>
                  </v-btn>
                </template>
              </v-text-field>
              <span 
                v-if="voucherAlert.show" 
                :class="{
                  'text-success': voucherAlert.type === 'success',
                  'text-error': voucherAlert.type === 'error'
                }"
              >
                {{ voucherAlert.message }}
              </span>
              </div>
            <h5>Chi tiết thanh toán</h5>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="invoiceInfo.fullname"
                  label="Họ và Tên"
                  rounded="pill"
                  variant="outlined"
                  required
                />
                <v-text-field
                  v-model="invoiceInfo.phonenumber"
                  label="Số điện thoại"
                  rounded="pill"
                  variant="outlined"
                  required
                />
                <v-text-field
                  v-model="invoiceInfo.email"
                  label="Email"
                  rounded="pill"
                  variant="outlined"
                  required
                />
                <v-text-field
                  v-model="invoiceInfo.deliveryAddress"
                  label="Địa chỉ giao hàng"
                  rounded="pill"
                  variant="outlined"
                  required
                />
              </v-col>
            </v-row>
          </div>
          <div class="col-lg-1"></div>
          <div class="col-lg-5">
            <div class="checkout__order">
              <h5>Đơn hàng của bạn <v-icon>mdi-cart</v-icon></h5>
              <div class="checkout__order__product">
                <ul>
                  <li>
                    <span class="top__text">Sản phẩm</span>
                    <span class="top__text__right">Tổng</span>
                  </li>
                  <li v-for="(item, index) in cartList" :key="index">
                    <b>{{ item.productDetail.productName }}</b> ({{ item.productDetail.size }},
                    {{ item.productDetail.style }}) x {{ item.cartItem.quantity ?? 1 }}
                    <span>{{
                      formatCurrency(
                        (item.productDetail.productPrice ?? 0) * (item.cartItem.quantity ?? 1),
                      )
                    }}</span>
                  </li>
                </ul>
              </div>
              <div class="checkout__order__total">
                <ul>
                  <li>
                    Tạm tính <span>{{ formatCurrency(subTotal) }}</span>
                  </li>
                  <li>
                    Giảm <span>{{ formatCurrency(discount) }}</span>
                  </li>
                  <li>
                    Tổng cộng <span>{{ formatCurrency(total) }}</span>
                  </li>
                </ul>
              </div>
              <div class="checkout__order__widget">
                <label for="qrcode">
                  Thanh toán bằng mã QR
                  <input
                    type="radio"
                    id="qrcode"
                    name="payment-method"
                    v-model="methodPayment"
                    value="2"
                  />
                  <span class="checkmark"></span>
                </label>
                <label for="cash">
                  Thanh toán bằng tiền mặt khi nhận hàng
                  <input
                    type="radio"
                    id="cash"
                    name="payment-method"
                    v-model="methodPayment"
                    value="1"
                  />
                  <span class="checkmark"></span>
                </label>
              </div>
              <button type="submit" class="site-btn">Đặt hàng</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
  <!-- Checkout Section End -->
</template>
<script setup lang="ts">
import ClientLayout from './ClientLayout.vue'
import { getUserInfo } from '@/utils/auth'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { getProductDetailByCode, checkoutOrder, getMyInfo, getVoucherByCode } from '@/api/checkoutApi'
import type { InputCartItem, InvoiceInfo, CheckoutRequest } from '@/types/checkoutRequest'
import { createVNPayPayment } from '@/api/paymentApi'
import type { ProductDetailDTO } from '@/types/productDetailDTO'
import type { UserDTO } from '@/types/userDTO'
import type { InvoiceDTO } from '@/types/invoiceDTO'
import type { Voucher } from '@/types/voucher'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

const isUploading = ref(false)
const alert = ref<{ show: boolean; type: 'success' | 'error'; message: string }>({
  show: false,
  type: 'success',
  message: '',
})

const router = useRouter()
interface CartProduct {
  productDetail: ProductDetailDTO
  cartItem: InputCartItem
}

const cartList = ref<CartProduct[]>([])
const subTotal = ref(0)
const discount = ref(0)
const total = ref(0)
const voucher = ref<Voucher | null>(null)
const voucherCode = ref<string>('')
const voucherAlert = ref<{ show: boolean; type: 'success' | 'error'; message: string }>({
  show: false,
  type: 'success',
  message: '',
})
const user = ref<UserDTO | null>(null)
const methodPayment = ref<number>(1) // 1: Tiền mặt, 2: VNPay
// Thông tin hóa đơn và đơn hàng
const invoiceInfo = ref<InvoiceInfo>({
  fullname: '',
  phonenumber: '',
  email: '',
  deliveryAddress: '',
  description: '',
  paymentMethodId: 0,
  voucherId: null,
  assignedStaffId: null,
})
const checkoutRequest = ref<CheckoutRequest>({
  invoiceInfo: invoiceInfo.value,
  items: [],
})

onMounted(async () => {
  let cart: InputCartItem[] = []
  try {
    const cartStr = localStorage.getItem('cart')
    if (cartStr) cart = JSON.parse(cartStr)
  } catch {}
  // Filter only selected items
  const selectedCart = cart.filter((item) => item.selected)
  const promises = selectedCart.map(async (item) => {
    console.log(item.productDetailCode)
    const res = await getProductDetailByCode(item.productDetailCode)
    return { productDetail: res.data as ProductDetailDTO, cartItem: item }
  })
  cartList.value = await Promise.all(promises)
  // Tính subTotal
  subTotal.value = cartList.value.reduce(
    (sum, item) => sum + (item.productDetail.productPrice ?? 0) * (item.cartItem.quantity ?? 1),
    0,
  )
  // Tính total
  total.value = subTotal.value - discount.value

  // Nếu đã đăng nhập thì lấy thông tin user từ API
  if (getUserInfo().username !== null) {
    try {
      const res = await getMyInfo()
      user.value = res.data
      invoiceInfo.value.fullname = user.value.fullname

      invoiceInfo.value.phonenumber = user.value.phonenumber
      invoiceInfo.value.email = user.value.email
      invoiceInfo.value.deliveryAddress = user.value.address
      console.log(invoiceInfo.value)
    } catch (e) {
      user.value = null
    }
  }
  
})

// Lấy thông tin voucher theo mã

async function applyVoucher() {
  if (!voucherCode.value) {
    voucherAlert.value = { show: true, type: 'error', message: 'Nhập mã voucher' }
    return
  }

  try {
    const res = await getVoucherByCode(voucherCode.value)
    voucher.value = res.data

    // Tính lại discount và total
    const discountPercentage = voucher.value.discountPercentage ?? 0
    discount.value = (subTotal.value * discountPercentage) / 100
    total.value = subTotal.value - discount.value
    invoiceInfo.value.voucherId = voucher.value.id ?? null

    voucherAlert.value = { show: true, type: 'success', message: 'Áp dụng voucher thành công (giảm ' + discountPercentage + '%)' }
  } catch (error: any) {
    voucher.value = null
    discount.value = 0
    total.value = subTotal.value
    invoiceInfo.value.voucherId = null

    const backendMsg = error.response?.data?.error || error.message || 'Có lỗi xảy ra!'
    voucherAlert.value = { show: true, type: 'error', message: backendMsg }
  }
}


const fetchVNPayUrl = async (amount: number, invoiceCode: string) => {
  try {
    // Gọi API tạo link thanh toán VNPay
    const vnpReturnUrl = `${window.location.origin}/transaction/${invoiceCode}`
    const response = await createVNPayPayment(amount, vnpReturnUrl)
    window.location.href = response.data['url'] // ✅ redirect đến link VNPay
    console.log('VNPay payment URL:', response.data)
  } catch (error) {
    console.error('VNPay error:', error)
  }
}

async function submitCheckout() {
  isUploading.value = true
  invoiceInfo.value.paymentMethodId = methodPayment.value
  // Validate form
  if (
    !invoiceInfo.value.fullname ||
    !invoiceInfo.value.phonenumber ||
    !invoiceInfo.value.email ||
    !invoiceInfo.value.deliveryAddress
  ) {
    alert.value = { show: true, type: 'error', message: 'Nhập đầy đủ thông tin' }
    return
  }
  // Lấy danh sách sản phẩm
  checkoutRequest.value = {
    invoiceInfo: { ...invoiceInfo.value },
    items: cartList.value.map((item) => ({
      productDetailCode: item.cartItem.productDetailCode,
      quantity: item.cartItem.quantity,
      selected: item.cartItem.selected,
    })),
  }
  checkoutRequest.value.invoiceInfo.paymentMethodId = 1
  try {
    // Gọi API tạo link thanh toán VNPay
    const response = await checkoutOrder(checkoutRequest.value)
    const newInvoice = response.data as InvoiceDTO
    alert.value = { show: true, type: 'success', message: 'Tạo hóa đơn thành công' }
    try {
      const cartStr = localStorage.getItem('cart')
      if (cartStr) {
        const cartArr = JSON.parse(cartStr)
        const newCart = cartArr.filter((item: any) => !item.selected)
        localStorage.setItem('cart', JSON.stringify(newCart))
        cartStore.loadCart() // Cập nhật lại giỏ hàng trong store
      }
    } catch {}
    if (Number(methodPayment.value) === 2) {
      console.log(methodPayment.value)
      // Thanh toán bằng tiền mặt, gọi API VNPAY rồi chuyển hướng

      try {
        // Gọi API tạo link thanh toán VNPay
        const vnpReturnUrl = `${window.location.origin}/transaction/${newInvoice.invoiceCode}`
        const response = await createVNPayPayment(newInvoice.totalAmount, vnpReturnUrl)
        console.log('VNPay payment URL:', response.data['url'])
        window.open(response.data['url']) // ✅ redirect đến link VNPay
        console.log('VNPay payment URL:', response.data)
        router.push({ name: 'order-detail', params: { invoiceCode: newInvoice.invoiceCode } })
      } catch (error) {
        console.error('VNPay error:', error)
      }
    } else {
      // Thanh toán bằng tiền mặt, chuyển hướng đến trang chi tiết hóa đơn
      router.push({ name: 'order-detail', params: { invoiceCode: newInvoice.invoiceCode } })
    }
  } catch (error: any) {
    let msg = null
    // Nếu backend trả về JSON có trường message
    if (error?.response?.data?.message) {
      msg = error.response.data.message
    } else if (typeof error.response.data === 'string') {
      msg = error.response.data
    } else if (typeof error.response.data === 'object') {
      msg = JSON.stringify(error.response.data, null, 2)
    }
    alert.value = { show: true, type: 'error', message: msg }
    isUploading.value = false
    setTimeout(() => (alert.value.show = false), 3000)
    return
  }
}

function formatCurrency(value) {
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}
</script>
