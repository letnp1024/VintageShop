<template>
  <!-- Phần danh mục Bắt đầu -->
  <div class="categories">
    <div class="container-fluid">
      <div class="row">
        <v-carousel :show-arrows="false" cycle hide-delimiter-background height="100vh">
          <v-carousel-item
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
            cover
          ></v-carousel-item>

          <v-carousel-item
            src="https://cdn.vuetifyjs.com/images/cards/hotel.jpg"
            cover
          ></v-carousel-item>

          <v-carousel-item
            src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
            cover
          ></v-carousel-item>
        </v-carousel>
        <div
          :style="{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            zIndex: 10,
          }"
        >
          <v-text-field
            v-model="searchText"
            rounded="pill"
            variant="solo"
            placeholder="Tìm kiếm sản phẩm"
            density="comfortable"
            hide-details
            :style="{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80%',
              zIndex: 10,
            }"
          >
            <!-- 👇 Slot để nhét nút vào trong ô tìm kiếm -->
            <template #append-inner>
              <v-btn
                @click="handleSearch"
                icon
                color="transparent"
                block
                variant="flat"
                :style="{ right: '-12px' }"
              >
                <v-icon size="large">mdi-magnify</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </div>
      </div>
    </div>
  </div>
  <!-- Phần danh mục Kết thúc -->

  <!-- Phần sản phẩm Bắt đầu -->
  <div class="product spad">
    <div class="container">
      <div class="row">
        <div class="col-lg-4 col-md-4">
          <div class="section-title">
            <h4>Sản phẩm mới</h4>
          </div>
        </div>
        <div class="col-lg-8 col-md-8">
          <ul class="filter__controls">
            <li class="active" data-filter="*">Tất cả</li>
            <li data-filter=".women">Nữ</li>
            <li data-filter=".men">Nam</li>
            <li data-filter=".kid">Trẻ em</li>
            <li data-filter=".accessories">Phụ kiện</li>
            <li data-filter=".cosmetic">Mỹ phẩm</li>
          </ul>
        </div>
      </div>
      <div class="row property__gallery">
        <div class="col-lg-3 col-md-4 col-sm-6 mix women">
          <div class="product__item">
            <div class="product__item__pic set-bg" :style="{ backgroundImage: `url(${product1})` }">
              <div class="label new">Mới</div>
              <ul class="product__hover">
                <li>
                  <a href="img/product/product-1.jpg" class="image-popup"
                    ><span class="arrow_expand"></span
                  ></a>
                </li>
                <li>
                  <a href="#"><span class="icon_heart_alt"></span></a>
                </li>
                <li>
                  <a href="#"><span class="icon_bag_alt"></span></a>
                </li>
              </ul>
            </div>
            <div class="product__item__text">
              <h6><a href="#">Áo blazer vải tweed có nút</a></h6>
              <div class="rating">
                <i class="fa fa-star"></i><i class="fa fa-star"></i> <i class="fa fa-star"></i
                ><i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
              </div>
              <div class="product__price">59.000đ</div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-4 col-sm-6 mix men">
          <div class="product__item">
            <div class="product__item__pic set-bg" :style="{ backgroundImage: `url(${product2})` }">
              <ul class="product__hover">
                <li>
                  <a href="img/product/product-2.jpg" class="image-popup"
                    ><span class="arrow_expand"></span
                  ></a>
                </li>
                <li>
                  <a href="#"><span class="icon_heart_alt"></span></a>
                </li>
                <li>
                  <a href="#"><span class="icon_bag_alt"></span></a>
                </li>
              </ul>
            </div>
            <div class="product__item__text">
              <h6><a href="#">Chân váy sọc nhẹ nhàng</a></h6>
              <div class="rating">
                <i class="fa fa-star"></i><i class="fa fa-star"></i> <i class="fa fa-star"></i
                ><i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
              </div>
              <div class="product__price">49.000đ</div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-4 col-sm-6 mix accessories">
          <div class="product__item">
            <div class="product__item__pic set-bg" :style="{ backgroundImage: `url(${product3})` }">
              <div class="label stockout">hết hàng</div>
              <ul class="product__hover">
                <li>
                  <a href="img/product/product-3.jpg" class="image-popup"
                    ><span class="arrow_expand"></span
                  ></a>
                </li>
                <li>
                  <a href="#"><span class="icon_heart_alt"></span></a>
                </li>
                <li>
                  <a href="#"><span class="icon_bag_alt"></span></a>
                </li>
              </ul>
            </div>
            <div class="product__item__text">
              <h6><a href="#">Áo thun cotton</a></h6>
              <div class="rating">
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
              </div>
              <div class="product__price">$ 59.0</div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-4 col-sm-6 mix cosmetic">
          <div class="product__item">
            <div class="product__item__pic set-bg" :style="{ backgroundImage: `url(${product4})` }">
              <ul class="product__hover">
                <li>
                  <a href="img/product/product-4.jpg" class="image-popup"
                    ><span class="arrow_expand"></span
                  ></a>
                </li>
                <li>
                  <a href="#"><span class="icon_heart_alt"></span></a>
                </li>
                <li>
                  <a href="#"><span class="icon_bag_alt"></span></a>
                </li>
              </ul>
            </div>
            <div class="product__item__text">
              <h6><a href="#">Áo sơ mi sọc mỏng có túi</a></h6>
              <div class="rating">
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
              </div>
              <div class="product__price">$ 59.0</div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-4 col-sm-6 mix kid">
          <div class="product__item">
            <div class="product__item__pic set-bg" :style="{ backgroundImage: `url(${product5})` }">
              <ul class="product__hover">
                <li>
                  <a href="img/product/product-5.jpg" class="image-popup"
                    ><span class="arrow_expand"></span
                  ></a>
                </li>
                <li>
                  <a href="#"><span class="icon_heart_alt"></span></a>
                </li>
                <li>
                  <a href="#"><span class="icon_bag_alt"></span></a>
                </li>
              </ul>
            </div>
            <div class="product__item__text">
              <h6><a href="#">Áo sơ mi nhung mịn dáng ôm</a></h6>
              <div class="rating">
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
              </div>
              <div class="product__price">$ 59.0</div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-4 col-sm-6 mix women men kid accessories cosmetic">
          <div class="product__item sale">
            <div class="product__item__pic set-bg" :style="{ backgroundImage: `url(${product6})` }">
              <div class="label sale">Giảm giá</div>
              <ul class="product__hover">
                <li>
                  <a href="img/product/product-6.jpg" class="image-popup"
                    ><span class="arrow_expand"></span
                  ></a>
                </li>
                <li>
                  <a href="#"><span class="icon_heart_alt"></span></a>
                </li>
                <li>
                  <a href="#"><span class="icon_bag_alt"></span></a>
                </li>
              </ul>
            </div>
            <div class="product__item__text">
              <h6><a href="#">Áo kimono nhiệt đới</a></h6>
              <div class="rating">
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
              </div>
              <div class="product__price">$ 49.0 <span>$ 59.0</span></div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-4 col-sm-6 mix women men kid accessories cosmetic">
          <div class="product__item">
            <div class="product__item__pic set-bg" :style="{ backgroundImage: `url(${product7})` }">
              <ul class="product__hover">
                <li>
                  <a href="img/product/product-7.jpg" class="image-popup"
                    ><span class="arrow_expand"></span
                  ></a>
                </li>
                <li>
                  <a href="#"><span class="icon_heart_alt"></span></a>
                </li>
                <li>
                  <a href="#"><span class="icon_bag_alt"></span></a>
                </li>
              </ul>
            </div>
            <div class="product__item__text">
              <h6><a href="#">Kính mát tương phản</a></h6>
              <div class="rating">
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
              </div>
              <div class="product__price">$ 59.0</div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-4 col-sm-6 mix women men kid accessories cosmetic">
          <div class="product__item sale">
            <div class="product__item__pic set-bg" :style="{ backgroundImage: `url(${product8})` }">
              <div class="label">Giảm giá</div>
              <ul class="product__hover">
                <li>
                  <a href="img/product/product-8.jpg" class="image-popup"
                    ><span class="arrow_expand"></span
                  ></a>
                </li>
                <li>
                  <a href="#"><span class="icon_heart_alt"></span></a>
                </li>
                <li>
                  <a href="#"><span class="icon_bag_alt"></span></a>
                </li>
              </ul>
            </div>
            <div class="product__item__text">
              <h6><a href="#">Balo chống nước</a></h6>
              <div class="rating">
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
              </div>
              <div class="product__price">$ 49.0 <span>$ 59.0</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Kết thúc phần Sản phẩm -->

  <!-- Bắt đầu phần Banner -->
  <div class="discount">
    <div class="container">
      <div class="row">
        <v-carousel show-arrows="hover" cycle hide-delimiter-background height="70vh">
          <v-carousel-item
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
            cover
          ></v-carousel-item>

          <v-carousel-item
            src="https://cdn.vuetifyjs.com/images/cards/hotel.jpg"
            cover
          ></v-carousel-item>

          <v-carousel-item
            src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
            cover
          ></v-carousel-item>
        </v-carousel>
      </div>
    </div>
  </div>
  <!-- Banner Section End -->

  <!-- Trend Section Begin -->
  <div class="trend spad">
    <div class="container">
      <div class="row">
        <!-- Hot Trend -->
        <div class="col-lg-4 col-md-4 col-sm-6">
          <div class="trend__content">
            <div class="section-title">
              <h4>Xu hướng nổi bật</h4>
            </div>
            <div class="trend__item">
              <div class="trend__item__pic">
                <img src="@/assets/img/trend/ht-1.jpg" alt="" />
              </div>
              <div class="trend__item__text">
                <h6>Túi bucket dây xích</h6>
                <div class="rating">
                  <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i
                  ><i class="fa fa-star"></i><i class="fa fa-star"></i>
                </div>
                <div class="product__price">$ 59.0</div>
              </div>
            </div>
            <div class="trend__item">
              <div class="trend__item__pic">
                <img src="@/assets/img/trend/ht-2.jpg" alt="" />
              </div>
              <div class="trend__item__text">
                <h6>Bông tai mặt dây chuyền</h6>
                <div class="rating">
                  <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i
                  ><i class="fa fa-star"></i><i class="fa fa-star"></i>
                </div>
                <div class="product__price">$ 59.0</div>
              </div>
            </div>
            <div class="trend__item">
              <div class="trend__item__pic">
                <img src="@/assets/img/trend/ht-3.jpg" alt="" />
              </div>
              <div class="trend__item__text">
                <h6>Áo thun cotton</h6>
                <div class="rating">
                  <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i
                  ><i class="fa fa-star"></i><i class="fa fa-star"></i>
                </div>
                <div class="product__price">$ 59.0</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Best Seller -->
        <div class="col-lg-4 col-md-4 col-sm-6">
          <div class="trend__content">
            <div class="section-title">
              <h4>Bán chạy nhất</h4>
            </div>
            <div class="trend__item">
              <div class="trend__item__pic">
                <img src="@/assets/img/trend/bs-1.jpg" alt="" />
              </div>
              <div class="trend__item__text">
                <h6>Áo thun cotton</h6>
                <div class="rating">
                  <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i
                  ><i class="fa fa-star"></i><i class="fa fa-star"></i>
                </div>
                <div class="product__price">$ 59.0</div>
              </div>
            </div>
            <div class="trend__item">
              <div class="trend__item__pic">
                <img src="@/assets/img/trend/bs-2.jpg" alt="" />
              </div>
              <div class="trend__item__text">
                <h6>Túi tote có khóa kéo <br />kiểu dáng cặp tài liệu</h6>
                <div class="rating">
                  <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i
                  ><i class="fa fa-star"></i><i class="fa fa-star"></i>
                </div>
                <div class="product__price">$ 59.0</div>
              </div>
            </div>
            <div class="trend__item">
              <div class="trend__item__pic">
                <img src="@/assets/img/trend/bs-3.jpg" alt="" />
              </div>
              <div class="trend__item__text">
                <h6>Túi da tròn</h6>
                <div class="rating">
                  <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i
                  ><i class="fa fa-star"></i><i class="fa fa-star"></i>
                </div>
                <div class="product__price">$ 59.0</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Feature -->
        <div class="col-lg-4 col-md-4 col-sm-6">
          <div class="trend__content">
            <div class="section-title">
              <h4>Nổi bật</h4>
            </div>
            <div class="trend__item">
              <div class="trend__item__pic">
                <img src="@/assets/img/trend/f-1.jpg" alt="" />
              </div>
              <div class="trend__item__text">
                <h6>Váy quấn nơ</h6>
                <div class="rating">
                  <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i
                  ><i class="fa fa-star"></i><i class="fa fa-star"></i>
                </div>
                <div class="product__price">$ 59.0</div>
              </div>
            </div>
            <div class="trend__item">
              <div class="trend__item__pic">
                <img src="@/assets/img/trend/f-2.jpg" alt="" />
              </div>
              <div class="trend__item__text">
                <h6>Bông tai kim loại</h6>
                <div class="rating">
                  <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i
                  ><i class="fa fa-star"></i><i class="fa fa-star"></i>
                </div>
                <div class="product__price">$ 59.0</div>
              </div>
            </div>
            <div class="trend__item">
              <div class="trend__item__pic">
                <img src="@/assets/img/trend/f-3.jpg" alt="" />
              </div>
              <div class="trend__item__text">
                <h6>Túi đeo chéo nắp gập</h6>
                <div class="rating">
                  <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i
                  ><i class="fa fa-star"></i><i class="fa fa-star"></i>
                </div>
                <div class="product__price">$ 59.0</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Discount Section Begin -->

  <!-- Discount Section End -->

  <!-- Services Section Begin -->
  <div class="services spad">
    <div class="container">
      <div class="row">
        <div class="col-lg-3 col-md-4 col-sm-6">
          <div class="services__item">
            <i class="fa fa-car"></i>
            <h6>Miễn phí vận chuyển</h6>
            <p>Cho mọi đơn hàng trên $99</p>
          </div>
        </div>
        <div class="col-lg-3 col-md-4 col-sm-6">
          <div class="services__item">
            <i class="fa fa-money"></i>
            <h6>Đảm bảo hoàn tiền</h6>
            <p>Nếu sản phẩm gặp sự cố</p>
          </div>
        </div>
        <div class="col-lg-3 col-md-4 col-sm-6">
          <div class="services__item">
            <i class="fa fa-support"></i>
            <h6>Hỗ trợ trực tuyến 24/7</h6>
            <p>Hỗ trợ tận tình</p>
          </div>
        </div>
        <div class="col-lg-3 col-md-4 col-sm-6">
          <div class="services__item">
            <i class="fa fa-headphones"></i>
            <h6>Thanh toán an toàn</h6>
            <p>Thanh toán bảo mật 100%</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Services Section End -->
</template>
<script setup lang="ts">
// img
import category1 from '@/assets/img/categories/category-1.jpg'
import category2 from '@/assets/img/categories/category-2.jpg'
import category3 from '@/assets/img/categories/category-3.jpg'
import category4 from '@/assets/img/categories/category-4.jpg'
import category5 from '@/assets/img/categories/category-5.jpg'
import product1 from '@/assets/img/product/product-1.jpg'
import product2 from '@/assets/img/product/product-2.jpg'
import product3 from '@/assets/img/product/product-3.jpg'
import product4 from '@/assets/img/product/product-4.jpg'
import product5 from '@/assets/img/product/product-5.jpg'
import product6 from '@/assets/img/product/product-6.jpg'
import product7 from '@/assets/img/product/product-7.jpg'
import product8 from '@/assets/img/product/product-8.jpg'
import banner1 from '@/assets/img/banner/banner-1.jpg'
import ClientLayout from './ClientLayout.vue'
import { ref } from 'vue'
const searchText = ref<string>('')

function handleSearch(text: string): void {
  console.log('Search:', searchText.value)
}
</script>
