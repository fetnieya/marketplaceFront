<template>
  <component :is="layoutComponent">
    <!-- Render the current page inside the chosen layout -->
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
    // Dynamically choose the layout component
    layoutComponent() {
      // Get the layout name from the route meta; default to 'DefaultLayout'
      const layout = this.$route.meta.layout || 'DefaultLayout';

      // Return the appropriate layout component
      switch (layout) {
        case 'AdminLayout':
          return AdminLayout;
        case 'SellerLayout':
          return SellerLayout;
        case 'AuthLayout':
          return AuthLayout;
        default:
          return DefaultLayout;
      }
    },
  },
};
</script>
