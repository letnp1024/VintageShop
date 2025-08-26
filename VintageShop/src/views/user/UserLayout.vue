<template>
  <div class="categories">
    <div class="container-fluid">
      <div class="row">
        <v-card width="200vh" min-height="600" variant="elevated">
          <v-layout>
            <v-navigation-drawer absolute permanent>
              <v-list>
                <v-list-item
                  prepend-icon="mdi-account-box-multiple"
                  subtitle="john@google.com"
                  title="John Leider"
                >
                </v-list-item>
              </v-list>

              <v-divider></v-divider>

              <v-list :lines="false" density="compact" nav>
                 <v-list-item
                    v-for="(item, i) in items"
                    :key="i"
                    :to="{ name: item.name }"
                    link
                    color="#4f77c4"
                  >
                  <template v-slot:prepend>
                    <v-icon :icon="item.icon"></v-icon>
                  </template>

                  <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item>
              </v-list>
            </v-navigation-drawer>

            <v-main class="h-min-screen">
              <router-view />
            </v-main>
          </v-layout>
        </v-card>
      </div>
    </div>
  </div>
</template>
<script setup>
import { logout } from '@/utils/auth';
const items = [
  { text: 'Tài khoản', icon: 'mdi-account', name: 'user-profile' }, 
  { text: 'Bảo mật', icon: 'mdi-key', name: 'user-security' }, 
  { text: 'Lịch sử hóa đơn', icon: 'mdi-file-document-outline', name: 'user-orders' }, 
  // { text: 'Danh sách yêu thích', icon: 'mdi-heart-outline', name: 'user-favorites' }, 
  // { text: 'Thông báo', icon: 'mdi-bell-outline', name: 'user-notifications' }, 
  // { text: 'Đăng xuất', icon: 'mdi-logout', name: 'logout' }, 
]
</script>
<style lang="css">
.v-icon {
  color: #1b3d7e;
}
</style>
