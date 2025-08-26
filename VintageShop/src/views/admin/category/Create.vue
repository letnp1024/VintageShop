<template>
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

  <v-container fluid>
    <!-- Overlay khi đang xử lý -->
    <v-overlay :model-value="isUploading" persistent class="align-center justify-center">
      <v-progress-circular indeterminate size="64" color="primary" />
    </v-overlay>

    <v-toolbar flat color="transparent">
      <v-toolbar-title class="text-h5 font-weight-bold">
        Thêm danh mục sản phẩm
      </v-toolbar-title>
    </v-toolbar>

    <v-col cols="12" xl="11" class="mx-auto">
      <v-card class="pa-4">
        <v-form @submit.prevent="handleSubmit">
          <v-row>
            <v-text-field
              v-model="categoryDTO.categoryName"
              label="Tên danh mục"
              class="mb-3 px-6"
              variant="underlined"
              style="width: 40vw"
              required
            />
          </v-row>

          <v-row>
            <v-col cols="6">
              <v-btn
                block
                color="success"
                variant="tonal"
                class="mb-3 px-6"
                :loading="isUploading"
                type="submit"
              >
                <v-icon color="success">mdi-content-save-outline</v-icon>
                Lưu
              </v-btn>
            </v-col>

            <v-col cols="6">
              <v-btn
                block
                color="warning"
                variant="tonal"
                class="mb-3 px-6"
                @click="router.push({ name: 'category-index' })"
                :disabled="isUploading"
              >
                <v-icon color="warning">mdi-arrow-left</v-icon>
                Hủy
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-col>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createCategory } from '@/api/categoryApi'
import type { Category } from '@/types/productDTO'

const router = useRouter()

// Trạng thái alert
const alert = ref<{ show: boolean; type: 'success' | 'error'; message: string }>({
  show: false,
  type: 'success',
  message: '',
})

// Trạng thái loading
const isUploading = ref(false)

// DTO cho category
const categoryDTO = ref<Category>({
  id: 0,
  categoryName: '',
})

// Hàm submit form
const handleSubmit = async () => {
  if (!categoryDTO.value.categoryName) {
    showAlert('error', 'Vui lòng nhập tên danh mục!')
    return
  }
  if (categoryDTO.value.categoryName.length < 3) {
    showAlert('error', 'Tên danh mục phải có ít nhất 3 ký tự!')
    return
  }

  isUploading.value = true
  try {
    await createCategory(categoryDTO.value)
    router.push({
      name: 'category-index',
      query: { alert: 'success', message: 'Thêm danh mục thành công!' },
    })
  } catch (error: any) {
    const msg =
      error?.response?.data?.message ??
      error?.response?.data ??
      error.message ??
      'Có lỗi xảy ra!'
    showAlert('error', msg)
  } finally {
    isUploading.value = false
  }
}

// Hàm hiển thị alert
function showAlert(type: 'success' | 'error', message: string) {
  alert.value = { show: true, type, message }
  setTimeout(() => (alert.value.show = false), 3000)
}
</script>
