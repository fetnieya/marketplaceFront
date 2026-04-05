<template>
  <section class="seller-store-page container py-4 mt-4 mb-5">
    <!-- Chargement -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="text-body-secondary mt-3 mb-0">Chargement de la boutique…</p>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="alert alert-danger rounded-3">
      {{ error }}
      <router-link to="/catalog" class="alert-link ms-2">Catalogue</router-link>
    </div>

    <template v-else>
      <!-- Barre retour + recherche dans la boutique -->
      <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
        <router-link to="/catalog" class="btn btn-outline-secondary btn-sm rounded-pill">
          <i class="ai-arrow-left me-1"></i> Retour
        </router-link>
        <div class="flex-grow-1 min-w-0 seller-store-search">
          <div class="input-group input-group-sm">
            <span class="input-group-text bg-transparent border-end-0"><i class="ai-search"></i></span>
            <input
              v-model="storeSearch"
              type="search"
              class="form-control border-start-0"
              placeholder="Rechercher dans cette boutique…"
              autocomplete="off"
            />
          </div>
        </div>
      </div>

      <!-- Carte vendeur -->
      <div class="seller-store-card card border-0 shadow-sm rounded-4 overflow-hidden mb-4 position-relative">
        <div class="seller-store-card__bg"></div>
        <div class="card-body position-relative pt-4 pb-3 px-3 px-md-4">
          <div class="d-flex flex-wrap align-items-start gap-3">
            <div class="seller-store-avatar rounded-circle flex-shrink-0">
              <img v-if="sellerPhoto" :src="sellerPhoto" alt="" class="rounded-circle w-100 h-100 object-fit-cover" />
              <span v-else>{{ sellerInitials }}</span>
            </div>
            <div class="flex-grow-1 min-w-0">
              <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
                <h1 class="h4 mb-0 text-truncate">{{ sellerDisplayName }}</h1>
                <span class="badge bg-success-subtle text-success small">Vendeur</span>
              </div>
              <div class="d-flex flex-wrap align-items-center gap-3 small text-body-secondary">
                <span v-if="reviewStats.count > 0">
                  <span class="text-warning me-1">★</span>
                  <strong class="text-body">{{ formatRating(reviewStats.average) }}</strong>
                  <span class="text-muted">({{ reviewStats.count }} avis)</span>
                </span>
                <span v-else class="text-muted">Pas encore d’avis</span>
                <span>{{ products.length }} annonce<span v-if="products.length !== 1">s</span></span>
              </div>
            </div>
            <div class="d-flex flex-column gap-2 align-items-stretch align-items-md-end">
              <button
                v-if="canFollowSeller"
                type="button"
                class="btn btn-dark btn-sm rounded-pill px-4"
                @click="toggleFollow"
              >
                {{ isFollowingSeller ? 'Abonné' : '+ Suivre' }}
              </button>
              <router-link
                v-else-if="!currentUser && sellerId"
                :to="{ path: '/sign-in', query: { redirect: $route.fullPath } }"
                class="btn btn-outline-primary btn-sm rounded-pill px-3"
              >
                Se connecter pour suivre
              </router-link>
              <span v-else-if="currentUser && !isClientUser" class="small text-muted text-md-end">Réservé aux clients</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Onglets -->
      <ul class="nav nav-tabs nav-fill seller-store-tabs border-bottom mb-4" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'products' }"
            type="button"
            @click="activeTab = 'products'"
          >
            Annonces
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'promo' }"
            type="button"
            @click="activeTab = 'promo'"
          >
            Promos
            <span v-if="promoProducts.length" class="badge bg-danger ms-1">{{ promoProducts.length }}</span>
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'reviews' }"
            type="button"
            @click="activeTab = 'reviews'"
          >
            Avis
            <span v-if="reviewStats.count" class="badge bg-secondary ms-1">{{ reviewStats.count }}</span>
          </button>
        </li>
      </ul>

      <!-- Grille annonces -->
      <div v-show="activeTab === 'products'">
        <div v-if="filteredProducts.length === 0" class="text-center text-muted py-5">
          Aucune annonce ne correspond à votre recherche.
        </div>
        <div v-else class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
          <div v-for="product in filteredProducts" :key="product.id" class="col">
            <article class="seller-product-card card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
              <router-link :to="`/shop-single/${product.id}`" class="text-decoration-none text-body">
                <div class="ratio ratio-1x1 bg-light">
                  <img :src="productImage(product)" :alt="product.name" class="object-fit-cover" loading="lazy" />
                </div>
                <div class="card-body p-2 p-md-3">
                  <h2 class="h6 card-title text-truncate mb-1">{{ product.name }}</h2>
                  <div class="fw-semibold text-primary">{{ formatPrice(product.price) }}</div>
                </div>
              </router-link>
            </article>
          </div>
        </div>
      </div>

      <!-- Promos -->
      <div v-show="activeTab === 'promo'">
        <p v-if="promoProducts.length === 0" class="text-center text-muted py-5">
          Aucune promotion en cours pour le moment.
        </p>
        <div v-else class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
          <div v-for="product in promoProducts" :key="'p-' + product.id" class="col">
            <article class="seller-product-card card h-100 border-0 shadow-sm rounded-3 overflow-hidden position-relative">
              <span class="badge bg-danger position-absolute top-0 end-0 m-2 z-1">-{{ promoPercent(product) }}%</span>
              <router-link :to="`/shop-single/${product.id}`" class="text-decoration-none text-body">
                <div class="ratio ratio-1x1 bg-light">
                  <img :src="productImage(product)" :alt="product.name" class="object-fit-cover" loading="lazy" />
                </div>
                <div class="card-body p-2 p-md-3">
                  <h2 class="h6 card-title text-truncate mb-1">{{ product.name }}</h2>
                  <div>
                    <span class="fw-semibold text-primary me-2">{{ formatPrice(effectivePrice(product)) }}</span>
                    <del class="small text-muted">{{ formatPrice(product.price) }}</del>
                  </div>
                </div>
              </router-link>
            </article>
          </div>
        </div>
      </div>

      <!-- Avis -->
      <div v-show="activeTab === 'reviews'">
        <div v-if="reviewsLoading" class="text-center py-4">
          <div class="spinner-border spinner-border-sm text-primary"></div>
        </div>
        <p v-else-if="!sellerReviews.length" class="text-center text-muted py-5">
          Aucun avis pour les produits de ce vendeur pour le moment.
        </p>
        <div v-else class="d-flex flex-column gap-3">
          <article
            v-for="r in sellerReviews"
            :key="r.id"
            class="card border-0 shadow-sm rounded-3"
          >
            <div class="card-body">
              <div class="d-flex align-items-start gap-3">
                <div class="review-avatar rounded-circle flex-shrink-0">{{ r.userInitials }}</div>
                <div class="flex-grow-1 min-w-0">
                  <div class="d-flex flex-wrap justify-content-between gap-2 mb-1">
                    <span class="fw-semibold">{{ r.userName }}</span>
                    <span class="small text-muted">{{ formatReviewDate(r.createdAt) }}</span>
                  </div>
                  <div class="small text-body-secondary mb-2" v-if="r.productName">
                    Sur : {{ r.productName }}
                  </div>
                  <div class="mb-2">
                    <span v-for="i in 5" :key="i" class="text-warning small">{{ i <= r.rating ? '★' : '☆' }}</span>
                  </div>
                  <p class="mb-0 small">{{ r.comment }}</p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </template>
  </section>
</template>

<script>
import axios from 'axios';

const PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+';

export default {
  name: 'MarketPage',
  data() {
    return {
      apiBase: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000',
      loading: true,
      error: null,
      seller: null,
      products: [],
      activeTab: 'products',
      storeSearch: '',
      reviewStats: { average: 0, count: 0 },
      sellerReviews: [],
      reviewsLoading: false,
      isFollowingSeller: false,
    };
  },
  computed: {
    sellerId() {
      const id = this.$route.params.sellerId;
      const n = parseInt(id, 10);
      return Number.isNaN(n) ? null : n;
    },
    sellerDisplayName() {
      if (this.seller?.displayName) return this.seller.displayName;
      const p = this.products[0];
      if (p?.sellerName) return p.sellerName;
      return 'Boutique';
    },
    sellerPhoto() {
      if (this.seller?.photo) return this.seller.photo;
      const p = this.products[0];
      if (p?.sellerPhoto) return p.sellerPhoto;
      return null;
    },
    sellerInitials() {
      const n = this.sellerDisplayName || '';
      const parts = n.trim().split(/\s+/);
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      return n.slice(0, 2).toUpperCase() || '?';
    },
    currentUser() {
      try {
        const u = localStorage.getItem('currentUser');
        return u ? JSON.parse(u) : null;
      } catch {
        return null;
      }
    },
    isClientUser() {
      return (this.currentUser?.role || '').toLowerCase() === 'client';
    },
    canFollowSeller() {
      if (!this.sellerId || !this.currentUser || !this.isClientUser) return false;
      return this.currentUser.id !== this.sellerId;
    },
    promoProducts() {
      return this.products.filter((p) => this.hasPromo(p));
    },
    filteredProducts() {
      const q = this.storeSearch.trim().toLowerCase();
      if (!q) return this.products;
      return this.products.filter((p) => {
        const name = String(p.name || '').toLowerCase();
        const desc = String(p.description || '').toLowerCase();
        return name.includes(q) || desc.includes(q);
      });
    },
  },
  watch: {
    '$route.params.sellerId'() {
      this.loadAll();
    },
  },
  methods: {
    getAuthHeaders() {
      const token = localStorage.getItem('authToken');
      return token ? { Authorization: `Bearer ${token}` } : {};
    },

    hasPromo(p) {
      const d = Number(p.discount);
      return !Number.isNaN(d) && d > 0;
    },

    effectivePrice(p) {
      const price = Number(p.price);
      const d = Number(p.discount);
      if (Number.isNaN(price)) return 0;
      if (Number.isNaN(d) || d <= 0) return price;
      return Math.max(0, price * (1 - d / 100));
    },

    promoPercent(p) {
      const d = Number(p.discount);
      return Number.isNaN(d) ? 0 : Math.round(d);
    },

    productImage(product) {
      if (product.images?.length) {
        const img = product.images[0];
        if (typeof img === 'object' && img?.url) return img.url;
        if (typeof img === 'string') return img;
      }
      if (product.image) return product.image;
      return PLACEHOLDER;
    },

    formatPrice(price) {
      const n = Number(price);
      if (Number.isNaN(n)) return '—';
      try {
        return new Intl.NumberFormat('fr-TN', {
          style: 'currency',
          currency: 'TND',
          minimumFractionDigits: 2,
        }).format(n);
      } catch {
        return `${n} DT`;
      }
    },

    formatRating(v) {
      const n = Number(v);
      if (Number.isNaN(n)) return '—';
      return n.toFixed(1);
    },

    formatReviewDate(iso) {
      if (!iso) return '';
      try {
        return new Date(iso).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      } catch {
        return '';
      }
    },

    async loadAll() {
      this.loading = true;
      this.error = null;
      if (!this.sellerId) {
        this.error = 'Vendeur introuvable.';
        this.loading = false;
        return;
      }
      try {
        const [sellerRes, productsRes] = await Promise.all([
          axios.get(`${this.apiBase}/users/public/seller/${this.sellerId}`).catch(() => ({ data: null })),
          axios.get(`${this.apiBase}/products?sellerId=${this.sellerId}`),
        ]);
        this.seller = sellerRes.data;
        this.products = Array.isArray(productsRes.data) ? productsRes.data : [];
        await this.loadReviews();
        await this.loadFollowState();
      } catch (e) {
        console.error(e);
        this.error = 'Impossible de charger cette boutique.';
        this.products = [];
      } finally {
        this.loading = false;
      }
    },

    async loadReviews() {
      if (!this.sellerId) return;
      this.reviewsLoading = true;
      try {
        const res = await axios.get(`${this.apiBase}/reviews/seller/${this.sellerId}`);
        this.sellerReviews = res.data?.reviews || [];
        this.reviewStats = res.data?.stats || { average: 0, count: 0 };
      } catch {
        this.sellerReviews = [];
        this.reviewStats = { average: 0, count: 0 };
      } finally {
        this.reviewsLoading = false;
      }
    },

    async loadFollowState() {
      if (!this.sellerId || !this.currentUser || !this.isClientUser) {
        this.isFollowingSeller = false;
        return;
      }
      try {
        const res = await axios.get(`${this.apiBase}/followers/status/${this.sellerId}`, {
          headers: this.getAuthHeaders(),
        });
        this.isFollowingSeller = !!res.data?.following;
      } catch {
        this.isFollowingSeller = false;
      }
    },

    async toggleFollow() {
      if (!this.canFollowSeller || !this.sellerId) return;
      try {
        if (this.isFollowingSeller) {
          await axios.delete(`${this.apiBase}/followers/by-seller/${this.sellerId}`, {
            headers: this.getAuthHeaders(),
          });
          this.isFollowingSeller = false;
        } else {
          await axios.post(
            `${this.apiBase}/followers`,
            { sellerId: this.sellerId },
            { headers: this.getAuthHeaders() },
          );
          this.isFollowingSeller = true;
        }
      } catch (e) {
        console.error(e);
      }
    },
  },
  created() {
    this.loadAll();
  },
};
</script>

<style scoped>
.seller-store-page {
  max-width: 1100px;
}

.seller-store-card {
  border: 1px solid var(--ar-border-color, rgba(0, 0, 0, 0.08)) !important;
}

.seller-store-card__bg {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 72px;
  background: linear-gradient(135deg, #7c4dff 0%, #b39ddb 45%, #e1bee7 100%);
  opacity: 0.9;
  pointer-events: none;
}

.seller-store-card .card-body {
  padding-top: 5.5rem !important;
}

.seller-store-avatar {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #c62828, #e57373);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.review-avatar {
  width: 44px;
  height: 44px;
  background: var(--ar-secondary-bg, #e9ecef);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--ar-body-color);
}

.seller-store-tabs .nav-link {
  border: none;
  border-bottom: 3px solid transparent;
  color: var(--ar-secondary-color);
  font-weight: 600;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.seller-store-tabs .nav-link.active {
  color: var(--ar-primary, #c62828);
  border-bottom-color: var(--ar-primary, #c62828);
  background: transparent;
}

.seller-product-card {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.seller-product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.08) !important;
}

.object-fit-cover {
  object-fit: cover;
}

[data-bs-theme='dark'] .seller-store-card__bg {
  opacity: 0.55;
}
</style>
