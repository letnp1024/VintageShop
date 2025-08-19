<template>
        <v-container fluid>
        <v-toolbar flat color="transparent">
          <v-toolbar-title class="text-h5 font-weight-bold">
            Thêm sản phẩm
          </v-toolbar-title>
        </v-toolbar>
    <!-- Nội dung: Form, ảnh, input... -->
    <v-col cols="12" sm="12" md="12" lg="12" xl="11" class="mx-auto">
        <v-card class="pa-4">
          <v-form>
            <ImageUploadProduct class="mb-3 px-6"/>
            <v-row>
                <v-col cols="12" sm="6">
                <v-text-field label="Tên sản phẩm" class="mb-3 px-6" variant="underlined" style="width: 40vw;"/>
                <v-text-field label="Giá sản phẩm" class="mb-3 pa-6" variant="underlined" style="width: 40vw;"/>
                </v-col>

                <v-col cols="12" sm="6">
                <v-select
                  style="width: 40vw;"
                  variant="underlined"
                  label="Select"
                  :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
                ></v-select>
                <!-- Bạn có thể thêm thêm trường ở đây -->
                </v-col>
            </v-row>
            <v-row>
                <v-textarea label="Mô tả sản phẩm" class="mb-3 px-6" variant="outlined" style="width: 40vw;"/>
            </v-row>
            <v-row>
                <v-col cols="6">
                <v-btn block color="success" variant="tonal" class="mb-3 px-6">Lưu</v-btn>
                </v-col>
                <v-col cols="6">
                <v-btn block color="warning" variant="tonal" class="mb-3 px-6">Hủy</v-btn>
                </v-col>
            </v-row>
                <!-- Bạn có thể thêm thêm trường ở đây -->
          </v-form>
        </v-card>
    </v-col>
    </v-container>
</template>
<script setup>
import { ref, watch } from 'vue'
import ImageUploadProduct from '@/components/admin/ImageUploadProduct.vue'
const rail = ref(true)
const group = ref(null)
</script>