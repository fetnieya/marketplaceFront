<template>
  <section class="following-market-page container py-5 mt-4 mb-lg-4">
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
      <div>
        <h1 class="h2 mb-1">Marchés suivis</h1>
        <p class="text-body-secondary mb-0">
          Les vendeurs que vous suivez depuis le catalogue ou une fiche produit.
        </p>
      </div>
      <span class="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2">
        {{ sellers.length }} vendeur<span v-if="sellers.length !== 1">s</span>
      </span>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-else-if="sellers.length === 0" class="empty-state text-center py-5 rounded-3 border bg-light">
      <i class="ai-heart fs-1 d-block mb-3 text-body-secondary"></i>
      <p class="fs-5 text-muted mb-2">Vous ne suivez encore aucun vendeur.</p>
      <p class="text-muted mb-4">
        Ouvrez une annonce et utilisez le bouton <strong>Suivre</strong> sur la fiche du vendeur.
      </p>
      <router-link to="/catalog" class="btn btn-primary rounded-pill px-4">Parcourir le catalogue</router-link>
    </div>

    <div v-else class="row g-4">
      <div v-for="item in sellers" :key="item.sellerId" class="col-12 col-md-6 col-xl-4">
        <div class="seller-follow-card h-100 rounded-3 border p-4 d-flex flex-column">
          <div class="d-flex align-items-center mb-3">
            <div class="avatar-circle me-3 flex-shrink-0 overflow-hidden">
              <img
                v-if="item.sellerPhoto"
                :src="item.sellerPhoto"
                alt=""
                class="w-100 h-100 object-fit-cover"
              />
              <span v-else>{{ sellerInitials(item) }}</span>
            </div>
            <div class="min-w-0 flex-grow-1">
              <h2 class="h6 mb-1 text-truncate">{{ item.displayName }}</h2>
              <div class="small text-body-secondary text-truncate">{{ item.email }}</div>
            </div>
          </div>
          <p v-if="item.createdAt" class="small text-muted mb-3">
            Suivi depuis le {{ formatDate(item.createdAt) }}
          </p>
          <div class="mt-auto d-flex flex-wrap gap-2">
            <router-link
              :to="{ name: 'SellerStore', params: { sellerId: String(item.sellerId) } }"
              class="btn btn-outline-primary btn-sm rounded-pill"
            >
              Voir la boutique
            </router-link>
            <button
              type="button"
              class="btn btn-outline-danger btn-sm rounded-pill"
              @click="unfollow(item)"
            >
              Ne plus suivre
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FollowingMarket',
  data() {
    return {
      apiBase: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000',
      sellers: [],
      loading: true,
      error: null,
    };
  },
  methods: {
    getAuthHeaders() {
      const token = localStorage.getItem('authToken');
      return token ? { Authorization: `Bearer ${token}` } : {};
    },

    async fetchFollowing() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${this.apiBase}/followers/following`, {
          headers: this.getAuthHeaders(),
          withCredentials: true,
        });
        this.sellers = Array.isArray(response.data) ? response.data : [];
      } catch (e) {
        console.error(e);
        this.error = 'Impossible de charger vos marchés suivis.';
        this.sellers = [];
      } finally {
        this.loading = false;
      }
    },

    sellerInitials(item) {
      const name = item.displayName || item.email || '';
      const parts = String(name).trim().split(/\s+/);
      if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
      }
      return (parts[0][0] + parts[1][0]).toUpperCase();
    },

    formatDate(value) {
      if (!value) return '';
      try {
        return new Date(value).toLocaleDateString('fr-FR');
      } catch {
        return value;
      }
    },

    async unfollow(item) {
      if (!confirm(`Ne plus suivre ${item.displayName} ?`)) return;
      try {
        await axios.delete(`${this.apiBase}/followers/by-seller/${item.sellerId}`, {
          headers: this.getAuthHeaders(),
          withCredentials: true,
        });
        this.sellers = this.sellers.filter((s) => s.sellerId !== item.sellerId);
      } catch (e) {
        console.error(e);
        if (typeof alert === 'function') {
          alert('Impossible de mettre à jour. Réessayez.');
        }
      }
    },
  },
  created() {
    this.fetchFollowing();
  },
};
</script>

<style scoped>
.following-market-page {
  max-width: 1200px;
}

.empty-state {
  padding: 3rem 1.5rem;
}

.seller-follow-card {
  background: var(--ar-body-bg, #fff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

[data-bs-theme='dark'] .seller-follow-card {
  background: #161b22;
  border-color: rgba(255, 255, 255, 0.08) !important;
}

[data-bs-theme='dark'] .empty-state {
  background: #161b22 !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}

.avatar-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #c62828, #e57373);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
}
</style>
