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

    <v-card class="mx-auto px-6 py-8" title="Đăng nhập" width="400" color="#FFFFFFEE">
      <v-form v-model="form" @submit.prevent="onSubmit">
        <v-text-field
          v-model="username"
          :readonly="loading"
          :rules="[required]"
          class="mb-2"
          label="Tên đăng nhập"
          clearable
        ></v-text-field>

        <v-text-field
          v-model="password"
          :readonly="loading"
          :rules="[required]"
          label="Mật khẩu"
          type="password"
          clearable
        ></v-text-field>

        <br />

        <v-btn
          :disabled="!form"
          :loading="loading"
          color="success"
          size="large"
          type="submit"
          variant="elevated"
          block
        >
          Đăng nhập
        </v-btn>

        <div class="text-center mt-4">
          <router-link to="/signup" class="text-decoration-none">
            Chưa có tài khoản? Đăng ký ngay
          </router-link>
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/authApi'
import type { LoginRequestDTO } from '@/types/authType'

const router = useRouter()

const form = ref<boolean>(false)
const username = ref<string>('')
const password = ref<string>('')
const loading = ref<boolean>(false)
const alert = ref<{ show: boolean; type: 'success' | 'error'; message: string }>({
  show: false,
  type: 'success',
  message: '',
})

async function onSubmit(): Promise<void> {
  if (!form.value) return

  const loginData: LoginRequestDTO = {
    username: username.value,
    password: password.value,
  }

  loading.value = true

  try {
    const response = await login(loginData)

    // Lưu thông tin đăng nhập vào localStorage
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('username', response.data.username)
    localStorage.setItem('role', response.data.role)

    // Hiển thị thông báo thành công
    alert.value = {
      show: true,
      type: 'success',
      message: 'Đăng nhập thành công!',
    }

    // Chuyển hướng dựa trên role
    setTimeout(() => {
      if (response.data.role === 'ADMIN') {
        router.push({ name: 'admin-home' })
      } else {
        router.push({ name: 'home' })
      }
    }, 1000)
  } catch (error: any) {
    // Hiển thị thông báo lỗi
    const errorMessage = error.response?.data?.error || 'Đăng nhập thất bại!'
    alert.value = {
      show: true,
      type: 'error',
      message: errorMessage,
    }
  } finally {
    loading.value = false
  }
}

function required(v: any): boolean | string {
  return !!v || 'Trường này là bắt buộc'
}
</script>
