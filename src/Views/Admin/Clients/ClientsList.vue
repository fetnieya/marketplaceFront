<template>
  <div class="admin-page-content">
    <!-- Barre de recherche (même esprit que vendeurs) -->
    <div class="mb-4">
      <div class="input-group clients-search-input">
        <span class="input-group-text bg-white border-end-0">
          <i class="ai-search text-body-secondary"></i>
        </span>
        <input
          type="search"
          class="form-control border-start-0 ps-0"
          placeholder="Rechercher un client (nom, prénom, email, téléphone, CIN)..."
          v-model="searchQuery"
          @input="onSearch"
          autocomplete="off"
        />
        <button
          v-if="searchQuery"
          class="btn btn-outline-secondary border-start-0"
          type="button"
          @click="clearSearch"
          aria-label="Effacer"
        >
          <i class="ai-x"></i>
        </button>
      </div>
      <div v-if="searchQuery && filteredClients.length > 0" class="text-muted small mt-2">
        {{ filteredClients.length }} résultat(s)
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <div v-else class="table-responsive clients-table-wrap">
      <table class="table table-hover align-middle mb-0 clients-table">
        <thead>
          <tr>
            <th scope="col">Prénom</th>
            <th scope="col">Nom</th>
            <th scope="col">E-mail</th>
            <th scope="col">Téléphone</th>
            <th scope="col">CIN</th>
            <th scope="col">Date de naissance</th>
            <th scope="col" class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in paginatedClients" :key="client.id">
            <td>{{ client.firstName }}</td>
            <td>{{ client.lastName }}</td>
            <td>{{ client.email }}</td>
            <td>{{ client.phone || 'N/A' }}</td>
            <td>{{ client.cin || 'N/A' }}</td>
            <td>{{ client.dateOfBirth ? formatDate(client.dateOfBirth) : 'N/A' }}</td>
            <td>
              <div class="action-buttons">
                <button
                  type="button"
                  class="btn btn-action btn-view"
                  title="Voir les détails"
                  @click="viewClient(client)"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span class="visually-hidden">Voir</span>
                </button>
                <router-link
                  :to="`/editClient/${client.id}`"
                  class="btn btn-action btn-edit"
                  title="Modifier"
                >
                  <i class="ai-edit"></i>
                </router-link>
                <button
                  type="button"
                  class="btn btn-action btn-delete"
                  title="Supprimer"
                  @click="confirmDelete(client)"
                >
                  <i class="ai-trash"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedClients.length === 0 && !error">
            <td colspan="7" class="text-center py-5 text-body-secondary">
              <i class="ai-user fs-1 d-block mb-3 opacity-50"></i>
              <p class="mb-0 fs-6">{{ searchQuery ? 'Aucun résultat' : 'Aucun client pour le moment' }}</p>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="error" class="alert alert-danger mt-3" role="alert">
        {{ error }}
        <button type="button" class="btn btn-link p-0 ms-2" @click="fetchClients">Réessayer</button>
      </div>

      <div v-if="filteredClients.length > 0" class="text-center text-muted small mt-4">
        {{ filteredClients.length }} client(s)
        <span v-if="totalPagesComputed > 1"> — Page {{ currentPage }} / {{ totalPagesComputed }}</span>
      </div>

      <nav v-if="totalPagesComputed > 1" class="mt-3" aria-label="Pagination">
        <ul class="pagination justify-content-center mb-0">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a href="#" class="page-link" @click.prevent="prevPage">Précédent</a>
          </li>
          <li
            v-for="page in displayedPages"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }"
          >
            <a href="#" class="page-link" @click.prevent="goToPage(page)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPagesComputed }">
            <a href="#" class="page-link" @click.prevent="nextPage">Suivant</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>

  <!-- Suppression -->
  <div class="modal fade" id="deleteClientModal" tabindex="-1" aria-labelledby="deleteClientModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="deleteClientModalLabel">Confirmer la suppression</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
        </div>
        <div class="modal-body">
          Supprimer le client
          <strong>{{ selectedClient?.firstName }} {{ selectedClient?.lastName }}</strong>
          &nbsp;? Cette action est définitive.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
          <button type="button" class="btn btn-danger" :disabled="deleting" @click="deleteClient">
            {{ deleting ? 'Suppression…' : 'Supprimer' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Détail -->
  <div class="modal fade" id="viewClientModal" tabindex="-1" aria-labelledby="viewClientModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header border-bottom">
          <h5 class="modal-title" id="viewClientModalLabel">
            <i class="ai-user me-2"></i>Détails du client
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
        </div>
        <div class="modal-body" v-if="viewedClient">
          <dl class="row mb-0">
            <dt class="col-sm-3 text-body-secondary">Prénom</dt>
            <dd class="col-sm-9">{{ viewedClient.firstName || '—' }}</dd>
            <dt class="col-sm-3 text-body-secondary">Nom</dt>
            <dd class="col-sm-9">{{ viewedClient.lastName || '—' }}</dd>
            <dt class="col-sm-3 text-body-secondary">E-mail</dt>
            <dd class="col-sm-9">{{ viewedClient.email || '—' }}</dd>
            <dt class="col-sm-3 text-body-secondary">Téléphone</dt>
            <dd class="col-sm-9">{{ viewedClient.phone || '—' }}</dd>
            <dt class="col-sm-3 text-body-secondary">CIN</dt>
            <dd class="col-sm-9">{{ viewedClient.cin || '—' }}</dd>
            <dt class="col-sm-3 text-body-secondary">Date de naissance</dt>
            <dd class="col-sm-9">{{ viewedClient.dateOfBirth ? formatDate(viewedClient.dateOfBirth) : '—' }}</dd>
            <dt class="col-sm-3 text-body-secondary">Rôle</dt>
            <dd class="col-sm-9">{{ viewedClient.role || 'client' }}</dd>
          </dl>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
          <router-link
            v-if="viewedClient"
            :to="`/editClient/${viewedClient.id}`"
            class="btn btn-primary"
            @click="closeViewModal"
          >
            <i class="ai-edit me-1"></i>Modifier
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Modal } from 'bootstrap';
import { toast } from '@/utils/toast';

export default {
  name: 'ClientsList',
  data() {
    return {
      apiBase: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000',
      clients: [],
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10,
      loading: true,
      error: null,
      selectedClient: null,
      deleting: false,
      deleteModal: null,
      viewedClient: null,
      viewModal: null,
    };
  },
  computed: {
    filteredClients() {
      if (!this.searchQuery.trim()) return this.clients;
      const q = this.searchQuery.toLowerCase().trim();
      return this.clients.filter((c) => {
        const fields = [
          c.firstName,
          c.lastName,
          c.email,
          c.phone,
          c.cin,
        ]
          .filter(Boolean)
          .map((s) => String(s).toLowerCase());
        return fields.some((f) => f.includes(q));
      });
    },
    paginatedClients() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredClients.slice(start, start + this.itemsPerPage);
    },
    totalPagesComputed() {
      return Math.max(1, Math.ceil(this.filteredClients.length / this.itemsPerPage));
    },
    displayedPages() {
      const total = this.totalPagesComputed;
      return Array.from({ length: total }, (_, i) => i + 1);
    },
  },
  watch: {
    filteredClients() {
      if (this.currentPage > this.totalPagesComputed) {
        this.currentPage = this.totalPagesComputed || 1;
      }
    },
  },
  mounted() {
    const existingBackdrop = document.querySelector('.modal-backdrop');
    if (existingBackdrop) existingBackdrop.remove();
    document.body.classList.remove('modal-open');

    this.$nextTick(() => {
      const delEl = document.getElementById('deleteClientModal');
      const viewEl = document.getElementById('viewClientModal');
      if (delEl) {
        this.deleteModal = new Modal(delEl);
        delEl.addEventListener('hidden.bs.modal', this.cleanupBackdrop);
      }
      if (viewEl) {
        this.viewModal = new Modal(viewEl);
        viewEl.addEventListener('hidden.bs.modal', () => {
          this.viewedClient = null;
          this.cleanupBackdrop();
        });
      }
    });

    this.fetchClients();
  },
  beforeUnmount() {
    if (this.deleteModal) this.deleteModal.dispose();
    if (this.viewModal) this.viewModal.dispose();
    this.cleanupBackdrop();
  },
  methods: {
    cleanupBackdrop() {
      document.querySelectorAll('.modal-backdrop').forEach((n) => n.remove());
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    },
    async fetchClients() {
      this.loading = true;
      this.error = null;
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          this.error = 'Connexion requise.';
          return;
        }
        const { data } = await axios.get(`${this.apiBase}/users/clients`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        this.clients = Array.isArray(data) ? data : [];
      } catch (e) {
        console.error(e);
        this.error = 'Impossible de charger les clients.';
        this.clients = [];
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
    async viewClient(client) {
      try {
        const token = localStorage.getItem('authToken');
        const { data } = await axios.get(`${this.apiBase}/users/${client.id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });
        this.viewedClient = data;
      } catch {
        this.viewedClient = client;
      }
      if (this.viewModal) this.viewModal.show();
    },
    closeViewModal() {
      if (this.viewModal) this.viewModal.hide();
    },
    confirmDelete(client) {
      this.selectedClient = client;
      if (this.deleteModal) this.deleteModal.show();
    },
    async deleteClient() {
      if (!this.selectedClient) return;
      this.deleting = true;
      try {
        const token = localStorage.getItem('authToken');
        await axios.delete(`${this.apiBase}/users/${this.selectedClient.id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });
        const i = this.clients.findIndex((c) => c.id === this.selectedClient.id);
        if (i !== -1) this.clients.splice(i, 1);
        toast.success('Client supprimé');
        if (this.deleteModal) this.deleteModal.hide();
        this.cleanupBackdrop();
      } catch (e) {
        console.error(e);
        toast.error('Suppression impossible');
      } finally {
        this.deleting = false;
        this.selectedClient = null;
      }
    },
    goToPage(page) {
      if (typeof page === 'number' && page >= 1 && page <= this.totalPagesComputed) {
        this.currentPage = page;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPagesComputed) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    onSearch() {
      this.currentPage = 1;
    },
    clearSearch() {
      this.searchQuery = '';
      this.currentPage = 1;
    },
  },
};
</script>

<style scoped>
.clients-search-input {
  border-radius: 0.65rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.clients-search-input .form-control {
  border-radius: 0 0.65rem 0.65rem 0;
}

.clients-table-wrap {
  background: #fafbfc;
  border-radius: 0.65rem;
  padding: 0 0.75rem 1rem;
}

.clients-table thead th {
  font-weight: 700;
  color: #3d3d3d;
  border-bottom-width: 1px;
  font-size: 0.9rem;
}

.clients-table tbody td {
  color: #374151;
  font-size: 0.92rem;
  border-color: rgba(0, 0, 0, 0.06);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.btn-action {
  width: 36px;
  height: 36px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
  text-decoration: none;
}

.btn-action i {
  font-size: 16px;
}

.btn-view {
  background-color: #26a69a;
  color: #fff;
  box-shadow: 0 2px 8px rgba(38, 166, 154, 0.3);
}

.btn-view:hover {
  background-color: #1f8c82;
  transform: translateY(-1px);
  color: #fff;
}

.btn-view svg {
  stroke: #fff;
}

.btn-edit {
  background-color: #e53935;
  color: #fff;
  box-shadow: 0 2px 8px rgba(229, 57, 53, 0.25);
}

.btn-edit:hover {
  background-color: #c62828;
  color: #fff;
  transform: translateY(-1px);
}

.btn-delete {
  background-color: #c62828;
  color: #fff;
  box-shadow: 0 2px 8px rgba(198, 40, 40, 0.25);
}

.btn-delete:hover {
  background-color: #b71c1c;
  color: #fff;
  transform: translateY(-1px);
}

[data-bs-theme='dark'] .clients-table-wrap {
  background: #1a1d21;
}

[data-bs-theme='dark'] .clients-table thead th {
  color: #e9ecef;
}

[data-bs-theme='dark'] .clients-table tbody td {
  color: #dee2e6;
  border-color: rgba(255, 255, 255, 0.08);
}
</style>
