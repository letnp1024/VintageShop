import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import Home from '@/views/client/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Test route
    {
      path: '/test',
      name: 'homeview',
      component: HomeView,
    },
    {
      path: '/transaction/:invoiceCode?',
      name: 'transaction',
      component: () => import('@/views/client/Transaction.vue'),
    },

    // Auth
    {
      path: '/auth',
      children: [
        {
          path: 'email-verification',
          name: 'email-verification',
          component: () => import('@/views/auth/EmailVerification.vue'),
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/Login.vue'),
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/auth/Signup.vue'),
        },
      ],
    },

    // Admin
    {
      path: '/admin',
      component: () => import('@/views/admin/AdminLayout.vue'),
      children: [
        {
          path: '',
          name: 'admin-home',
          component: () => import('@/views/admin/Home.vue'),
        },

        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/Dashboard.vue'),
        },
        {
          path: 'users',
          name: 'user-index',
          component: () => import('@/views/admin/user/Index.vue'),
        },
        {
          path: 'category',
          name: 'category-index',
          component: () => import('@/views/admin/category/Index.vue'),
        },
        {
          path: 'category/create',
          name: 'category-create',
          component: () => import('@/views/admin/category/Create.vue'),
        },
        {
          path: 'category/:id/edit',
          name: 'category-edit',
          component: () => import('@/views/admin/category/Edit.vue'),
        },
        {
          path: 'vouchers',
          name: 'voucher-index',
          component: () => import('@/views/admin/voucher/Index.vue'),
        },
        {
          path: 'vouchers/create',
          name: 'voucher-create',
          component: () => import('@/views/admin/voucher/Create.vue'),
        },
        {
          path: 'vouchers/:id/edit',
          name: 'voucher-edit',
          component: () => import('@/views/admin/voucher/Edit.vue'),
        },
        {
          path: 'products',
          name: 'product-index',
          component: () => import('@/views/admin/products/Index.vue'),
        },
        {
          path: 'products/create',
          name: 'product-create',
          component: () => import('@/views/admin/products/Create.vue'),
        },
        {
          path: 'products/:id',
          name: 'product-edit',
          component: () => import('@/views/admin/products/Edit.vue'),
        },
        {
          path: 'products/:productId/details',
          name: 'product-details',
          component: () => import('@/views/admin/product-details/Index.vue'),
        },
        {
          path: 'products/:productId/details/create',
          name: 'product-details-create',
          component: () => import('@/views/admin/product-details/Create.vue'),
        },
        {
          path: 'products/:productId/details/:id/edit',
          name: 'product-details-edit',
          component: () => import('@/views/admin/product-details/Edit.vue'),
        },
        {
          path: 'invoices',
          name: 'invoice-index',
          component: () => import('@/views/admin/invoice/Index.vue'),
        },
        {
          path: 'invoices/:invoiceCode',
          name: 'invoice-details',
          component: () => import('@/views/admin/invoice-details/Index.vue'),
        },
      ],
    },

    // Client
    {
      path: '/',
      name: 'client',
      component: () => import('@/views/client/ClientLayout.vue'),
      children: [
        // User
        {
          path: 'user',
          name: 'user',
          component: () => import('@/views/user/UserLayout.vue'),
          children: [
            {
              path: '',
              name: 'user-profile',
              component: () => import('@/views/user/Profile.vue'),
            },
            {
              path: 'security',
              name: 'user-security',
              component: () => import('@/views/user/Security.vue'),
            },
            {
              path: 'orders/:invoiceCode',
              name: 'order-detail',
              component: () => import('@/views/user/OrderDetail.vue'),
            },
            {
              path: 'orders',
              name: 'user-orders',
              component: () => import('@/views/user/UserOrders.vue'),
            },
            // Các route dưới đây đang bị comment. Nếu cần, bỏ comment:
            // {
            //   path: 'notifications',
            //   name: 'user-notifications',
            //   component: () => import('@/views/user/Notifications.vue'),
            // },
            // {
            //   path: 'favorites',
            //   name: 'user-favorites',
            //   component: () => import('@/views/user/Favorites.vue'),
            // },
          ],
        },

        // Trang chính
        {
          path: '',
          component: Home,
        },
        {
          path: 'home',
          name: 'home',
          component: Home,
        },
        {
          path: 'shop',
          name: 'shop',
          component: () => import('@/views/client/Shop.vue'),
        },
        {
          path: 'product/:productCode',
          name: 'product-detail',
          component: () => import('@/views/client/ShopDetail.vue'),
        },
        {
          path: 'cart',
          name: 'cart',
          component: () => import('@/views/client/ShopCart.vue'),
        },
        {
          path: 'checkout',
          name: 'checkout',
          component: () => import('@/views/client/CheckOut.vue'),
        },
        {
          path: 'checkout/qrcode',
          name: 'checkout-qrcode',
          component: () => import('@/views/client/QRcode.vue'),
        },
        {
          path: 'order-update',
          name: 'order-update',
          component: () => import('@/views/client/OrderUpdate.vue'),
        },
        {
          path: 'contact',
          name: 'contact',
          component: () => import('@/views/client/Contact.vue'),
        },
      ],
    },
  ],
})

export default router
