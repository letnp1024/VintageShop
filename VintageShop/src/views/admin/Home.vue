<script setup lang="ts">
import Chart from '@/components/admin/Chart.vue'
import { ref, onMounted } from 'vue'
import {
  getSummary,
  getRevenueToday,
  getRevenueByMonth,
  getRevenueByYear,
  getRevenueByDate,
} from '@/api/statisticApi'

const stats = ref([
  { title: 'Doanh thu hôm nay', value: '0', icon: 'mdi-cash' },
  { title: 'Doanh thu tháng này', value: '0', icon: 'mdi-calendar-month' },
  { title: 'Doanh thu năm nay', value: '0', icon: 'mdi-calendar-year' },
  { title: 'Tổng doanh thu', value: '0', icon: 'mdi-chart-line' },
])

onMounted(async () => {
  try {
    // Format số tiền
    const formatCurrency = (amount: number) => {
      if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)}M`
      } else if (amount >= 1000) {
        return `${(amount / 1000).toFixed(1)}K`
      }
      return amount.toString()
    }

    // Lấy doanh thu hôm nay
    const revenueToday = await getRevenueToday()
    stats.value[0].value = formatCurrency(Number(revenueToday.data))

    // Lấy doanh thu tháng này
    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()
    const revenueMonth = await getRevenueByMonth(currentMonth, currentYear)
    stats.value[1].value = formatCurrency(Number(revenueMonth.data))

    // Lấy doanh thu năm nay
    const revenueYear = await getRevenueByYear(currentYear)
    stats.value[2].value = formatCurrency(Number(revenueYear.data))

    // Lấy tổng doanh thu
    const summary = await getSummary()
    stats.value[3].value = formatCurrency(Number(summary.data))
  } catch (error) {
    console.error('Error fetching revenue data:', error)
  }
})
</script>

<template>
  <v-row>
    <v-col v-for="(stat, index) in stats" :key="index" cols="12" sm="6" md="3">
      <v-card class="pa-4 d-flex flex-column align-start hover:shadow-lg" elevation="2">
        <!-- icon -->
        <v-avatar size="40" class="mb-2" color="primary" variant="tonal">
          <v-icon>{{ stat.icon }}</v-icon>
        </v-avatar>

        <!-- title -->
        <div class="text-caption text-grey">
          {{ stat.title }}
        </div>

        <!-- value + badge -->
        <div class="d-flex align-center ga-2">
          <span class="text-h5 font-weight-bold">
            {{ stat.value }}
          </span>
        </div>
      </v-card>
    </v-col>
  </v-row>
  <Chart />
</template>
