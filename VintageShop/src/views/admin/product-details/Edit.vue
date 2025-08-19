<template>
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
    <v-overlay :model-value="isUploading" persistent class="align-center justify-center">
      <v-progress-circular indeterminate size="64" color="primary" />
    </v-overlay>
    <v-toolbar flat color="transparent">
      <v-toolbar-title class="text-h5 font-weight-bold">Sửa biến thể sản phẩm</v-toolbar-title>
    </v-toolbar>
    <v-col cols="12" xl="11" class="mx-auto">
      <v-card class="pa-4">
        <v-form @submit.prevent="handleSubmit">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="detailDTO.inventoryQuantity"
                label="Số lượng tồn kho"
                class="mb-3 px-6"
                variant="underlined"
                style="width: 40vw"
                :rules="[rules.required, rules.inventory]"
                required
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-file-input
                class="mb-3 px-6"
                variant="underlined"
                style="width: 40vw"
                accept="image/png, image/jpeg, image/bmp"
                label="Chọn ảnh biến thể"
                :rules="[(file) => !!file || 'Vui lòng chọn ảnh']"
                :model-value="selectedFile"
                @update:model-value="onFileInputChange"
                prepend-icon="mdi-camera"
              />
              <div style="position: relative; display: inline-block">
                <v-img :src="previewUrl" width="60" height="80" cover class="rounded" />
                <v-btn
                  icon
                  size="x-small"
                  color="transparent"
                  style="position: absolute; top: 0; right: 0; z-index: 2"
                  @click="removePreview"
                >
                  <v-icon size="16">mdi-close-circle</v-icon>
                </v-btn>
              </div>
            </v-col>
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
                <v-icon color="success">mdi-content-save-outline</v-icon> Lưu
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                block
                color="warning"
                variant="tonal"
                class="mb-3 px-6"
                @click="router.push({ name: 'product-details', params: { productId } })"
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductDetailById, updateProductDetail } from '@/api/productDetailApi'
import { uploadImageToCloudinary } from '@/useImageUpload'
import type { ProductDetailDTO } from '@/types/productDetailDTO'
import { allColors } from '@/constants/allColors'
import { allSizes } from '@/constants/allSizes'

const router = useRouter()
const route = useRoute()
const productId = Array.isArray(route.params.productId)
  ? route.params.productId[0]
  : route.params.productId
const detailId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id

const isUploading = ref(false)
const alert = ref<{ show: boolean; type: 'success' | 'error'; message: string }>({
  show: false,
  type: 'success',
  message: '',
})

const detailDTO = ref<Partial<ProductDetailDTO>>({})
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

const rules = {
  required: (v: any) => !!v || 'Trường này là bắt buộc',
  inventory: (v: any) => (v !== null && v !== '' && v >= 0) || 'Tồn kho phải >= 0',
}

import { watch } from 'vue'

const onFileInputChange = (file: File | undefined) => {
  if (!file) {
    selectedFile.value = null
    // Nếu có detailDTO.imgUrl thì vẫn hiện ảnh cũ
    previewUrl.value = detailDTO.value.imgUrl || null
    return
  }
  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

// Luôn đồng bộ previewUrl với detailDTO.imgUrl khi dữ liệu API trả về
watch(
  () => detailDTO.value.imgUrl,
  (newUrl) => {
    if (!selectedFile.value) {
      previewUrl.value = newUrl || null
    }
  },
  { immediate: true },
)

const removePreview = () => {
  previewUrl.value = null
  selectedFile.value = null
}

onMounted(async () => {
  try {
    const res = await getProductDetailById(productId, detailId)
    detailDTO.value = res.data
    // Nếu chưa chọn file mới thì hiện ảnh cũ
    if (!selectedFile.value) {
      previewUrl.value = res.data.imgUrl || null
    }
  } catch (e) {
    alert.value = { show: true, type: 'error', message: 'Không tải được dữ liệu biến thể!' }
    setTimeout(() => (alert.value.show = false), 2500)
  }
})

const handleSubmit = async () => {
  if (detailDTO.value.inventoryQuantity <= 0) {
    alert.value = { show: true, type: 'error', message: 'Số lượng tồn kho phải lớn hơn 0!' }
    setTimeout(() => (alert.value.show = false), 2500)
    return
  }
  isUploading.value = true
  try {
    // Nếu có file mới thì upload, không thì giữ nguyên ảnh cũ
    if (selectedFile.value) {
      const url = await uploadImageToCloudinary(
        selectedFile.value,
        detailDTO.value.productDetailCode || 'edit',
        0,
      )
      detailDTO.value.imgUrl = url
    }
    // Nếu previewUrl null thì imgUrl cũng null
    if (!previewUrl.value) {
      detailDTO.value.imgUrl = null
    }
    await updateProductDetail(productId, detailId, detailDTO.value)
    router.push({
      name: 'product-details',
      params: { productId },
      query: { alert: 'success', message: 'Cập nhật biến thể thành công!' },
    })
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
</script>
