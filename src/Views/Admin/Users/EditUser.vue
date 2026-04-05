<template>
  <div class="d-flex align-items-center justify-content-center min-vh-100 bg-light">
    <div class="col-lg-6 col-md-8 col-sm-10 bg-white shadow p-4 rounded">
      <h1 class="h2 mb-4 text-center">{{ editTitle }}</h1>
      <form @submit.prevent="handleSubmit">
        <div class="container">
          <div class="mb-3">
            <label for="first-name-input" class="form-label">Prénom</label>
            <input
              v-model="user.firstName"
              class="form-control"
              type="text"
              id="first-name-input"
              placeholder="First Name"
            />
          </div>

          <div class="mb-3">
            <label for="last-name-input" class="form-label">Nom</label>
            <input
              v-model="user.lastName"
              class="form-control"
              type="text"
              id="last-name-input"
              placeholder="Last Name"
            />
          </div>

          <div class="mb-3">
            <label for="email-input" class="form-label">Email</label>
            <input
              v-model="user.email"
              class="form-control"
              type="email"
              id="email-input"
              placeholder="email@example.com"
            />
          </div>

          <div class="mb-3">
            <label for="tel-input" class="form-label">Téléphone</label>
            <input
              v-model="user.phone"
              class="form-control"
              type="tel"
              id="tel-input"
              placeholder="12345678"
            />
          </div>

          <div class="mb-3">
            <label for="cin-input" class="form-label">CIN</label>
            <input
              v-model="user.cin"
              class="form-control"
              type="text"
              id="cin-input"
              placeholder="AB123456"
            />
          </div>

          <div class="mb-3">
            <label for="dob-input" class="form-label">Date de naissance</label>
            <input
              v-model="user.dateOfBirth"
              class="form-control"
              type="date"
              id="dob-input"
            />
          </div>

          <div class="d-flex justify-content-center mt-3">
            <button type="submit" class="btn btn-primary mx-2">Enregistrer</button>
            <router-link :to="listPath" class="btn btn-secondary mx-2">Annuler</router-link>
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
  name: 'EditUser',
  computed: {
    isSeller() {
      return this.$route.path.includes('/editSeller');
    },
    isClientEdit() {
      return this.$route.path.includes('/editClient');
    },
    listPath() {
      if (this.isSeller) return '/sellers';
      if (this.isClientEdit) return '/clients';
      return '/admin';
    },
    editTitle() {
      if (this.isSeller) return 'Modifier le vendeur';
      return 'Modifier le client';
    },
    apiBase() {
      return process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
    },
  },
  data() {
    return {
      user: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        cin: '',
        dateOfBirth: '',
      },
    };
  },
  methods: {
    async fetchUserDetails() {
      const userId = this.$route.params.id;
      console.log(userId);
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`http://localhost:3000/users/${userId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });
        this.user = response.data;
        // Convertir la date de naissance au format YYYY-MM-DD pour l'input date
        if (this.user.dateOfBirth) {
          const date = new Date(this.user.dateOfBirth);
          this.user.dateOfBirth = date.toISOString().split('T')[0];
        }
      } catch (error) {
        console.error('Error fetching user details:', error.response || error.message);
        toast.error('Échec du chargement des détails');
      }
    },
    async handleSubmit() {
      const userId = this.$route.params.id; 
      console.log(this.$route.params.id);
      try {
        const token = localStorage.getItem('authToken');
        await axios.put(`${this.apiBase}/users/${userId}`, this.user, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });
        toast.success(this.isSeller ? 'Vendeur modifié avec succès' : 'Client modifié avec succès');
        this.$router.push(this.listPath);
      } catch (error) {
        console.error('Error updating user:', error);
        toast.error(
          this.isSeller ? 'Échec de la modification du vendeur' : 'Échec de la modification du client',
        );
      }
    },
  },
  mounted() {
    this.fetchUserDetails();
  },
};
</script>
