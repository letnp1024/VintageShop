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
      <v-toolbar-title class="text-h5 font-weight-bold"> Quản lý danh mục 
              <v-btn
          icon="mdi-plus"
          variant="flat"
          @click="router.push({ name: 'category-create' })"
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

        <v-btn variant="elevated" color="success" @click="exportCategories">
          <v-icon color="#fffa">mdi-microsoft-excel</v-icon>
          Xuất Excel
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Bảng dữ liệu -->
      <v-data-table
        :headers="visibleHeaders"
        :items="filteredCategories"
        :search="search"
        items-per-page="5"
      >
  <template #item.role="{ item }">
    {{ item['role']['roleName']}}
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
                    color="success"
                    block
                    @click="router.push({ name: 'category-edit', params: { id: item.id } })"
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
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { deleteCategory, getCategoriesByStatus } from '@/api/categoryApi'
import type { Category } from '@/types/productDTO'
import { exportJsonToExcel } from '@/utils/exportExcel'

function exportCategories() {
  if (!categories.value.length) {
    alert.value = { show: true, type: 'error', message: 'Không có dữ liệu để xuất Excel' }
    return
  }

  const exportData = categories.value.map((c) => ({
    ID: c.id,
    'Tên danh mục': c.categoryName
  }))

  exportJsonToExcel(exportData, 'categories.xlsx', 'Categories')
}

const route = useRoute()
const router = useRouter()

const tab = ref<'staff' | 'customer'>('staff')
const search = ref('')
const alert = ref<{ show: boolean; type: 'success' | 'error'; message: string }>(
  { show: false, type: 'success', message: '' }
)

const allHeaders = [
  { title: 'id', key: 'id' },
  { title: 'Tên', key: 'categoryName' },
  { title: 'Hành động', key: 'action' }

]
const fixedColumns = ['action']
const selectedColumns = ref<string[]>(allHeaders.map((h) => h.key))
const visibleHeaders = computed(() =>
  allHeaders.filter((h) => fixedColumns.includes(h.key) || selectedColumns.value.includes(h.key)),
)
const selectableHeaders = computed(() => allHeaders.filter((h) => !fixedColumns.includes(h.key)))

const categories = ref<Category[]>([])

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

onMounted(async () => {
  try {
    const res = await getCategoriesByStatus(1) // load category active
    categories.value = res.data
  } catch (e) {
    alert.value = { show: true, type: 'error', message: 'Không tải được danh mục' }
  }
})
function filterBySearch(list: Category[]) {
  if (!search.value) return list
  const keyword = search.value.toLowerCase()
  return list.filter(
    (c) =>
      c.categoryName?.toLowerCase().includes(keyword)
  )
}

const filteredCategories = computed(() => filterBySearch(categories.value))

async function handleDelete(id: number) {
  if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return
  try {
    await deleteCategory(id)
    categories.value = categories.value.filter((c) => c.id !== id)
    alert.value = { show: true, type: 'success', message: 'Xóa danh mục thành công!' }
    setTimeout(() => (alert.value.show = false), 2000)
  } catch (e) {
    alert.value = { show: true, type: 'error', message: 'Xóa danh mục thất bại!' }
    setTimeout(() => (alert.value.show = false), 2000)
  }
}
</script>
