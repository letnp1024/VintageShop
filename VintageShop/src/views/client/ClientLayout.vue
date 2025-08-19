<template>
  <!-- Trang tải trước -->
  <div v-if="loading" id="preloder">
    <div class="loader"></div>
  </div>

  <!-- Menu ngoài màn hình Bắt đầu -->
  <transition name="offcanvas-slide">
    <div v-if="offcanvasActive" class="offcanvas-menu-overlay active" @click="closeOffcanvas"></div>
  </transition>
  <transition name="offcanvas-slide">
    <div v-if="offcanvasActive" class="offcanvas-menu-wrapper active">
      <div class="offcanvas__close" @click="closeOffcanvas">+</div>
      <ul class="offcanvas__widget">
        <li><span class="icon_search search-switch"></span></li>
        <li>
          <a href="#"
            ><span class="icon_heart_alt"></span>
            <div class="tip">2</div>
          </a>
        </li>
        <li>
          <a href="#"
            ><span class="icon_bag_alt"></span>
            <div class="tip">2</div>
          </a>
        </li>
      </ul>
      <div class="offcanvas__logo">
        <router-link to="/">
          <img src="@/assets/img/logo.png" alt="" />
        </router-link>
      </div>
      <div id="mobile-menu-wrap">
        <div class="slicknav_menu">
          <a
            href="#"
            aria-haspopup="true"
            role="button"
            tabindex="0"
            class="slicknav_btn slicknav_collapsed"
            style="outline: none"
          >
            <span class="slicknav_menutxt">MENU</span>
            <span class="slicknav_icon"
              ><span class="slicknav_icon-bar"></span> <span class="slicknav_icon-bar"></span
              ><span class="slicknav_icon-bar"></span>
            </span>
          </a>
          <nav
            class="slicknav_nav slicknav_hidden"
            aria-hidden="true"
            role="menu"
            style="display: none"
          >
            <ul>
              <li class="active"><router-link to="/home">Trang chủ</router-link></li>
              <li>
                <a href="#" @click.prevent="toggleDropdown('sanpham')"
                  >Sản phẩm
                  <span class="slicknav_arrow" v-if="!showDropdown.sanpham">►</span>
                  <span class="slicknav_arrow" v-else>▼</span>
                </a>
                <transition name="slide">
                  <ul class="dropdown" v-show="showDropdown.sanpham">
                    <li><router-link to="/shop">Tất cả sản phẩm</router-link></li>
                    <li><a href="#">Thời trang nam</a></li>
                    <li><a href="#">Thời trang nữ</a></li>
                    <li><a href="#">Thời trang trẻ em</a></li>
                  </ul>
                </transition>
              </li>
              <li>
                <a href="#" @click.prevent="toggleDropdown('taikhoan')"
                  >Tài khoản
                  <span class="slicknav_arrow" v-if="!showDropdown.taikhoan">►</span>
                  <span class="slicknav_arrow" v-else>▼</span>
                </a>
                <transition name="slide">
                  <ul class="dropdown" v-show="showDropdown.taikhoan">
                    <li><router-link to="/product/1">Chi tiết sản phẩm</router-link></li>
                    <li><router-link to="/cart">Giỏ hàng</router-link></li>
                    <li><router-link to="/checkout">Thanh toán</router-link></li>
                    <!-- <li><a href="./blog-details.html">Chi tiết blog</a></li> -->
                  </ul>
                </transition>
              </li>
              <li><router-link to="/contact">Liên hệ</router-link></li>
            </ul>
          </nav>
        </div>
      </div>

      <div class="offcanvas__auth">
        <a href="#">Đăng nhập</a>
        <a href="#">Đăng ký</a>
      </div>
    </div>
  </transition>
  <!-- Menu ngoài màn hình Kết thúc -->

  <!-- Phần đầu trang Bắt đầu -->
  <div class="header">
    <div class="container-fluid">
      <div class="row">
        <div class="col-xl-3 col-lg-2">
          <div class="header__logo">
            <router-link to="/"><img src="@/assets/img/logo.png" alt="" /></router-link>
          </div>
        </div>
        <div class="col-xl-5 col-lg-6">
          <nav class="header__menu">
            <ul>
              <li class="active"><router-link to="/home">Trang chủ</router-link></li>
              <li>
                <a href="#">Sản phẩm</a>
                <ul class="dropdown">
                  <li><router-link to="/shop">Tất cả sản phẩm</router-link></li>
                  <li><a href="#">Thời trang nam</a></li>
                  <li><a href="#">Thời trang nữ</a></li>
                  <li><a href="#">Thời trang trẻ em</a></li>
                </ul>
              </li>
              <li>
                <a href="#">Tài khoản</a>
                <ul class="dropdown">
                  <li><router-link to="/user/orders">Hóa đơn</router-link></li>
                  <li><router-link to="/cart">Giỏ hàng</router-link></li>
                  <li><router-link to="/checkout">Thanh toán</router-link></li>
                </ul>
              </li>
              <li><router-link to="/contact">Liên hệ</router-link></li>
            </ul>
          </nav>
        </div>
        <div class="col-lg-4">
          <div class="header__right">
            <ul class="header__right__widget">
              <li v-if="!isAuthenticated()">
                <span
                  ><v-btn density="compact" @click="router.push({ name: 'login' })" variant="text"
                    >Đăng nhập</v-btn
                  ></span
                >
                <span
                  ><v-btn
                    density="compact"
                    color="success"
                    variant="text"
                    @click="router.push({ name: 'register' })"
                    >Đăng ký</v-btn
                  ></span
                >
              </li>
              <li v-else>
                <v-link variant="text"
                  ><v-icon>mdi-account</v-icon>{{ getUserInfo().username }}</v-link
                >
              </li>
              <li>
                <a><v-icon>mdi-heart-outline</v-icon> </a>
              </li>
              <li>
                <a @click="router.push({ name: 'cart' })"
                  ><v-icon>mdi-cart-outline</v-icon>
                  <!-- <div class="tip">{{ cartItemCount }}</div> -->
                </a>
              </li>
              <li>
                <a @click="router.push({ name: 'user-orders' })"
                  ><v-icon>mdi-receipt-text-outline</v-icon>
                </a>
              </li>
              <li v-if="isAuthenticated()">
                <a @click="logout"><v-icon>mdi-logout</v-icon> </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="canvas__open" @click="openOffcanvas">
        <i class="fa fa-bars"></i>
      </div>
    </div>
  </div>
  <!-- Phần đầu trang Kết thúc -->
  <div>
    <router-view />
  </div>
  <!-- Footer Section Begin -->
  <div class="footer">
    <div class="container">
      <div class="row">
        <div class="col-lg-4 col-md-6 col-sm-7">
          <div class="footer__about">
            <div class="footer__logo">
              <a href="./index.html"><img src="@/assets/img/logo.png" alt="" /></a>
            </div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt cilisis.
            </p>
            <div class="footer__payment">
              <a href="#"><img src="@/assets/img/payment/payment-1.png" alt="" /></a>
              <a href="#"><img src="@/assets/img/payment/payment-2.png" alt="" /></a>
              <a href="#"><img src="@/assets/img/payment/payment-3.png" alt="" /></a>
              <a href="#"><img src="@/assets/img/payment/payment-4.png" alt="" /></a>
              <a href="#"><img src="@/assets/img/payment/payment-5.png" alt="" /></a>
            </div>
          </div>
        </div>
        <div class="col-lg-2 col-md-3 col-sm-5">
          <div class="footer__widget">
            <h6>Liên kết nhanh</h6>
            <ul>
              <li><a href="#">Về chúng tôi</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Liên hệ</a></li>
              <li><a href="#">Câu hỏi thường gặp</a></li>
            </ul>
          </div>
        </div>
        <div class="col-lg-2 col-md-3 col-sm-4">
          <div class="footer__widget">
            <h6>Tài khoản</h6>
            <ul>
              <li><a href="#">Tài khoản của tôi</a></li>
              <li><a href="#">Theo dõi đơn hàng</a></li>
              <li><a href="#">Thanh toán</a></li>
              <li><a href="#">Danh sách yêu thích</a></li>
            </ul>
          </div>
        </div>
        <div class="col-lg-4 col-md-8 col-sm-8">
          <div class="footer__newslatter">
            <h6>BẢN TIN</h6>
            <form action="#">
              <input type="text" placeholder="Email" />
              <button type="submit" class="site-btn">Đăng ký</button>
            </form>
            <div class="footer__social">
              <a href="#"><i class="fa fa-facebook"></i></a>
              <a href="#"><i class="fa fa-twitter"></i></a>
              <a href="#"><i class="fa fa-youtube-play"></i></a>
              <a href="#"><i class="fa fa-instagram"></i></a>
              <a href="#"><i class="fa fa-pinterest"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Footer Section End -->

  <!-- Search Begin -->
  <div class="search-model">
    <div class="h-100 d-flex align-items-center justify-content-center">
      <div class="search-close-switch">+</div>
      <form class="search-model-form">
        <input type="text" id="search-input" placeholder="Tìm kiếm tại đây..." />
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// css
import '@/assets/css/bootstrap.min.css'
import '@/assets/css/font-awesome.min.css'
import '@/assets/css/elegant-icons.css'
import '@/assets/css/jquery-ui.min.css'
import '@/assets/css/magnific-popup.css'
import '@/assets/css/owl.carousel.min.css'
import '@/assets/css/slicknav.min.css'
import '@/assets/css/style.css'

import { useRoute, useRouter } from 'vue-router'
import { isAuthenticated, getUserInfo, logout as authLogout } from '@/utils/auth'

const router = useRouter()

// Sử dụng hàm logout từ utils, truyền router để chuyển trang
const logout = () => {
  authLogout(router)
  window.location.reload()
}

const loading = ref(false)
const showDropdown = ref({})
const toggleDropdown = (key) => {
  showDropdown.value[key] = !showDropdown.value[key]
}

const offcanvasActive = ref(false)
const openOffcanvas = () => {
  offcanvasActive.value = true
}
const closeOffcanvas = () => {
  offcanvasActive.value = false
}
//count cartItem trong localStorage
const cartItemCount = ref(0)
// Kiểm tra số lượng sản phẩm trong giỏ hàng
const checkCartItemCount = () => {
  const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]')
  cartItemCount.value = cartItems.length
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition:
    max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.3s;
  overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
.slide-enter-to,
.slide-leave-from {
  max-height: 500px;
  opacity: 1;
}

.offcanvas-slide-enter-active,
.offcanvas-slide-leave-active {
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.3s;
}
.offcanvas-slide-enter-from,
.offcanvas-slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
.offcanvas-slide-enter-to,
.offcanvas-slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
