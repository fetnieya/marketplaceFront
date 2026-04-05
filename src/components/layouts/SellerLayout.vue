<template>
  <div class="seller-layout-wrapper">
    <!-- Fixed Sidebar -->
    <aside class="seller-sidebar-fixed">
      <div class="offcanvas-lg offcanvas-start" id="sidebarAccount">
        <button class="btn-close btn-close-white position-absolute top-0 end-0 mt-3 me-3 d-lg-none" type="button" data-bs-dismiss="offcanvas" data-bs-target="#sidebarAccount" aria-label="Close"></button>
        <div class="offcanvas-body d-flex flex-column">
          <!-- Logo at the top -->
          <div class="logo-container mb-3">
            <router-link to="/seller" class="navbar-brand d-flex align-items-center text-decoration-none justify-content-center">
              <AsmadLogo :icon-size="120" :hide-tagline="true" />
            </router-link>
          </div>

          <!-- Navigation Menu -->
          <nav class="nav flex-column pb-2 sidebar-nav">
            <router-link 
              class="sidebar-nav-link" 
              :class="{ 'active': $route.path === '/seller' && !showProfile }"
              to="/seller"
              @click="showProfile = false"
            >
              <i class="ai-dashboard me-3"></i> Tableau de bord
            </router-link>
            <router-link 
              class="sidebar-nav-link" 
              :class="{ 'active': $route.path === '/products' || $route.path.startsWith('/addProduct') || $route.path.startsWith('/editProduct') }"
              to="/products"
              @click="showProfile = false"
            >
              <i class="ai-box me-3"></i> Gestion des annonces
            </router-link>
        <router-link 
          class="sidebar-nav-link" 
          :class="{ 'active': $route.path === '/sellerCategory' || $route.path.startsWith('/addSellerCategory') }"
          to="/sellerCategory"
          @click="showProfile = false"
        >
          <i class="ai-grid me-3"></i> Catégories
        </router-link>
        <router-link 
          class="sidebar-nav-link" 
          :class="{ 'active': $route.path === '/followers' }"
          to="/followers"
          @click="showProfile = false"
        >
          <i class="ai-user-group me-3"></i> Abonnés
        </router-link>
        <router-link 
          class="sidebar-nav-link" 
          :class="{ 'active': $route.path === '/orders' }"
          to="/orders"
          @click="showProfile = false"
        >
          <i class="ai-file-text me-3"></i> Gestion de commande
        </router-link>
        <router-link 
          class="sidebar-nav-link" 
          :class="{ 'active': $route.path === '/comments' }"
          to="/comments"
          @click="showProfile = false"
        >
          <i class="ai-messages me-3"></i> Commentaires
        </router-link>
          </nav>

          <!-- Spacer to push bottom section to the end -->
          <div class="sidebar-spacer"></div>

          <!-- Profil + déconnexion : même style que les liens du menu -->
          <div class="sidebar-footer">
            <button 
              v-if="currentUser"
              class="sidebar-profile-link w-100" 
              :class="{ 'active': showProfile }"
              @click="toggleProfile"
              type="button"
            >
              <div class="profile-avatar-circle me-3" :style="avatarStyle">
                <span v-if="!hasAvatar && userInitials" class="avatar-initials">{{ userInitials }}</span>
              </div>
              <span>Profil</span>
            </button>

            <button 
              class="sidebar-nav-link sidebar-logout-link w-100" 
              type="button" 
              @click="logout"
            >
              <i class="ai-logout me-3"></i> Déconnexion
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="seller-main-wrapper">
      <!-- Fixed Header -->
      <header class="seller-header-fixed">
        <div class="seller-header-content">
          <div class="seller-header-title">
            <h1 class="page-title">{{ pageTitle }}</h1>
          </div>
          <div class="seller-header-actions">
            <!-- Theme Switcher -->
            <div class="form-check form-switch mode-switch" data-bs-toggle="mode">
              <input class="form-check-input" type="checkbox" id="seller-theme-switcher" :checked="isDarkMode" @change="toggleTheme">
              <label class="form-check-label" for="seller-theme-switcher">
                <i v-if="isDarkMode" class="ai-moon fs-lg"></i>
                <i v-else class="ai-sun fs-lg"></i>
              </label>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="seller-content-area">
        <SellerProfile v-if="showProfile" @profile-updated="handleProfileUpdate" />
        <slot v-else/>
      </main>
    </div>
    <AsmadChatWidget variant="seller" />
  </div>
</template>

<script>
import axios from 'axios';
import AsmadLogo from '../AsmadLogo.vue';
import AsmadChatWidget from '../AsmadChatWidget.vue';
import SellerProfile from '@/Views/Seller/SellerProfile.vue';

export default {
  name: 'SellerLayout',
  components: {
    AsmadLogo,
    AsmadChatWidget,
    SellerProfile
  },
  data() {
    return {
      isDarkMode: this.getPreferredTheme() === 'dark',
      currentUser: null,
      apiBase: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000',
      showProfile: false,
    };
  },
  computed: {
    userDisplayName() {
      if (!this.currentUser) return '';
      const { firstName, lastName, email } = this.currentUser;
      const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
      return fullName || email;
    },
    userInitials() {
      if (!this.currentUser) return '';
      const first = this.currentUser.firstName?.trim()?.[0] || '';
      const last = this.currentUser.lastName?.trim()?.[0] || '';
      return (first + last || this.currentUser.email?.[0] || 'U').toUpperCase();
    },
    hasAvatar() {
      if (!this.currentUser) return false;
      const avatar = this.currentUser.avatar || this.currentUser.photo || this.currentUser.photoURL;
      return !!avatar;
    },
    avatarStyle() {
      if (!this.currentUser) {
        return {
          backgroundColor: '#c62828',
          color: 'white',
        };
      }
      const avatar = this.currentUser.avatar || this.currentUser.photo || this.currentUser.photoURL;
      if (avatar) {
        return { 
          backgroundImage: `url(${avatar})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      }
      return {
        backgroundColor: '#c62828',
        color: 'white',
      };
    },
    pageTitle() {
      const routeTitles = {
        '/seller': 'Tableau de bord',
        '/products': 'Gestion des annonces',
        '/addProduct': 'Créer une annonce',
        '/sellerCategory': 'Catégories',
        '/addSellerCategory': 'Demande de catégorie',
        '/followers': 'Gestion des abonnés',
        '/orders': 'Gestion de commande',
        '/comments': 'Commentaires par produit',
      };
      if (this.$route.path.startsWith('/editProduct')) {
        return 'Modifier l\'annonce';
      }
      return routeTitles[this.$route.path] || routeTitles[this.$route.matched[0]?.path] || 'Vendeur';
    }
  },
  methods: {
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
      const themeSwitcher = document.querySelector('#seller-theme-switcher');
      if (!themeSwitcher) return;
      themeSwitcher.checked = theme === 'dark';
      this.isDarkMode = theme === 'dark';
    },
    toggleTheme() {
      // Toggle the theme
      const newTheme = !this.isDarkMode ? 'dark' : 'light';
      this.isDarkMode = !this.isDarkMode;
      this.setStoredTheme(newTheme);
      this.setTheme(newTheme);
      this.showActiveTheme(newTheme);
    },
    async loadCurrentUser() {
      try {
        const stored = localStorage.getItem('currentUser');
        let user = stored ? JSON.parse(stored) : null;
        
        if (user && user.id) {
          // Charger les données depuis l'API pour obtenir la photo
          try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${this.apiBase}/users/${user.id}`, {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
              withCredentials: true,
            });
            this.currentUser = response.data;
          } catch (apiError) {
            console.warn('Failed to load user from API, using stored data', apiError);
            this.currentUser = user;
          }
        } else {
          this.currentUser = user;
        }
      } catch (error) {
        console.error('Error loading current user:', error);
        this.currentUser = null;
      }
    },
    toggleProfile() {
      // Si on ouvre le profil, ne pas naviguer
      if (!this.showProfile) {
        this.showProfile = true;
      } else {
        // Si on ferme le profil, retourner au tableau de bord
        this.showProfile = false;
        if (this.$route.path !== '/seller') {
          this.$router.push('/seller');
        }
      }
    },
    handleProfileUpdate() {
      // Recharger les données de l'utilisateur après la mise à jour du profil
      this.loadCurrentUser();
    },
    logout() {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      this.$router.push('/sign-in');
    }
  },
  watch: {
    // Réinitialiser showProfile quand on change de route vers une autre page seller
    '$route'() {
      // Si on navigue vers une route seller différente, toujours cacher le profil
      // Le profil ne doit s'afficher que quand on clique explicitement sur le bouton Profil
      this.showProfile = false;
    }
  },
  mounted() {
    this.setTheme(this.getPreferredTheme());
    this.loadCurrentUser();
    this.showActiveTheme(this.getPreferredTheme());
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      const storedTheme = this.getStoredTheme();
      if (storedTheme !== 'light' && storedTheme !== 'dark') {
        this.setTheme(this.getPreferredTheme());
      }
    });
  }
}
</script>

<style scoped>
/* Seller Layout Wrapper */
.seller-layout-wrapper {
  display: flex;
  min-height: 100vh;
  background-color: var(--ar-body-bg, #fff);
  color: var(--ar-body-color, #121519);
}

/* Fixed Sidebar */
.seller-sidebar-fixed {
  width: 280px;
  background-color: var(--ar-secondary-bg, #f6f9fc);
  border-right: 1px solid var(--ar-border-color, rgba(0, 0, 0, 0.1));
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  z-index: 1000;
  left: 0;
  top: 0;
}

[data-bs-theme="dark"] .seller-sidebar-fixed {
  background-color: #161b22;
  border-right-color: rgba(255, 255, 255, 0.1);
}

.offcanvas-lg.offcanvas-start {
  background-color: var(--ar-secondary-bg, #f6f9fc);
  border: none;
  position: static;
  transform: none;
  visibility: visible;
}

[data-bs-theme="dark"] .offcanvas-lg.offcanvas-start {
  background-color: #161b22;
}

.offcanvas-body {
  padding: 2rem 1.5rem;
  padding-bottom: 140px; /* Space for footer */
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: relative;
}

/* Logo Container */
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
}

.logo-container a {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.logo-container svg {
  width: 35px;
  height: 32px;
}

/* Navigation Links */
.sidebar-nav {
  margin-top: 1rem;
  flex: 1;
  min-height: 0;
}

.sidebar-nav-link {
  display: flex;
  align-items: center;
  padding: 0.875rem 1rem;
  margin-bottom: 0.5rem;
  color: var(--ar-body-color, #121519);
  opacity: 0.7;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 500;
}

[data-bs-theme="dark"] .sidebar-nav-link {
  color: rgba(255, 255, 255, 0.7);
}

.sidebar-nav-link:hover {
  opacity: 0.9;
  background-color: rgba(0, 0, 0, 0.05);
}

[data-bs-theme="dark"] .sidebar-nav-link:hover {
  color: rgba(255, 255, 255, 0.9);
  background-color: rgba(255, 255, 255, 0.05);
}

.sidebar-nav-link.active {
  opacity: 1;
  background-color: rgba(var(--ar-primary-rgb), 0.15);
  border-left: 3px solid #fdd835;
  padding-left: calc(1rem - 3px);
  color: var(--ar-primary, #c62828);
}

[data-bs-theme="dark"] .sidebar-nav-link.active {
  color: var(--ar-primary, #ef5350);
  background-color: rgba(var(--ar-primary-rgb), 0.18);
}

.sidebar-nav-link i {
  width: 20px;
  text-align: center;
  font-size: 1.25rem;
}

/* Sidebar Spacer — léger espace avant le pied de menu */
.sidebar-spacer {
  flex: 0 0 0.75rem;
  min-height: 0;
}

/* Sidebar Footer — mêmes marges horizontales que le contenu (padding body 1.5rem) */
.sidebar-footer {
  position: absolute;
  bottom: 0;
  left: 1.5rem;
  right: 1.5rem;
  padding: 0.75rem 0 1.25rem;
  background-color: transparent;
  z-index: 10;
  border-top: 1px solid var(--ar-border-color, rgba(0, 0, 0, 0.1));
}

[data-bs-theme="dark"] .sidebar-footer {
  border-top-color: rgba(255, 255, 255, 0.1);
}

/* Profile Link */
.sidebar-profile-link {
  display: flex;
  align-items: center;
  padding: 0.875rem 1rem;
  margin-bottom: 0.5rem;
  background-color: transparent;
  border: none;
  color: var(--ar-body-color, #121519);
  opacity: 0.7;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
}

[data-bs-theme="dark"] .sidebar-profile-link {
  color: rgba(255, 255, 255, 0.7);
}

.sidebar-profile-link:hover {
  opacity: 0.9;
  background-color: rgba(0, 0, 0, 0.05);
}

[data-bs-theme="dark"] .sidebar-profile-link:hover {
  color: rgba(255, 255, 255, 0.9);
  background-color: rgba(255, 255, 255, 0.05);
}

.sidebar-profile-link.active {
  opacity: 1;
  background-color: rgba(var(--ar-primary-rgb), 0.15);
  border-left: 3px solid #fdd835;
  padding-left: calc(1rem - 3px);
  color: var(--ar-primary, #c62828);
}

[data-bs-theme="dark"] .sidebar-profile-link.active {
  color: var(--ar-primary, #ef5350);
  background-color: rgba(var(--ar-primary-rgb), 0.18);
}

.profile-avatar-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 600;
  background-size: cover;
  background-position: center;
}

.avatar-initials {
  color: white;
}

/* Déconnexion : bouton visuellement identique aux liens (pas de cadre type btn) */
button.sidebar-nav-link {
  font: inherit;
  appearance: none;
  -webkit-appearance: none;
}

.sidebar-logout-link {
  margin-bottom: 0 !important;
}

.sidebar-logout-link:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--ar-danger, #ed5050);
}

[data-bs-theme="dark"] .sidebar-logout-link:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: #ff8a80;
}

/* Main Wrapper */
.seller-main-wrapper {
  margin-left: 280px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Fixed Header */
.seller-header-fixed {
  position: fixed;
  top: 0;
  left: 280px;
  right: 0;
  height: 70px;
  background-color: var(--ar-body-bg, #fff);
  border-bottom: 1px solid var(--ar-border-color, rgba(0, 0, 0, 0.1));
  z-index: 999;
  display: flex;
  align-items: center;
}

[data-bs-theme="dark"] .seller-header-fixed {
  background-color: #161b22;
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.seller-header-content {
  width: 100%;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.seller-header-title {
  flex: 1;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--ar-emphasis-color, #121519);
  margin: 0;
}

.seller-header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Theme Switcher */
.mode-switch {
  cursor: pointer;
}

/* Content Area */
.seller-content-area {
  margin-top: 70px;
  padding: 2rem;
  flex: 1;
}

/* Responsive */
@media (max-width: 991.98px) {
  .seller-sidebar-fixed {
    position: fixed;
    transform: translateX(-100%);
  }
  
  .seller-main-wrapper {
    margin-left: 0;
  }
  
  .seller-header-fixed {
    left: 0;
  }
  
  .offcanvas-lg.show {
    transform: translateX(0);
  }
  
  .seller-content-area {
    padding: 1.5rem;
  }
}

@media (max-width: 575.98px) {
  .seller-header-content {
    padding: 0 1rem;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
  
  .seller-content-area {
    padding: 1rem;
  }
}
</style>