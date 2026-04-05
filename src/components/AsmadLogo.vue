<template>
  <span class="asmad-logo-wrapper" :class="{ 'logo-inline': inline, compact: hideTagline }" :style="wrapperStyle">
    <template v-if="hideTagline">
      <span class="asmad-emblem-box">
        <img class="asmad-emblem-img" :src="currentLogoSrc" alt="Asmad" />
      </span>
    </template>
    <img v-else class="asmad-logo-img" :src="currentLogoSrc" alt="Asmad logo" :style="logoStyle" />
  </span>
</template>

<script>
import logoLight from '@/assets/img/logo/logo-light-red.png';
import logoDark from '@/assets/img/logo/logo-dark-red.png';

export default {
  name: 'AsmadLogo',
  props: {
    iconSize: { type: [Number, String], default: 120 },
    inline: { type: Boolean, default: true },
    hideTagline: { type: Boolean, default: false },
  },
  data() {
    return {
      logoLight,
      logoDark,
      isDarkTheme: false,
      themeObserver: null,
    };
  },
  computed: {
    currentLogoSrc() {
      return this.isDarkTheme ? this.logoDark : this.logoLight;
    },
    wrapperStyle() {
      const size = Number(this.iconSize) || 120;
      if (!this.hideTagline) {
        return {
          width: `${size * 2.8}px`,
          height: `${size * 1.05}px`,
        };
      }
      // Navbar: carré proportionné à la hauteur utile de la barre (~ nav links / boutons)
      const side = size * 0.88;
      return {
        width: `${side}px`,
        height: `${side}px`,
        minWidth: `${side}px`,
        minHeight: `${side}px`,
      };
    },
    logoStyle() {
      const size = Number(this.iconSize) || 120;
      return {
        width: `${size * 2.8}px`,
        height: `${size * 1.05}px`,
        objectFit: 'contain',
        objectPosition: 'center center',
      };
    },
  },
  methods: {
    syncTheme() {
      const t = document?.documentElement?.getAttribute('data-bs-theme') || 'light';
      this.isDarkTheme = t === 'dark';
    },
  },
  mounted() {
    this.syncTheme();
    this.themeObserver = new MutationObserver(() => this.syncTheme());
    this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-bs-theme'] });
  },
  beforeUnmount() {
    if (this.themeObserver) {
      this.themeObserver.disconnect();
      this.themeObserver = null;
    }
  },
};
</script>

<style scoped>
/* Pas d'overflow:hidden ici : il coupait le logo avec les anciens zooms */
.asmad-logo-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  line-height: 0;
  vertical-align: middle;
}

.asmad-logo-wrapper.compact {
  flex-shrink: 0;
}

.asmad-logo-img {
  display: block;
  max-width: none;
}

.asmad-emblem-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
}

/* Image remplit le cadre : recadrage sur la partie haute (main) sans transform */
.asmad-emblem-img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center 18%;
}
</style>
