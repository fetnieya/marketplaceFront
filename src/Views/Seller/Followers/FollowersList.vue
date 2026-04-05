<template>
  <div class="followers-management">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h2 mb-0">Gestion des abonnés</h1>
      <span class="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2">
        {{ filteredFollowers.length }} abonné<span v-if="filteredFollowers.length > 1">s</span>
      </span>
    </div>

    <!-- Search + filters (same style as gestion des annonces) -->
    <div class="filter-section mb-4">
      <div class="row g-3 align-items-end">
        <!-- Recherche par nom / email -->
        <div class="col-md-6">
          <label class="form-label small mb-1">Recherche</label>
          <div class="input-group input-group-sm">
            <span class="input-group-text">
              <i class="ai-search"></i>
            </span>
            <input
              type="text"
              class="form-control"
              placeholder="Rechercher par nom ou email..."
              v-model="searchQuery"
            />
            <button
              v-if="searchQuery"
              class="btn btn-outline-secondary"
              type="button"
              @click="searchQuery = ''"
            >
              <i class="ai-x"></i>
            </button>
          </div>
        </div>

        <!-- Filtre rapide par type -->
        <div class="col-md-3">
          <label class="form-label small mb-1">Type</label>
          <select
            class="form-select form-select-sm"
            v-model="selectedType"
          >
            <option value="">Tous les abonnés</option>
            <option value="recent">Les plus récents</option>
            <option value="old">Les plus anciens</option>
          </select>
        </div>

        <!-- Bouton réinitialiser -->
        <div class="col-md-3">
          <button
            v-if="searchQuery || selectedType"
            class="btn btn-outline-secondary btn-sm w-100"
            type="button"
            @click="resetFilters"
          >
            <i class="ai-rotate-cw me-1"></i>Réinitialiser
          </button>
        </div>
      </div>

      <div v-if="searchQuery || selectedType" class="text-muted small mt-2">
        {{ filteredFollowers.length }} abonné(s) trouvé(s)
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredFollowers.length === 0" class="empty-state text-center py-5">
      <i class="ai-user-group fs-1 d-block mb-3 opacity-50"></i>
      <p class="fs-5 text-muted mb-2">Vous n'avez pas encore d'abonnés.</p>
      <p class="text-muted mb-0">
        Les clients qui cliquent sur le bouton <strong>Suivre</strong> sur vos annonces
        apparaîtront automatiquement ici.
      </p>
    </div>

    <!-- Liste des abonnés (tableau) -->
    <div v-else class="followers-list-wrap rounded-3 border bg-body overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover followers-table mb-0 align-middle">
          <thead class="table-light">
            <tr>
              <th scope="col" class="ps-3">Abonné</th>
              <th scope="col" class="d-none d-md-table-cell">E-mail</th>
              <th scope="col" class="d-none d-lg-table-cell">Téléphone</th>
              <th scope="col" class="text-nowrap">Depuis</th>
              <th scope="col" class="text-end pe-3">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="follower in filteredFollowers" :key="follower.id">
              <td class="ps-3">
                <div class="d-flex align-items-center gap-2">
                  <div class="avatar-circle flex-shrink-0">
                    <span>{{ getInitials(follower) }}</span>
                  </div>
                  <div class="min-w-0">
                    <div class="fw-semibold text-truncate">
                      {{ follower.fullName || follower.name || follower.email }}
                    </div>
                    <div class="text-muted small d-md-none text-truncate">
                      {{ follower.email }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="d-none d-md-table-cell text-body-secondary small">
                {{ follower.email }}
              </td>
              <td class="d-none d-lg-table-cell text-body-secondary small">
                <span v-if="follower.phone"><i class="ai-phone me-1 opacity-75"></i>{{ follower.phone }}</span>
                <span v-else class="text-muted">—</span>
              </td>
              <td>
                <span v-if="follower.createdAt" class="badge bg-success-subtle text-success">
                  {{ formatDate(follower.createdAt) }}
                </span>
                <span v-else class="text-muted">—</span>
              </td>
              <td class="text-end pe-3">
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="removeFollower(follower)"
                >
                  <i class="ai-user-minus me-1"></i> Retirer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FollowersList',
  data() {
    return {
      apiBase: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000',
      followers: [],
      loading: true,
      error: null,
      searchQuery: '',
      selectedType: '',
    };
  },
  computed: {
    filteredFollowers() {
      let list = [...this.followers];

      // Recherche par nom / email
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        list = list.filter((f) => {
          const name = (f.fullName || f.name || '').toLowerCase();
          const email = (f.email || '').toLowerCase();
          return name.includes(q) || email.includes(q);
        });
      }

      // Tri simple selon le type
      if (this.selectedType === 'recent') {
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      } else if (this.selectedType === 'old') {
        list.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
      }

      return list;
    },
  },
  methods: {
    getCurrentSellerId() {
      try {
        const storedUser = localStorage.getItem('currentUser');
        const user = storedUser ? JSON.parse(storedUser) : null;
        return user?.id || null;
      } catch (error) {
        console.error('Unable to read current user from storage', error);
        return null;
      }
    },

    async fetchFollowers() {
      this.loading = true;
      this.error = null;
      try {
        const sellerId = this.getCurrentSellerId();
        if (!sellerId) {
          throw new Error('Compte vendeur non trouvé. Veuillez vous reconnecter.');
        }

        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${this.apiBase}/followers`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });
        this.followers = response.data || [];
      } catch (error) {
        console.error('Error fetching followers:', error);
        this.error =
          'Erreur lors du chargement des abonnés. Vérifiez que l’API des followers est bien configurée.';
      } finally {
        this.loading = false;
      }
    },

    async removeFollower(follower) {
      if (!confirm(`Retirer ${follower.fullName || follower.name || follower.email} de vos abonnés ?`)) {
        return;
      }
      try {
        const token = localStorage.getItem('authToken');
        await axios.delete(`${this.apiBase}/followers/${follower.id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });
        this.followers = this.followers.filter((f) => f.id !== follower.id);
      } catch (error) {
        console.error('Error removing follower:', error);
        alert("Erreur lors de la suppression de l'abonné.");
      }
    },

    resetFilters() {
      this.searchQuery = '';
      this.selectedType = '';
    },

    getInitials(follower) {
      const name = follower.fullName || follower.name || follower.email || '';
      const parts = name.trim().split(' ');
      if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
      }
      return (parts[0][0] + parts[1][0]).toUpperCase();
    },

    formatDate(value) {
      if (!value) return '';
      try {
        const d = new Date(value);
        return d.toLocaleDateString('fr-FR');
      } catch {
        return value;
      }
    },
  },
  created() {
    this.fetchFollowers();
  },
};
</script>

<style scoped>
.followers-management {
  width: 100%;
}

.filter-section {
  background-color: var(--ar-secondary-bg, #f6f9fc);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--ar-border-color, rgba(0, 0, 0, 0.1));
}

[data-bs-theme='dark'] .filter-section {
  background-color: #1c2128;
  border-color: rgba(255, 255, 255, 0.1);
}

.followers-list-wrap {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.followers-table thead th {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  font-weight: 600;
  color: var(--ar-secondary-color, #6c757d);
  border-bottom-width: 1px;
}

.followers-table tbody tr:last-child td {
  border-bottom: 0;
}

[data-bs-theme='dark'] .followers-table thead {
  --bs-table-bg: #21262d;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #c62828, #e57373);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  font-size: 0.85rem;
}

.empty-state {
  padding: 3rem 1.5rem;
}
</style>

