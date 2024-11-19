<template>
  <div class="default-layout">
    <AppHeader />
    <main>
      <slot/> <!-- This allows dynamic content to be inserted -->
    </main>
   <AppFooter/>
  </div>
</template>

<script>
import AppHeader from '../AppHeader.vue'
import AppFooter from '../AppFooter.vue'

export default {
  name: 'DefaultLayout',
  components: {
    AppHeader,
    AppFooter
  },
}
</script>

