import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'
import type { InputCartItem } from '@/types/checkoutRequest'
import type { ProductDetailDTO } from '@/types/productDetailDTO'
import { getProductDetailByCode } from '@/api/checkoutApi'

interface CartProduct {
  productDetail: ProductDetailDTO
  cartItem: InputCartItem
}

export const useCartStore = defineStore('cart', () => {
  const cartList = ref<CartProduct[]>([])
  const subTotalPrice = ref(0)
  const totalPrice = ref(0)

  // ✅ Getter: số lượng item trong giỏ
  const cartItemCount = computed(() => cartList.value.length)

  // ✅ Load cart từ localStorage
  const loadCart = async () => {
    let cart: InputCartItem[] = []
    try {
      const cartStr = localStorage.getItem('cart')
      if (cartStr) cart = JSON.parse(cartStr)
    } catch {}

    const promises = cart.map(async (item) => {
      if (!item.productDetailCode || item.quantity <= 0) return null
      try {
        const res = await getProductDetailByCode(item.productDetailCode)
        const productDetail = res.data as ProductDetailDTO
        if (productDetail.inventoryQuantity < item.quantity) {
          item.quantity = productDetail.inventoryQuantity
        }
        return { productDetail, cartItem: item }
      } catch {
        return null
      }
    })

    const resolved = await Promise.all(promises)
    cartList.value = resolved.filter((i): i is CartProduct => i !== null)
  }
// ✅ Thêm vào trong defineStore
const addItem = async (newItem: InputCartItem) => {
  // check đã có trong giỏ chưa
  const idx = cartList.value.findIndex(
    (i) => i.cartItem.productDetailCode === newItem.productDetailCode
  )

  if (idx !== -1) {
    // cộng dồn số lượng
    cartList.value[idx].cartItem.quantity += newItem.quantity
  } else {
    try {
      const res = await getProductDetailByCode(newItem.productDetailCode)
      const productDetail = res.data as ProductDetailDTO
      cartList.value.push({ productDetail, cartItem: { ...newItem } })
    } catch (err) {
      console.error('Không thể load productDetail khi addItem:', err)
    }
  }
}
  // ✅ Đồng bộ localStorage
  const updateLocalStorage = () => {
    const newCart = cartList.value.map((i) => i.cartItem)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  // ✅ Xóa sản phẩm
  const removeItem = (index: number) => {
    cartList.value.splice(index, 1)
    // không cần gọi updateLocalStorage() thủ công,
    // vì watch(cartList) sẽ tự xử lý
  }

  // ✅ Theo dõi giỏ hàng và tính toán lại giá
  watch(
    cartList,
    (newList) => {
      let subtotal = 0
      let total = 0
      for (const item of newList) {
        if (!item || !item.productDetail) continue
        const inventory = item.productDetail.inventoryQuantity || 0
        const price = item.productDetail.productPrice ?? 0

        // Nếu số lượng > tồn kho thì điều chỉnh lại
        if (item.cartItem.quantity > inventory) {
          item.cartItem.quantity = inventory
        }

        // Nếu được chọn thì tính vào subtotal
        if (item.cartItem.selected) {
          subtotal += item.cartItem.quantity * price
        }

        // Tổng giá trị giỏ
        total += item.cartItem.quantity * price
      }

      subTotalPrice.value = subtotal
      totalPrice.value = total

      // luôn đồng bộ lại localStorage
      updateLocalStorage()
    },
    { deep: true }
  )

  return {
    cartList,
    cartItemCount,   // ✅ thêm count để component reactive
    subTotalPrice,
    totalPrice,
    loadCart,
    removeItem,
    addItem,
  }
})
