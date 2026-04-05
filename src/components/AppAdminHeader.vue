<template>
    <!-- Page wrapper -->
    <main class="page-wrapper">

        <!-- Navbar. Remove 'fixed-top' class to make the navigation bar scrollable with the page -->
        <header class="navbar navbar-expand-lg fixed-top bg-light">
            <div class="container">

                <!-- Navbar brand (Logo) -->
                <router-link class="navbar-brand d-flex align-items-center py-2 py-lg-1 pe-sm-3" to="/admin">
                    <AsmadLogo :icon-size="76" :hide-tagline="true" />
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
                  
                <!-- User signed in state. Account dropdown on screens > 576px -->
                <div class="dropdown nav d-none d-sm-block order-lg-3">
                    <a class="nav-link d-flex align-items-center p-0" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                        <img class="border rounded-circle" src="" width="48" alt="Isabella Bocouse">
                        <div class="ps-2">
                            <div class="fs-xs lh-1 opacity-60">Hello,</div>
                            <div class="fs-sm dropdown-toggle">Isabella</div>
                        </div>
                    </a>
                    <div class="dropdown-menu dropdown-menu-end my-1">
                        <h6 class="dropdown-header fs-xs fw-medium text-body-secondary text-uppercase pb-1">Account</h6>
                        <router-link class="dropdown-item" to="/profile">
                            <i class="ai-user-check fs-lg opacity-70 me-2"></i> Overview
                        </router-link>
                        <router-link class="dropdown-item" to="/settingAdmin">
                            <i class="ai-settings fs-lg opacity-70 me-2"></i> Settings
                        </router-link>
                        <button class="dropdown-item d-flex align-items-center" type="button" @click="logout">
                            <i class="ai-logout fs-lg opacity-70 me-2"></i> Sign out
                        </button>
                    </div>
                </div>

                  
                </div>

                <!-- Mobile menu toggler (Hamburger) -->
                <button class="navbar-toggler ms-sm-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

         


            </div>
  </header>
    </main>
</template>
<script>
import AsmadLogo from './AsmadLogo.vue';
export default {
    name : 'AppAdminHeader',
    components: { AsmadLogo },
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

    logout() {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      this.$router.push('/sign-in');
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
  },
};
</script>
