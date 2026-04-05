<template>
  <div class="seller-comments">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
      <div>
        <h1 class="h2 mb-1">Commentaires par produit</h1>
        <p class="text-muted mb-0">
          Avis laissés sur vos annonces, regroupés par produit.
        </p>
      </div>
      <button
        type="button"
        class="btn btn-outline-secondary btn-sm"
        :disabled="loading"
        @click="loadData"
      >
        <i class="ai-rotate-cw me-1"></i> Actualiser
      </button>
    </div>

    <div v-if="globalStats.count" class="mb-4 p-3 rounded-3 filter-section">
      <span class="fw-semibold">Tous vos produits :</span>
      <span class="text-muted ms-2">
        {{ globalStats.count }} avis · note moyenne
        <span class="text-warning">{{ '★'.repeat(Math.round(globalStats.average)) }}</span>
        {{ globalStats.average }}/5
      </span>
    </div>

    <div class="filter-section mb-4">
      <label class="form-label small mb-1">Rechercher un produit</label>
      <div class="input-group input-group-sm" style="max-width: 420px">
        <span class="input-group-text"><i class="ai-search"></i></span>
        <input
          v-model="search"
          type="text"
          class="form-control"
          placeholder="Nom du produit…"
        />
      </div>
    </div>

    <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
    <div v-else-if="loading" class="text-muted py-5 text-center">Chargement…</div>
    <div v-else-if="!filteredProducts.length" class="alert border-0 shadow-sm" role="alert">
      {{
        products.length
          ? 'Aucun produit ne correspond à la recherche.'
          : 'Aucun commentaire pour le moment sur vos annonces.'
      }}
    </div>

    <div v-else class="product-groups">
      <section
        v-for="block in filteredProducts"
        :key="block.productId"
        class="card shadow-sm border-0 mb-4 product-block"
      >
        <div class="card-header py-3 d-flex flex-wrap align-items-center gap-3 justify-content-between">
          <div class="d-flex align-items-center gap-3 min-w-0 flex-grow-1">
            <img
              :src="productThumb(block)"
              :alt="block.productName"
              class="product-thumb rounded-2 flex-shrink-0"
              width="72"
              height="72"
            />
            <div class="min-w-0">
              <div class="fw-semibold text-truncate" :title="block.productName">
                {{ block.productName }}
              </div>
              <div class="text-muted fs-sm">Produit #{{ block.productId }}</div>
            </div>
          </div>
          <div class="text-end fs-sm flex-shrink-0">
            <span class="badge bg-secondary-subtle text-secondary-emphasis me-1">
              {{ block.stats.count }} avis
            </span>
            <span class="text-warning" aria-hidden="true">
              {{ '★'.repeat(Math.round(block.stats.average)) }}
            </span>
            <span class="text-muted">{{ block.stats.average }}/5</span>
          </div>
        </div>
        <ul class="list-group list-group-flush">
          <li
            v-for="r in block.reviews"
            :key="r.id"
            class="list-group-item py-3"
          >
            <div class="d-flex align-items-start gap-3">
              <div
                class="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 review-avatar"
                :aria-label="r.userName"
              >
                {{ r.userInitials || '?' }}
              </div>
              <div class="flex-grow-1 min-w-0">
                <div class="fw-semibold">{{ r.userName }}</div>
                <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
                  <span class="text-warning fs-sm" aria-hidden="true">
                    {{ '★'.repeat(r.rating) }}{{ '☆'.repeat(5 - r.rating) }}
                  </span>
                  <span class="fs-sm text-muted">{{ formatDate(r.createdAt) }}</span>
                  <span v-if="r.verifiedPurchase" class="fs-sm text-muted">· Achat vérifié</span>
                </div>
                <p class="mb-0">{{ r.comment }}</p>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserComments',
  data() {
    return {
      placeholderImage:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BdWN1bmUgaW1hZ2U8L3RleHQ+PC9zdmc+',
      apiBase: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000',
      products: [],
      globalStats: { average: 0, count: 0 },
      search: '',
      loading: false,
      error: null,
    };
  },
  computed: {
    filteredProducts() {
      const q = this.search.trim().toLowerCase();
      if (!q) {
        return this.products;
      }
      return this.products.filter((p) =>
        (p.productName || '').toLowerCase().includes(q),
      );
    },
  },
  mounted() {
    this.loadData();
  },
  methods: {
    authHeaders() {
      const token = localStorage.getItem('authToken');
      return token ? { Authorization: `Bearer ${token}` } : {};
    },
    async loadData() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await axios.get(
          `${this.apiBase}/reviews/seller/me/by-product`,
          {
            headers: this.authHeaders(),
            withCredentials: true,
          },
        );
        this.products = Array.isArray(data?.products) ? data.products : [];
        this.globalStats = data?.stats || { average: 0, count: 0 };
      } catch (e) {
        const msg =
          e.response?.data?.message ||
          (Array.isArray(e.response?.data?.message)
            ? e.response.data.message.join(' ')
            : null) ||
          e.message ||
          'Impossible de charger les commentaires.';
        this.error = typeof msg === 'string' ? msg : 'Erreur.';
        this.products = [];
        this.globalStats = { average: 0, count: 0 };
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
    productThumb(block) {
      return block?.productImage || this.placeholderImage;
    },
  },
};
</script>

<style scoped>
.seller-comments {
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

.product-block {
  border-radius: 1rem;
  overflow: hidden;
}

.product-block .card-header {
  background: var(--ar-secondary-bg, #f6f9fc);
  border-bottom: 1px solid var(--ar-border-color, rgba(0, 0, 0, 0.08));
}

[data-bs-theme='dark'] .product-block .card-header {
  background: #252b33;
  border-color: rgba(255, 255, 255, 0.08);
}

.review-avatar {
  width: 44px;
  height: 44px;
  font-size: 0.85rem;
  font-weight: 700;
  background: rgba(198, 40, 40, 0.12);
  color: #c62828;
}

[data-bs-theme='dark'] .review-avatar {
  background: rgba(248, 113, 113, 0.15);
  color: #f87171;
}

.product-thumb {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border: 1px solid var(--ar-border-color, rgba(0, 0, 0, 0.1));
  background-color: var(--ar-secondary-bg, #f6f9fc);
}

[data-bs-theme='dark'] .product-thumb {
  border-color: rgba(255, 255, 255, 0.12);
  background-color: #252b33;
}
</style>
