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

    <v-card class="mx-auto px-6 py-8" title="Đăng ký tài khoản" width="800" color="#FFFFFFEE">
      <v-form v-model="form" @submit.prevent="onSubmit">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="username"
              :readonly="loading"
              :rules="[required]"
              class="mb-2"
              label="Tên đăng nhập"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="fullname"
              :readonly="loading"
              :rules="[required]"
              class="mb-2"
              label="Họ và tên"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="email"
              :readonly="loading"
              :rules="[required, emailRule]"
              class="mb-2"
              label="Email"
              type="email"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="phonenumber"
              :readonly="loading"
              :rules="[required, phoneRule]"
              class="mb-2"
              label="Số điện thoại"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="password"
              :readonly="loading"
              :rules="[required, passwordRule]"
              label="Mật khẩu"
              type="password"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="confirmPassword"
              :readonly="loading"
              :rules="[required, confirmPasswordRule]"
              label="Xác nhận mật khẩu"
              type="password"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="address"
              :readonly="loading"
              :rules="[required]"
              label="Địa chỉ"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-radio-group v-model="gender" :rules="[genderRule]" label="Giới tính" inline>
              <v-radio :value="true" label="Nam"></v-radio>
              <v-radio :value="false" label="Nữ"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>

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
          Đăng ký
        </v-btn>

        <div class="text-center mt-4">
          <router-link to="/login" class="text-decoration-none">
            Đã có tài khoản? Đăng nhập ngay
          </router-link>
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { register } from '@/api/authApi'
import type { RegisterRequestDTO } from '@/types/authType'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref<boolean>(false)
const username = ref<string>('')
const fullname = ref<string>('')
const email = ref<string>('')
const phonenumber = ref<string>('')
const password = ref<string>('')
const confirmPassword = ref<string>('')
const address = ref<string>('')
const gender = ref<boolean | null>(null)
const loading = ref<boolean>(false)
const alert = ref<{ show: boolean; type: 'success' | 'error'; message: string }>({
  show: false,
  type: 'success',
  message: '',
})

async function onSubmit(): Promise<void> {
  if (!form.value) return

  const userData: RegisterRequestDTO = {
    username: username.value,
    password: password.value,
    fullname: fullname.value,
    gender: gender.value!,
    phonenumber: phonenumber.value,
    address: address.value,
    email: email.value,
  }

  loading.value = true

  try {
    const response = await register(userData)

    // Lưu token nếu API trả về (optional)
    if ((response.data as any).token) {
      localStorage.setItem('token', (response.data as any).token)
    }

    // Hiển thị thông báo thành công
    alert.value = {
      show: true,
      type: 'success',
      message:
        response.data.message ||
        'Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản.',
    }

    // Reset form sau khi đăng ký thành công
    setTimeout(() => {
      router.push({ name: 'email-verification' })
    }, 2000)
  } catch (error: any) {
    // Hiển thị thông báo lỗi
    const errorMessage = error.response?.data?.error || 'Có lỗi xảy ra khi đăng ký!'
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

function emailRule(v: string): boolean | string {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(v) || 'Email không hợp lệ'
}

function phoneRule(v: string): boolean | string {
  const pattern = /^[0-9]{10,11}$/
  return pattern.test(v) || 'Số điện thoại phải có 10-11 chữ số'
}

function passwordRule(v: string): boolean | string {
  return v?.length >= 6 || 'Mật khẩu phải có ít nhất 6 ký tự'
}

function confirmPasswordRule(v: string): boolean | string {
  return v === password.value || 'Mật khẩu xác nhận không khớp'
}
// genderRule
function genderRule(v: boolean | null): boolean | string {
  return v !== null || 'Giới tính là bắt buộc'
}
</script>
