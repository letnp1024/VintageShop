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
      <v-toolbar-title class="text-h5 font-weight-bold">Thêm biến thể sản phẩm</v-toolbar-title>
    </v-toolbar>
    <v-col cols="12" xl="11" class="mx-auto">
      <v-card class="pa-4">
        <v-form @submit.prevent="handleSubmit">
          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                v-model="detailDTO.style"
                :items="allColors"
                item-title="label"
                item-value="value"
                label="Màu sắc"
                class="mb-3 px-6"
                variant="underlined"
                style="width: 40vw"
                :rules="[rules.required]"
                required
              />
              <v-select
                v-model="detailDTO.size"
                :items="allSizes"
                item-title="label"
                item-value="value"
                label="Kích thước"
                class="mb-3 px-6"
                variant="underlined"
                style="width: 40vw"
                :rules="[rules.required]"
                required
              />
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
import { addProductDetail } from '@/api/productDetailApi'
import { uploadImageToCloudinary } from '@/useImageUpload'
import type { ProductDetailDTO } from '@/types/productDetailDTO'
import { allColors } from '@/constants/allColors'
import { allSizes } from '@/constants/allSizes'

const router = useRouter()
const route = useRoute()
const productId = Array.isArray(route.params.productId)
  ? route.params.productId[0]
  : route.params.productId

const isUploading = ref(false)
const alert = ref<{ show: boolean; type: 'success' | 'error'; message: string }>({
  show: false,
  type: 'success',
  message: '',
})

const detailDTO = ref<Partial<ProductDetailDTO>>({
  style: '',
  size: '',
  inventoryQuantity: 0,
  imgUrl: null,
})

const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const rules = {
  required: (v: any) => !!v || 'Trường này là bắt buộc',
  inventory: (v: any) => (v !== null && v !== '' && v >= 0) || 'Tồn kho phải >= 0',
}

const onFileInputChange = (file: File | undefined) => {
  if (!file) {
    selectedFile.value = null
    previewUrl.value = null
    return
  }
  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

const removePreview = () => {
  previewUrl.value = null
  selectedFile.value = null
}

const handleSubmit = async () => {
  if (
    !detailDTO.value.style ||
    !detailDTO.value.size ||
    detailDTO.value.inventoryQuantity === undefined ||
    detailDTO.value.inventoryQuantity === null
  ) {
    alert.value = { show: true, type: 'error', message: 'Vui lòng nhập đầy đủ thông tin!' }
    setTimeout(() => (alert.value.show = false), 2500)
    return
  }
  if (detailDTO.value.inventoryQuantity <= 0) {
    alert.value = { show: true, type: 'error', message: 'Số lượng tồn kho phải lớn hơn 0!' }
    setTimeout(() => (alert.value.show = false), 2500)
    return
  }
  isUploading.value = true
  try {
    if (selectedFile.value) {
      const url = await uploadImageToCloudinary(
        selectedFile.value,
        detailDTO.value.productDetailCode || 'new',
        0,
      )
      detailDTO.value.imgUrl = url
    }
    await addProductDetail(productId, detailDTO.value)
    router.push({
      name: 'product-details',
      params: { productId },
      query: { alert: 'success', message: 'Thêm biến thể thành công!' },
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
