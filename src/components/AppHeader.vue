<template>
    <!-- Search modal -->
    <div class="modal fade" id="searchModal" tabindex="-1" role="dialog" data-focus-input="#search">
      <div class="modal-dialog modal-dialog-scrollable" role="document">
        <div class="modal-content">
          <div class="modal-header d-block position-relative border-0 pb-3">
            <form class="position-relative w-100 mt-2 mb-4">
              <button class="btn-close position-absolute top-50 end-0 translate-middle-y m-0 me-n1" type="reset" data-bs-dismiss="modal" aria-label="Close"></button>
              <i class="ai-search fs-xl position-absolute top-50 start-0 translate-middle-y ms-3"></i>
              <input class="form-control form-control-lg px-5" type="search" placeholder="Type to search" data-focus-on-open='["modal", "#searchModal"]'>
            </form>
            <div class="fs-xs fw-medium text-body-secondary text-uppercase">Suggestions</div>
          </div>
          <div class="modal-body pt-3">
            <!-- Modal content -->
          </div>
        </div>
      </div>
    </div>
  
    <!-- Page wrapper -->
    <main class="page-wrapper">
  
      <!-- Navbar -->
      <header class="navbar navbar-expand-lg fixed-top bg-light">
        <div class="container">
  
          <!-- Navbar brand (Logo) -->
          <router-link class="navbar-brand pe-sm-3" to="/">
            <span class="text-primary flex-shrink-0 me-2">
              <svg width="35" height="32" viewBox="0 0 36 33" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M35.6,29c-1.1,3.4-5.4,4.4-7.9,1.9c-2.3-2.2-6.1-3.7-9.4-3.7c-3.1,0-7.5,1.8-10,4.1c-2.2,2-5.8,1.5-7.3-1.1c-1-1.8-1.2-4.1,0-6.2l0.6-1.1l0,0c0.6-0.7,4.4-5.2,12.5-5.7c0.5,1.8,2,3.1,3.9,3.1c2.2,0,4.1-1.9,4.1-4.2s-1.8-4.2-4.1-4.2c-2,0-3.6,1.4-4,3.3H7.7c-0.8,0-1.3-0.9-0.9-1.6l5.6-9.8c2.5-4.5,8.8-4.5,11.3,0L35.1,24C36,25.7,36.1,27.5,35.6,29z"></path>
              </svg>
            </span>
            <span class="d-none d-sm-inline">Around</span>
          </router-link>
  
                  <!-- Theme switcher -->
                  <div class="form-check form-switch mode-switch order-lg-2 me-3 me-lg-4 ms-auto" @click="toggleTheme">
    <input class="form-check-input" type="checkbox" id="theme-switcher" v-model="isDarkMode" @change="toggleTheme">
    <label class="form-check-label" for="theme-switcher">
      <i v-if="isDarkMode" class="ai-moon fs-lg"></i>
      <i v-else class="ai-sun fs-lg"></i>
    </label>
  </div>
  
          <!-- Search + Account + Cart -->
          <div class="nav align-items-center order-lg-3 ms-n1 me-3 me-sm-0">
            <a class="nav-link fs-4 p-2 mx-sm-1" href="#searchModal" data-bs-toggle="modal" aria-label="Search">
              <i class="ai-search"></i>
            </a>
            <router-link to="/sign-in" class="btn btn-outline-primary btn-sm fs-sm ms-3 mb-4 mb-lg-0 d-none d-lg-inline">
              <i class="ai-login me-2 ms-n1"></i>
              Sign in
            </router-link>
            <router-link to="/sign-up" class="btn btn-primary btn-sm fs-sm ms-3 mb-4 mb-lg-0 d-none d-lg-inline">
              <i class="ai-user me-2 ms-n1"></i>
              Sign up
            </router-link>
          </div>
  
          <!-- Mobile menu toggler (Hamburger) -->
          <button class="navbar-toggler ms-sm-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
  
          <!-- Navbar collapse (Main navigation) -->
          <nav class="collapse navbar-collapse" id="navbarNav" role="navigation">
            <ul class="navbar-nav">
              <li class="nav-item">
                <router-link to="/" class="nav-link" aria-label="Go to Home">Home</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/catalog" class="nav-link" aria-label="Go to Catalog">Catalog</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/wishlist" class="nav-link" aria-label="Go to WishList">WishList</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/following-market" class="nav-link" aria-label="Go to Following market">Following Market</router-link>
              </li>
            </ul>
          </nav>
  
        </div>
      </header>
    </main>
  </template>
  
  
<script>
import "../assets/vendor/swiper/swiper-bundle.min.css";
import "../assets/icons/around-icons.min.css";
import "../assets/css/theme.min.css";

export default {
  name: 'AppHeader',
  data() {
    return {
      isDarkMode: this.getPreferredTheme() === 'dark',
    };
  },
  methods: {
    // Fetches the theme from local storage or defaults to light mode
    getStoredTheme() {
      return localStorage.getItem('theme');
    },
    setStoredTheme(theme) {
      localStorage.setItem('theme', theme);
    },
    getPreferredTheme() {
      const storedTheme = this.getStoredTheme();
      if (storedTheme) {
        return storedTheme;
      }
      // Default to light mode if no theme is set
      return 'light';
    },
    setTheme(theme) {
      if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-bs-theme', theme);
      }
    },
    showActiveTheme(theme) {
      const themeSwitcher = document.querySelector('[data-bs-toggle="mode"]');
      if (!themeSwitcher) return;

      const themeSwitcherCheck = themeSwitcher.querySelector('input[type="checkbox"]');
      if (theme === 'dark') {
        themeSwitcherCheck.checked = true;
      } else {
        themeSwitcherCheck.checked = false;
      }
    },
    toggleTheme() {
      const theme = this.isDarkMode ? 'dark' : 'light';
      this.setStoredTheme(theme);
      this.setTheme(theme);
      this.showActiveTheme(theme);
    },

    addMetaTag(name, content) {
      const meta = document.createElement('meta');
      meta.name = name;
      meta.content = content;
      document.head.appendChild(meta);
    },

    addLinkTag(attributes) {
      const link = document.createElement('link');
      Object.keys(attributes).forEach(attr => link.setAttribute(attr, attributes[attr]));
      document.head.appendChild(link);
    },

    addScriptTag(src) {
      const script = document.createElement('script');
      script.src = src;
      document.body.appendChild(script);
    },
  },

  mounted() {
    // Set the initial theme based on the stored or preferred theme
    this.setTheme(this.getPreferredTheme());

    // Listen for system theme changes and update the theme accordingly
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      const storedTheme = this.getStoredTheme();
      if (storedTheme !== 'light' && storedTheme !== 'dark') {
        this.setTheme(this.getPreferredTheme());
      }
    });

    // Check for the saved theme preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.body.classList.add('dark-mode');
    }

    // Add meta tags and link tags for SEO and other configurations
    this.addMetaTag('viewport', 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover');
    this.addMetaTag('description', 'Around - Multipurpose Bootstrap HTML Template');
    this.addMetaTag('keywords', 'bootstrap, business, corporate, coworking space, services, creative agency, dashboard, e-commerce, mobile app showcase, saas, multipurpose, product landing, shop, software, ui kit, web studio, landing, light and dark mode, html5, css3, javascript, gallery, slider, touch, creative');
    this.addMetaTag('author', 'Createx Studio');

    // Link tags
    this.addLinkTag({ rel: "manifest", href: "/manifest.json" });
    this.addLinkTag({ rel: "icon", type: "image/png", href: "assets/app-icons/icon-32x32.png", sizes: "32x32" });
    this.addLinkTag({ rel: "apple-touch-icon", href: "assets/app-icons/icon-180x180.png" });
    this.addLinkTag({ rel: "preconnect", href: "https://fonts.googleapis.com" });
    this.addLinkTag({ rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" });
    this.addLinkTag({ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap", id: "google-font" });

    // Add Vendor scripts: JS libraries and plugins
    this.addScriptTag('assets/vendor/jarallax/dist/jarallax.min.js');
    this.addScriptTag('assets/vendor/swiper/swiper-bundle.min.js');
    this.addScriptTag('assets/vendor/timezz/dist/timezz.js');
    this.addScriptTag('assets/js/theme.min.js');
  },
};
</script>