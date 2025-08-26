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
      <v-toolbar-title class="text-h5 font-weight-bold">
        Bảng sản phẩm chi tiết
        <v-btn
          icon="mdi-plus"
          variant="flat"
          @click="router.push({ name: 'product-details-create', params: { productId } })"
        ></v-btn>
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
            <v-btn variant="elevated" color="success" @click="exportProductDetails">
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
          items-per-page="5"
        >
          <template #item.imgUrl="{ item }">
            <v-img :src="item.imgUrl" height="80" width="60" cover />
          </template>
          <template #item.style="{ item }">
            {{ allColors.find((c) => c.value === item.style)?.label || item.style }}
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
                  <v-btn variant="tonal" color="success" block @click="editDetail(item)">
                    <v-icon color="success">mdi-pencil</v-icon> Sửa
                  </v-btn>
                </v-list-item>
                <v-list-item>
                  <v-btn variant="tonal" color="danger" block @click="deleteDetail(item.id)">
                    <v-icon color="danger">mdi-close</v-icon> Xóa
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
import { useRoute, useRouter } from 'vue-router'
import { getProductDetails, deleteProductDetail } from '@/api/productDetailApi'
import type { ProductDetailDTO } from '@/types/productDetailDTO'
import { allColors } from '@/constants/allColors'
import { exportJsonToExcel } from '@/utils/exportExcel'

function exportProductDetails() {
  if (!details.value.length) {
    alert.value = { show: true, type: 'error', message: 'Không có dữ liệu để xuất Excel' }
    return
  }

  const exportData = details.value.map((d) => ({
    'ID': d.id,
    'Mã biến thể': d.productDetailCode,
    'Màu sắc': allColors.find((c) => c.value === d.style)?.label || d.style,
    'Size': d.size,
    'Tồn kho': d.inventoryQuantity
  }))

  exportJsonToExcel(exportData, 'product-details.xlsx', 'ProductDetails')
}

const route = useRoute()
const router = useRouter()
// Đảm bảo productId là string hoặc number, không phải mảng
const productId = Array.isArray(route.params.productId)
  ? route.params.productId[0]
  : route.params.productId

// Danh sách biến thể sản phẩm
const details = ref<ProductDetailDTO[]>([])

// Tìm kiếm
const search = ref('')

// Cấu hình các cột hiển thị
const allHeaders = [
  { title: 'Mã biến thể', key: 'productDetailCode' },
  { title: 'Ảnh', key: 'imgUrl' },
  { title: 'Màu sắc', key: 'style' },
  { title: 'Size', key: 'size' },
  { title: 'Tồn kho', key: 'inventoryQuantity' },
  { title: ' ', key: 'action' },
]
const fixedColumns = ['productDetailCode', 'action']
const selectedColumns = ref<string[]>(allHeaders.map((h) => h.key))
const visibleHeaders = computed(() =>
  allHeaders.filter((h) => fixedColumns.includes(h.key) || selectedColumns.value.includes(h.key)),
)
const selectableHeaders = computed(() => allHeaders.filter((h) => !fixedColumns.includes(h.key)))

// Alert thành công/thất bại
const alert = ref<{ show: boolean; type: 'success' | 'error'; message: string }>({
  show: false,
  type: 'success',
  message: '',
})

onMounted(() => {
  if (route.query.alert === 'success') {
    alert.value = {
      show: true,
      type: 'success',
      message: (route.query.message as string) || 'Thêm sản phẩm thành công!',
    }
    setTimeout(() => (alert.value.show = false), 2500)
    // Xóa query để không hiện lại khi reload
    router.replace({ query: { ...route.query, alert: undefined, message: undefined } })
  }
})
// Tải danh sách biến thể sản phẩm
onMounted(async () => {
  try {
    const res = await getProductDetails(productId)
    if (res && Array.isArray(res.data)) {
      details.value = res.data
    } else {
      details.value = []
      alert.value = { show: true, type: 'error', message: 'Không có dữ liệu biến thể!' }
    }
  } catch (err) {
    details.value = []
    alert.value = { show: true, type: 'error', message: 'Lỗi tải biến thể sản phẩm!' }
  }
})

// Tìm kiếm đơn giản
const filteredDetails = computed(() => {
  if (!search.value) return details.value
  const keyword = search.value.toLowerCase()
  return details.value.filter(
    (d) =>
      d.productDetailCode.toLowerCase().includes(keyword) ||
      d.style.toLowerCase().includes(keyword) ||
      d.size.toLowerCase().includes(keyword),
  )
})

const showAlert = (type: 'success' | 'error', message: string) => {
  alert.value = { show: true, type, message }
  setTimeout(() => (alert.value.show = false), 2500)
}

// Chuyển sang trang sửa biến thể
const editDetail = (item: ProductDetailDTO) => {
  router.push({ name: 'product-details-edit', params: { productId, id: item.id } })
}

// Xóa biến thể sản phẩm
const deleteDetail = async (id: number | string) => {
  if (!window.confirm('Bạn có chắc muốn xóa biến thể này?')) return
  try {
    await deleteProductDetail(productId, id)
    details.value = details.value.filter((d) => d.id !== id)
    showAlert('success', 'Xóa biến thể thành công!')
  } catch (e) {
    showAlert('error', 'Lỗi khi xóa biến thể!')
  }
}
</script>

<style scoped></style>
