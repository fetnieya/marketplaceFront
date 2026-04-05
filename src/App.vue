<template>
  <component :is="layoutComponent" :key="layoutKey">
    <router-view />
  </component>
</template>

<script>
import DefaultLayout from './components/layouts/DefaultLayout.vue';
import AdminLayout from './components/layouts/AdminLayout.vue';
import SellerLayout from './components/layouts/SellerLayout.vue';
import AuthLayout from './components/layouts/AuthLayout.vue';
export default {
  components: {
    DefaultLayout,
    AdminLayout,
    SellerLayout,
    AuthLayout,
  },
  computed: {
    /** Références de composants (pas des chaînes) pour éviter les erreurs de résolution :is / vnode null */
    layoutComponent() {
      const name = this.$route?.meta?.layout;
      switch (name) {
        case 'AdminLayout':
          return AdminLayout;
        case 'SellerLayout':
          return SellerLayout;
        case 'AuthLayout':
          return AuthLayout;
        case 'DefaultLayout':
        default:
          return DefaultLayout;
      }
    },
    layoutKey() {
      return this.$route?.meta?.layout || 'DefaultLayout';
    },
  },
};
</script>
