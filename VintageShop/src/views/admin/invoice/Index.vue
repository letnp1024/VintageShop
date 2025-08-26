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
      <v-toolbar-title class="text-h5 font-weight-bold"> Bảng hóa đơn </v-toolbar-title>
    </v-toolbar>
    <!-- Nội dung: Form, ảnh, input... -->
    <v-col cols="12" sm="12" md="12" lg="12" xl="11" class="mx-auto">
      <v-card class="pa-4">
        <v-tabs v-model="tab" bg-color="transparent" class="mb-6">
          <v-tab value="all">Tất cả </v-tab>
          <v-badge :content="waitCount" color="blue" offset-x="10" offset-y="8">
            <v-tab value="waiting">Chờ xác nhận</v-tab>
          </v-badge>
          <v-badge :content="prepareCount" color="purple" offset-x="10" offset-y="8">
            <v-tab value="preparing">Đang chuẩn bị</v-tab>
          </v-badge>
          <v-badge :content="shipCount" color="orange" offset-x="10" offset-y="8">
            <v-tab value="shipping">Đang giao</v-tab>
          </v-badge>
          <v-badge :content="returnCount" color="red" offset-x="10" offset-y="8">
            <v-tab value="returning">Hoàn trả</v-tab>
          </v-badge>
          <v-tab value="success" class="text-success">Thành công</v-tab>
          <v-tab value="cancel" class="text-red">Đã hủy</v-tab>
        </v-tabs>
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
            <v-btn variant="elevated" color="success" @click="exportInvoices">
              <v-icon color="#fffa">mdi-microsoft-excel</v-icon>
              Excel
            </v-btn>
          </v-divider>
        </v-card-title>

        <v-divider></v-divider>

        <!-- Bảng dữ liệu -->
        <v-data-table
          :headers="visibleHeaders"
          :items="filteredInvoices"
          :search="search"
          items-per-page="5"
        >
          <template #item.imageFirstProduct="{ item }">
            <v-img :src="item.imageFirstProduct" height="80" width="60" cover />
          </template>
          <template #item.shippingFee="{ item }">
            {{ formatMoney(item.shippingFee) }}
          </template>
          <template #item.discountAmount="{ item }">
            {{ formatMoney(item.discountAmount) }}
          </template>
          <template #item.totalAmount="{ item }">
            {{ formatMoney(item.totalAmount) }}
          </template>
          <template #item.creationDate="{ item }">
            {{ new Date(item.creationDate).toLocaleString('vi-VN') }}
          </template>
          <template #item.status="{ item }">
            <v-chip :color="getStatusInfo(item.status).color" small>
              <v-icon start :size="18">{{ getStatusInfo(item.status).icon }}</v-icon>
              {{ getStatusInfo(item.status).label }}
            </v-chip>
          </template>
          <template #item.action="{ item }">
            <v-menu>
              <template #activator="{ props }">
                <v-btn icon variant="text" v-bind="props">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-btn
                    variant="tonal"
                    color="info"
                    block
                    @click="
                      router.push({
                        name: 'invoice-details',
                        params: { invoiceCode: item.invoiceCode },
                      })
                    "
                  >
                    <v-icon color="info">mdi-eye</v-icon>
                    Chi tiết
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getAllInvoices } from '@/api/invoiceApi'
import { allInvoiceStatus } from '@/constants/allInvoiceStatus'
import type { InvoiceDTO } from '@/types/invoiceDTO'
import { exportJsonToExcel } from '@/utils/exportExcel'

function exportInvoices() {
  if (!invoices.value.length) {
    alert.value = { show: true, type: 'error', message: 'Không có dữ liệu để xuất Excel' }
    return
  }

  const exportData = invoices.value.map((c) => ({
    'Mã hóa đơn': c.invoiceCode,
    'Khách hàng': c.fullname,
    'SĐT': c.phonenumber,
    'Email': c.email,
    'Địa chỉ': c.deliveryAddress,
    'Ngày tạo': c.creationDate,
    'Phí ship': c.shippingFee,
    'Voucher': c.voucherId,
    'Giảm giá': c.discountAmount,
    'Tổng tiền': c.totalAmount,
    'Nhân viên': c.assignedStaffId,
    'Trạng thái': getStatusInfo(c.status).label
  }))

  exportJsonToExcel(exportData, 'invoices.xlsx', 'Invoices')
}

const tab = ref('one')
const router = useRouter()
const search = ref('')
const alert = ref<{ show: boolean; type: 'success' | 'error'; message: string }>({
  show: false,
  type: 'success',
  message: '',
})

const allHeaders = [
  { title: 'Mã hóa đơn', key: 'invoiceCode' },
  { title: 'Ảnh', key: 'imageFirstProduct' },
  { title: 'Khách hàng', key: 'fullname' },
  { title: 'SĐT', key: 'phonenumber' },
  { title: 'Email', key: 'email' },
  { title: 'Địa chỉ', key: 'deliveryAddress' },
  { title: 'Ngày tạo', key: 'creationDate' },
  { title: 'Phí ship', key: 'shippingFee' },
  { title: 'Voucher', key: 'voucherId' },
  { title: 'Giảm giá', key: 'discountAmount' },
  { title: 'Tổng tiền', key: 'totalAmount' },
  { title: 'Nhân viên', key: 'assignedStaffId' },
  { title: 'Trạng thái', key: 'status' },
  { title: ' ', key: 'action' },
]
const fixedColumns = ['invoiceCode', 'action']
const selectedColumns = ref<string[]>(allHeaders.map((h) => h.key))
const visibleHeaders = computed(() =>
  allHeaders.filter((h) => fixedColumns.includes(h.key) || selectedColumns.value.includes(h.key)),
)
const selectableHeaders = computed(() => allHeaders.filter((h) => !fixedColumns.includes(h.key)))

const invoices = ref<InvoiceDTO[]>([])

onMounted(async () => {
  try {
    const res = await getAllInvoices()
    invoices.value = res.data
  } catch (e) {
    alert.value = { show: true, type: 'error', message: 'Lỗi tải hóa đơn!' }
  }
})

// Tab-based filtered lists (does not affect other functions)
function filterBySearch(list: InvoiceDTO[]) {
  if (!search.value) return list
  const keyword = search.value.toLowerCase()
  return list.filter(
    (i) =>
      i.invoiceCode.toLowerCase().includes(keyword) ||
      i.fullname.toLowerCase().includes(keyword) ||
      i.phonenumber.toLowerCase().includes(keyword) ||
      i.email.toLowerCase().includes(keyword),
  )
}

const filteredInvoicesAll = computed(() => filterBySearch(invoices.value))
const filteredInvoicesWaiting = computed(() =>
  filterBySearch(invoices.value.filter((i) => i.status === 1)),
)
const filteredInvoicesPreparing = computed(() =>
  filterBySearch(invoices.value.filter((i) => i.status === 2)),
)
const filteredInvoicesShipping = computed(() =>
  filterBySearch(invoices.value.filter((i) => i.status === 3 || i.status === 4)),
)
const filteredInvoicesReturning = computed(() =>
  filterBySearch(invoices.value.filter((i) => i.status === 6)),
)
const filteredInvoicesSuccess = computed(() =>
  filterBySearch(invoices.value.filter((i) => i.status === 5)),
)
const filteredInvoicesCancel = computed(() =>
  filterBySearch(invoices.value.filter((i) => i.status === 0 || i.status === 7)),
)

// Count for each tab
const waitCount = computed(() => invoices.value.filter((i) => i.status === 1).length)
const prepareCount = computed(() => invoices.value.filter((i) => i.status === 2).length)
const shipCount = computed(
  () => invoices.value.filter((i) => i.status === 3 || i.status === 4).length,
)
const returnCount = computed(() => invoices.value.filter((i) => i.status === 6).length)

const filteredInvoices = computed(() => {
  switch (tab.value) {
    case 'waiting':
      return filteredInvoicesWaiting.value
    case 'preparing':
      return filteredInvoicesPreparing.value
    case 'shipping':
      return filteredInvoicesShipping.value
    case 'returning':
      return filteredInvoicesReturning.value
    case 'success':
      return filteredInvoicesSuccess.value
    case 'cancel':
      return filteredInvoicesCancel.value
    case 'all':
    default:
      return filteredInvoicesAll.value
  }
})

function formatMoney(val: string | number) {
  if (val == null) return ''
  return Number(val).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}

function getStatusInfo(status) {
  const found = allInvoiceStatus.find((s) => s.value === status)
  if (!found) return { label: 'Không xác định', icon: 'mdi-help-circle-outline', color: 'grey' }
  return { label: found.labelClient, icon: found.icon, color: found.color || 'primary' }
}
</script>
