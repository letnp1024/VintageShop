<template>
  <v-card
    class="mx-auto px-6 py-8"
    title="Thông tin tài khoản"
    prepend-icon="mdi-account"
    variant="text"
  >
    <v-form v-model="form" @submit.prevent="onSubmit">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            density="compact"
            variant="plain"
            prepend-icon="mdi-pencil"
            v-model="username"
            :readonly="loading"
            :rules="[required]"
            class="mb-2"
            label="Tên đăng nhập"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-btn variant="text" color="primary"> Đổi tên đăng nhập </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            density="compact"
            variant="plain"
            prepend-icon="mdi-pencil"
            v-model="password"
            :readonly="loading"
            :rules="[required, passwordRule]"
            label="Mật khẩu"
            type="password"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-btn variant="text" color="primary"> Đổi mật khẩu </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            density="compact"
            variant="plain"
            prepend-icon="mdi-pencil"
            v-model="confirmPassword"
            :readonly="loading"
            :rules="[required, passwordRule]"
            label="Xác nhận mật khẩu"
            type="password"
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>
<script setup>
import { ref } from 'vue'

const form = ref(false)
const username = ref('')
const fullname = ref('')
const email = ref('')
const phonenumber = ref('')
const password = ref('')
const confirmPassword = ref('')
const address = ref('')
const gender = ref(null)
const loading = ref(false)

function onSubmit() {
  if (!form.value) return

  const userData = {
    username: username.value,
    fullname: fullname.value,
    email: email.value,
    phonenumber: phonenumber.value,
    password: password.value,
    address: address.value,
    gender: gender.value,
    // role sẽ được set mặc định ở backend (user role)
    // registrationdate sẽ được set ở backend
    // status mặc định là 0 (chưa verify email)
  }

  loading.value = true

  // TODO: Gọi API đăng ký
  console.log('Signup data:', userData)

  setTimeout(() => (loading.value = false), 2000)
}

function required(v) {
  return !!v || 'Trường này là bắt buộc'
}

function emailRule(v) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(v) || 'Email không hợp lệ'
}

function phoneRule(v) {
  const pattern = /^[0-9]{10,11}$/
  return pattern.test(v) || 'Số điện thoại phải có 10-11 chữ số'
}

function passwordRule(v) {
  return v?.length >= 6 || 'Mật khẩu phải có ít nhất 6 ký tự'
}

function confirmPasswordRule(v) {
  return v === password.value || 'Mật khẩu xác nhận không khớp'
}
</script>
