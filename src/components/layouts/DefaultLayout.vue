<template>
  <div class="default-layout">
    <AppHeader />
    <main class="default-layout-main">
      <slot/> <!-- This allows dynamic content to be inserted -->
    </main>
    <AppFooter />
    <AsmadChatWidget />
  </div>
</template>

<script>
import AppHeader from '../AppHeader.vue'
import AppFooter from '../AppFooter.vue'
import AsmadChatWidget from '../AsmadChatWidget.vue'

export default {
  name: 'DefaultLayout',
  components: {
    AppHeader,
    AppFooter,
    AsmadChatWidget
  }
}
</script>

<style scoped>
/* Évite que le contenu (titres, fil d’Ariane) passe sous la navbar fixed-top */
.default-layout-main {
  padding-top: var(--asmad-fixed-navbar-height, 7.75rem);
}
</style>

