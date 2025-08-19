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
            variant="text"
            prepend-icon="mdi-pencil"
            density="compact"
            v-model="username"
            :readonly="loading"
            :rules="[required]"
            class="mb-2"
            label="Tên đăng nhập"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            variant="text"
            prepend-icon="mdi-pencil"
            density="compact"
            v-model="fullname"
            :readonly="loading"
            :rules="[required]"
            class="mb-2"
            label="Họ và tên"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            variant="text"
            prepend-icon="mdi-pencil"
            density="compact"
            v-model="email"
            :readonly="loading"
            :rules="[]"
            class="mb-2"
            label="Email"
            type="email"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            variant="text"
            prepend-icon="mdi-pencil"
            density="compact"
            v-model="phonenumber"
            :readonly="loading"
            :rules="[]"
            class="mb-2"
            label="Số điện thoại"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            variant="text"
            prepend-icon="mdi-pencil"
            density="compact"
            v-model="password"
            :readonly="loading"
            :rules="[]"
            label="Mật khẩu"
            type="password"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            variant="text"
            prepend-icon="mdi-pencil"
            density="compact"
            v-model="confirmPassword"
            :readonly="loading"
            :rules="[]"
            label="Xác nhận mật khẩu"
            type="password"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-text-field
            variant="text"
            prepend-icon="mdi-pencil"
            density="compact"
            v-model="address"
            :readonly="loading"
            :rules="[required]"
            label="Địa chỉ"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-radio-group v-model="gender" :rules="[required]" label="Giới tính" inline>
            <v-radio :value="true" label="Nam"></v-radio>
            <v-radio :value="false" label="Nữ"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <br />

      <v-btn
        :disabled="!form"
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
import { ref } from 'vue'

// const form = ref(false)
// const username = ref('')
// const fullname = ref('')
// const email = ref('')
// const phonenumber = ref('')
// const password = ref('')
// const confirmPassword = ref('')
// const address = ref('')
// const gender = ref(null)
// const loading = ref(false)

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
  }

  loading.value = true

  // TODO: Gọi API đăng ký
  console.log('Signup data:', userData)

  setTimeout(() => (loading.value = false), 2000)
}

// function required(v) {
//   return !!v || 'Trường này là bắt buộc'
// }

// function emailRule(v) {
//   const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//   return pattern.test(v) || 'Email không hợp lệ'
// }

// function phoneRule(v) {
//   const pattern = /^[0-9]{10,11}$/
//   return pattern.test(v) || 'Số điện thoại phải có 10-11 chữ số'
// }

// function passwordRule(v) {
//   return v?.length >= 6 || 'Mật khẩu phải có ít nhất 6 ký tự'
// }

// function confirmPasswordRule(v) {
//   return v === password.value || 'Mật khẩu xác nhận không khớp'
// }
</script>
