<template>
  <!-- Full-page container -->
  <div class="d-flex align-items-center justify-content-center min-vh-100 bg-light">
    <!-- Form container -->
    <div class="col-lg-6 col-md-8 col-sm-10 bg-white shadow p-4 rounded">
      <h1 class="h2 mb-4 text-center">Ajouter un vendeur</h1>
      <form @submit.prevent="addUser">
        <div class="container">
          <!-- Text input -->
          <div class="mb-3">
            <label for="first-name-input" class="form-label">Prénom</label>
            <input
              v-model="newUser.firstName"
              class="form-control"
              type="text"
              id="first-name-input"
              placeholder="John"
              required
            />
          </div>

          <div class="mb-3">
            <label for="last-name-input" class="form-label">Nom</label>
            <input
              v-model="newUser.lastName"
              class="form-control"
              type="text"
              id="last-name-input"
              placeholder="Doe"
              required
            />
          </div>

          <!-- Email input -->
          <div class="mb-3">
            <label for="email-input" class="form-label">Email</label>
            <input
              v-model="newUser.email"
              class="form-control"
              type="email"
              id="email-input"
              placeholder="email@example.com"
              required
              :class="{'is-invalid': emailError}"
            />
            <div v-if="emailError" class="invalid-feedback">
              Please enter a valid email.
            </div>
          </div>

          <!-- Phone Input -->
          <div class="mb-3">
            <label for="tel-input" class="form-label">Téléphone</label>
            <input
              v-model="newUser.phone"
              class="form-control"
              type="tel"
              id="tel-input"
              placeholder="12345678"
              required
            />
          </div>

          <!-- CIN Input -->
          <div class="mb-3">
            <label for="cin-input" class="form-label">CIN</label>
            <input
              v-model="newUser.cin"
              class="form-control"
              type="text"
              id="cin-input"
              placeholder="AB123456"
              required
            />
          </div>

          <!-- Date of Birth Input -->
          <div class="mb-3">
            <label for="dob-input" class="form-label">Date de naissance</label>
            <input
              v-model="newUser.dateOfBirth"
              class="form-control"
              type="date"
              id="dob-input"
              required
            />
          </div>

          <!-- Button Container -->
          <div class="d-flex justify-content-center mt-3">
            <!-- Primary solid button -->
            <button type="submit" class="btn btn-primary mx-2" :disabled="submitting">
              {{ submitting ? 'Ajout en cours...' : 'Ajouter' }}
            </button>
            <!-- Secondary solid button -->
            <router-link to="/sellers">
              <button type="button" class="btn btn-secondary mx-2" :disabled="submitting">Annuler</button>
            </router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { toast } from '@/utils/toast';

export default {
  name: 'AddUser',
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
      },
      emailError: false, // Flag for email validation error
      submitting: false, // Flag to prevent double submission
    };
  },
  methods: {
    validateEmail() {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      this.emailError = !emailRegex.test(this.newUser.email);
      return !this.emailError;
    },
    async addUser() {
      // Prevent double submission
      if (this.submitting) {
        return;
      }

      // Validate email before submitting
      if (!this.validateEmail()) {
        return;
      }

      this.submitting = true;
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          toast.error('Vous devez être connecté pour ajouter un vendeur.');
          this.$router.push('/sign-in');
          return;
        }

        const userData = {
          ...this.newUser,
          role: 'seller',
        };

        const response = await axios.post(`${this.apiBase}/users`, userData, {
          headers: { 
            Authorization: `Bearer ${token}` 
          },
          withCredentials: true,
        });

        console.log('User added successfully:', response.data);
        toast.success('Vendeur ajouté avec succès');
        
        // Reset form
        this.newUser = { firstName: '', lastName: '', email: '', phone: '', cin: '', dateOfBirth: '' };
        
        // Navigate back to list
        this.$router.push('/sellers');
      } catch (error) {
        console.error('Error adding user:', error);
        
        // Better error handling
        let errorMessage = "Échec de l'ajout du vendeur.";
        
        if (error?.response?.status === 401) {
          errorMessage = 'Vous n\'êtes pas autorisé à effectuer cette action. Veuillez vous reconnecter.';
          this.$router.push('/sign-in');
        } else if (error?.response?.status === 409 || error?.response?.status === 400) {
          errorMessage = error?.response?.data?.message || 'Les données fournies sont invalides.';
        } else if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        toast.error(errorMessage);
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>


<style scoped>
/* Ensuring the parent container takes full height */
.min-vh-100 {
  min-height: 100vh;
}
.bg-light {
  background-color: #f8f9fa !important;
}
.is-invalid {
  border-color: #dc3545 !important;
}
.invalid-feedback {
  color: #dc3545;
}
</style>
