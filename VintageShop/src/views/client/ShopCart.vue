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
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useCartStore } from '@/stores/cart' // import store
import { allColors } from '@/constants/allColors'

// Lấy store
const cartStore = useCartStore()
const { cartList, subTotalPrice, totalPrice } = storeToRefs(cartStore)

// Hàm format tiền VND
const formatCurrency = (value: number): string => {
  return value.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  })
}

// Lấy nhãn màu từ mã màu
const getColorLabel = (style: string): string => {
  const found = allColors.find((c) => c.value === style)
  return found ? found.label : style
}

// Xóa sản phẩm khỏi giỏ
const removeItem = (index: number) => {
  cartStore.removeItem(index)
}

// Fetch dữ liệu khi mounted
onMounted(() => {
  cartStore.loadCart() // store tự lo đọc localStorage + gọi API
})
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
