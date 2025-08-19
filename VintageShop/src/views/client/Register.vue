
<template>
  <div class="register-container" :style="{
  backgroundImage:'url(https://im.uniqlo.com/global-cms/spa/rese6bcbd57adb1e6a1e1c4169d075c97c4fr.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  height: '100vh' 
}">
  <v-card class="mx-auto" max-width="500" title="Đăng ký" color="#FFFFFFEE">
    <v-container>
      <v-text-field
        v-model="username"
        color="primary"
        label="Username"
        variant="underlined"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        color="primary"
        label="Password"
        type="password"
        placeholder="Enter your password"
        variant="underlined"
        required
      ></v-text-field>

      <v-text-field
        v-model="fullname"
        color="primary"
        label="Full Name"
        variant="underlined"
        required
      ></v-text-field>

      <v-radio-group v-model="gender" row>
        <v-label class="mb-2">Gender</v-label>
        <v-row>
          <v-col >
            <v-radio label="Male" :value="true"></v-radio>
          </v-col>
          <v-col>
            <v-radio label="Female" :value="false"></v-radio>
          </v-col>
        </v-row>
      </v-radio-group>

      <v-text-field
        v-model="phonenumber"
        color="primary"
        label="Phone Number"
        variant="underlined"
        required
      ></v-text-field>

      <v-text-field
        v-model="address"
        color="primary"
        label="Address"
        variant="underlined"
        required
      ></v-text-field>

      <v-text-field
        v-model="email"
        color="primary"
        label="Email (optional)"
        variant="underlined"
      ></v-text-field>

      <v-checkbox
        v-model="terms"
        color="secondary"
        label="I agree to site terms and conditions"
      ></v-checkbox>
    </v-container>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="success">
        Hoàn thành đăng ký

        <v-icon icon="mdi-chevron-right" end></v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</div>
</template>

<script setup>
import { ref } from 'vue'
import rp1 from '@/assets/img/product/related/rp-1.jpg';
const username = ref('')
const password = ref('')
const fullname = ref('')
const gender = ref(null) // true = nam, false = nữ
const phonenumber = ref('')
const address = ref('')
const email = ref('')
const terms = ref(false)

const submit = () => {
  if (!terms.value) {
    alert('You must agree to the terms to register.')
    return
  }

  const userData = {
    username: username.value,
    password: password.value,
    fullname: fullname.value,
    gender: gender.value,
    phonenumber: phonenumber.value,
    address: address.value,
    email: email.value || null,
  }

  console.log('Submitted:', userData)
  // Gửi dữ liệu đến server API tại đây
}
</script>
