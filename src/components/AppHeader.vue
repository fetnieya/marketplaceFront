<template>
  <!-- Modal recherche produits -->
  <div v-if="isModalOpen" class="search-overlay" @click.self="closeModal">
    <div class="search-panel shadow-lg" role="dialog" aria-modal="true" aria-labelledby="search-modal-title">
      <div class="search-panel-header d-flex align-items-center justify-content-between gap-3">
        <h2 id="search-modal-title" class="h5 mb-0 fw-semibold">Rechercher un produit</h2>
        <button type="button" class="btn-close" @click="closeModal" aria-label="Fermer"></button>
      </div>

      <div class="search-panel-body">
        <div class="search-input-shell mb-3">
          <i class="ai-search search-input-icon" aria-hidden="true"></i>
          <input
            ref="searchInput"
            type="search"
            class="form-control search-input-field"
            placeholder="Tapez un nom d’annonce…"
            v-model="searchQuery"
            @keyup.enter="performSearch"
            autocomplete="off"
            spellcheck="false"
          />
          <span v-if="suggestionsLoading" class="search-input-spinner spinner-border spinner-border-sm" role="status" aria-label="Chargement"></span>
        </div>
        <p class="small text-body-secondary mb-2">
          {{ normalizedSearchQuery ? 'Résultats pour votre saisie' : 'Suggestions récentes' }}
        </p>

        <div class="search-results-scroll">
          <div v-if="suggestionsLoading && displayedSuggestions.length === 0" class="text-center py-4 text-body-secondary small">
            Chargement…
          </div>
          <div
            v-else-if="displayedSuggestions.length === 0 && !suggestionsLoading"
            class="text-center py-4 text-body-secondary small px-2"
          >
            <template v-if="normalizedSearchQuery">
              Aucune annonce ne correspond à « {{ searchQuery.trim() }} ».
              <button type="button" class="btn btn-link btn-sm p-0 d-block mx-auto mt-2" @click="goCatalogWithQuery">
                Ouvrir le catalogue avec ce filtre
              </button>
            </template>
            <template v-else>
              Aucune annonce disponible pour le moment.
            </template>
          </div>
          <ul v-else class="list-unstyled mb-0 search-result-list">
            <li v-for="product in displayedSuggestions" :key="product.id">
              <button
                type="button"
                class="search-result-row w-100 text-start"
                @click="goToProduct(product)"
              >
                <div class="search-result-thumb flex-shrink-0">
                  <img
                    :src="productThumb(product)"
                    :alt="product.name"
                    loading="lazy"
                  />
                </div>
                <div class="search-result-text min-w-0 flex-grow-1">
                  <div class="search-result-title">
                    <template v-for="(seg, si) in nameSegments(product.name)" :key="`${product.id}-seg-${si}`">
                      <mark v-if="seg.hl" class="search-highlight px-0">{{ seg.text }}</mark>
                      <span v-else>{{ seg.text }}</span>
                    </template>
                  </div>
                  <div class="search-result-meta small text-body-secondary text-truncate">
                    <span v-if="product.sellerName">{{ product.sellerName }}</span>
                    <span v-if="product.price != null" class="ms-1">· {{ formatSearchPrice(product.price) }}</span>
                  </div>
                </div>
                <i class="ai-chevron-right search-result-chevron flex-shrink-0 opacity-50"></i>
              </button>
            </li>
          </ul>
        </div>

        <div class="search-panel-footer pt-3 mt-2 border-top">
          <button type="button" class="btn btn-primary w-100 rounded-pill" @click="performSearch">
            Rechercher dans le catalogue
          </button>
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
        <router-link class="navbar-brand d-flex align-items-center py-2 py-lg-1 pe-sm-3" :to="homeRoute">
          <AsmadLogo :icon-size="120" :hide-tagline="true" />
        </router-link>

        <!-- Theme switcher -->
        <div class="form-check form-switch mode-switch order-lg-2 me-3 me-lg-4 ms-auto" @click="toggleTheme">
          <input class="form-check-input" type="checkbox" id="theme-switcher" v-model="isDarkMode" @change="toggleTheme">
          <label class="form-check-label" for="theme-switcher">
            <i v-if="isDarkMode" class="ai-moon fs-lg"></i>
            <i v-else class="ai-sun fs-lg"></i>
          </label>
        </div>

        <!-- Search + Cart + Account -->
        <div class="nav align-items-center order-lg-3 ms-n1 me-3 me-sm-0">
          <div class="search-container">
            <button @click="openModal" class="search-button" type="button" aria-label="Rechercher">
              <i class="ai-search"></i>
            </button>
          </div>
          <router-link to="/cart" class="nav-cart-link ms-3 d-flex align-items-center justify-content-center" aria-label="Panier" title="Panier">
            <i class="ai-cart fs-5"></i>
            <span v-if="cartCount > 0" class="nav-cart-badge">{{ cartCount > 99 ? '99+' : cartCount }}</span>
          </router-link>
          <div v-if="currentUser" class="dropdown ms-3 d-none d-lg-block">
            <button class="btn btn-outline-primary btn-sm fs-sm dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <span class="user-avatar me-2">
                <img
                  v-if="showUserPhoto"
                  :src="userPhotoUrl"
                  alt=""
                  class="user-avatar-img"
                  @error="onUserAvatarError"
                />
                <span v-else class="user-avatar-initials">{{ userInitials }}</span>
              </span>
              <span class="text-truncate" style="max-width: 160px;">{{ userDisplayName }}</span>
            </button>
            <div class="dropdown-menu dropdown-menu-end mt-2">
              <span class="dropdown-item-text small text-body-secondary">Connecté en tant que</span>
              <span class="dropdown-item-text fw-semibold">{{ currentUser.email }}</span>
              <div class="dropdown-divider"></div>
              <router-link class="dropdown-item d-flex align-items-center" to="/profile">
                <i class="ai-user-check me-2"></i>
                Profil
              </router-link>
              <router-link
                v-if="role === 'client'"
                class="dropdown-item d-flex align-items-center"
                to="/my-orders"
              >
                <i class="ai-file-text me-2"></i>
                Mes commandes
              </router-link>
              <button class="dropdown-item d-flex align-items-center" type="button" @click="logout">
                <i class="ai-logout me-2"></i>
                Déconnexion
              </button>
            </div>
          </div>
          <template v-else>
            <router-link to="/sign-in" class="btn btn-outline-primary btn-sm fs-sm ms-3 mb-4 mb-lg-0 d-none d-lg-inline">
              <i class="ai-login me-2 ms-n1"></i>
              Connexion
            </router-link>
            <router-link to="/sign-up" class="btn btn-primary btn-sm fs-sm ms-3 mb-4 mb-lg-0 d-none d-lg-inline">
              <i class="ai-user me-2 ms-n1"></i>
              Inscription
            </router-link>
          </template>
        </div>

        <!-- Mobile menu toggler (Hamburger) -->
        <button class="navbar-toggler ms-sm-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-label="Basculer la navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navbar collapse (Main navigation) -->
        <nav class="collapse navbar-collapse" id="navbarNav" role="navigation">
          <ul class="navbar-nav" v-if="navLinks.length">
            <li class="nav-item" v-for="link in navLinks" :key="link.to">
              <router-link :to="link.to" class="nav-link" :aria-label="`Aller à ${link.label}`">
                {{ link.label }}
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  </main>
</template>

<script>
import axios from "axios";
import AsmadLogo from "./AsmadLogo.vue";
import "../assets/vendor/swiper/swiper-bundle.min.css";
import "../assets/icons/around-icons.min.css";

export default {
  name: 'AppHeader',
  components: { AsmadLogo },
  data() {
    return {
      cartCountValue: 0,
      isDarkMode: this.getPreferredTheme() === 'dark',
      isModalOpen: false,
      searchQuery: '',
      searchQuerySmall: '',
      apiBase: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000',
      placeholderImg:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==',
      products: [],
      dynamicResults: [],
      suggestionsLoading: false,
      searchDebounceId: null,
      currentUser: null,
    };
  },
  computed: {
    role() {
      return this.currentUser?.role?.toLowerCase() || 'guest';
    },
    homeRoute() {
      return this.defaultRouteForRole(this.role);
    },
    navLinks() {
      switch (this.role) {
        case 'admin':
          return [
            { to: '/admin', label: 'Tableau de bord' },
            { to: '/clients', label: 'Gestion utilisateur' },
            { to: '/sellers', label: 'Vendeurs' },
            { to: '/markets', label: 'Marchés' },
            { to: '/category', label: 'Catégories' },
          ];
        case 'seller':
          return [
            { to: '/seller', label: 'Tableau de bord' },
            { to: '/products', label: 'Produits' },
            { to: '/followers', label: 'Abonnés' },
            { to: '/comments', label: 'Commentaires' },
          ];
        default: {
          const links = [
            { to: '/', label: 'Accueil' },
            { to: '/catalog', label: 'Catalogue' },
          ];
          if (this.role === 'client') {
            links.push({ to: '/my-orders', label: 'Mes commandes' });
          }
          links.push(
            { to: '/wishlist', label: 'Liste de souhaits' },
            { to: '/following-market', label: 'Marchés suivis' },
          );
          return links;
        }
      }
    },
    userDisplayName() {
      if (!this.currentUser) return '';
      const { firstName, lastName, email } = this.currentUser;
      const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
      return fullName || email;
    },
    userInitials() {
      if (!this.currentUser) return '';
      const first = this.firstLetter(this.currentUser.firstName);
      const last = this.firstLetter(this.currentUser.lastName);
      const pair = `${first}${last}`;
      if (pair) return pair.toUpperCase();
      const fromEmail = this.firstLetter(this.currentUser.email);
      return (fromEmail || 'U').toUpperCase();
    },
    userPhotoRaw() {
      const u = this.currentUser;
      if (!u) return '';
      const raw = u.photo || u.avatar || u.photoURL;
      if (raw == null || raw === '') return '';
      return String(raw).trim();
    },
    userPhotoUrl() {
      return this.normalizeProfilePhotoUrl(this.userPhotoRaw);
    },
    showUserPhoto() {
      return Boolean(this.userPhotoUrl) && !this.userAvatarLoadFailed;
    },
    normalizedSearchQuery() {
      return String(this.searchQuery || '').toLowerCase().trim();
    },
    displayedSuggestions() {
      const q = this.normalizedSearchQuery;
      if (!q) {
        return this.products.slice(0, 12);
      }
      return this.dynamicResults;
    },
    cartCount() {
      return this.cartCountValue;
    }
  },
  watch: {
    currentUser: {
      handler() {
        this.userAvatarLoadFailed = false;
      },
      deep: true,
    },
    searchQuery() {
      if (!this.isModalOpen) return;
      if (this.searchDebounceId) {
        clearTimeout(this.searchDebounceId);
      }
      this.searchDebounceId = setTimeout(() => {
        this.searchDebounceId = null;
        this.runLiveSearch();
      }, 280);
    },
  },
  methods: {
    firstLetter(value) {
      if (value == null || value === '') return '';
      const s = String(value).trim();
      if (!s) return '';
      const ch = [...s][0];
      return ch || '';
    },
    normalizeProfilePhotoUrl(raw) {
      if (raw == null || raw === '') return '';
      const str = String(raw).trim();
      if (!str) return '';
      if (
        str.startsWith('data:') ||
        str.startsWith('http://') ||
        str.startsWith('https://') ||
        str.startsWith('blob:')
      ) {
        return str;
      }
      const b64 = str.replace(/\s/g, '');
      if (b64.length > 20 && /^[A-Za-z0-9+/=]+$/.test(b64)) {
        return `data:image/jpeg;base64,${b64}`;
      }
      return str;
    },
    onUserAvatarError() {
      this.userAvatarLoadFailed = true;
    },
    defaultRouteForRole(role) {
      switch ((role || '').toLowerCase()) {
        case 'admin':
          return '/admin';
        case 'seller':
          return '/seller';
        default:
          return '/';
      }
    },
    openModal() {
      this.isModalOpen = true;
      if (this.searchQuerySmall) {
        this.searchQuery = this.searchQuerySmall;
      }
      if (!this.products.length) {
        this.fetchProductSuggestions();
      }
      this.$nextTick(() => {
        if (this.$refs.searchInput) {
          this.$refs.searchInput.focus();
        }
        if (this.normalizedSearchQuery) {
          this.runLiveSearch();
        } else {
          this.dynamicResults = [];
        }
      });
      document.body.style.overflow = 'hidden';
    },
    
    openModalWithQuery() {
      if (this.searchQuerySmall) {
        this.searchQuery = this.searchQuerySmall;
        this.openModal();
      }
    },
    
    closeModal() {
      this.isModalOpen = false;
      this.dynamicResults = [];
      document.body.style.overflow = '';
    },
    
    performSearch() {
      const query = this.searchQuery.trim();
      if (!query) {
        this.$router.push({ path: '/catalog' });
        this.closeModal();
        return;
      }

      const list = this.displayedSuggestions;
      const exact = list.find(
        (p) => String(p.name || '').toLowerCase().trim() === query.toLowerCase(),
      );
      if (exact?.id) {
        this.goToProduct(exact);
        return;
      }
      if (list.length === 1 && list[0]?.id) {
        this.goToProduct(list[0]);
        return;
      }

      this.$router.push({ path: '/catalog', query: { q: query } });
      this.closeModal();
    },

    goCatalogWithQuery() {
      const query = this.searchQuery.trim();
      this.$router.push({ path: '/catalog', query: query ? { q: query } : {} });
      this.closeModal();
    },

    async runLiveSearch() {
      const raw = String(this.searchQuery || '').trim();
      if (!raw) {
        this.dynamicResults = [];
        this.suggestionsLoading = false;
        return;
      }
      this.suggestionsLoading = true;
      try {
        const response = await axios.get(
          `${this.apiBase}/products?q=${encodeURIComponent(raw)}`,
        );
        this.dynamicResults = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error('Live search failed', error);
        this.dynamicResults = [];
      } finally {
        this.suggestionsLoading = false;
      }
    },

    nameSegments(name) {
      const n = String(name || '');
      const q = String(this.searchQuery || '').trim();
      if (!q) {
        return [{ text: n, hl: false }];
      }
      const lower = n.toLowerCase();
      const idx = lower.indexOf(q.toLowerCase());
      if (idx === -1) {
        return [{ text: n, hl: false }];
      }
      const segs = [];
      if (idx > 0) segs.push({ text: n.slice(0, idx), hl: false });
      segs.push({ text: n.slice(idx, idx + q.length), hl: true });
      if (idx + q.length < n.length) {
        segs.push({ text: n.slice(idx + q.length), hl: false });
      }
      return segs;
    },

    productThumb(product) {
      if (!product) {
        return this.placeholderImg;
      }
      const images = product.images;
      if (images && Array.isArray(images) && images.length > 0) {
        const u = images[0]?.url || images[0];
        if (typeof u === 'string' && u) return u;
      }
      if (product.image && typeof product.image === 'string') {
        return product.image;
      }
      return this.placeholderImg;
    },

    formatSearchPrice(price) {
      const n = Number(price);
      if (Number.isNaN(n)) return '';
      try {
        return new Intl.NumberFormat('fr-TN', {
          style: 'currency',
          currency: 'TND',
          minimumFractionDigits: 2,
        }).format(n);
      } catch {
        return `${n} DT`;
      }
    },
    
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
      try {
        const script = document.createElement('script');
        script.src = src;
        script.onerror = () => {
          // Silently ignore missing script files to avoid console errors
          console.debug(`Script not found: ${src}`);
        };
        document.body.appendChild(script);
      } catch (error) {
        // Silently ignore script loading errors
        console.debug(`Error loading script ${src}:`, error);
      }
    },

    loadCurrentUser() {
      try {
        const storedUser = localStorage.getItem('currentUser');
        this.currentUser = storedUser ? JSON.parse(storedUser) : null;
      } catch (error) {
        console.error('Unable to load current user from storage', error);
        this.currentUser = null;
      }
    },
    async hydrateUserFromApi() {
      const token = localStorage.getItem('authToken');
      const u = this.currentUser;
      if (!token || !u?.id) return;
      try {
        const { data } = await axios.get(`${this.apiBase}/users/${u.id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        if (!data || typeof data !== 'object') return;
        const merged = { ...u, ...data };
        delete merged.password;
        this.currentUser = merged;
        localStorage.setItem('currentUser', JSON.stringify(merged));
      } catch {
        /* session ou réseau : garder le user stocké */
      }
    },
    refreshCartCount() {
      try {
        const cart = localStorage.getItem('cart');
        if (!cart) {
          this.cartCountValue = 0;
          return;
        }
        const items = JSON.parse(cart);
        this.cartCountValue = Array.isArray(items) ? items.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;
      } catch {
        this.cartCountValue = 0;
      }
    },
    handleUserUpdate() {
      this.loadCurrentUser();
    },

    logout() {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      this.currentUser = null;
      this.$router.push('/sign-in');
    },

    handleStorage(event) {
      if (event.key === 'currentUser') {
        this.loadCurrentUser();
      }
    },

    async fetchProductSuggestions() {
      this.suggestionsLoading = true;
      try {
        const response = await axios.get(`${this.apiBase}/products`);
        this.products = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error('Unable to load search suggestions', error);
        this.products = [];
      } finally {
        this.suggestionsLoading = false;
      }
    },

    goToProduct(product) {
      if (!product?.id) return;
      this.$router.push(`/shop-single/${product.id}`);
      this.closeModal();
    }
  },

  mounted() {
    this.loadCurrentUser();
    this.hydrateUserFromApi();
    this.refreshCartCount();
    this.fetchProductSuggestions();
    window.addEventListener('cart-updated', this.refreshCartCount);

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
    this.addMetaTag('description', 'Asmad – Des milliers de choix, un seul marché.');
    this.addMetaTag('keywords', 'bootstrap, business, corporate, coworking space, services, creative agency, dashboard, e-commerce, mobile app showcase, saas, multipurpose, product landing, shop, software, ui kit, web studio, landing, light and dark mode, html5, css3, javascript, gallery, slider, touch, creative');
    this.addMetaTag('author', 'Createx Studio');

    // Link tags
    this.addLinkTag({ rel: "manifest", href: "/manifest.json" });
    this.addLinkTag({ rel: "icon", type: "image/png", href: "assets/app-icons/icon-32x32.png", sizes: "32x32" });
    this.addLinkTag({ rel: "apple-touch-icon", href: "assets/app-icons/icon-180x180.png" });
    this.addLinkTag({ rel: "preconnect", href: "https://fonts.googleapis.com" });
    this.addLinkTag({ rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" });
    this.addLinkTag({ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap", id: "google-font" });

    // Add Vendor scripts: JS libraries and plugins (optional, will fail silently if not found)
    // These scripts are loaded dynamically and errors are handled gracefully
    try {
      this.addScriptTag('assets/vendor/jarallax/dist/jarallax.min.js');
      this.addScriptTag('assets/vendor/swiper/swiper-bundle.min.js');
      this.addScriptTag('assets/vendor/timezz/dist/timezz.js');
      this.addScriptTag('assets/js/theme.min.js');
    } catch (error) {
      // Silently ignore if scripts are not available
      console.debug('Optional vendor scripts not available');
    }
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isModalOpen) {
        this.closeModal();
      }
    });

    window.addEventListener('storage', this.handleStorage);
    window.addEventListener('user-updated', this.handleUserUpdate);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorage);
    window.removeEventListener('user-updated', this.handleUserUpdate);
    window.removeEventListener('cart-updated', this.refreshCartCount);
  },
};
</script>

<style>
/* Existing styles */
.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 0;
  padding: 0;
  border: none;
  border-bottom: 2px solid transparent;
  outline: none;
  font-size: 16px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.search-button {
  background: linear-gradient(135deg, #c62828, #c62828);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 18px;
  transition: all 0.3s ease;
  z-index: 1;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.search-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.search-container:hover .search-input,
.search-input:focus {
  width: 200px;
  padding: 10px;
  border-bottom: 2px solid #c62828;
  margin-right: 10px;
}

/* Modal recherche */
.search-overlay {
  position: fixed;
  inset: 0;
  z-index: 1050;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 1.25rem;
  padding-top: clamp(3rem, 12vh, 6rem);
  overflow-y: auto;
  background: rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: searchOverlayIn 0.2s ease-out;
}

@keyframes searchOverlayIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.search-panel {
  width: 100%;
  max-width: 560px;
  background: var(--ar-body-bg, #fff);
  color: var(--ar-body-color, #212529);
  border-radius: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  overflow: hidden;
  animation: searchPanelIn 0.28s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.28),
    0 0 0 1px rgba(255, 255, 255, 0.06) inset;
}

@keyframes searchPanelIn {
  from {
    opacity: 0;
    transform: translateY(-12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.search-panel-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--ar-border-color, rgba(0, 0, 0, 0.08));
  background: var(--ar-body-bg, #fff);
}

.search-panel-body {
  padding: 1rem 1.25rem 1.25rem;
}

.search-input-shell {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input-icon {
  position: absolute;
  left: 1rem;
  font-size: 1.1rem;
  color: var(--ar-secondary-color, #6c757d);
  pointer-events: none;
  z-index: 1;
}

.search-input-field {
  padding-left: 2.75rem;
  padding-right: 2.5rem;
  border-radius: 999px;
  border-width: 1px;
  font-size: 1rem;
  min-height: 48px;
  background: var(--ar-secondary-bg, #f8f9fa);
  border-color: transparent;
  transition:
    border-color 0.15s,
    box-shadow 0.15s,
    background 0.15s;
}

.search-input-field:focus {
  background: var(--ar-body-bg, #fff);
  border-color: rgba(198, 40, 40, 0.45);
  box-shadow: 0 0 0 3px rgba(198, 40, 40, 0.15);
}

.search-input-spinner {
  position: absolute;
  right: 1rem;
  color: var(--ar-primary, #c62828);
}

.search-results-scroll {
  max-height: min(52vh, 420px);
  overflow-y: auto;
  margin: 0 -0.25rem;
  padding: 0 0.25rem;
  border-radius: 0.5rem;
}

.search-result-list li + li {
  margin-top: 0.35rem;
}

.search-result-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.65rem;
  border: none;
  border-radius: 0.65rem;
  background: transparent;
  color: inherit;
  transition: background 0.15s;
}

.search-result-row:hover {
  background: var(--ar-secondary-bg, #f1f3f5);
}

.search-result-thumb {
  width: 52px;
  height: 52px;
  border-radius: 0.5rem;
  overflow: hidden;
  background: var(--ar-secondary-bg, #e9ecef);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.search-result-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.search-result-title {
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.3;
  word-break: break-word;
}

.search-highlight {
  background: rgba(198, 40, 40, 0.18);
  color: inherit;
  font-weight: 700;
  border-radius: 2px;
}

.search-result-chevron {
  font-size: 1rem;
}

.search-panel-footer .btn-primary {
  background: linear-gradient(135deg, #c62828, #b71c1c);
  border: none;
}

[data-bs-theme='dark'] .search-panel {
  background: #1e2329;
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.04) inset;
}

[data-bs-theme='dark'] .search-panel-header {
  background: #1e2329;
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

[data-bs-theme='dark'] .search-input-field {
  background: #2b3035;
  color: #e9ecef;
}

[data-bs-theme='dark'] .search-input-field:focus {
  background: #212529;
  border-color: rgba(198, 40, 40, 0.55);
}

[data-bs-theme='dark'] .search-result-row:hover {
  background: rgba(255, 255, 255, 0.06);
}

[data-bs-theme='dark'] .search-highlight {
  background: rgba(198, 40, 40, 0.35);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #e0e7ff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.user-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.user-avatar-initials {
  font-weight: 700;
  font-size: 0.7rem;
  line-height: 1;
  color: #1f2937;
  text-transform: uppercase;
  letter-spacing: -0.02em;
}

.nav-cart-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: var(--ar-emphasis-color, #1a1d21);
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
  position: relative;
}

.nav-cart-link:hover {
  background: var(--ar-secondary-bg, #f1f3f5);
  color: var(--ar-primary, #c62828);
}

[data-bs-theme="dark"] .nav-cart-link {
  color: #e9ecef;
}

[data-bs-theme="dark"] .nav-cart-link:hover {
  background: #343a40;
  color: #60d9a0;
}

.nav-cart-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 18px;
  text-align: center;
  color: #fff;
  background: var(--ar-primary, #c62828);
  border-radius: 999px;
}
</style>
