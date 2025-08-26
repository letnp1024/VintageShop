<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getInvoiceDetails, getInvoiceByCode, updateInvoiceStatus } from '@/api/invoiceDetailApi'
import type { InvoiceDetailDTO } from '@/types/invoiceDetailDTO'
import type { InvoiceDTO } from '@/types/invoiceDTO'
import { allColors } from '@/constants/allColors'
import { allInvoiceStatus } from '@/constants/allInvoiceStatus'
import { exportJsonToExcel } from '@/utils/exportExcel'
import { exportInvoicePDF } from "@/utils/invoicePrint"

function infoInvoicePDF() {
  if (!invoice.value || !details.value.length) return
  exportInvoicePDF(invoice.value, details.value)
}

function exportInvoiceDetails() {
  if (!details.value.length) {
    alert.value = { show: true, type: 'error', message: 'Không có dữ liệu để xuất Excel' }
    return
  }

  const exportData = details.value.map((d) => ({
    'ID': d.id,
    'Mã biến thể': d.productDetailCode,
    'Tên sản phẩm': d.productName,
    'Số lượng': d.quantity,
    'Đơn giá': d.price,
    'Thành tiền': d.totalPrice,
    'Size': d.size,
    'Màu sắc': getColorLabel(d.style)
  }))

  exportJsonToExcel(exportData, 'invoice-details.xlsx', 'InvoiceDetails')
}
const route = useRoute()
const search = ref('')
const alert = ref<{ show: boolean; type: 'success' | 'error'; message: string }>({
  show: false,
  type: 'success',
  message: '',
})

const allHeaders = [
  { title: 'ID', key: 'id' },
  { title: 'Ảnh', key: 'imgUrl' },
  { title: 'Mã biến thể', key: 'productDetailCode' },
  { title: 'Tên sản phẩm', key: 'productName' },
  { title: 'Số lượng', key: 'quantity' },
  { title: 'Đơn giá', key: 'price' },
  { title: 'Thành tiền', key: 'totalPrice' },
  { title: 'Size', key: 'size' },
  { title: 'Màu sắc', key: 'style' },
]
const fixedColumns: string[] = ['id']
const selectedColumns = ref<string[]>(allHeaders.map((h) => h.key))
const visibleHeaders = computed(() =>
  allHeaders.filter((h) => fixedColumns.includes(h.key) || selectedColumns.value.includes(h.key)),
)
const selectableHeaders = computed(() => allHeaders.filter((h) => !fixedColumns.includes(h.key)))

const details = ref<InvoiceDetailDTO[]>([])
const invoice = ref<InvoiceDTO | null>(null)
const step = ref(0)
onMounted(async () => {
  try {
    const invoiceCode = route.params.invoiceCode
    const invoiceDetailRes = await getInvoiceDetails(invoiceCode as string)
    const invoiceRes = await getInvoiceByCode(invoiceCode as string)
    details.value = invoiceDetailRes.data
    invoice.value = invoiceRes.data
    if (invoice.value && typeof invoice.value.status === 'number') {
      step.value = invoice.value.status
    }
  } catch (e) {
    alert.value = { show: true, type: 'error', message: 'Lỗi tải chi tiết hóa đơn!' }
  }
})

const filteredDetails = computed(() => {
  if (!search.value) return details.value
  const keyword = search.value.toLowerCase()
  return details.value.filter(
    (d) => d.id.toString().includes(keyword) || d.productDetailCode.includes(keyword),
  )
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
      return 'Thanh toán khi nhận hàng (COD)'
    case 2:
      return 'Chuyển khoản ngân hàng'
    case 3:
      return 'Thẻ tín dụng/Ghi nợ'
    case 4:
      return 'Ví điện tử'
    default:
      return 'Phương thức không xác định'
  }
}

function goNextStep() {
  if (step.value < allInvoiceStatus.length - 1) {
    step.value++
  }
  if (invoice.value) {
    invoice.value.status = step.value
    if (!window.confirm(`Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng?`)) {
      return
    }
    updateInvoiceStatus(invoice.value.invoiceCode, step.value)
      .then(() => {
        alert.value = { show: true, type: 'success', message: 'Cập nhật trạng thái thành công!' }
      })
      .catch((err) => {
        console.error('Lỗi cập nhật trạng thái:', err)
        alert.value = { show: true, type: 'error', message: 'Lỗi cập nhật trạng thái!' }
      })
  } else {
    alert.value = { show: true, type: 'error', message: 'Không tìm thấy hóa đơn!' }
  }
}
const goToStep = (xstep: number) => {
  step.value = xstep
  if (invoice.value) {
    invoice.value.status = step.value
    if (!window.confirm(`Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng?`)) {
      return
    }
    updateInvoiceStatus(invoice.value.invoiceCode, step.value)
      .then(() => {
        alert.value = { show: true, type: 'success', message: 'Cập nhật trạng thái thành công!' }
      })
      .catch((err) => {
        console.error('Lỗi cập nhật trạng thái:', err)
        alert.value = { show: true, type: 'error', message: 'Lỗi cập nhật trạng thái!' }
      })
  } else {
    alert.value = { show: true, type: 'error', message: 'Không tìm thấy hóa đơn!' }
  }
}
</script>
<template>
  <v-container fluid>
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
    <v-toolbar flat color="transparent">
      <v-btn icon @click="$router.back()" class="mr-2">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title class="text-h5 font-weight-bold">
        Chi tiết hóa đơn #{{ route.params.invoiceCode }}
      </v-toolbar-title>
    </v-toolbar>
    <!-- Nội dung: Form, ảnh, input... -->
    <v-col cols="12" sm="12" md="12" lg="12" xl="11" class="mx-auto">
      <v-card class="pa-4">
        <v-card-title class="d-flex align-center pe-2">
          <!-- Select các cột cần hiển thị -->
          <v-text-field
            v-model="search"
            label="Tìm kiếm"
            prepend-inner-icon="mdi-magnify"
            variant="solo"
            hide-details
            single-line
            density="compact"
          />

          <v-spacer></v-spacer>
          <v-select
            label="Tìm kiếm"
            variant="solo"
            v-model="selectedColumns"
            :items="selectableHeaders"
            item-title="title"
            item-value="key"
            multiple
            style="max-width: 300px"
            hide-details
            single-line
            density="compact"
          >
            <template #selection="{ index }">
              <span v-if="index === 0">Chọn các cột muốn hiển thị</span>
            </template>
          </v-select>
          <v-divider>
            <v-btn variant="elevated" color="success" @click="exportInvoiceDetails">
              <v-icon color="#fffa">mdi-microsoft-excel</v-icon>
              Excel
            </v-btn>
          </v-divider>
        </v-card-title>

        <v-divider></v-divider>

        <!-- Bảng dữ liệu -->
        <v-data-table
          :headers="visibleHeaders"
          :items="filteredDetails"
          :search="search"
          items-per-page="10"
          class="invoice-details-table"
          density="compact"
        >
          <!-- Hiển thị hình ảnh sản phẩm -->
          <template #item.imgUrl="{ item }">
            <v-img
              :src="item.imgUrl || 'https://placehold.co/60x80?text=No+Image'"
              width="60"
              height="80"
              cover
            />
          </template>

          <!-- Hiển thị tên sản phẩm -->
          <template #item.productName="{ item }">
            <div class="font-weight-medium">{{ item.productName || 'Không có tên' }}</div>
          </template>

          <!-- Hiển thị số lượng -->
          <template #item.quantity="{ item }">
            <div class="text-end">{{ item.quantity }}</div>
          </template>

          <!-- Định dạng đơn giá -->
          <template #item.price="{ item }">
            <div class="text-end">{{ formatMoney(item.price) }}</div>
          </template>

          <!-- Định dạng thành tiền -->
          <template #item.totalPrice="{ item }">
            <div class="text-end font-weight-bold">{{ formatMoney(item.totalPrice) }}</div>
          </template>

          <!-- Hiển thị size -->
          <template #item.size="{ item }">
            <v-chip size="small" color="primary" class="text-caption">
              {{ item.size || 'N/A' }}
            </v-chip>
          </template>

          <!-- Hiển thị màu sắc -->
          <template #item.style="{ item }">
            {{ getColorLabel(item.style) }}
          </template>
        </v-data-table>
      </v-card>
      <v-card class="pa-4 mt-4">
        <v-stepper
          alt-labels
          :items="allInvoiceStatus"
          :item-title="'icon'"
          :item-value="'value'"
          v-model="step"
          prev-text=""
        >
          <template v-slot:title="{ title }">
            <v-icon :size="40">{{ title }}</v-icon>
          </template>
          <template v-slot:item="StepperItem">
            <div class="d-flex justify-center">
              <span
                ><v-icon class="pr-2">{{ StepperItem['raw']['icon'] }}</v-icon></span
              >
              {{ StepperItem['raw']['labelAdmin'] }}
            </div>
          </template>
          <template v-slot:item.0="StepperItem">
            <div class="d-flex justify-center">
              <span
                ><v-icon class="pr-2" color="red">{{ StepperItem['raw']['icon'] }}</v-icon></span
              >
              <span class="text-red">{{ StepperItem['raw']['labelAdmin'] }}</span>
            </div>
          </template>
          <template v-slot:item.3="StepperItem">
            <div class="d-flex justify-center">
              <span
                ><v-icon class="pr-2">{{ StepperItem['raw']['icon'] }}</v-icon></span
              >
              <span>{{ StepperItem['raw']['labelAdmin'] }}</span>
              <span>
                <v-btn color="red" variant="text" density="compact" @click="goToStep(6)">
                  Khách hàng không nhận đơn hàng</v-btn
                ></span
              >
            </div>
          </template>
          <template v-slot:item.4="StepperItem">
            <div class="d-flex justify-center">
              <span
                ><v-icon class="pr-2">{{ StepperItem['raw']['icon'] }}</v-icon></span
              >
              <span>{{ StepperItem['raw']['labelAdmin'] }}</span>
              <span>
                <v-btn color="red" variant="text" density="compact" @click="goToStep(6)">
                  Đơn hàng bị trả lại</v-btn
                ></span
              >
            </div>
          </template>
          <template v-slot:item.5="StepperItem">
            <div class="d-flex justify-center">
              <span
                ><v-icon class="pr-2">{{ StepperItem['raw']['icon'] }}</v-icon></span
              >
              <span>{{ StepperItem['raw']['labelAdmin'] }}</span>
              <span>
                <v-btn color="red" variant="text" density="compact" @click="goToStep(6)">
                  Khách hàng muốn trả lại hàng & đủ điều kiện trả</v-btn
                ></span
              >
            </div>
          </template>
          <template v-slot:item.6="StepperItem">
            <div class="d-flex justify-center">
              <span
                ><v-icon class="pr-2">{{ StepperItem['raw']['icon'] }}</v-icon></span
              >
              <span>{{ StepperItem['raw']['labelAdmin'] }}</span>
              <span>
                <v-btn color="success" variant="text" density="compact" @click="goToStep(7)">
                  Xác nhận đủ điều kiện trả hàng</v-btn
                ></span
              >
            </div>
          </template>
          <template v-slot:prev>
            <v-btn :disabled="true"></v-btn>
          </template>
          <template v-slot:next>
            <v-btn
              v-if="allInvoiceStatus[step]?.value !== 0 && allInvoiceStatus[step]?.value < 5"
              color="success"
              variant="elevated"
              @click="goNextStep"
            >
              <v-icon color="white">mdi-check</v-icon>
              Xác nhận
            </v-btn>
          </template>
        </v-stepper>
      </v-card>
      <!-- Thông tin hóa đơn -->
      <v-card class="pa-4 mt-4">
        <v-card-title class="pb-2">
          <div class="d-flex align-center">
            <v-icon icon="mdi-file-document-outline" class="mr-2"></v-icon>
            Thông tin hóa đơn
          </div>
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text v-if="invoice">
          <v-row>
            <v-col cols="12" md="6">
              <div class="d-flex flex-column gap-2">
                <div class="d-flex">
                  <div class="text-subtitle-2 font-weight-bold" style="width: 150px">
                    Mã hóa đơn:
                  </div>
                  <div>{{ invoice.invoiceCode }}</div>
                </div>
                <div class="d-flex">
                  <div class="text-subtitle-2 font-weight-bold" style="width: 150px">Ngày tạo:</div>
                  <div>{{ formatDate(invoice.creationDate) }}</div>
                </div>
                <div class="d-flex">
                  <div class="text-subtitle-2 font-weight-bold" style="width: 150px">
                    Khách hàng:
                  </div>
                  <div>{{ invoice.fullname }}</div>
                </div>
                <div class="d-flex">
                  <div class="text-subtitle-2 font-weight-bold" style="width: 150px">
                    Số điện thoại:
                  </div>
                  <div>{{ invoice.phonenumber }}</div>
                </div>
                <div class="d-flex">
                  <div class="text-subtitle-2 font-weight-bold" style="width: 150px">Email:</div>
                  <div>{{ invoice.email }}</div>
                </div>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <div class="d-flex flex-column gap-2">
                <div class="d-flex">
                  <div class="text-subtitle-2 font-weight-bold" style="width: 150px">
                    Địa chỉ giao hàng:
                  </div>
                  <div>{{ invoice.deliveryAddress }}</div>
                </div>
                <div class="d-flex">
                  <div class="text-subtitle-2 font-weight-bold" style="width: 150px">
                    Phí vận chuyển:
                  </div>
                  <div>{{ formatMoney(invoice.shippingFee) }}</div>
                </div>
                <div class="d-flex">
                  <div class="text-subtitle-2 font-weight-bold" style="width: 150px">Giảm giá:</div>
                  <div>{{ formatMoney(invoice.discountAmount) }}</div>
                </div>
                <div class="d-flex">
                  <div class="text-subtitle-2 font-weight-bold" style="width: 150px">
                    Phương thức thanh toán:
                  </div>
                  <div>{{ getPaymentMethodName(invoice.paymentMethodId) }}</div>
                </div>
                <div class="d-flex">
                  <div class="text-subtitle-2 font-weight-bold" style="width: 150px">
                    Tổng tiền:
                  </div>
                  <div class="text-h6 font-weight-bold text-primary">
                    {{ formatMoney(invoice.totalAmount) }}
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <v-row>
            <v-col cols="12">
              <div class="d-flex align-center">
                <div class="text-subtitle-2 font-weight-bold me-3">Trạng thái:</div>
                {{ getStatusLabel(invoice.status) }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text v-else>
          <v-skeleton-loader type="article"></v-skeleton-loader>
        </v-card-text>
      </v-card>

      <!-- Thẻ tổng kết -->
      <v-card class="mt-4 pa-4">
        <v-card-title class="pb-2">
          <div class="d-flex align-center">
            <v-icon icon="mdi-calculator" class="mr-2"></v-icon>
            Thông tin tổng kết sản phẩm
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div class="d-flex flex-column">
            <div class="d-flex justify-space-between py-2">
              <span class="text-subtitle-1">Tổng số sản phẩm:</span>
              <span class="text-subtitle-1 font-weight-bold">{{ totalItems }} sản phẩm</span>
            </div>
            <div class="d-flex justify-space-between py-2">
              <span class="text-subtitle-1">Tổng số lượng:</span>
              <span class="text-subtitle-1 font-weight-bold">{{ totalQuantity }} đơn vị</span>
            </div>
            <div class="d-flex justify-space-between py-2">
              <span class="text-subtitle-1">Tổng tiền hàng:</span>
              <span class="text-subtitle-1 font-weight-bold">{{ formatMoney(totalAmount) }}</span>
            </div>
            <v-divider class="my-2" v-if="invoice"></v-divider>
            <div class="d-flex justify-space-between py-2" v-if="invoice">
              <span class="text-subtitle-1">Phí vận chuyển:</span>
              <span class="text-subtitle-1">{{ formatMoney(invoice.shippingFee) }}</span>
            </div>
            <div class="d-flex justify-space-between py-2" v-if="invoice">
              <span class="text-subtitle-1">Giảm giá:</span>
              <span class="text-subtitle-1">{{ formatMoney(invoice.discountAmount) }}</span>
            </div>
            <div class="d-flex justify-space-between py-2" v-if="invoice">
              <span class="text-subtitle-1 font-weight-bold">TỔNG THANH TOÁN:</span>
              <span class="text-subtitle-1 font-weight-bold text-primary">{{
                formatMoney(invoice.totalAmount)
              }}</span>
            </div>
          </div>
        </v-card-text>
      </v-card>
<div class="d-flex justify-end pa-2">
  <v-btn color="red" @click="infoInvoicePDF()">
    <v-icon left>mdi-file-pdf-box</v-icon>
    Xuất PDF thông tin hóa đơn
  </v-btn>
</div>
    </v-col>
  </v-container>
</template>