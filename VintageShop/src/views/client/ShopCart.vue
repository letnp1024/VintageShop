<template>
  <!-- Breadcrumb Begin -->
  <div class="breadcrumb-option">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <div class="breadcrumb__links">
            <a href="./index.html"><i class="fa fa-home"></i> Home</a>
            <span>Shopping cart</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Breadcrumb End -->

  <!-- Shop Cart Section Begin -->
  <div class="shop-cart spad">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <div class="shop__cart__table">
            <table>
              <thead>
                <tr>
                  <th>Chọn</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in cartList" :key="index">
                  <td class="cart__checkbox">
                    <v-checkbox
                      v-model="item.cartItem.selected"
                      :true-value="true"
                      :false-value="false"
                    />
                  </td>
                  <td class="cart__product__item">
                    <img :src="item.productDetail.imgUrl" alt="" width="60" height="80" />
                    <div class="cart__product__item__title">
                      <h6>{{ item.productDetail.productName }}</h6>
                      <div class="rating">
                        <p>
                          {{ getColorLabel(item.productDetail.style) }},
                          {{ item.productDetail.size }}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td class="cart__price">{{ formatCurrency(item.productDetail.productPrice) }}</td>
                  <td class="cart__quantity">
                    <div class="pro-qty">
                      <input
                        type="number"
                        v-model.number="item.cartItem.quantity"
                        min="1"
                        :max="item.productDetail.inventoryQuantity"
                      />
                    </div>
                    <div class="inventory-info" v-if="item.productDetail.inventoryQuantity > 0">
                      <small>Còn {{ item.productDetail.inventoryQuantity }} sản phẩm</small>
                    </div>
                  </td>
                  <td class="cart__total">
                    {{
                      formatCurrency(
                        item.cartItem.quantity * (item.productDetail.productPrice ?? 0),
                      )
                    }}
                  </td>
                  <td class="cart__total">
                    <v-btn icon color="danger" variant="tonal" @click="removeItem(index)">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-6 col-md-6 col-sm-6">
          <div class="cart__btn">
            <a href="#">Continue Shopping</a>
          </div>
        </div>
        <div class="col-lg-4 offset-lg-2">
          <div class="cart__total__procced">
            <h6>Cart total</h6>
            <ul>
              <li>
                Subtotal <span>{{ formatCurrency(subTotalPrice) }}</span>
              </li>
              <li>
                Total <span>{{ formatCurrency(totalPrice) }}</span>
              </li>
            </ul>
            <router-link to="/checkout" class="primary-btn">Tiến hành thanh toán</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Shop Cart Section End -->
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getProductDetailByCode } from '@/api/checkoutApi'
import type { InputCartItem } from '@/types/checkoutRequest'
import type { ProductDetailDTO } from '@/types/productDetailDTO'
import { allColors } from '@/constants/allColors'

/* --------------------------
  Khai báo types và state
-------------------------- */
interface CartProduct {
  productDetail: ProductDetailDTO
  cartItem: InputCartItem
}

const cartList = ref<CartProduct[]>([])
const subTotalPrice = ref(0)
const totalPrice = ref(0)

/* --------------------------
  Hàm format & xử lý dữ liệu
-------------------------- */

// Lấy nhãn màu từ mã màu
const getColorLabel = (style: string): string => {
  const found = allColors.find((c) => c.value === style)
  return found ? found.label : style
}

// Format tiền VND
const formatCurrency = (value: number): string => {
  return value.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  })
}

// Xóa sản phẩm khỏi giỏ
const removeItem = (index: number) => {
  cartList.value.splice(index, 1)
  updateLocalStorage()
}

// Cập nhật localStorage từ cartList hiện tại
const updateLocalStorage = () => {
  const newCart = cartList.value.map((item) => item.cartItem)
  localStorage.setItem('cart', JSON.stringify(newCart))
}

/* --------------------------
  Fetch dữ liệu khi mounted
-------------------------- */
onMounted(async () => {
  let cart: InputCartItem[] = []
  try {
    const cartStr = localStorage.getItem('cart')
    if (cartStr) cart = JSON.parse(cartStr)
  } catch (e) {
    console.warn('Lỗi khi đọc localStorage:', e)
  }

  const promises = cart.map(async (item) => {
    if (!item.productDetailCode || item.quantity <= 0) return null

    try {
      const res = await getProductDetailByCode(item.productDetailCode)
      const productDetail = res.data as ProductDetailDTO

      // Giới hạn số lượng nếu vượt quá tồn kho
      if (productDetail.inventoryQuantity < item.quantity) {
        item.quantity = productDetail.inventoryQuantity
      }

      return { productDetail, cartItem: item }
    } catch (error) {
      console.warn('Không thể lấy chi tiết sản phẩm:', error)
      return null
    }
  })

  const resolved = await Promise.all(promises)
  cartList.value = resolved.filter((item): item is CartProduct => item !== null)
})

/* --------------------------
  Watch cartList => cập nhật tổng tiền và localStorage
-------------------------- */
watch(
  cartList,
  (newList) => {
    let subtotal = 0
    let total = 0

    for (const item of newList) {
      if (!item || !item.productDetail) continue

      const inventory = item.productDetail.inventoryQuantity || 0
      const price = item.productDetail.productPrice ?? 0

      // Kiểm tra số lượng vượt quá tồn kho
      if (item.cartItem.quantity > inventory) {
        item.cartItem.quantity = inventory
      }

      if (item.cartItem.selected) {
        subtotal += item.cartItem.quantity * price
      }
      total += item.cartItem.quantity * price
    }

    subTotalPrice.value = subtotal
    totalPrice.value = total

    updateLocalStorage()
  },
  { deep: true },
)
</script>

<style scoped>
.inventory-info {
  font-size: 0.8rem;
  color: #666;
  margin-top: 5px;
}

.pro-qty {
  display: flex;
}

.pro-qty input {
  width: 80px;
  text-align: center;
}
</style>
