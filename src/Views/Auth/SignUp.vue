<template>
  <main class="page-wrapper">
    <div class="d-lg-flex position-relative min-vh-100">
      <router-link
        class="text-nav btn btn-icon bg-light border rounded-circle position-absolute top-0 end-0 p-0 mt-3 me-3 mt-sm-4 me-sm-4 z-3"
        to="/"
        data-bs-toggle="tooltip"
        data-bs-placement="left"
        title="Retour à l'accueil"
        aria-label="Retour à l'accueil"
      >
        <i class="ai-home"></i>
      </router-link>

      <div class="d-flex flex-column w-lg-50 px-3 px-lg-5 py-4 py-lg-5" style="height: 100vh; overflow-y: auto; overflow-x: hidden;">
        <div class="w-100 mx-auto" style="max-width: 526px; padding-bottom: 2rem;">
          <h1 class="h3 mb-2">Pas de compte ? Créer un compte</h1>
          <p class="pb-2 mb-3">
            Vous avez déjà un compte ?
            <router-link to="/sign-in">Connectez-vous ici !</router-link>
          </p>
          <form class="needs-validation" novalidate @submit.prevent="handleRegister">
            <div v-if="errorMessage" class="alert alert-danger" role="alert">
              {{ errorMessage }}
            </div>

            <div class="row row-cols-1 row-cols-sm-2 g-3">
              <div class="col">
                <label for="firstName" class="form-label mb-1">Prénom <span class="text-danger">*</span></label>
                <input 
                  v-model.trim="newUser.firstName" 
                  id="firstName"
                  class="form-control" 
                  type="text" 
                  placeholder="Prénom" 
                  autocomplete="given-name" 
                  required
                >
              </div>
              <div class="col">
                <label for="lastName" class="form-label mb-1">Nom <span class="text-danger">*</span></label>
                <input 
                  v-model.trim="newUser.lastName" 
                  id="lastName"
                  class="form-control" 
                  type="text" 
                  placeholder="Nom" 
                  autocomplete="family-name" 
                  required
                >
              </div>
            </div>

            <div class="mb-3">
              <label for="email" class="form-label mb-1">Adresse email <span class="text-danger">*</span></label>
              <input 
                v-model.trim="newUser.email" 
                id="email"
                class="form-control" 
                type="email" 
                placeholder="email@exemple.com" 
                autocomplete="email" 
                required
              >
            </div>

            <div class="mb-3">
              <label for="phone" class="form-label mb-1">Numéro de téléphone</label>
              <input 
                v-model.trim="newUser.phone" 
                id="phone"
                class="form-control" 
                type="tel" 
                placeholder="Numéro de téléphone" 
                autocomplete="tel"
              >
            </div>

            <div class="row row-cols-1 row-cols-sm-2 g-3">
              <div class="col">
                <label for="cin" class="form-label mb-1">CIN</label>
                <input 
                  v-model.trim="newUser.cin" 
                  id="cin"
                  class="form-control" 
                  type="text" 
                  placeholder="CIN (optionnel)"
                >
              </div>
              <div class="col">
                <label for="dateOfBirth" class="form-label mb-1">Date de naissance</label>
                <input 
                  v-model="newUser.dateOfBirth" 
                  id="dateOfBirth"
                  class="form-control" 
                  type="date"
                >
              </div>
            </div>

            <div class="password-toggle mb-3">
              <label for="password" class="form-label mb-1">Mot de passe <span class="text-danger">*</span></label>
              <input 
                v-model="newUser.password" 
                id="password"
                class="form-control" 
                type="password" 
                placeholder="Mot de passe (minimum 6 caractères)" 
                autocomplete="new-password" 
                required
                minlength="6"
              >
              <label class="password-toggle-btn" aria-label="Afficher/masquer le mot de passe">
                <input class="password-toggle-check" type="checkbox">
                <span class="password-toggle-indicator"></span>
              </label>
            </div>

            <div class="password-toggle mb-3">
              <label for="confirmPassword" class="form-label mb-1">Confirmer le mot de passe <span class="text-danger">*</span></label>
              <input 
                v-model="confirmPassword" 
                id="confirmPassword"
                class="form-control" 
                type="password" 
                placeholder="Confirmer le mot de passe" 
                autocomplete="new-password" 
                required
                minlength="6"
              >
              <label class="password-toggle-btn" aria-label="Afficher/masquer le mot de passe">
                <input class="password-toggle-check" type="checkbox">
                <span class="password-toggle-indicator"></span>
              </label>
            </div>

            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="terms" required>
                <label class="form-check-label" for="terms">
                  J'accepte les <a href="#">Conditions générales d'utilisation</a>
                </label>
              </div>
            </div>

            <button class="btn btn-primary w-100 mb-3" type="submit" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ loading ? 'Création en cours...' : 'Créer un compte' }}
            </button>

          </form>
          
          <p class="nav w-100 fs-sm text-center mt-3 mb-0">
            <span class="text-body-secondary">&copy; Tous droits réservés. Réalisé par</span>
            <span class="nav-link d-inline-block p-0 ms-1">Eya Fetni</span>
          </p>
        </div>
      </div>

      <div class="w-lg-50 d-none d-lg-block position-relative">
        <img src="@/assets/img/account/cover.jpg" alt="Photo de couverture" class="img-fluid h-100" style="object-fit: cover;">
      </div>
    </div>

    <a class="btn-scroll-top" href="#top" data-scroll aria-label="Revenir en haut">
      <svg viewBox="0 0 40 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10"></circle>
      </svg>
      <i class="ai-arrow-up"></i>
    </a>
  </main>
</template>

<script>
import axios from 'axios';
import { showSignupWelcomeToast } from '@/utils/toast';

export default {
  name: 'SignUpComponent',
  data() {
    return {
      apiBase: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000',
      newUser: { 
        firstName: '', 
        lastName: '', 
        email: '', 
        phone: '', 
        cin: '',
        dateOfBirth: '',
        password: '' 
      },
      confirmPassword: '',
      loading: false,
      errorMessage: '',
    };
  },
  methods: {
    defaultRouteForRole(role = '') {
      switch (role.toLowerCase()) {
        case 'admin':
          return '/admin';
        case 'seller':
          return '/seller';
        case 'client':
          return '/';
        default:
          return '/';
      }
    },
    validateForm() {
      // Vérifier les champs requis
      if (!this.newUser.firstName || !this.newUser.lastName || !this.newUser.email || !this.newUser.password) {
        this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
        return false;
      }

      // Valider le format de l'email
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(this.newUser.email)) {
        this.errorMessage = 'Veuillez entrer une adresse email valide.';
        return false;
      }

      // Vérifier la longueur du mot de passe
      if (this.newUser.password.length < 6) {
        this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères.';
        return false;
      }

      // Vérifier que les mots de passe correspondent
      if (this.newUser.password !== this.confirmPassword) {
        this.errorMessage = 'Les mots de passe ne correspondent pas.';
        return false;
      }

      return true;
    },
    async handleRegister() {
      this.errorMessage = '';
      if (!this.validateForm()) return;
      this.loading = true;
      
      try {
        // Préparer le payload avec tous les attributs de l'utilisateur
        const payload = {
          firstName: this.newUser.firstName.trim(),
          lastName: this.newUser.lastName.trim(),
          email: this.newUser.email.trim().toLowerCase(),
          password_create: this.newUser.password, // Utiliser password_create pour la création selon le DTO
          role: 'client', // Toujours créer un compte client
        };

        // Ajouter les champs optionnels s'ils sont remplis
        if (this.newUser.phone && this.newUser.phone.trim()) {
          payload.phone = this.newUser.phone.trim();
        }

        if (this.newUser.cin && this.newUser.cin.trim()) {
          payload.cin = this.newUser.cin.trim();
        }

        if (this.newUser.dateOfBirth) {
          payload.dateOfBirth = this.newUser.dateOfBirth;
        }

        const config = {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        };

        // Utiliser le endpoint correct pour l'inscription
        const response = await axios.post(`${this.apiBase}/auth/signup`, payload, config);
        
        const user = response?.data?.user || response?.data;
        const token = response?.data?.access_token || response?.data?.accessToken || response?.data?.token;

        if (token) {
          localStorage.setItem('authToken', token);
        }

        // Nettoyer les données sensibles avant de les stocker
        const safeUser = { ...user };
        delete safeUser.password;

        localStorage.setItem('currentUser', JSON.stringify(safeUser));

        showSignupWelcomeToast(safeUser);

        // Rediriger vers la page d'accueil pour les clients
        this.$router.push('/');
      } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        const status = error?.response?.status;
        const apiMessage = error?.response?.data?.message;

        if (Array.isArray(apiMessage)) {
          this.errorMessage = apiMessage[0];
        } else if (typeof apiMessage === 'string') {
          this.errorMessage = apiMessage;
        } else if (status === 409) {
          this.errorMessage = 'Un utilisateur avec cet email existe déjà.';
        } else if (status === 400) {
          this.errorMessage = 'Données invalides. Veuillez vérifier vos informations.';
        } else if (status === 401 || status === 403) {
          this.errorMessage = 'Inscription non autorisée. Veuillez contacter le support.';
        } else if (status === 404) {
          this.errorMessage = 'Service d\'inscription indisponible. Veuillez réessayer plus tard.';
        } else if (status === 500) {
          this.errorMessage = 'Erreur du serveur. Veuillez réessayer plus tard.';
        } else {
          this.errorMessage = 'Impossible de créer un compte. Veuillez réessayer.';
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.page-wrapper {
  height: 100vh;
  overflow: hidden;
}

.page-wrapper > div {
  height: 100vh;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.form-control {
  font-size: 0.9375rem;
  padding: 0.5rem 0.75rem;
}

.password-toggle {
  position: relative;
}

.password-toggle-btn {
  position: absolute;
  top: 1.9rem;
  right: 0.75rem;
  z-index: 5;
  cursor: pointer;
}

/* Personnaliser la scrollbar pour un look propre */
.d-flex.flex-column.w-lg-50::-webkit-scrollbar {
  width: 8px;
}

.d-flex.flex-column.w-lg-50::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.d-flex.flex-column.w-lg-50::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.d-flex.flex-column.w-lg-50::-webkit-scrollbar-thumb:hover {
  background: #555;
}

@media (max-width: 991.98px) {
  .page-wrapper > div {
    height: auto;
    min-height: 100vh;
  }
  
  .w-lg-50 {
    overflow-y: visible;
  }
}
</style>
