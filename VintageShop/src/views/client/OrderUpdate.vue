<template>
    <!-- Breadcrumb Begin -->
    <div class="breadcrumb-option">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="breadcrumb__links">
              <router-link to="/home"><i class="fa fa-home"></i> Trang chủ</router-link>
              <router-link to="/cart"><i class="fa fa-shopping-cart"></i> Giỏ hàng</router-link>
              <router-link to="/cart"><i class="fa fa-qrcode"></i> QRcode</router-link>
              <span>Theo dõi đơn hàng</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Breadcrumb End -->
    <!-- QRcode Section Begin -->
    <div class="checkout spad">
      <div class="container">
        <div style="border-left: 2px solid #666; padding-left: 24px; color: lightgray;">
        <v-row class="mb-8" align="center" justify="space-between" no-gutters>
            <v-col cols="12" md="4">
            <h3 class="mb-2" style=" font-size: 30px; font-weight: 400; color: lightgray;" >Tiến hành thanh toán</h3>
            <p >Date: January 1, 2022</p>
            </v-col>
            <v-col cols="12" md="8">
            <p >Đơn hàng đang chờ thanh toán</p>
            </v-col>
        </v-row>
      </div>
      <div style="border-left: 2px solid #666; padding-left: 24px;">
        <v-row class="mb-8" align="center" justify="space-between" no-gutters>
            <v-col cols="12" md="4">
            <h3 class="mb-2" style=" font-size: 30px; font-weight: 400;">Soạn đơn</h3>
            <p class="text-grey-darken-1 text-body-2">Date: January 1, 2022</p>
            </v-col>
            <v-col cols="12" md="7">
            <p class="text-grey-darken-2">Nhân viên đang chuẩn bị đơn hàng</p>
            </v-col>
            <v-col cols="12" md="1">
            <router-link to="/order/1"><v-btn block color="danger" variant="tonal" class="pa-10">
                 Hủy
            </v-btn></router-link>
            </v-col>
        </v-row>
      </div>
      </div>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import ClientLayout from './ClientLayout.vue'

</script>