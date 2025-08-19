<template>
  <v-sheet
    class="pa-4"
    elevation="0"
    style="border: 2px dashed #ccc; border-radius: 8px;"
  >
    <v-row justify="center" align="start" class="pa-4" no-gutters>
      <v-col cols="12" sm="4">
        <v-card flat class="text-center">
          <v-card
            class="mt-4 mx-auto"
            elevation="0"
            rounded="lg"
            border
            variant="outlined"
            height="400"
            width="300"
            style="cursor: pointer;"
            @click="triggerFileInput"
          >
            <v-img
              :src="imagePreview || props.initialUrl || 'https://placehold.co/300x400?text=Nh%E1%BA%A5n%20v%C3%A0o%20%C4%91%E1%BB%83%20up%20%E1%BA%A3nh'"
              alt="Preview"
              height="400"
              class="rounded-lg"
              cover
            />
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              style="display: none"
            />
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Props & Emits
const props = defineProps<{
  initialUrl?: string | null
}>()

const emit = defineEmits<{
  (e: 'change', file: File): void
}>()

// Image preview & input
const imagePreview = ref<string>('')
const fileInput = ref<HTMLInputElement | null>(null)

// Trigger hidden file input
const triggerFileInput = () => {
  fileInput.value?.click()
}

// Handle file upload
const handleImageUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    imagePreview.value = URL.createObjectURL(file)
    emit('change', file)
  }
}
</script>
