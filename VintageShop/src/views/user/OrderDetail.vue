<template>
  <v-overlay :model-value="isUploading" persistent class="align-center justify-center">
    <v-progress-circular indeterminate size="64" color="primary" />
  </v-overlay>
  <!-- Shop Cart Section Begin -->
  <div class="shop-cart spad">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <div class="shop__cart__table">
            <v-stepper alt-labels v-model="status">
              <v-stepper-header>
                <v-stepper-item value="0">
                  <template v-slot.item>
                    <v-icon color="danger" size="40">mdi-cancel</v-icon>
                  </template>
                </v-stepper-item>

                <v-divider opacity="1"></v-divider>

                <v-stepper-item value="1">
                  <template v-slot.item>
                    <v-icon color="primary" size="40">mdi-clock-outline</v-icon>
                  </template>
                </v-stepper-item>

                <v-divider opacity="1"></v-divider>
                <v-stepper-item value="2">
                  <template v-slot.item>
                    <v-icon color="primary" size="40">mdi-package-variant-closed</v-icon>
                  </template>
                </v-stepper-item>

                <v-divider opacity="1"></v-divider>

                <v-stepper-item value="3">
                  <template v-slot.item>
                    <v-icon color="primary" size="40">mdi-truck-delivery-outline</v-icon>
                  </template>
                </v-stepper-item>
                <v-divider opacity="1"></v-divider>
                <v-stepper-item value="4">
                  <template v-slot.item>
                    <v-icon color="primary" size="40">mdi-account</v-icon>
                  </template>
                </v-stepper-item>
                <v-divider opacity="1"></v-divider>
                <v-stepper-item value="5">
                  <template v-slot.item>
                    <v-icon color="success" size="40">mdi-check</v-icon>
                  </template>
                </v-stepper-item>
              </v-stepper-header>
            </v-stepper>
            <v-card class="mt-4" v-if="status === 1 || status === 2">
              <v-tabs v-model="tab" bg-color="transparent">
                <v-tab value="one">Cập nhật địa chỉ</v-tab>
                <v-tab value="two" color="danger">Hủy hóa đơn</v-tab>
              </v-tabs>

              <v-card-text>
                <v-tabs-window v-model="tab">
                  <v-tabs-window-item value="one">
                    <form @submit.prevent="updateAddress">
                      <div class="d-flex align-center">
                        <v-text-field
                          variant="plain"
                          label="Số điện thoại"
                          v-model="phoneNumber"
                          prepend-icon="mdi-phone"
                          :rules="phoneRules"
                          required
                        ></v-text-field>
                        <v-text-field
                          variant="plain"
                          label="Địa chỉ giao hàng"
                          v-model="address"
                          prepend-icon="mdi-map-marker"
                          :rules="addressRules"
                          required
                        ></v-text-field>
                        <v-btn variant="plain" color="success" density="compact" type="submit">
                          Lưu địa chỉ
                        </v-btn>
                      </div>
                    </form>
                  </v-tabs-window-item>
                  <v-tabs-window-item value="two">
                    <form @submit.prevent="cancelOrder">
                      <div class="d-flex align-center">
                        <v-text-field
                          variant="plain"
                          label="Lý do hủy đơn hàng"
                          v-model="cancel"
                          prepend-icon="mdi-comment-text"
                          :rules="cancelRules"
                        ></v-text-field>
                        <v-btn variant="plain" color="danger" density="compact" type="submit">
                          Hủy hóa đơn
                        </v-btn>
                      </div>
                    </form>
                  </v-tabs-window-item>
                </v-tabs-window>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <div class="shop__cart__table">
            <table>
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Giá</th>
                  <th>Số Lượng</th>
                  <th>Tổng</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in details" :key="item.id">
                  <td class="cart__product__item">
                    <img
                      :src="item.imgUrl || require('@/assets/img/shop-cart/cp-1.jpg')"
                      width="90px"
                      height="120px"
                    />
                    <div class="cart__product__item__title">
                      <h6>{{ item.productName }}</h6>
                      <span> ({{ getColorLabel(item.style) }},{{ item.size }})</span>
                      <div class="rating">
                        <i class="fa fa-star" v-for="n in 5" :key="n"></i>
                      </div>
                      <span><router-link to="/reviews">Đánh giá sản phẩm</router-link></span>
                    </div>
                  </td>
                  <td class="cart__price">
                    {{ formatMoney(item.price) }}
                  </td>
                  <td class="cart__quantity">
                    <div class="pro-qty">
                      <input type="text" :value="item.quantity" readonly />
                    </div>
                  </td>
                  <td class="cart__total">
                    {{ formatMoney(item.totalPrice) }}
                  </td>
                </tr>
                <tr>
                  <td class="order__fee">
                    <div class="order__fee__title">
                      <h6>Phí ship</h6>
                    </div>
                  </td>
                  <td class="cart__price"></td>
                  <td class="cart__quantity"></td>
                  <td class="cart__total">{{ formatMoney(invoice?.shippingFee ?? 0) }}</td>
                </tr>
                <tr>
                  <td class="order__fee">
                    <div class="order__fee__title">
                      <h6>Giảm giá</h6>
                    </div>
                  </td>
                  <td class="cart__price"></td>
                  <td class="cart__quantity"></td>
                  <td class="cart__total">{{ formatMoney(invoice?.discountAmount ?? 0) }}</td>
                </tr>
                <tr>
                  <td class="order__fee">
                    <div class="order__total__title">
                      <h6>Thanh toán</h6>
                    </div>
                  </td>
                  <td class="cart__price"></td>
                  <td class="cart__quantity"></td>
                  <td class="order__total">{{ formatMoney(invoice?.totalAmount ?? 0) }}</td>
                </tr>
                <tr>
                  <td class="order__fee">
                    <div class="order__fee__title">
                      <h6>Hình thức thanh toán</h6>
                    </div>
                  </td>
                  <td class="cart__price"></td>
                  <td class="cart__quantity"></td>
                  <td class="cart__total text-primary">
                    {{ getPaymentMethodName(invoice?.paymentMethodId) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Shop Cart Section End -->
</template>
<script setup lang="ts">
import { allInvoiceStatus } from '@/constants/allInvoiceStatus'
import type { InvoiceDetailDTO } from '@/types/invoiceDetailDTO'
import type { InvoiceDTO } from '@/types/invoiceDTO'
import { allColors } from '@/constants/allColors'
import {
  getInvoiceDetails,
  getInvoiceByCode,
  cancelInvoice,
  updateInvoiceAddress,
} from '@/api/userInvoiceDetailApi'
import { useRoute } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
const isUploading = ref(false)
const status = ref(2)
const tab = ref('one')
const address = ref<string>('')
const phoneNumber = ref<string>('')
const cancel = ref<string>('')
const route = useRoute()
const alert = ref<{ show: boolean; type: 'success' | 'error'; message: string }>({
  show: false,
  type: 'success',
  message: '',
})
const allHeaders = [
  { title: 'Ảnh', key: 'imgUrl' },
  { title: 'Tên sản phẩm', key: 'productName' },
  { title: 'Số lượng', key: 'quantity' },
  { title: 'Đơn giá', key: 'price' },
  { title: 'Thành tiền', key: 'totalPrice' },
]
const fixedColumns: string[] = ['id']
const selectedColumns = ref<string[]>(allHeaders.map((h) => h.key))
const visibleHeaders = computed(() =>
  allHeaders.filter((h) => fixedColumns.includes(h.key) || selectedColumns.value.includes(h.key)),
)
const selectableHeaders = computed(() => allHeaders.filter((h) => !fixedColumns.includes(h.key)))

const details = ref<InvoiceDetailDTO[]>([])
const invoice = ref<InvoiceDTO | null>(null)

// Rules validate cho form
const phoneRules = [
  (v: string) => !!v || 'Vui lòng nhập số điện thoại',
  (v: string) => /^0\d{9,10}$/.test(v) || 'Số điện thoại không hợp lệ',
]
const addressRules = [
  (v: string) => !!v || 'Vui lòng nhập địa chỉ giao hàng',
  (v: string) => v.length >= 5 || 'Địa chỉ quá ngắn',
]
const cancelRules = [
  (v: string) => !!v || 'Vui lòng nhập lý do hủy đơn hàng',
  (v: string) => v.length >= 5 || 'Lý do quá ngắn',
]
onMounted(async () => {
  try {
    const invoiceCode = route.params.invoiceCode
    const invoiceDetailRes = await getInvoiceDetails(invoiceCode as string)
    const invoiceRes = await getInvoiceByCode(invoiceCode as string)
    details.value = invoiceDetailRes.data
    invoice.value = invoiceRes.data
    if (invoice.value && typeof invoice.value.status === 'number') {
      status.value = invoice.value.status
      address.value = invoice.value.deliveryAddress || ''
      phoneNumber.value = invoice.value.phonenumber || ''
      let description = invoice.value.description || ''
      invoice.value.description = description + '|| Lý do hủy' + cancel.value
    }
  } catch (e) {
    alert.value = { show: true, type: 'error', message: 'Lỗi tải chi tiết hóa đơn!' }
  }
})

// Tính tổng số sản phẩm
const totalItems = computed(() => details.value.length)

// Tính tổng số lượng
const totalQuantity = computed(() => {
  return details.value.reduce((sum, item) => sum + item.quantity, 0)
})

// Tính tổng tiền
const totalAmount = computed(() => {
  return details.value.reduce((sum, item) => {
    const price =
      typeof item.totalPrice === 'string' ? parseFloat(item.totalPrice) : item.totalPrice || 0
    return sum + price
  }, 0)
})

function updateAddress() {
  if (
    !address.value ||
    !phoneNumber.value ||
    address.value.trim() === '' ||
    phoneNumber.value.trim() === ''
  ) {
    alert.value = {
      show: true,
      type: 'error',
      message: 'Vui lòng nhập đầy đủ địa chỉ và số điện thoại!',
    }
    isUploading.value = false
    return
  }
  isUploading.value = true
  updateInvoiceAddress(invoice.value?.invoiceCode || '', address.value, phoneNumber.value)
    .then(() => {
      alert.value = { show: true, type: 'success', message: 'Cập nhật địa chỉ thành công!' }
      window.location.reload()
    })
    .catch(() => {
      alert.value = { show: true, type: 'error', message: 'Lỗi cập nhật địa chỉ!' }
    })
}
function cancelOrder() {
  if (!cancel.value || cancel.value.trim() === '') {
    alert.value = { show: true, type: 'error', message: 'Vui lòng nhập lý do hủy đơn hàng!' }
    isUploading.value = false
    return
  }
  isUploading.value = true
  cancelInvoice(invoice.value?.invoiceCode || '')
    .then(() => {
      alert.value = { show: true, type: 'success', message: 'Hủy đơn hàng thành công!' }
      window.location.reload()
      // Redirect or refresh page as needed
    })
    .catch(() => {
      alert.value = { show: true, type: 'error', message: 'Lỗi hủy đơn hàng!' }
    })
}
function formatMoney(val: string | number) {
  if (val == null) return ''
  return Number(val).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}

// Lấy tên màu từ mã màu
function getColorLabel(style: string): string {
  if (!style) return 'N/A'
  const found = allColors.find((c) => c.value === style)
  return found ? found.label : style
}
function getStatusLabel(status: number): string {
  const found = allInvoiceStatus.find((s) => s.value === status)
  return found ? found.labelClient : 'Không xác định'
}

// Lấy mã màu để hiển thị (mã màu cố định dựa trên tên màu)

// Format ngày tháng
function formatDate(dateString: string): string {
  if (!dateString) return 'N/A'

  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch (e) {
    return dateString
  }
}

// Lấy text trạng thái hóa đơn
function getInvoiceStatusText(status: number): string {
  const invoiceStatus = allInvoiceStatus.find((s) => s.value === status)
  return invoiceStatus ? invoiceStatus.labelClient : 'Không xác định'
}

// Mapping payment methods
function getPaymentMethodName(methodId: number | null): string {
  if (methodId === null) return 'Không có'

  switch (methodId) {
    case 1:
      return 'Trả sau (COD)'
    case 2:
      return 'Trả trước (VNPay)'
    default:
      return 'Phương thức không xác định'
  }
}
</script>
