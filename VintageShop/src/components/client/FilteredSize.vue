<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import pd1 from "@/assets/img/test/pd1.png"
import pd2 from "@/assets/img/test/pd2.png"
import pd3 from "@/assets/img/test/pd3.png"
import pd4 from "@/assets/img/test/pd4.png"
import pd5 from "@/assets/img/test/pd5.png"
import pd6 from "@/assets/img/test/pd6.png"


const props = defineProps<{
  size?: string | null
}>()

const emit = defineEmits<{
  (e: 'select', payload: { id_product_detail: number; filename: string }): void
}>()

const items = ref([
  { id: 1, image: pd1, sizes: ['M', 'XL'], selected: false },
  { id: 2, image: pd2, sizes: ['M', 'L', 'XL'], selected: false },
  { id: 3, image: pd3, sizes: ['S', 'XL'], selected: false },
  { id: 4, image: pd4, sizes: ['M', 'XL'], selected: false },
  { id: 5, image: pd5, sizes: ['L', 'XL'], selected: false },
  { id: 6, image: pd6, sizes: ['S', 'M', 'XL'], selected: false },
])

const filteredItems = computed(() => {
  if (!props.size) return items.value
  return items.value.filter(item => item.sizes.includes(props.size!))
})
watch(
  () => props.size,
  () => {
    // Khi size thay đổi → bỏ hết selected
    items.value.forEach(item => {
      item.selected = false
    })
  }
)
const selectItem = (item: {
  selected: boolean ; id: number; image: string 
}) => {
  // Reset chọn
  filteredItems.value.forEach(i => (i.selected = false))
  item.selected = true

  const filename = item.image
  emit('select', {
    id_product_detail: item.id,
    filename,
  })
}
</script>


<template>
  <v-card flat class="pa-4">
    <v-row dense>
      <v-col
        v-for="item in filteredItems"
        :key="item.id"
        cols="auto"
        class="d-flex flex-column align-center"
      >
        <v-card
          class="card-container"
          elevation="0"
          border
          height="80"
          width="60"
          style="cursor: pointer;"
          @click="selectItem(item)"
        >
          <v-img :src="item.image" height="80" cover />
          <div class="overlay" :class="{ active: item.selected }">Chọn</div>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>


<style scoped>
.card-container {
  position: relative;
  width: 60px;
  height: 80px;
}

.overlay {
  position: absolute;
  top: 35%;
  left: 0;
  width: 100%;
  height: 30%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  font-weight: bold;
  font-size: 14px;
  z-index: 1;
  pointer-events: none;
}

.card-container:hover .overlay,
.overlay.active {
  opacity: 1;
}
</style>
