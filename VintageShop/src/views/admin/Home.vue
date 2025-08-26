<script setup lang="ts">
import { computed, ref, shallowRef, onMounted } from 'vue'
import { format } from 'date-fns'
import type { ChartItem } from '@/types/chartItem'
import {
  getSummary,
  getRevenueToday,
  getRevenueByMonth,
  getRevenueByYear,
  getRevenueByDate,
  getRevenueYearChart,
  getAllRevenueChart,
  getRevenueMonthChart,
  getRevenueHourChart,
  getRevenueByDateChart,
} from '@/api/statisticApi'

// ================== STATE ==================
const tab = ref<'revenue' | 'invoice'>('revenue')
const stats = ref<any[]>([])              // danh sách card
const currentChart = ref<ChartItem[]>([]) // dữ liệu chart đang hiển thị
const model = shallowRef(null)
const activeKey = ref<string | null>(null)
const dateRange = ref<string[] | null>(null) // lưu range date từ <v-date-input>
const customChartItem = ref<ChartItem | null>(null)
// ================== FORMAT ==================
const formatCurrency = (amount: number) => {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(1)}K`
  return amount.toString()
}

// ================== INIT ==================
onMounted(async () => {
  try {
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    // gọi API thống kê song song
    const [revenueTodayRes, revenueMonthRes, revenueYearRes, summaryRes, allChartRes] =
      await Promise.all([
        getRevenueToday(),
        getRevenueByMonth(currentMonth, currentYear),
        getRevenueByYear(currentYear),
        getSummary(),
        getAllRevenueChart(),
      ])

    // map sang stats
    stats.value = [
      {
        key: 'today',
        title: 'Hôm nay',
        icon: 'mdi-calendar-today',
        value: formatCurrency(revenueTodayRes.data.revenue),
        countSuccess: revenueTodayRes.data.countSuccess,
        countCanceled: revenueTodayRes.data.countCanceled,
      },
      {
        key: 'month',
        title: 'Tháng này',
        icon: 'mdi-calendar-month',
        value: formatCurrency(revenueMonthRes.data.revenue),
        countSuccess: revenueMonthRes.data.countSuccess,
        countCanceled: revenueMonthRes.data.countCanceled,
      },
      {
        key: 'year',
        title: 'Năm nay',
        icon: 'mdi-calendar-range',
        value: formatCurrency(revenueYearRes.data.revenue),
        countSuccess: revenueYearRes.data.countSuccess,
        countCanceled: revenueYearRes.data.countCanceled,
      },
      {
        key: 'all',
        title: 'Tổng cộng',
        icon: 'mdi-cash-multiple',
        value: formatCurrency(summaryRes.data.revenue),
        countSuccess: summaryRes.data.countSuccess,
        countCanceled: summaryRes.data.countCanceled,
      },
    ]

    // default hiển thị all chart
    currentChart.value = allChartRes.data
  } catch (error) {
    console.error('Error fetching revenue data:', error)
  }
})

// ================== LOAD CHART ==================
const loadChart = async (type: string) => {
  activeKey.value = type
  const now = new Date()
  const currentYear = now.getFullYear()

  try {
    if (type === 'all') {
      currentChart.value = (await getAllRevenueChart()).data
    } else if (type === 'today') {
      currentChart.value = (await getRevenueHourChart()).data
    } else if (type === 'month') {
      currentChart.value = (await getRevenueMonthChart()).data
    } else if (type === 'year') {
      currentChart.value = (await getRevenueYearChart(currentYear)).data
    } else if (type === 'custom') {
      // kiểm tra có đủ 2 ngày không
      console.log('Date range:', dateRange.value)
      const listDays = dateRange.value
      const start = listDays[0]
      const end = listDays[listDays.length - 1]
      const startDate = format(start, "yyyy-MM-dd'T'HH:mm:ss")
      const endDate = format(end, "yyyy-MM-dd'T'HH:mm:ss")
      if (startDate && endDate) {
        customChartItem.value = (await getRevenueByDate(startDate, endDate)).data
        console.log('Fetching custom date chart:', startDate, endDate)
        currentChart.value = (await getRevenueByDateChart(startDate, endDate)).data
      } else {
        console.warn('Date range chưa chọn đủ 2 ngày')
      }
    }
  } catch (err) {
    console.error('Error loading chart:', err)
  }
}

// ================== APEXCHART ==================
const series = computed(() => {
  if (tab.value === 'revenue') {
    return [
      {
        name: 'Doanh thu',
        data: currentChart.value.map(item => item.revenue),
      },
    ]
  } else if (tab.value === 'invoice') {
    return [
      {
        name: 'Đơn thành công',
        data: currentChart.value.map(item => item.countSuccess),
      },
      {
        name: 'Đơn hủy',
        data: currentChart.value.map(item => item.countCanceled),
      },
    ]
  }
  return []
})

const chartOptions = computed(() => ({
  chart: { type: 'bar', height: 350 },
  plotOptions: {
    bar: { horizontal: false, columnWidth: '55%', borderRadius: 5, borderRadiusApplication: 'end' },
  },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 2, colors: ['transparent'] },
  xaxis: { categories: currentChart.value.map(item => item.label) },
  yaxis: { title: { text: 'VNĐ' } },
  fill: { opacity: 1 },
  tooltip: {
    y: { formatter: (val: number) => `${val.toLocaleString()} VNĐ` },
  },
}))

// ================== DONUT CHART (demo) ==================
const donutSeries = [44, 55, 41, 17]
const donutChartOptions = {
  chart: { type: 'donut' },
  labels: ['Nam', 'Nữ', 'Unique', 'Trẻ em'],
  dataLabels: { enabled: true },
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          total: { show: true, label: 'Tổng cộng' },
        },
      },
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: { chart: { width: 200 }, legend: { position: 'bottom' } },
    },
  ],
}
</script>



<template>
  <v-container fluid>
    <!-- <v-alert
      v-if="alert.show"
      :color="alert.type === 'success' ? 'success' : 'error'"
      :icon="alert.type === 'success' ? '$success' : '$error'"
      :title="alert.type === 'success' ? 'Thành công' : 'Lỗi'"
      :text="alert.message"
      class="mb-4"
      variant="tonal"
      border="start"
    /> -->
    <!-- Nội dung: Form, ảnh, input... -->
    <v-col cols="12" sm="12" md="12" lg="12" xl="11" class="mx-auto">
      <v-card class="pa-4" variant="flat">
  <v-row>
    <v-col
      v-for="(stat, index) in stats"
      :key="index"
      cols="12"
      sm="6"
      md="3"
    >
      <v-card
        class="pa-4 d-flex flex-column align-start hover:shadow-lg cursor-pointer"
        elevation="2"
        @click="loadChart(stat.key)"
        :color="activeKey === stat.key ? 'light-blue' : undefined"
        :class="{ 'text-white': activeKey === stat.key }"
      >
        <!-- icon -->
        <v-avatar size="40" class="mb-2" variant="tonal">
          <v-icon :color="activeKey === stat.key ? 'white' : 'primary'">
            {{ stat.icon }}
          </v-icon>
        </v-avatar>

        <!-- title -->
        <div class="text-caption" :class="{ 'text-grey': activeKey !== stat.key }">
          {{ stat.title }}
        </div>

        <!-- revenue -->
        <div class="d-flex align-center ga-2">
          <span class="text-h5 font-weight-bold">
            {{ stat.value }}
          </span>
        </div>

        <!-- chips -->
        <div class="d-flex ga-2 mt-2">
          <v-chip
            :color="activeKey === stat.key ? 'light' : 'success'"
            :variant="activeKey === stat.key ? 'outlined' : 'tonal'"
            size="small"
          >
            +{{ stat.countSuccess }} đơn hàng
          </v-chip>
          <v-chip
            color="error"
            :variant="activeKey === stat.key ? 'outlined' : 'tonal'"
            size="small"
          >
            -{{ stat.countCanceled }} đơn hàng
          </v-chip>
        </div>
      </v-card>
    </v-col>
  </v-row>
<v-row class="mt-4">
  <v-col cols="12" >
<v-card 
  class="pa-4 d-flex flex-column align-start hover:shadow-lg" 
  elevation="2"
  color="light-blue"
  variant="tonal"
  @click="loadChart('custom')"
>
  <!-- icon -->
    <v-date-input
      label="Select range"
      max-width="368"
      multiple="range"
      :width="368"
      variant="underlined"
      v-model="dateRange"
    ></v-date-input>
  <!-- title -->
  <div class="text-caption">
    Tổng cộng
  </div>

  <!-- revenue -->
  <div class="d-flex align-center ga-2">
    <span class="text-h5 font-weight-bold text-primary">
      {{ customChartItem ? formatCurrency(customChartItem.revenue) : '0' }} 
    </span>
  </div>

  <!-- chips -->
  <div class="d-flex ga-2 mt-2">
    <v-chip color="success" variant="outlined" size="small">
      +{{ customChartItem ? customChartItem.countSuccess : 0 }} đơn hàng
    </v-chip>
    <v-chip color="error" variant="outlined" size="small">
      -{{ customChartItem ? customChartItem.countCanceled : 0 }} đơn hàng
    </v-chip>
  </div>
</v-card>

  </v-col>
</v-row>
    <v-row>
      <v-col cols="12" md="8">
        <v-card flat>
                <v-tabs v-model="tab" bg-color="transparent" class="mb-6">
        <v-tab value="revenue">Doanh thu</v-tab>
        <v-tab value="invoice">Đơn hàng</v-tab>
      </v-tabs>
          <div id="chart">
            <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card flat>
          <div id="chart">
            <apexchart
              type="donut"
              height="350"
              :options="donutChartOptions"
              :series="donutSeries"
            ></apexchart>
          </div>
        </v-card>
      </v-col>
    </v-row>
    </v-card>
    </v-col>
</v-container>
</template>
