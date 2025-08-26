<template>
  <v-container fluid>
    <!-- Alert -->
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

    <!-- Toolbar -->
    <v-toolbar flat color="transparent">
      <v-toolbar-title class="text-h5 font-weight-bold"> Quản lý voucher
        <v-btn
          icon="mdi-plus"
          variant="flat"
          @click="router.push({ name: 'voucher-create' })"
        ></v-btn>
      </v-toolbar-title>
    </v-toolbar>

    <!-- Tabs -->
    <v-card class="pa-4">

      <!-- Search & Column Select -->
      <v-card-title class="d-flex align-center pe-2">
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
          label="Chọn cột hiển thị"
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

        <v-divider class="mx-2" vertical></v-divider>

        <v-btn variant="elevated" color="success" @click="exportVouchers">
          <v-icon color="#fffa">mdi-microsoft-excel</v-icon>
          Xuất Excel
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Bảng dữ liệu -->
      <v-data-table
        :headers="visibleHeaders"
        :items="filteredVouchers"
        :search="search"
        items-per-page="5"
      >
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
                    color="success"
                    block
                    @click="router.push({ name: 'voucher-edit', params: { id: item.id } })"
                  >
                    <v-icon color="success">mdi-pencil</v-icon>
                    Sửa
                  </v-btn>
                </v-list-item>
                <v-list-item>
                  <v-btn variant="tonal" color="red" block @click="handleDelete(item.id)">
                    <v-icon color="red">mdi-close</v-icon>
                    Xóa
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getAllVouchers, deleteVoucher } from '@/api/voucherApi'
import type { Voucher } from '@/types/voucher'
import { exportJsonToExcel } from '@/utils/exportExcel'

const route = useRoute()
const router = useRouter()

const search = ref('')
const alert = ref<{ show: boolean; type: 'success' | 'error'; message: string }>(
  { show: false, type: 'success', message: '' }
)

const allHeaders = [
  { title: 'ID', key: 'id' },
  { title: 'Mã voucher', key: 'voucherCode' },
  { title: 'Ngày bắt đầu', key: 'startDate' },
  { title: 'Ngày kết thúc', key: 'endDate' },
  { title: 'Phần trăm giảm', key: 'discountPercentage' },
  { title: 'Hành động', key: 'action' }
]
const fixedColumns = ['action']
const selectedColumns = ref<string[]>(allHeaders.map((h) => h.key))
const visibleHeaders = computed(() =>
  allHeaders.filter((h) => fixedColumns.includes(h.key) || selectedColumns.value.includes(h.key)),
)
const selectableHeaders = computed(() => allHeaders.filter((h) => !fixedColumns.includes(h.key)))

const vouchers = ref<Voucher[]>([])

onMounted(() => {
  if (route.query.alert === 'success') {
    alert.value = {
      show: true,
      type: 'success',
      message: (route.query.message as string) || 'Thêm voucher thành công!',
    }
    setTimeout(() => (alert.value.show = false), 2500)
    router.replace({ query: { ...route.query, alert: undefined, message: undefined } })
  }
})

onMounted(async () => {
  try {
    const res = await getAllVouchers()
    vouchers.value = res.data
  } catch (e) {
    alert.value = { show: true, type: 'error', message: 'Không tải được voucher' }
  }
})

function filterBySearch(list: Voucher[]) {
  if (!search.value) return list
  const keyword = search.value.toLowerCase()
  return list.filter(
    (v) =>
      v.voucherCode?.toLowerCase().includes(keyword) ||
      v.startDate?.toLowerCase().includes(keyword) ||
      v.endDate?.toLowerCase().includes(keyword)
  )
}

const filteredVouchers = computed(() => filterBySearch(vouchers.value))

const exportVouchers = () => {
  if (!filteredVouchers.value.length) {
    alert.value = { show: true, type: 'error', message: 'Không có dữ liệu để xuất Excel' }
    return
  }
  const exportData = filteredVouchers.value.map((v) => ({
    'ID': v.id,
    'Mã voucher': v.voucherCode,
    'Ngày bắt đầu': v.startDate,
    'Ngày kết thúc': v.endDate,
    'Phần trăm giảm': v.discountPercentage ?? '',
  }))
  exportJsonToExcel(exportData, 'vouchers.xlsx', 'Vouchers')
}

async function handleDelete(id: number) {
  if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return
  try {
    await deleteVoucher(id)
    vouchers.value = vouchers.value.filter((c) => c.id !== id)
    alert.value = { show: true, type: 'success', message: 'Xóa voucher thành công!' }
    setTimeout(() => (alert.value.show = false), 2000)
  } catch (e) {
    alert.value = { show: true, type: 'error', message: 'Xóa voucher thất bại!' }
    setTimeout(() => (alert.value.show = false), 2000)
  }
}

</script>
