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
        Bảng sản phẩm
        <v-btn
          icon="mdi-plus"
          variant="flat"
          @click="router.push({ name: 'product-create' })"
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
            <v-btn variant="elevated" color="success" @click="exportProducts">
              <v-icon color="#fffa">mdi-microsoft-excel</v-icon>
              Excel
            </v-btn>
          </v-divider>
        </v-card-title>

        <v-divider></v-divider>

        <!-- Bảng dữ liệu -->
        <v-data-table
          :headers="visibleHeaders"
          :items="filteredProducts"
          :search="search"
          items-per-page="5"
        >
          <!-- Hiển thị ảnh đại diện (lấy ảnh đầu tiên trong imageUrls - ImageDTO[]) -->
          <template #item.imageUrl="{ item }">
            <v-img
              :src="item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0].imageUrl : ''"
              height="80"
              width="60"
              cover
            ></v-img>
          </template>
          <!-- Hiển thị giá có định dạng -->
          <template #item.price="{ item }">
            {{ formatPrice(item.price) }}
          </template>
          <!-- Hiển thị nổi bật -->
          <template #item.isFeatured="{ item }">
            <v-chip :color="item.isFeatured ? 'orange' : 'grey'" small>{{
              item.isFeatured ? 'Nổi bật' : ''
            }}</v-chip>
          </template>
          <!-- Hiển thị trạng thái -->

          <!-- Hiển thị trạng thái bằng chip -->
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
                      router.push({ name: 'product-details', params: { productId: item.id } })
                    "
                  >
                    <v-icon color="info">mdi-eye</v-icon>
                    Chi tiết
                  </v-btn>
                </v-list-item>

                <v-list-item v-if="item.isFeatured">
                  <v-btn variant="tonal" color="black" block @click="setUnFeaturedProduct(item.id)">
                    <v-icon color="black">mdi-star</v-icon>
                    Xóa nổi bật
                  </v-btn>
                </v-list-item>
                <v-list-item v-else>
                  <v-btn variant="tonal" color="orange" block @click="setFeaturedProduct(item.id)">
                    <v-icon color="orange">mdi-star</v-icon>
                    Nổi bật
                  </v-btn>
                </v-list-item>
                <v-list-item>
                  <v-btn
                    variant="tonal"
                    color="success"
                    block
                    @click="router.push({ name: 'product-edit', params: { id: item.id } })"
                  >
                    <v-icon color="success">mdi-pencil</v-icon>
                    Sửa
                  </v-btn>
                </v-list-item>
                <v-list-item>
                  <v-btn variant="tonal" color="danger" block @click="deleteProduct(item.id)">
                    <v-icon color="danger">mdi-close</v-icon>
                    Xóa
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
import {
  getAllProducts,
  deleteProduct as apiDeleteProduct,
  featureProduct,
  unFeatureProduct,
} from '@/api/productApi'
import type { ProductDTO } from '@/types/productDTO'
import { exportJsonToExcel } from '@/utils/exportExcel'

function exportProducts() {
  if (!products.value.length) {
    alert.value = { show: true, type: 'error', message: 'Không có dữ liệu để xuất Excel' }
    return
  }

  const exportData = products.value.map((p) => ({
    'ID': p.id,
    'Mã SP': p.productCode,
    'Tên sản phẩm': p.productName,
    'Thương hiệu': p.brand,
    'Loại': p.categoryName,
    'Người dùng': p.userType,
    'Chất liệu': p.material,
    'Giá': p.price,
    'Nổi bật': p.isFeatured ? 'Nổi bật' : '',
  }))

  exportJsonToExcel(exportData, 'products.xlsx', 'Products')
}

const route = useRoute()
const router = useRouter()

// Danh sách sản phẩm
const products = ref<ProductDTO[]>([])

// Tìm kiếm
const search = ref('')

// Tất cả cột có thể hiển thị
const allHeaders = [
  { title: 'Mã SP', key: 'productCode' },
  { title: 'Ảnh', key: 'imageUrl' },
  { title: 'Tên sản phẩm', key: 'productName' },
  { title: 'Thương hiệu', key: 'brand' },
  { title: 'Loại', key: 'categoryName' },
  { title: 'Người dùng', key: 'userType' },
  { title: 'Chất liệu', key: 'material' },
  { title: 'Giá', key: 'price' },
  { title: 'Nổi bật', key: 'isFeatured' },
  { title: ' ', key: 'action' },
]
const fixedColumns = ['productCode', 'action']
// Cột được chọn để hiển thị
const selectedColumns = ref<string[]>(allHeaders.map((h) => h.key))

// Chỉ hiển thị các cột được chọn
const visibleHeaders = computed(() => {
  return allHeaders.filter(
    (h) => fixedColumns.includes(h.key) || selectedColumns.value.includes(h.key),
  )
})

const selectableHeaders = computed(() => allHeaders.filter((h) => !fixedColumns.includes(h.key)))

// Format giá VND
const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)

// Tải sản phẩm từ API
onMounted(async () => {
  try {
    const res = await getAllProducts()
    products.value = res.data
  } catch (err) {
    console.error('Lỗi tải sản phẩm:', err)
  }
})

// Tìm kiếm đơn giản
const filteredProducts = computed(() => {
  if (!search.value) return products.value
  const keyword = search.value.toLowerCase()
  return products.value.filter(
    (p) =>
      p.productName.toLowerCase().includes(keyword) ||
      p.brand.toLowerCase().includes(keyword) ||
      p.categoryName.toLowerCase().includes(keyword) ||
      p.userType.toLowerCase().includes(keyword) ||
      p.material.toLowerCase().includes(keyword),
  )
})

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

const showAlert = (type: 'success' | 'error', message: string) => {
  alert.value = { show: true, type, message }
  setTimeout(() => (alert.value.show = false), 2500)
}

// Ghi log khi tìm kiếm
const deleteProduct = async (id: string | number) => {
  const confirmDelete = window.confirm('Bạn có chắc muốn xóa sản phẩm này không?')
  if (!confirmDelete) return
  try {
    await apiDeleteProduct(id)
    products.value = products.value.filter((p) => p.id !== id)
    showAlert('success', 'Xóa sản phẩm thành công!')
  } catch (error) {
    showAlert('error', 'Lỗi khi xóa sản phẩm!')
    console.error('❌ Lỗi khi xóa sản phẩm:', error)
  }
}
const setFeaturedProduct = async (id: string | number) => {
  try {
    await featureProduct(id)
    const p = products.value.find((p) => p.id === id)
    if (p) p.isFeatured = true
    showAlert('success', 'Đánh dấu nổi bật thành công!')
  } catch (error) {
    showAlert('error', 'Không thể đánh dấu nổi bật hơn 10 sản phẩm!')
    console.error('❌ Lỗi feature sản phẩm:', error)
  }
}
const setUnFeaturedProduct = async (id: string | number) => {
  try {
    await unFeatureProduct(id)
    const p = products.value.find((p) => p.id === id)
    if (p) p.isFeatured = false
    showAlert('success', 'Bỏ nổi bật thành công!')
  } catch (error) {
    showAlert('error', 'Không thể bỏ nổi bật!')
    console.error('❌ Không thể feature hơn 10 sản phẩm:', error)
  }
}
</script>
