<template>
    <!-- Page wrapper -->
    <main class="page-wrapper">

        <!-- Navbar. Remove 'fixed-top' class to make the navigation bar scrollable with the page -->
        <header class="navbar navbar-expand-lg fixed-top bg-light">
            <div class="container">

                <!-- Navbar brand (Logo) -->
                <router-link class="navbar-brand pe-sm-3" to="/admin">
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
                        <router-link class="dropdown-item" to="/overviewAdmin">
                            <i class="ai-user-check fs-lg opacity-70 me-2"></i> Overview
                        </router-link>
                        <router-link class="dropdown-item" to="/settingAdmin">
                            <i class="ai-settings fs-lg opacity-70 me-2"></i> Settings
                        </router-link>
                        <router-link class="dropdown-item" to="/sign-in">
                            <i class="ai-logout fs-lg opacity-70 me-2"></i> Sign out
                        </router-link>
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
export default {
    name : 'AppAdminHeader',
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