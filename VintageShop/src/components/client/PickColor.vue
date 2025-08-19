<template>
  <v-container class="pa-2" fluid>
    <v-row dense>
      <v-col
        v-for="color in filteredColors"
        :key="color.name"
        cols="auto"
      >
        <v-hover v-slot="{ isHovering, props }">
          <div
            v-bind="props"
            @click="selectColor(color)"
            :class="[
              'transition-all',
              'rounded-circle',
              'd-inline-block',
              isHovering ? 'elevation-10 border' : 'elevation-2',
              selectedColor?.name === color.name ? 'p-1' : ''
            ]"
            :style="selectedColor?.name === color.name ? { border: '2px solid black' } : {}"
          >
            <v-img
              :src="color.src"
              height="40"
              width="40"
              cover
              class="rounded-circle"
            />
          </div>
        </v-hover>
      </v-col>
    </v-row>
<v-row class="px-4">
  <p v-if="selectedColor">
  {{ selectedColor.label }}
  </p>
</v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Props: chỉ nhận danh sách tên màu cần hiển thị
const props = defineProps<{
  allowedColors: string[] // ví dụ: ['red', 'blue']
}>()

const emit = defineEmits<{
  (e: 'update:color', color: ColorOption): void
}>()

interface ColorOption {
  name: string
  label: string
  src: string
}

// ✅ Danh sách 10 màu cố định
import black from '@/assets/img/color/black.png'
import blue from '@/assets/img/color/blue.png'
import brown from '@/assets/img/color/brown.png'
import gray from '@/assets/img/color/gray.png'
import green from '@/assets/img/color/green.png'
import pink from '@/assets/img/color/pink.png'
import red from '@/assets/img/color/red.png'
import purple from '@/assets/img/color/purple.png'
import white from '@/assets/img/color/white.png'
import yellow from '@/assets/img/color/yellow.png'
import beige from '@/assets/img/color/beige.png'
import orange from '@/assets/img/color/orange.png'

const allColors: ColorOption[] = [
  { name: 'black', label: 'ĐEN', src: black },
  { name: 'blue', label: 'XANH DƯƠNG', src: blue },
  { name: 'brown', label: 'NÂU', src: brown },
  { name: 'gray', label: 'XÁM', src: gray },
  { name: 'green', label: 'XANH LÁ', src: green },
  { name: 'pink', label: 'HỒNG', src: pink },
  { name: 'red', label: 'ĐỎ', src: red },
  { name: 'purple', label: 'TÍM', src: purple },
  { name: 'white', label: 'TRẮNG', src: white },
  { name: 'yellow', label: 'VÀNG', src: yellow },
  { name: 'beige', label: 'BE', src: beige },
  { name: 'orange', label: 'CAM', src: orange },
]

// ✅ Chỉ lọc ra những màu được phép
const filteredColors = computed(() =>
  allColors.filter((color) => props.allowedColors.includes(color.name))
)

const selectedColor = ref<ColorOption | null>(null)

function selectColor(color: ColorOption) {
  selectedColor.value = color
  emit('update:color', color)
}
</script>
