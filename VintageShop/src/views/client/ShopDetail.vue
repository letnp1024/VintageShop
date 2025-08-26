<template>
  <!-- Loading overlay -->
  <v-overlay :model-value="isUploading" persistent class="align-center justify-center">
    <v-progress-circular indeterminate size="64" color="primary" />
  </v-overlay>

  <!-- Thông báo alert -->
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

  <!-- Product Details Section Begin -->
  <div class="product-details spad">
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          <div class="product__details__pic">
            <v-container fluid class="pa-0">
              <v-row no-gutters>
                <!-- Thumbnails bên trái -->
                <v-col cols="2">
                  <v-sheet elevation="2" max-height="500">
                    <v-slide-group
                      v-model="selectedIndex"
                      direction="vertical"
                      next-icon="mdi-chevron-down"
                      prev-icon="mdi-chevron-up"
                      selected-class="bg-primary"
                      show-arrows
                    >
                      <v-slide-group-item
                        v-for="(productImage, index) in productImages"
                        :key="index"
                        v-slot="{ toggle }"
                      >
                        <v-img @click="toggle" :src="productImage.src" class="py-1" />
                      </v-slide-group-item>
                    </v-slide-group>
                  </v-sheet>
                </v-col>

                <!-- Carousel ảnh lớn bên phải -->
                <v-col cols="10">
                  <v-carousel v-model="selectedIndex" hide-delimiter-background show-arrows="hover">
                    <v-carousel-item v-for="(img, index) in productImages" :key="index">
                      <v-img
                        :src="img.src"
                        alt="Product image"
                        class="main-product-image"
                        contain
                        max-height="500"
                      />
                    </v-carousel-item>
                  </v-carousel>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="product__details__text">
            <h3>
              {{ productDTO && productDTO.productName ? productDTO.productName : '' }}
              <span v-if="productDTO">
                Thương hiệu: {{ productDTO.brand || 'N/A' }} | Phân loại:
                {{ productDTO.categoryName || 'N/A' }}
              </span>
            </h3>
            <div class="rating">
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <span>(138 đánh giá)</span>
            </div>
            <div class="product__details__widget">
              <ul>
                <li>
                  <PickColor
                    :allowedColors="(allStyles || []).map((c) => c.color)"
                    @update:color="handleColorSelect"
                  />
                </li>
                <li>
                  <PickSize :sizes="sizes" @update:size="selectedSize = $event" />
                </li>
                <li>
                  <p v-if="selectedSize && selectedColor">
                    <b v-if="inventoryQuantity > 0">Số lượng: {{ inventoryQuantity }}</b>
                    <b v-else>Hết hàng</b>
                  </p>
                </li>
              </ul>
            </div>
            <div class="product__details__price" v-if="productDTO">
              {{ formatProductPrice(productDTO.price) }}
            </div>
            <div class="product__details__button">
              <div class="quantity">
                <v-text-field
                  v-model.number="orderQuantity"
                  variant="solo"
                  type="number"
                  rounded="pill"
                  :min="0"
                  :max="inventoryQuantity"
                  :disabled="inventoryQuantity <= 0 || !selectedSize || !selectedColor"
                  label="Số lượng mua"
                  density="comfortable"
                  hide-details
                  style="width: 120px"
                />
              </div>
              <v-btn height="50px" class="cart-btn" @click="handleAddToCart"
                ><span class="icon_bag_alt"></span> Thêm vào giỏ hàng</v-btn
              >
            </div>
            <div class="product__details__widget">
              <ul>
                <li><strong>Mô Tả</strong></li>
                <li>
                  <p>
                    {{
                      productDTO && productDTO.description
                        ? productDTO.description
                        : 'Không có mô tả'
                    }}
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-12">
        <div class="product__details__tab"></div>
      </div>
      <v-divider class="col-lg-12" opacity="1"></v-divider>
      <div class="row">
        <div class="col-lg-12 text-center">
          <div class="related__title">
            <h5>SẢN PHẨM LIÊN QUAN</h5>
          </div>
        </div>
        <v-slide-group show-arrows="always" class="col-lg-12">
          <div
            class="col-lg-3 col-md-4 col-sm-6"
            v-for="(item, index) in relatedProduct"
            :key="index"
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
                <div class="product__price">{{ formatProductPrice(item.price) }}</div>
              </div>
            </div>
          </div>
        </v-slide-group>
      </div>
    </div>
  </div>
  <!-- Product Details Section End -->
</template>
<script setup lang="ts">
import { ref, watch, onMounted, computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  getShopProductDetails,
  getShopProductById,
  getColorsOptions,
  getSizesOptions,
  getRelatedProducts,
} from '@/api/shopDetailsApi'
import { Style } from '@/types/productDetailDTO'
import type { ProductDTO } from '@/types/productDTO'
import type { ProductDetailDTO } from '@/types/productDetailDTO'
// Không cần import lại, đã khai báo ở trên
import type { InputCartItem } from '@/types/checkoutRequest'
import type { ProductInfo } from '@/types/productInfo'

// Components
import ClientLayout from './ClientLayout.vue'
import PickSize from '@/components/client/PickSize.vue'
import PickColor from '@/components/client/PickColor.vue'

// Assets - Ảnh chính (có thể xóa nếu không sử dụng)
import p1 from '@/assets/img/test/p1.png'

// Assets - Sản phẩm liên quan
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
// ==== State và interface ====
// Hàm định dạng giá sản phẩm
const formatProductPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)
}

const isUploading = ref(false)
const productDTO = ref<ProductDTO | null>(null)
const productDetailsList = ref<ProductDetailDTO[]>([])
const relatedProduct = ref<ProductInfo[]>([])

const route = useRoute()
const router = useRouter()

// Tải dữ liệu khi component được mounted
onMounted(() => {
  const productCode = Array.isArray(route.params.productCode)
    ? route.params.productCode[0]
    : route.params.productCode || ''

  if (productCode !== '') {
    isUploading.value = true
    Promise.all([
      fetchProductById(productCode),
      fetchColorOptions(productCode),
      fetchSizeOptions(productCode),
      fetchProductDetails(productCode),
      fetchRelatedProduct(productCode),
    ]).finally(() => {
      isUploading.value = false
    })
  }
})

async function fetchProductById(productCode: string) {
  try {
    const res = await getShopProductById(productCode)
    productDTO.value = res.data
    console.table(productDTO.value)
    return res.data
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm:', error)
    productDTO.value = null
    return null
  }
}
async function fetchRelatedProduct(productCode: string) {
  try {
    const res = await getRelatedProducts(productCode)
    relatedProduct.value = res.data
    return res.data
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm liên quan:', error)
    productDTO.value = null
    return null
  }
}
// Alert state
const alert = ref({
  show: false,
  type: 'error', // 'success' | 'error'
  message: '',
})

const model = ref(null)
interface ColorOption {
  name: string
  label: string
  src: string
}

// Màu được chọn từ PickColor
const allStyles = ref<Style[] | null>(null)
const selectedColor = ref<ColorOption | null>(null)
function handleColorSelect(color: ColorOption) {
  selectedColor.value = color
  // Tìm index của ảnh đầu tiên thuộc màu được chọn trong productImages
  if (allStyles.value && Array.isArray(allStyles.value)) {
    const style = allStyles.value.find((s) => s.color === color.name)
    if (style && style.imageUrl) {
      const idx = productImages.value.findIndex((img) => img.src === style.imageUrl)
      if (idx !== -1) {
        selectedIndex.value = idx
        // Đánh dấu selected cho ảnh này, các ảnh khác bỏ selected
        productImages.value.forEach((img, i) => {
          img.selected = i === idx
        })
        return
      }
    }
  }
  // Nếu không có ảnh cho màu, giữ selectedIndex ở 0
  selectedIndex.value = 0
  productImages.value.forEach((img, i) => {
    img.selected = i === 0
  })
}

// Size
const sizes = ref<any[]>([])
const selectedSize = ref(sizes.value[0] || null)

// Reset mô tả khi đổi size
const descriptionPD = ref<string>('')
watch(selectedSize, () => {
  descriptionPD.value = ''
})

// ==== Hình ảnh sản phẩm chính ====

const selectedIndex = ref<number>(0)

// InputCartItem type từ checkoutRequest.ts

// Số lượng đặt mua
const orderQuantity = ref(0)

function selectImage(index: number) {
  selectedIndex.value = index
}

// Lọc productDetailsList theo size và color được chọn

const filteredProductDetails = computed(() => {
  return productDetailsList.value.filter((detail) => {
    const matchSize = selectedSize.value ? detail.size === selectedSize.value : true
    const matchColor = selectedColor.value ? detail.style === selectedColor.value.name : true
    return matchSize && matchColor
  })
})

// Reset orderQuantity về 0 khi đổi size hoặc color
watch([selectedSize, selectedColor], () => {
  orderQuantity.value = 0
})

// Khi orderQuantity thay đổi, kiểm tra < 0 hoặc > inventoryQuantity.value
watch(orderQuantity, (val) => {
  if (val < 0) orderQuantity.value = 0
  if (val > inventoryQuantity.value) orderQuantity.value = inventoryQuantity.value
})

// Lấy product detail đầu tiên phù hợp (nếu có)
const selectedProductDetail = computed(() => filteredProductDetails.value[0] || null)
// Lấy số lượng tồn kho của product detail đã chọn
const inventoryQuantity = computed(() =>
  selectedProductDetail.value ? selectedProductDetail.value.inventoryQuantity : 0,
)

// Map src từ productDTO.value.imageUrls, first image is selected
const productImages = ref<{ src: string; selected: boolean }[]>([])

// Gộp đồng bộ productImages từ productDTO và allStyles, tránh trùng lặp, selected luôn boolean
watchEffect(() => {
  const images: { src: string; selected: boolean }[] = []
  if (productDTO.value && Array.isArray(productDTO.value.imageUrls)) {
    productDTO.value.imageUrls.forEach((img, idx) => {
      if (img.imageUrl) {
        images.push({ src: img.imageUrl, selected: idx === 0 })
      }
    })
  }
  if (allStyles.value && Array.isArray(allStyles.value)) {
    allStyles.value.forEach((style) => {
      if (style.imageUrl && !images.some((i) => i.src === style.imageUrl)) {
        images.push({ src: style.imageUrl, selected: !!style.selected })
      }
    })
  }
  // Đảm bảo chỉ có 1 ảnh selected, ưu tiên ảnh đầu tiên
  let foundSelected = false
  images.forEach((img, idx) => {
    if (img.selected && !foundSelected) {
      foundSelected = true
    } else {
      img.selected = false
    }
  })
  if (!foundSelected && images.length > 0) {
    images[0].selected = true
  }
  productImages.value = images
})

const imgURL = ref<string>(p1)

function selectProductImage(image: { src: string }) {
  productImages.value.forEach((img) => {
    img.selected = img.src === image.src
  })
  imgURL.value = image.src
}

// ==== Khi click ảnh sản phẩm liên quan ====

const selectedProduct = ref<{ id_product_detail: number; filename: string } | null>(null)

function handleSelect(payload: { id_product_detail: number; filename: string }) {
  productImages.value.forEach((img) => (img.selected = false))
  selectedProduct.value = payload
  imgURL.value = payload.filename
  descriptionPD.value = `${selectedSize.value} ${payload.id_product_detail}`
}
function handleAddToCart() {
  if (selectedProductDetail.value && orderQuantity.value > 0) {
    if (orderQuantity.value > inventoryQuantity.value) {
      orderQuantity.value = inventoryQuantity.value
      alert.value = {
        show: true,
        type: 'error',
        message: 'Số lượng mua vượt quá tồn kho. Đã điều chỉnh về tối đa!',
      }
      setTimeout(() => (alert.value.show = false), 2000)
      return
    }

    const code = selectedProductDetail.value.productDetailCode || selectedProductDetail.value.id
    const quantity = orderQuantity.value

    cartStore.addItem({
      productDetailCode: String(code),
      quantity,
      selected: true, // nếu có field này
    })

    console.log('Add to cart:', { code, quantity })

    alert.value = {
      show: true,
      type: 'success',
      message: 'Đã thêm vào giỏ hàng!',
    }
    setTimeout(() => (alert.value.show = false), 1500)
  } else {
    alert.value = {
      show: true,
      type: 'error',
      message: 'Vui lòng chọn đủ thuộc tính và số lượng hợp lệ trước khi thêm vào giỏ hàng.',
    }
    setTimeout(() => (alert.value.show = false), 2000)
  }
}
//Tạo các hàm từ api dưới đây
// Import các hàm API từ shopDetailsApi

// Hàm lấy chi tiết sản phẩm theo productId
async function fetchProductDetails(productCode: string) {
  try {
    const res = await getShopProductDetails(productCode)
    productDetailsList.value = res.data || []
    return res.data
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết sản phẩm:', error)
    productDetailsList.value = []
    return []
  }
}

// Hàm lấy danh sách màu (style) theo productId
async function fetchColorOptions(productCode: string) {
  try {
    const res = await getColorsOptions(productCode)
    allStyles.value = res.data
    return res.data
  } catch (error) {
    console.error('Lỗi khi lấy danh sách màu:', error)
    return []
  }
}

// Hàm lấy danh sách size theo productId
async function fetchSizeOptions(productCode: string) {
  try {
    const res = await getSizesOptions(productCode)
    sizes.value = res.data
    return res.data
  } catch (error) {
    console.error('Lỗi khi lấy danh sách size:', error)
    return []
  }
}
</script>
