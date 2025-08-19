<script setup>
import { ref } from 'vue'

const sizes = ['S', 'M', 'L', 'XL']
const selectedSize = ref(null)
</script>
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
        @click="selectedSize = size"
      >
        {{ size }}
      </v-btn>
    </v-col>
  </v-row>
</v-card>
</template>
