<template>
  <div class="breadcrumb-option">
    <div class="container">
      <div class="row">
        <div class="col-lg-12 pa-0">
          <div class="breadcrumb__links">
            <v-tabs v-model="tab" bg-color="transparent">
              <v-tab :key="0" :value="null"> Tất cả </v-tab>
              <v-tab v-for="cate in categories" :key="cate.id" :value="cate.id">
                {{ cate.categoryName }}
              </v-tab>
            </v-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Shop Section Begin -->
  <div class="shop spad">
    <div class="container">
      <div class="row">
        <div class="col-lg-3 col-md-3">
          <div>
            <div class="shop__sidebar">
              <div class="sidebar__filter">
                <div class="section-title">
                  <h4>Lọc theo giá</h4>
                </div>
                <div class="filter-range-wrap">
                  <v-range-slider
                    v-model="range"
                    color="red"
                    :min="0"
                    :max="3000000"
                    step="10"
                    label="Giá"
                  />
                  <div class="range-slider"></div>
                  <form class="price-input" @submit.prevent="filterByPrice">
                    <v-text-field
                      variant="outlined"
                      type="number"
                      label="Giá tối thiểu"
                      density="compact"
                      v-model.number="range[0]"
                      placeholder="Giá tối thiểu"
                      v-bind="{ step: 50000 }"
                    />
                    <v-text-field
                      variant="outlined"
                      type="number"
                      label="Giá tối đa"
                      density="compact"
                      v-model.number="range[1]"
                      placeholder="Giá tối đa"
                      v-bind="{ step: 50000 }"
                    />
                    <v-btn
                      color="#ff6b6b"
                      variant="outlined"
                      :style="{ border: '3px solid' }"
                      type="submit"
                    >
                      <b>Lọc giá</b>
                    </v-btn>
                  </form>
                </div>
              </div>

              <div class="sidebar__sizes">
                <div class="section-title">
                  <h4>Lọc theo kích cỡ</h4>
                </div>
                <div class="size__list">
                  <label v-for="size in allSizes" :key="size.value" :for="size.value">
                    {{ size.label }}
                    <input
                      type="checkbox"
                      :id="size.value"
                      :value="size.value"
                      v-model="selectedSizes"
                    />
                    <span class="checkmark"></span>
                  </label>
                </div>
              </div>

              <div class="sidebar__color">
                <div class="section-title">
                  <h4>Lọc theo màu sắc</h4>
                </div>
                <div class="size__list color__list">
                  <label v-for="color in allColors" :key="color.value" :for="color.value">
                    {{ color.label }}
                    <input
                      type="checkbox"
                      :id="color.value"
                      :value="color.value"
                      v-model="selectedColors"
                    />
                    <span class="checkmark"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-9 col-md-9">
          <!-- for -->
          <div class="row">
            <div
              class="col-lg-4 col-md-6"
              v-for="item in paginatedProducts"
              :key="item.productCode"
            >
              <div class="product__item">
                <div
                  @click="
                    router.push({
                      name: 'product-detail',
                      params: { productCode: item.productCode },
                    })
                  "
                  class="product__item__pic set-bg"
                  :style="{ backgroundImage: `url(${item.imageUrls})` }"
                >
                  <div class="label new">Mới</div>
                  <ul class="product__hover">
                    <li></li>
                    <li>
                      <v-btn icon variant="flat" color="pink">
                        <v-icon>mdi-heart</v-icon>
                      </v-btn>
                    </li>
                    <li>
                      <v-btn
                        icon
                        variant="flat"
                        color="#ffc107"
                        @click="
                          router.push({
                            name: 'product-detail',
                            params: { productCode: item.productCode },
                          })
                        "
                      >
                        <v-icon>mdi-eye</v-icon>
                      </v-btn>
                    </li>
                  </ul>
                </div>
                <div class="product__item__text">
                  <h6>
                    <router-link
                      class="font-bold"
                      :to="{ name: 'product-detail', params: { productCode: item.productCode } }"
                    >
                      <b>{{ item.productName }}</b>
                    </router-link>
                  </h6>
                  <div class="rating">
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                  </div>
                  <div class="product__price">{{ formatPrice(item.price) }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="d-flex justify-center mt-4">
            <v-pagination
              rounded="pill"
              v-model="currentPage"
              :length="totalPages"
              :total-visible="3"
            ></v-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Shop Section End -->
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, computed, watch } from 'vue'
import { allColors } from '@/constants/allColors'
import { allSizes } from '@/constants/allSizes'
import axios from 'axios'
import proImg from '@/assets/img/product/product-1.jpg'
const tab = ref(null)
const range = ref([0, 3000000]) // Giá trị mặc định (min - max)
const selectedSizes = ref<string[]>([])
const selectedColors = ref<string[]>([])
const productsFiltered = ref<ProductInfo[]>([])
const router = useRouter()
// Lọc sản phẩm theo tất cả điều kiện hiện tại
function filterAll() {
  let filtered = products.value
  // Lọc theo category
  if (tab.value) {
    filtered = filtered.filter((item) => item.categoryId === tab.value)
  }
  // Lọc theo size
  if (selectedSizes.value.length > 0) {
    filtered = filtered.filter((item) =>
      item.sizes?.some((size) => selectedSizes.value.includes(size)),
    )
  }
  // Lọc theo color
  if (selectedColors.value.length > 0) {
    filtered = filtered.filter((item) =>
      item.styles?.some((color) => selectedColors.value.includes(color)),
    )
  }
  // Lọc theo giá
  filtered = filtered.filter((item) => item.price >= range.value[0] && item.price <= range.value[1])
  productsFiltered.value = filtered
}

// Lọc chỉ khi ấn nút giá
function filterByPrice() {
  filterAll()
}

// Watch size, color để lọc tự động
watch([selectedSizes, selectedColors, tab], () => {
  filterAll()
})
import type { ProductInfo } from '@/types/productInfo'

import type { Category } from '@/types/productDTO'
import { getAllProductInfo, getAllCategories } from '@/api/shopApi'

const products = ref<ProductInfo[]>([])
const categories = ref<Category[]>([])

async function fetchProducts() {
  try {
    const res = await getAllProductInfo()
    products.value = res.data
  } catch (err) {
    console.error('Lỗi tải sản phẩm:', err)
  }
}

async function fetchCategories() {
  try {
    const res = await getAllCategories()
    console.log('Danh mục:')
    console.table(res.data)
    categories.value = res.data
  } catch (err) {
    console.error('Lỗi tải danh mục:', err)
  }
}

onMounted(() => {
  fetchProducts().then(() => {
    filterAll()
  })
  fetchCategories()
})
const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 6
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return productsFiltered.value.slice(start, start + itemsPerPage)
})
const totalPages = computed(() => Math.ceil(productsFiltered.value.length / itemsPerPage) || 1)

// Reset về trang 1 khi filter thay đổi
watch(productsFiltered, () => {
  currentPage.value = 1
})
</script>
