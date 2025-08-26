<template>
  <v-card
    class="mx-auto px-6 py-8"
    title="Thông tin tài khoản"
    prepend-icon="mdi-account"
    variant="text"
  >
    <v-form v-model="form" @submit.prevent="onSubmit">
      <v-row>
        <v-col cols="12" md="6">
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
        <v-col cols="12" md="6">
          <v-text-field
            density="compact"
            variant="plain"
            prepend-icon="mdi-pencil"
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
            density="compact"
            variant="plain"
            prepend-icon="mdi-pencil"
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
            density="compact"
            variant="plain"
            prepend-icon="mdi-pencil"
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
        <v-col cols="12">
          <v-text-field
            density="compact"
            variant="plain"
            prepend-icon="mdi-pencil"
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
          <v-radio-group v-model="gender" label="Giới tính" inline>
            <v-radio :value="true" label="Nam" class="mr-10"></v-radio>
            <v-radio :value="false" label="Nữ" class="ml-10"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>

      <br />

      <v-btn
        :loading="loading"
        color="primary"
        size="large"
        type="submit"
        variant="text"
      >
        Cập nhật thông tin
      </v-btn>
    </v-form>
  </v-card>
</template>
<script setup>

import { ref, onMounted } from 'vue'
import { getProfile, updateProfile } from '@/api/accountApi'
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

onMounted(async () => {
  loading.value = true
  try {
    const res = await getProfile()
    const user = res.data
    username.value = user.username || ''
    fullname.value = user.fullname || ''
    email.value = user.email || ''
    phonenumber.value = user.phonenumber || ''
    address.value = user.address || ''
    gender.value = user.gender ?? null
    // Không set password khi fetch profile
  } catch (error) {
    console.error('Lỗi lấy thông tin người dùng:', error)
  }
  loading.value = false
})

async function onSubmit() {
  if (!form.value) return

  const userData = {
    fullname: fullname.value,
    email: email.value,
    phonenumber: phonenumber.value,
    password: password.value,
    address: address.value,
    gender: gender.value,
  }

  loading.value = true
  try {
    const res = await updateProfile(userData)
    // Có thể cập nhật lại thông tin trên form nếu backend trả về user mới
    const updatedUser = res.data
    fullname.value = updatedUser.fullname || ''
    email.value = updatedUser.email || ''
    phonenumber.value = updatedUser.phonenumber || ''
    address.value = updatedUser.address || ''
    //reload page
    location.reload()
    // Không set password khi cập nhật
    // Hiển thị thông báo thành công nếu muốn
  } catch (error) {
    console.error('Lỗi cập nhật thông tin:', error)
  }
  loading.value = false
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
