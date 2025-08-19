<template>
  <v-container
    fluid
    class="d-flex justify-center align-center"
    :style="{
      backgroundImage:
        'url(https://im.uniqlo.com/global-cms/spa/rese6bcbd57adb1e6a1e1c4169d075c97c4fr.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      height: '100vh',
    }"
  >
    <!-- Alert thông báo -->
    <v-alert
      v-if="alert.show"
      :color="alert.type === 'success' ? 'success' : 'error'"
      :icon="alert.type === 'success' ? '$success' : '$error'"
      :title="alert.type === 'success' ? 'Thành công' : 'Lỗi'"
      :text="alert.message"
      class="ma-4"
      style="position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px"
      variant="tonal"
      border="start"
      closable
      @click:close="alert.show = false"
    />

    <v-card class="mx-auto px-8 py-12 text-center" width="500" color="#FFFFFFEE">
      <div v-if="!verified">
        <!-- Icon email -->
        <v-icon size="80" color="primary" class="mb-6"> mdi-email-outline </v-icon>

        <h2 class="text-h4 mb-4">Xác minh email</h2>

        <p class="text-body-1 mb-6 text-grey-darken-1">
          Chúng tôi đã gửi email xác minh đến địa chỉ email của bạn. Vui lòng kiểm tra hộp thư và
          nhấp vào liên kết để xác minh tài khoản.
        </p>

        <!-- Loading spinner khi đang chờ -->
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
          class="mb-6"
        ></v-progress-circular>

        <p class="text-body-2 mb-6">Đang chờ xác minh email...</p>

        <!-- Buttons -->
        <div class="d-flex flex-column gap-3">
          <v-btn
            color="secondary"
            variant="text"
            size="large"
            @click="resendEmail"
            :loading="resending"
          >
            <v-icon start>mdi-email-send</v-icon>
            Gửi lại email
          </v-btn>

          <v-divider class="my-2"></v-divider>

          <v-btn color="grey" variant="text" @click="router.push({ name: 'home' })">
            <v-icon start>mdi-arrow-left</v-icon>
            Trở về trang chủ
          </v-btn>
        </div>
      </div>

      <!-- Hiển thị khi đã xác minh thành công -->
      <div v-else>
        <v-icon size="80" color="success" class="mb-6"> mdi-check-circle-outline </v-icon>

        <h2 class="text-h4 mb-4 text-success">Xác minh thành công!</h2>

        <p class="text-body-1 mb-6 text-grey-darken-1">
          Tài khoản của bạn đã được xác minh thành công. Bạn có thể đăng nhập ngay bây giờ.
        </p>
      </div>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { verifyEmail } from '@/api/authApi'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const verified = ref<boolean>(false)
const checking = ref<boolean>(false)
const resending = ref<boolean>(false)
const alert = ref<{ show: boolean; type: 'success' | 'error'; message: string }>({
  show: false,
  type: 'success',
  message: '',
})

// Tự động kiểm tra token từ URL khi component mount
onMounted(async () => {
  const token = localStorage.getItem('token')
  if (token) {
    await verifyToken(token)
  }
})

async function verifyToken(token: string): Promise<void> {
  try {
    const response = await verifyEmail(token)

    verified.value = true
    alert.value = {
      show: true,
      type: 'success',
      message: response.data.message || 'Xác minh email thành công!',
    }
    setTimeout(() => {
      router.push({ name: 'login' })
    }, 2000)
  } catch (error: any) {
    alert.value = {
      show: true,
      type: 'error',
      message: error.response?.data?.error || 'Token không hợp lệ hoặc đã hết hạn!',
    }
  }
}

async function checkVerification(): Promise<void> {
  checking.value = true

  // Simulate checking - trong thực tế có thể gọi API để check status
  setTimeout(() => {
    checking.value = false
    alert.value = {
      show: true,
      type: 'error',
      message: 'Vui lòng kiểm tra email và nhấp vào liên kết xác minh!',
    }
  }, 1000)
}

async function resendEmail(): Promise<void> {
  resending.value = true

  // Simulate resend - trong thực tế gọi API resend verification email
  setTimeout(() => {
    resending.value = false
    alert.value = {
      show: true,
      type: 'success',
      message: 'Đã gửi lại email xác minh! Vui lòng kiểm tra hộp thư.',
    }
  }, 1500)
}

function backToLogin(): void {
  router.push({ name: 'register' })
}

function goToLogin(): void {
  router.push({ name: 'login' })
}
</script>
