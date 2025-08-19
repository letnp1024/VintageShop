<template>
  <v-card flat class="pa-2">
    <v-row dense>
      <v-col
        v-for="size in sizes"
        :key="size"
        cols="auto"
      >
        <v-btn
          icon
          class="font-weight-bold"
          rounded="circle"
          :variant="selectedSize === size ? 'flat' : 'outlined'"
          color="#1b3d7e"
          size="small"
          @click="selectSize(size)"
        >
          {{ size }}
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// Nhận danh sách size từ cha
const props = defineProps<{
  sizes: string[]
}>()

// Emit size được chọn
const emit = defineEmits<{
  (e: 'update:size', size: string): void
}>()

// State: size đang chọn
const selectedSize = ref<string>('')

// Gán giá trị mặc định (nếu có)
if (props.sizes.length > 0) {
  selectedSize.value = props.sizes[0]
  emit('update:size', selectedSize.value)
}

// Khi click chọn size
function selectSize(size: string) {
  selectedSize.value = size
  emit('update:size', size)
}
</script>
