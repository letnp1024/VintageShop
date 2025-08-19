<template>
  <!-- Breadcrumb Begin -->
  <div class="breadcrumb-option">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <div class="breadcrumb__links">
            <router-link to="/home"><i class="fa fa-home"></i> Trang chủ</router-link>
            <router-link to="/cart"><i class="fa fa-shopping-cart"></i> Giỏ hàng</router-link>
            <span>QRcode</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Breadcrumb End -->

  <!-- QRcode Section Begin -->
  <div class="checkout spad">
    <div class="container fluid">
      <div class="row">
        <div class="text-center">
          <h5>Quét mã để thanh toán</h5>
          <img :src="qrUrl" alt="QR VietQR" width="300" />
          <p>Nội dung {{ info }}</p>
          <div class="mt-4">
            <label
              >Số tiền:
              <input type="number" v-model="amount" min="0" class="border rounded px-2 py-1 w-32"
            /></label>
          </div>
          <div class="mt-2">
            <label
              >Nội dung: <input type="text" v-model="info" class="border rounded px-2 py-1 w-64"
            /></label>
          </div>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-6">
          <div class="cart__btn">
            <router-link to="/order-update"
              >Xem trạng thái đơn hàng <i class="fa fa-arrow-right"></i
            ></router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- QRcode Section End -->
</template>
<script setup>
import { ref, computed } from 'vue'
import ClientLayout from './ClientLayout.vue'
import router from '@/router'

const amount = ref(150000)
const info = ref('Thanh toán đơn hàng 123')

const qrUrl =
  'https://img.vietqr.io/image/NCB-9704198526191432198-compact2.png?amount=10000&addInfo=Thanh%20toan%20hoa%20don%20A123'
</script>
