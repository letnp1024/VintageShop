<template>
  <v-layout>
    <v-app-bar style="background-color: rgba(255, 255, 255, 0.7)">
      <v-app-bar-nav-icon variant="text" @click.stop="rail = !rail"></v-app-bar-nav-icon>

      <v-toolbar-title><img src="@/assets/img/logo.png" alt="" /></v-toolbar-title>

      <template v-if="$vuetify.display.mdAndUp">
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
          title="John Leider"
        ></v-list-item>
      </template>

      <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
    </v-app-bar>

    <v-navigation-drawer :rail="rail" permanent>
      <v-list>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
          title="John Leider"
        >
          <template v-slot:append> </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-home"
          title="Trang chủ"
          @click="router.push({ name: 'admin-home' })"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-tshirt-crew"
          title="Sản phẩm"
          @click="router.push({ name: 'product-index' })"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-receipt-text-outline"
          title="Hóa đơn"
          @click="router.push({ name: 'invoice-index' })"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-shape-plus-outline"
          title="Danh mục"
          @click="router.push({ name: 'category-index' })"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-tag-multiple"
          title="Voucher"
          @click="router.push({ name: 'voucher-index' })"
        ></v-list-item>
        <v-list-item prepend-icon="mdi-account-group-outline" title="Users"
        @click="router.push({ name: 'user-index' })"
        ></v-list-item>
        <v-divider></v-divider>
        <v-list-item
          prepend-icon="mdi-web"
          title="Website"
          @click="router.push({ name: 'home' })"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="h-min-screen">
      <router-view />
    </v-main>
  </v-layout>
</template>
<script setup>
import router from '@/router'
import { ref, watch } from 'vue'
const rail = ref(true)
</script>
<style lang="css">
.v-data-table__th {
  background-color: #1b3d7e; /* Màu nền header */
}

.v-data-table-header__content {
  color: #ffff; /* Màu chữ */
  background-color: #1b3d7e;
  font-size: larger;
}
.v-icon {
  color: #1b3d7e;
}
.text-h5 {
  color: #1b3d7e;
}
</style>
