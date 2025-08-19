<template>
  <v-sheet
    class="pa-4"
    elevation="0"
    style="border: 2px dashed #ccc; border-radius: 8px;"
  >
    <v-row justify="center" align="start" class="pa-4" no-gutters>
      <v-col
        v-for="(preview, index) in imagePreviews"
        :key="index"
        cols="12"
        sm="4"
        class="d-flex justify-center"
      >
        <v-card flat class="text-center">
          <v-card
            elevation="0"
            rounded="lg"
            border
            variant="outlined"
            height="400"
            width="300"
            style="cursor: pointer;"
            @click="triggerFileInput(index)"
          >
            <v-img
              :src="preview || placeholder"
              alt="Preview"
              height="400"
              class="rounded-lg"
              cover
            />
            <input
              :ref="el => fileInputs[index] = el as HTMLInputElement"
              type="file"
              accept="image/"
              @change="e => handleImageUpload(e, index)"
              style="display: none"
            />
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// 📦 Props: nhận mảng ảnh URL ban đầu (3 ảnh hoặc ít hơn)
const props = defineProps<{
  initialUrls?: (string | null)[]
}>()

// 📤 Emits: gửi file + index về component cha
const emit = defineEmits<{
  (e: 'change', file: File, index: number): void
}>()

// 🔁 Mảng preview các ảnh đã chọn
const imagePreviews = ref<string[]>(['', '', ''])

// 📥 Mảng ref tới input file
const fileInputs = ref<(HTMLInputElement | null)[]>([])

// 🔄 Tạo preview từ props ban đầu
watch(() => props.initialUrls, (newUrls) => {
  if (newUrls && Array.isArray(newUrls)) {
    for (let i = 0; i < 3; i++) {
      imagePreviews.value[i] = newUrls[i] || ''
    }
  }
}, { immediate: true }) // <== Gọi ngay khi mounted

// 🔘 Click vào card → mở input file tương ứng
const triggerFileInput = (index: number) => {
  fileInputs.value[index]?.click()
}

// 📷 Khi người dùng chọn file mới → update preview + emit
const handleImageUpload = (e: Event, index: number) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    imagePreviews.value[index] = URL.createObjectURL(file)
    emit('change', file, index)
  }
}

// 🔍 Placeholder ảnh mặc định
const placeholder = 'https://placehold.co/300x400?text=Nhấn+để+chọn+ảnh'
</script>
