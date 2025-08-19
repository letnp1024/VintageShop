<template>
  <v-card-text>
    <v-row>
      <v-col cols="12" md="6">
        <v-card flat>
          <div id="chart">
            <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
          </div>
          <div id="chart">
            <apexchart
              type="area"
              height="350"
              :options="chartOptions"
              :series="series"
            ></apexchart>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
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
  </v-card-text>
</template>
<script setup>
import { ref, watch } from 'vue'
const rail = ref(true)
const group = ref(null)

const items = [
  {
    title: 'Foo',
    value: 'foo',
  },
  {
    title: 'Bar',
    value: 'bar',
  },
  {
    title: 'Fizz',
    value: 'fizz',
  },
  {
    title: 'Buzz',
    value: 'buzz',
  },
]

watch(group, () => {
  drawer.value = false
})

const series = [
  {
    name: 'Net Profit',
    data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
  },
  {
    name: 'Revenue',
    data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
  },
  {
    name: 'Free Cash Flow',
    data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
  },
]

const chartOptions = {
  chart: {
    type: 'bar',
    height: 350,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 5,
      borderRadiusApplication: 'end',
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent'],
  },
  xaxis: {
    categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
  },
  yaxis: {
    title: {
      text: '$ (thousands)',
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter(val) {
        return `$ ${val} thousands`
      },
    },
  },
}

const donutSeries = [44, 55, 41, 17, 15]
const donutChartOptions = {
  chart: {
    type: 'donut',
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  ],
}
</script>
