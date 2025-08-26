// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import VueApexCharts from 'vue3-apexcharts'
import { VDateInput } from 'vuetify/labs/VDateInput'

const vuetify = createVuetify({
    components: {
    ...components,
    VDateInput, // 👈 thêm dòng này
  },
  directives,
    icons: {
    defaultSet: 'mdi', // <-- Rất quan trọng
  },
})
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(VueApexCharts)
app.component('apexchart')

app.mount('#app')
