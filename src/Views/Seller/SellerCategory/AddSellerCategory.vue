<template>
  <div class="announcements-management">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h2 mb-0">Demander une nouvelle catégorie</h1>
      <router-link to="/sellerCategory">
        <button type="button" class="btn btn-outline-secondary">
          <i class="ai-x me-1"></i>Annuler
        </button>
      </router-link>
    </div>

    <!-- Form card (style proche de 'Créer une annonce') -->
    <div class="card border-0 shadow-sm p-4">
      <p class="text-muted small mb-4">
        Utilisez ce formulaire pour proposer une nouvelle catégorie à l’administrateur.
      </p>

      <form @submit.prevent="submitRequest">
          <!-- Nom de la catégorie -->
          <div class="mb-3">
            <label for="category-label" class="form-label fw-semibold">
              Nom de la catégorie <span class="text-danger">*</span>
            </label>
            <input
              class="form-control"
              type="text"
              id="category-label"
              v-model="label"
              placeholder="Ex: Produits artisanaux"
              required
            >
          </div>
  
          <!-- Description -->
          <div class="form-floating mb-3">
            <textarea
              class="form-control"
              id="category-description"
              style="height: 140px;"
              v-model="description"
              placeholder="Décrivez le type de produits pour cette catégorie..."
              required
            ></textarea>
            <label for="category-description">Description de la catégorie</label>
          </div>

          <div v-if="error" class="alert alert-danger py-2 px-3 mb-3">
            {{ error }}
          </div>
          <div v-if="success" class="alert alert-success py-2 px-3 mb-3">
            {{ success }}
          </div>
  
          <!-- Buttons -->
          <div class="d-flex justify-content-end mt-3">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              Envoyer la demande
            </button>
          </div>
      </form>
    </div>
  </div>
</template>
  
  <script>
  import axios from 'axios';

  export default {
    name: 'AddSellerCategory',
    data() {
      return {
        apiBase: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000',
        label: '',
        description: '',
        loading: false,
        error: null,
        success: null,
      };
    },
    methods: {
      getCurrentSeller() {
        try {
          const storedUser = localStorage.getItem('currentUser');
          return storedUser ? JSON.parse(storedUser) : null;
        } catch (e) {
          console.error('Unable to read current user from storage', e);
          return null;
        }
      },

      async submitRequest() {
        this.error = null;
        this.success = null;
        this.loading = true;

        try {
          const seller = this.getCurrentSeller();
          if (!seller) {
            this.error = 'Impossible de trouver le compte vendeur. Veuillez vous reconnecter.';
            this.loading = false;
            return;
          }

          const payload = {
            label: this.label,
            description: this.description,
            sellerId: seller.id,
            sellerEmail: seller.email,
            sellerName: `${seller.firstName || ''} ${seller.lastName || ''}`.trim() || seller.email,
          };

          // Endpoint backend à implémenter côté API pour envoyer l'email à l’admin
          const token = localStorage.getItem('authToken');
          await axios.post(`${this.apiBase}/category-requests`, payload, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            withCredentials: true,
          });

          this.success = 'Votre demande de nouvelle catégorie a été envoyée à l’administrateur.';

          setTimeout(() => {
            this.$router.push('/sellerCategory');
          }, 1200);
        } catch (error) {
          console.error('Error sending category request:', error);
          this.error =
            "Erreur lors de l’envoi de la demande. Vérifiez que l’API des demandes de catégorie est bien configurée.";
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .announcements-management {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
  }
  </style>
  