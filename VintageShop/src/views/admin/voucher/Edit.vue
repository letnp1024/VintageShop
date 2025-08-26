<template>
  <!-- Alert -->
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
    <!-- Overlay khi đang xử lý -->
    <v-overlay :model-value="isUploading" persistent class="align-center justify-center">
      <v-progress-circular indeterminate size="64" color="primary" />
    </v-overlay>

    <v-toolbar flat color="transparent">
      <v-toolbar-title class="text-h5 font-weight-bold">
  Thêm voucher
      </v-toolbar-title>
    </v-toolbar>

    <v-col cols="12" xl="11" class="mx-auto">
      <v-card class="pa-4">
        <v-form @submit.prevent="handleSubmit">
          <v-row>
            <v-text-field v-model="voucherDTO.voucherCode" label="Mã voucher" class="mb-3 px-6" variant="underlined" style="width: 40vw" required />
            <v-text-field v-model="voucherDTO.discountPercentage" label="Phần trăm giảm (%)" type="number" class="mb-3 px-6" variant="underlined" style="width: 40vw" />
            <v-date-input
              label="Select range"
              min-width="368"
              multiple="range"
              style="width: 40vw"
              variant="underlined"
              v-model="dateRange"
              class="mb-3 px-3"
            ></v-date-input>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-btn block color="success" variant="tonal" class="mb-3 px-6" :loading="isUploading" type="submit">
                <v-icon color="success">mdi-content-save-outline</v-icon>
                Lưu
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn block color="warning" variant="tonal" class="mb-3 px-6" @click="router.push({ name: 'voucher-index' })" :disabled="isUploading">
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
import { useRouter, useRoute } from 'vue-router'
import { getVoucherById, updateVoucher } from '@/api/voucherApi'
import type { Voucher } from '@/types/voucher'
import { format } from 'date-fns'

const router = useRouter()
const route = useRoute()

const alert = ref<{ show: boolean; type: 'success' | 'error'; message: string }>(
  { show: false, type: 'success', message: '' }
)
const isUploading = ref(false)

const dateRange = ref<string[] | null>(null)

const voucherDTO = ref<Voucher>({
  id: 0,
  voucherCode: '',
  startDate: '',
  endDate: '',
  discountPercentage: null,
  status: 1,
})

onMounted(async () => {
  const id = route.params.id
  if (id) {
    try {
      const res = await getVoucherById(Number(id))
      const voucher = res.data
      voucherDTO.value = { ...voucher }
      // Set dateRange for v-date-input
      if (voucher.startDate && voucher.endDate) {
        dateRange.value = [voucher.startDate, voucher.endDate]
      }
    } catch (e) {
      showAlert('error', 'Không tìm thấy voucher!')
    }
  }
})

const handleSubmit = async () => {
  if (!voucherDTO.value.voucherCode) {
    showAlert('error', 'Vui lòng nhập mã voucher!')
    return
  }
  const listDays = dateRange.value
  if (!listDays || listDays.length < 2) {
    showAlert('error', 'Vui lòng nhập ngày bắt đầu và kết thúc!')
    return
  }
  isUploading.value = true
  try {
    const start = listDays[0]
    const end = listDays[listDays.length - 1]
    voucherDTO.value.startDate = format(start, 'yyyy-MM-dd')
    voucherDTO.value.endDate = format(end, 'yyyy-MM-dd')
    await updateVoucher(voucherDTO.value.id, voucherDTO.value)
    router.push({
      name: 'voucher-index',
      query: { alert: 'success', message: 'Cập nhật voucher thành công!' },
    })
  } catch (error: any) {
    const msg =
      error?.response?.data?.message ??
      error?.response?.data ??
      error.message ??
      'Có lỗi xảy ra!'
    showAlert('error', msg)
  } finally {
    isUploading.value = false
  }
}

function showAlert(type: 'success' | 'error', message: string) {
  alert.value = { show: true, type, message }
  setTimeout(() => (alert.value.show = false), 3000)
}
</script>
