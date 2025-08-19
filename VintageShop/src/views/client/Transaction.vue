<template>
  <div class="transaction-container">
    <v-card class="mx-auto my-12" max-width="500" elevation="4">
      <v-card-title class="text-h5 text-center">Kết quả giao dịch</v-card-title>
      <v-card-text class="text-center">
        <template v-if="status === 'success'">
          <v-icon color="success" size="60">mdi-check-circle</v-icon>
          <div class="mt-2 mb-4 text-success">Chúc mừng! Thanh toán thành công.</div>
          <v-btn color="primary" @click="goInvoiceDetail">Về trang chủ</v-btn>
        </template>
        <template v-else-if="status === 'pending'">
          <v-icon color="warning" size="60">mdi-alert-circle</v-icon>
          <div class="mt-2 mb-4 text-warning">Giao dịch chưa hoàn tất hoặc bị hủy.</div>
          <v-btn color="primary" @click="retryPayment">Tạo thanh toán lại</v-btn>
          <v-btn variant="text" class="ml-2" @click="goInvoiceDetail">Để trả sau</v-btn>
        </template>
        <template v-else>
          <v-icon color="error" size="60">mdi-close-circle</v-icon>
          <div class="mt-2 mb-4 text-error">Giao dịch thất bại hoặc không xác định.</div>
          <v-btn color="primary" @click="goInvoiceDetail">Về trang chủ</v-btn>
        </template>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { createVNPayPayment } from '@/api/paymentApi'
import { ref, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const invoiceCode = (route.params.invoiceCode as string) || ''
const vnp_TransactionStatus = (route.query.vnp_TransactionStatus as string) || ''
const vnp_TxnRef = (route.query.vnp_TxnRef as string) || ''
const vnp_Amount = (route.query.vnp_Amount as string) || ''

const status = ref<'success' | 'pending' | 'fail'>('fail')
const retryPayment = async () => {
  try {
    // Gọi API tạo link thanh toán VNPay
    const vnpReturnUrl = `${window.location.origin}/transaction/${invoiceCode}`
    const response = await createVNPayPayment(Number(vnp_Amount), vnpReturnUrl)
    window.location.href = response.data['url'] // ✅ redirect đến link VNPay
    console.log('VNPay payment URL:', response.data)
  } catch (error) {
    console.error('VNPay error:', error)
  }
}
onMounted(() => {
  if (vnp_TransactionStatus === '00') {
    status.value = 'success'
    setTimeout(() => {
      goInvoiceDetail()
    }, 2000)
  } else if (vnp_TransactionStatus === '02' || vnp_TransactionStatus === '24') {
    status.value = 'pending'
  } else {
    status.value = 'fail'
  }
})

function goInvoiceDetail() {
  router.push({ name: 'order-detail', params: { invoiceCode } })
}
</script>
