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
      <v-toolbar-title class="text-h5 font-weight-bold">Thêm sản phẩm</v-toolbar-title>
    </v-toolbar>
    <v-col cols="12" xl="11" class="mx-auto">
      <v-card class="pa-4">
        <v-form @submit.prevent="handleSubmit">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="productDTO.productCode"
                label="Mã sản phẩm"
                class="mb-3 px-6"
                variant="underlined"
                style="width: 40vw"
                :rules="[rules.required]"
                required
              />
              <v-text-field
                v-model="productDTO.productName"
                label="Tên sản phẩm"
                class="mb-3 px-6"
                variant="underlined"
                style="width: 40vw"
                :rules="[rules.required]"
                required
              />
              <v-text-field
                v-model.number="productDTO.price"
                label="Giá sản phẩm"
                class="mb-3 px-6"
                prefix="₫"
                type="number"
                variant="underlined"
                style="width: 40vw"
                :rules="[rules.required, rules.price]"
                required
              />
              <v-text-field
                v-model="productDTO.material"
                label="Chất liệu"
                class="mb-3 px-6"
                variant="underlined"
                style="width: 40vw"
                :rules="[rules.required]"
                required
              />
              <v-textarea
                v-model="productDTO.description"
                label="Mô tả"
                class="mb-3 px-6"
                variant="underlined"
                style="width: 40vw"
                required
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="productDTO.brand"
                label="Thương hiệu"
                class="mb-3 px-6"
                variant="underlined"
                style="width: 40vw"
                :rules="[rules.required]"
                required
              />
              <v-select
                v-model="productDTO.categoryId"
                :items="categories"
                item-title="categoryName"
                item-value="id"
                label="Danh mục"
                variant="underlined"
                class="mb-3 px-6"
                style="width: 40vw"
                :rules="[rules.required]"
                required
              />
              <v-select
                v-model="productDTO.userType"
                :items="['Nam', 'Nữ', 'Unisex', 'Trẻ em']"
                label="Đối tượng khách hàng"
                variant="underlined"
                class="mb-3 px-6"
                style="width: 40vw"
                :rules="[rules.required]"
                required
              />
              <v-file-input
                class="mb-3 px-6"
                variant="underlined"
                style="width: 40vw"
                accept="image/png, image/jpeg, image/bmp"
                label="Chọn tối đa 15 ảnh sản phẩm"
                multiple
                counter
                :rules="[(files) => !files || files.length <= 15 || 'Tối đa 15 ảnh']"
                :model-value="selectedFiles"
                @update:model-value="onFileInputChange"
                prepend-icon="mdi-camera"
              />
              <div class="d-flex flex-row mt-2 flex-wrap" style="gap: 8px">
                <div
                  v-for="(url, idx) in previewUrls"
                  :key="idx"
                  style="position: relative; display: inline-block"
                >
                  <v-img v-if="url" :src="url" width="60" height="80" cover class="rounded" />
                  <v-btn
                    icon
                    size="x-small"
                    color="transparent"
                    style="position: absolute; top: 0; right: 0; z-index: 2"
                    @click.prevent="removePreview(idx)"
                  >
                    <v-icon size="16">mdi-close-circle</v-icon>
                  </v-btn>
                </div>
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
                @click="router.push({ name: 'product-index' })"
                :disabled="isUploading"
              >
                <v-icon color="warning">mdi-arrow-left</v-icon> Hủy
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-col>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { createProduct, getAllCategory } from '@/api/productApi'
import { uploadImageToCloudinary } from '@/useImageUpload'
import type { ProductDTO, Category, ImageDTO } from '@/types/productDTO'
const router = useRouter()
const isUploading = ref(false)

const categories = ref<Category[]>([])

const productDTO = ref<Partial<ProductDTO>>({
  productCode: '',
  productName: '',
  brand: '',
  categoryId: null,
  categoryName: '',
  userType: '',
  material: '',
  price: 0,
  description: '',
  isFeatured: false,
  imageUrls: [],
})

const selectedFiles = ref<File[]>([])
const previewUrls = ref<string[]>([])

const rules = {
  required: (v: any) => !!v || 'Trường này là bắt buộc',
  price: (v: any) => (v !== null && v !== '' && v > 0) || 'Giá phải lớn hơn 0',
}

const onFileInputChange = (files: File[] | undefined) => {
  if (!files) {
    selectedFiles.value = []
    previewUrls.value = []
    return
  }
  selectedFiles.value = files.slice(0, 15)
  previewUrls.value = selectedFiles.value.map((f) => URL.createObjectURL(f))
}

const removePreview = (idx: number) => {
  previewUrls.value.splice(idx, 1)
  selectedFiles.value.splice(idx, 1)
}

const alert = ref<{ show: boolean; type: 'success' | 'error'; message: string }>({
  show: false,
  type: 'success',
  message: '',
})

const handleSubmit = async () => {
  if (
    !productDTO.value.productCode ||
    String(productDTO.value.productCode).trim() === '' ||
    !productDTO.value.productName ||
    String(productDTO.value.productName).trim() === '' ||
    !productDTO.value.categoryId
  ) {
    alert.value = { show: true, type: 'error', message: 'Vui lòng nhập đầy đủ thông tin!' }
    setTimeout(() => (alert.value.show = false), 2500)
    return
  }
  if (!productDTO.value.price || productDTO.value.price <= 0) {
    alert.value = { show: true, type: 'error', message: 'Giá sản phẩm phải lớn hơn 0!' }
    setTimeout(() => (alert.value.show = false), 2500)
    return
  }

  isUploading.value = true
  console.log('selectedFiles trước khi upload:', selectedFiles.value)
  const uploadedImages: ImageDTO[] = []
  for (let i = 0; i < selectedFiles.value.length; i++) {
    const file = selectedFiles.value[i]
    if (file) {
      try {
        const url = await uploadImageToCloudinary(file, productDTO.value.productCode || 'new', i)
        console.log('Cloudinary upload result:', url)
        if (!url) {
          console.error('Không nhận được url từ Cloudinary cho file:', file)
        }
        uploadedImages.push({ id: null, imageUrl: url, status: 1 })
      } catch (error) {
        console.error('Upload thất bại:', error)
      }
    } else {
      console.warn('File null/undefined tại vị trí:', i)
    }
  }
  console.log('Tổng số ảnh upload:', uploadedImages.length, uploadedImages)
  productDTO.value.imageUrls = uploadedImages
  try {
    console.log('📦 Dữ liệu sản phẩm gửi backend:', JSON.stringify(productDTO.value, null, 2))
    const res = await createProduct(productDTO.value)
    console.log('Kết quả trả về từ backend:', res)
    router.push({
      name: 'product-index',
      query: { alert: 'success', message: 'Thêm sản phẩm thành công!' },
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
    console.log('ALERT ERROR:', alert.value)
    setTimeout(() => (alert.value.show = false), 3000)
  } finally {
    isUploading.value = false
  }
}

// Khi chọn danh mục, cập nhật categoryName
watch(
  () => productDTO.value.categoryId,
  (id) => {
    const cat = categories.value.find((c) => String(c.id) === String(id))
    productDTO.value.categoryName = cat ? cat.categoryName : ''
  },
)

onMounted(async () => {
  try {
    const res = await getAllCategory()
    // Map ProductDTO[] to Category[]
    categories.value = res.data
  } catch (e) {
    console.error('Không tải được danh mục:', e)
  }
})
</script>
