<template>
  <div class="admin-comments">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
      <div>
        <h1 class="h2 mb-1">Commentaires par vendeur</h1>
        <p class="text-muted mb-0">
          Avis sur les produits, regroupés par vendeur. Chaque ligne indique le client auteur. Suppression possible par commentaire.
        </p>
      </div>
      <button
        type="button"
        class="btn btn-outline-secondary btn-sm"
        :disabled="loading"
        @click="loadReviews"
      >
        <i class="ai-rotate-cw me-1"></i> Actualiser
      </button>
    </div>

    <div class="filter-section mb-4">
      <label class="form-label small mb-1">Recherche client</label>
      <div class="input-group input-group-sm" style="max-width: 420px">
        <span class="input-group-text"><i class="ai-search"></i></span>
        <input
          v-model="search"
          type="text"
          class="form-control"
          placeholder="Nom, email…"
        />
      </div>
    </div>

    <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
    <div v-else-if="loading" class="text-muted py-5 text-center">Chargement…</div>
    <div v-else-if="!reviews.length" class="alert border-0 shadow-sm" role="alert">
      Aucun commentaire pour le moment.
    </div>

    <div v-else class="seller-groups">
      <section
        v-for="group in filteredGroups"
        :key="group.sellerId"
        class="card shadow-sm border-0 mb-4 seller-card"
      >
        <div class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2 py-3">
          <div>
            <div class="fw-semibold">{{ group.sellerName }}</div>
            <div class="text-muted fs-sm">{{ group.sellerEmail || '—' }}</div>
            <div class="text-muted fs-sm">
              {{ group.reviews.length }} commentaire(s)
            </div>
          </div>
        </div>
        <ul class="list-group list-group-flush">
          <li
            v-for="r in group.reviews"
            :key="r.id"
            class="list-group-item py-3 d-flex flex-column flex-md-row gap-3 align-items-start"
          >
            <div class="flex-grow-1 min-w-0">
              <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
                <span class="badge bg-secondary-subtle text-secondary-emphasis">
                  Produit #{{ r.productId }}
                </span>
                <span class="fw-medium text-truncate" :title="r.productName">
                  {{ r.productName }}
                </span>
                <span class="text-warning" aria-hidden="true">
                  {{ '★'.repeat(r.rating) }}{{ '☆'.repeat(5 - r.rating) }}
                </span>
              </div>
              <div class="fs-sm text-body-secondary mb-1">
                <span class="fw-medium">Client :</span>
                {{ r.userName }}
                <span v-if="r.userEmail" class="text-muted"> · {{ r.userEmail }}</span>
              </div>
              <p class="mb-1">{{ r.comment }}</p>
              <div class="fs-sm text-muted">
                {{ formatDate(r.createdAt) }}
                <span v-if="r.verifiedPurchase" class="ms-2">· Achat vérifié</span>
              </div>
            </div>
            <button
              type="button"
              class="btn btn-outline-danger btn-sm flex-shrink-0"
              :disabled="deletingId === r.id"
              title="Supprimer ce commentaire"
              @click="confirmDelete(r)"
            >
              <i class="ai-trash me-1"></i>
              {{ deletingId === r.id ? '…' : 'Supprimer' }}
            </button>
          </li>
        </ul>
      </section>
    </div>

    <!-- Confirmation suppression (pas de window.confirm) -->
    <div
      id="deleteReviewModal"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="deleteReviewModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="deleteReviewModalLabel" class="modal-title">Supprimer le commentaire</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Fermer"
            />
          </div>
          <div class="modal-body">
            <p class="mb-2">Supprimer définitivement cet avis ? Cette action ne peut pas être annulée.</p>
            <p
              v-if="reviewPendingDelete"
              class="small mb-0 text-body-secondary border-start border-secondary border-3 ps-2 py-1"
            >
              {{ truncateComment(reviewPendingDelete.comment) }}
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Annuler
            </button>
            <button
              type="button"
              class="btn btn-danger"
              :disabled="deletingId !== null"
              @click="executeDeleteReview"
            >
              {{ deletingId !== null ? 'Suppression…' : 'Supprimer' }}
            </button>
          </div>
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
  name: 'AdminComments',
  data() {
    return {
      apiBase: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000',
      reviews: [],
      search: '',
      loading: false,
      error: null,
      deletingId: null,
      reviewPendingDelete: null,
      deleteModal: null,
    };
  },
  computed: {
    groupsBySeller() {
      const map = new Map();
      for (const r of this.reviews) {
        const key = r.sellerId != null ? r.sellerId : 0;
        if (!map.has(key)) {
          map.set(key, {
            sellerId: key,
            sellerName: r.sellerName || 'Vendeur inconnu',
            sellerEmail: r.sellerEmail || '',
            reviews: [],
          });
        }
        map.get(key).reviews.push(r);
      }
      return Array.from(map.values()).sort((a, b) =>
        (a.sellerName || '').localeCompare(b.sellerName || '', 'fr', {
          sensitivity: 'base',
        }),
      );
    },
    filteredGroups() {
      const q = this.search.trim().toLowerCase();
      if (!q) {
        return this.groupsBySeller;
      }
      return this.groupsBySeller.filter((g) => {
        const name = (g.sellerName || '').toLowerCase();
        const email = (g.sellerEmail || '').toLowerCase();
        return name.includes(q) || email.includes(q);
      });
    },
  },
  mounted() {
    this.loadReviews();
    this.$nextTick(() => {
      const el = document.getElementById('deleteReviewModal');
      if (el) {
        this.deleteModal = new Modal(el);
        this._onDeleteModalHidden = () => {
          if (this.deletingId === null) {
            this.reviewPendingDelete = null;
          }
        };
        el.addEventListener('hidden.bs.modal', this._onDeleteModalHidden);
      }
    });
  },
  beforeUnmount() {
    const el = document.getElementById('deleteReviewModal');
    if (el && this._onDeleteModalHidden) {
      el.removeEventListener('hidden.bs.modal', this._onDeleteModalHidden);
    }
    if (this.deleteModal) {
      this.deleteModal.dispose();
      this.deleteModal = null;
    }
  },
  methods: {
    authHeaders() {
      const token = localStorage.getItem('authToken');
      return token ? { Authorization: `Bearer ${token}` } : {};
    },
    async loadReviews() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await axios.get(`${this.apiBase}/reviews/admin/all`, {
          headers: this.authHeaders(),
          withCredentials: true,
        });
        this.reviews = Array.isArray(data) ? data : [];
      } catch (e) {
        const msg =
          e.response?.data?.message ||
          (Array.isArray(e.response?.data?.message)
            ? e.response.data.message.join(' ')
            : null) ||
          e.message ||
          'Impossible de charger les commentaires.';
        this.error = typeof msg === 'string' ? msg : 'Erreur.';
        this.reviews = [];
        if (e.response?.status === 401) {
          this.$router.push({ path: '/sign-in', query: { redirect: this.$route.fullPath } });
        }
      } finally {
        this.loading = false;
      }
    },
    formatDate(iso) {
      if (!iso) return '';
      try {
        return new Date(iso).toLocaleString('fr-FR', {
          dateStyle: 'short',
          timeStyle: 'short',
        });
      } catch {
        return String(iso);
      }
    },
    truncateComment(text) {
      const t = (text || '').trim();
      if (t.length <= 160) return t || '—';
      return `${t.slice(0, 160)}…`;
    },
    confirmDelete(r) {
      this.reviewPendingDelete = r;
      if (this.deleteModal) {
        this.deleteModal.show();
      }
    },
    async executeDeleteReview() {
      const r = this.reviewPendingDelete;
      if (!r) return;
      this.deletingId = r.id;
      try {
        await axios.delete(`${this.apiBase}/reviews/admin/${r.id}`, {
          headers: this.authHeaders(),
          withCredentials: true,
        });
        this.reviews = this.reviews.filter((x) => x.id !== r.id);
        toast.success('Commentaire supprimé');
        this.reviewPendingDelete = null;
        if (this.deleteModal) this.deleteModal.hide();
      } catch (e) {
        const msg =
          e.response?.data?.message ||
          'La suppression a échoué.';
        toast.error(typeof msg === 'string' ? msg : 'Erreur lors de la suppression.');
      } finally {
        this.deletingId = null;
      }
    },
  },
};
</script>

<style scoped>
.admin-comments {
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

.seller-card {
  border-radius: 1rem;
  overflow: hidden;
}

.seller-card .card-header {
  background: var(--ar-secondary-bg, #f6f9fc);
  border-bottom: 1px solid var(--ar-border-color, rgba(0, 0, 0, 0.08));
}

[data-bs-theme='dark'] .seller-card .card-header {
  background: #252b33;
  border-color: rgba(255, 255, 255, 0.08);
}
</style>
