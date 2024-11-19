<template>
  <component :is="layoutComponent">
    <!-- Render the current page inside the chosen layout -->
    <router-view />
  </component>
</template>

<script>
import DefaultLayout from './components/layouts/DefaultLayout.vue';
import AdminLayout from './components/layouts/AdminLayout.vue';

export default {
  components: {
    DefaultLayout,
    AdminLayout,
  },
  computed: {
    // Dynamically choose the layout component
    layoutComponent() {
      // Get the layout name from the route meta; default to 'DefaultLayout'
      const layout = this.$route.meta.layout || 'DefaultLayout';

      // Return the appropriate layout component
      if (layout === 'AdminLayout') {
        return AdminLayout;
      }
      return DefaultLayout;
    },
  },
};
</script>
