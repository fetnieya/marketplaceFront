<template>
  <div class="seller-layout">
    <!-- Header Component -->
    <AppSellerHeader />
    
    <!-- Slot for projected content -->
    <main>
      <slot />
    </main>
  </div>
</template>

<script>
import AppSellerHeader from '../AppSellerHeader.vue';

export default {
  name: 'SellerLayout',
  components: {
    AppSellerHeader, 
  },
};
</script>


