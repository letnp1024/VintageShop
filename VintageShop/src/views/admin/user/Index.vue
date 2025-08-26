<template>
  <v-container fluid>
    <!-- Alert -->
    <v-alert
      v-if="alert.show"
      :color="alert.type === 'success' ? 'success' : 'error'"
      :icon="alert.type === 'success' ? '$success' : '$error'"
      :title="alert.type === 'success' ? 'Thành công' : 'Lỗi'"
      :text="alert.message"
      class="mb-4"
      variant="tonal"
      border="start"
    />

    <!-- Toolbar -->
    <v-toolbar flat color="transparent">
      <v-toolbar-title class="text-h5 font-weight-bold"> Quản lý người dùng </v-toolbar-title>
    </v-toolbar>

    <!-- Tabs -->
    <v-card class="pa-4">
      <v-tabs v-model="tab" bg-color="transparent" class="mb-6">
        <v-tab value="staff">Nhân viên</v-tab>
        <v-tab value="customer">Khách hàng</v-tab>
      </v-tabs>

      <!-- Search & Column Select -->
      <v-card-title class="d-flex align-center pe-2">
        <v-text-field
          v-model="search"
          label="Tìm kiếm"
          prepend-inner-icon="mdi-magnify"
          variant="solo"
          hide-details
          single-line
          density="compact"
        />

        <v-spacer></v-spacer>
        <v-select
          label="Chọn cột hiển thị"
          variant="solo"
          v-model="selectedColumns"
          :items="selectableHeaders"
          item-title="title"
          item-value="key"
          multiple
          style="max-width: 300px"
          hide-details
          single-line
          density="compact"
        >
          <template #selection="{ index }">
            <span v-if="index === 0">Chọn các cột muốn hiển thị</span>
          </template>
        </v-select>

        <v-divider class="mx-2" vertical></v-divider>

        <v-btn variant="elevated" color="success" @click="exportUsers">
          <v-icon color="#fffa">mdi-microsoft-excel</v-icon>
          Xuất Excel
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Bảng dữ liệu -->
      <v-data-table
        :headers="visibleHeaders"
        :items="filteredUsers"
        :search="search"
        items-per-page="5"
      >
  <template #item.role="{ item }">
    {{ item['role']['roleName']}}
  </template>
        <template #item.action="{ item }">
          <v-menu>
            <template #activator="{ props }">
              <v-btn icon variant="text" v-bind="props">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-btn
                  variant="tonal"
                  color="info"
                  block
                  @click="viewDetail(item)"
                >
                  <v-icon color="info">mdi-eye</v-icon>
                  Chi tiết
                </v-btn>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getStaffList, getCustomerList } from '@/api/userAdminApi'
import type { UserDTO } from '@/types/userDTO'
import { exportJsonToExcel } from '@/utils/exportExcel'

function exportUsers() {
  if (!users.value.length) {
    alert.value = { show: true, type: 'error', message: 'Không có dữ liệu để xuất Excel' }
    return
  }

  const exportData = users.value.map((u) => ({
    'Tên đăng nhập': u.username,
    'Họ và tên': u.fullname,
    'Email': u.email,
    'Số điện thoại': u.phonenumber,
    'Quyền': u['role']['roleName'] || '',
  }))

  exportJsonToExcel(exportData, 'users.xlsx', 'Users')
}

const router = useRouter()

const tab = ref<'staff' | 'customer'>('staff')
const search = ref('')
const alert = ref<{ show: boolean; type: 'success' | 'error'; message: string }>(
  { show: false, type: 'success', message: '' }
)

const allHeaders = [
  { title: 'Tên đăng nhập', key: 'username' },
  { title: 'Họ và tên', key: 'fullname' },
  { title: 'Email', key: 'email' },
  { title: 'Số điện thoại', key: 'phonenumber' },
  { title: 'Quyền', key: 'role' },
  { title: 'Thao tác', key: 'action', sortable: false },
]
const fixedColumns = ['action']
const selectedColumns = ref<string[]>(allHeaders.map((h) => h.key))
const visibleHeaders = computed(() =>
  allHeaders.filter((h) => fixedColumns.includes(h.key) || selectedColumns.value.includes(h.key)),
)
const selectableHeaders = computed(() => allHeaders.filter((h) => !fixedColumns.includes(h.key)))

const users = ref<UserDTO[]>([])

async function loadUsers() {
  try {
    if (tab.value === 'staff') {
      const res = await getStaffList()
      users.value = res.data
    } else {
      const res = await getCustomerList()
      users.value = res.data
    }
  } catch (e) {
    alert.value = { show: true, type: 'error', message: 'Lỗi tải người dùng!' }
  }
}

watch(tab, () => {
  loadUsers()
})

onMounted(() => {
  loadUsers()
})

function filterBySearch(list: UserDTO[]) {
  if (!search.value) return list
  const keyword = search.value.toLowerCase()
  return list.filter(
    (u) =>
      u.username?.toLowerCase().includes(keyword) ||
      u.fullname?.toLowerCase().includes(keyword) ||
      u.email?.toLowerCase().includes(keyword) ||
      u.phonenumber?.toLowerCase().includes(keyword),
  )
}

const filteredUsers = computed(() => filterBySearch(users.value))

function viewDetail(user: UserDTO) {
  router.push({
    name: 'user-detail',
    params: { username: user.username },
  })
}
</script>
