<template>
    <!-- Page wrapper -->
    <main class="page-wrapper">
      <div class="d-lg-flex position-relative h-100">

        <!-- Home button -->
        <router-link class="text-nav btn btn-icon bg-light border rounded-circle position-absolute top-0 end-0 p-0 mt-3 me-3 mt-sm-4 me-sm-4" to="/" data-bs-toggle="tooltip" data-bs-placement="left" title="Retour à l'accueil" aria-label="Retour à l'accueil">
          <i class="ai-home"></i>
        </router-link>

        <!-- Sign in form -->
        <div class="d-flex flex-column align-items-center w-lg-50 h-100 px-3 px-lg-5 pt-5">
          <div class="w-100 mt-auto" style="max-width: 526px;">
            <h1>Connexion à Asmad</h1>
            <p class="pb-3 mb-3 mb-lg-4">Vous n'avez pas encore de compte ?&nbsp;&nbsp;<router-link to="/sign-up">Inscrivez-vous ici !</router-link></p>
            <form class="needs-validation" novalidate @submit.prevent="handleLogin">
              <div v-if="errorMessage" class="alert alert-danger" role="alert">
                {{ errorMessage }}
              </div>
              <div class="pb-3 mb-3">
                <div class="position-relative">
                  <i class="ai-mail fs-lg position-absolute top-50 start-0 translate-middle-y ms-3"></i>
                  <input
                    v-model.trim="email"
                    class="form-control form-control-lg ps-5"
                    type="email"
                    placeholder="Adresse e-mail"
                    autocomplete="email"
                    required
                  >
                </div>
              </div>
              <div class="mb-4">
                <div class="position-relative">
                  <i class="ai-lock-closed fs-lg position-absolute top-50 start-0 translate-middle-y ms-3"></i>
                  <div class="password-toggle">
                    <input
                      v-model="password"
                      class="form-control form-control-lg ps-5"
                      type="password"
                      placeholder="Mot de passe"
                      autocomplete="current-password"
                      required
                    >
                    <label class="password-toggle-btn" aria-label="Afficher/masquer le mot de passe">
                      <input class="password-toggle-check" type="checkbox"><span class="password-toggle-indicator"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="d-flex flex-wrap align-items-center justify-content-between pb-4">
                <div class="form-check my-1">
                  <input class="form-check-input" type="checkbox" id="keep-signedin">
                  <label class="form-check-label ms-1" for="keep-signedin">Rester connecté</label>
                </div>
                <router-link class="fs-sm fw-semibold text-decoration-none my-1" to="/resetPass">Mot de passe oublié ?</router-link>
              </div>
              <button class="btn btn-lg btn-primary w-100 mb-4" type="submit" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Se connecter
              </button>

            </form>
          </div>

          <!-- Copyright -->
          <p class="nav w-100 fs-sm pt-5 mt-auto mb-5" style="max-width: 526px;"><span class="text-body-secondary">&copy; Tous droits réservés. Réalisé par</span><span class="nav-link d-inline-block p-0 ms-1">Eya Fetni</span></p>
        </div>

        
        <!-- Cover image -->
        <div class="w-50">
    <img src="@/assets/img/account/cover.jpg" alt="Cover Photo" class="img-fluid">
  </div>      </div>
    </main>


    <!-- Back to top button -->
    <a class="btn-scroll-top" href="#top" data-scroll aria-label="Scroll back to top">
      <svg viewBox="0 0 40 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10"></circle>
      </svg>
      <i class="ai-arrow-up"></i>
    </a>

</template>
<script>
import axios from 'axios';
import { showLoginWelcomeToast } from '@/utils/toast';

export default {
  name: 'SignInComponent',
  data() {
    return {
      apiBase: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000',
      email: '',
      password: '',
      loading: false,
      errorMessage: '',
    };
  },
  methods: {
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
    async handleLogin() {
      this.errorMessage = '';

      if (!this.email || !this.password) {
        this.errorMessage = 'Veuillez saisir votre e-mail et votre mot de passe.';
        return;
      }

      this.loading = true;
      try {
        const credentials = { email: this.email, password: this.password };
        const config = {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        };

        // Try common auth endpoints before falling back to a plain users lookup
        const endpoints = [
          { method: 'post', url: `${this.apiBase}/auth/login` },
          { method: 'post', url: `${this.apiBase}/login` },
          { method: 'post', url: `${this.apiBase}/auth/signin` },
          { method: 'get', url: `${this.apiBase}/users`, params: credentials },
        ];

        let userProfile = null;
        let token = null;

        for (const endpoint of endpoints) {
          try {
            const response = endpoint.method === 'get'
              ? await axios.get(endpoint.url, { ...config, params: endpoint.params || credentials })
              : await axios.post(endpoint.url, credentials, config);

            const data = response.data;
            const candidateUser = Array.isArray(data) ? data[0] : data?.user || data?.data || data;
            const candidateToken = data?.access_token || data?.accessToken || data?.token;

            if (candidateUser) {
              userProfile = { ...candidateUser };
              token = candidateToken || token;
              break;
            }
          } catch (err) {
            const status = err?.response?.status;
            if (status === 401 || status === 403 || status === 404) {
              continue; // try the next endpoint
            }
            throw err; // unexpected errors should bubble
          }
        }

        if (!userProfile) {
          this.errorMessage = 'E-mail ou mot de passe invalide.';
          return;
        }

        if (token) {
          localStorage.setItem('authToken', token);
        }

        userProfile = { ...userProfile, role: userProfile.role || 'client' };
        delete userProfile.password;
        localStorage.setItem('currentUser', JSON.stringify(userProfile));

        showLoginWelcomeToast(userProfile);

        const redirectTo = this.$route.query.redirect;
        this.$router.push(redirectTo || this.defaultRouteForRole(userProfile.role));
      } catch (error) {
        console.error('Error signing in:', error);
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          this.errorMessage = 'Accès refusé. Veuillez vérifier vos identifiants.';
        } else if (status === 404) {
          this.errorMessage = 'Service de connexion indisponible. Veuillez réessayer plus tard.';
        } else {
          this.errorMessage = 'Impossible de se connecter. Veuillez réessayer.';
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
