<template>
  <main class="page-wrapper">
    <div class="container py-5 mt-4 mt-lg-5 mb-lg-4">
      <header class="mb-4 pb-3 border-bottom border-opacity-25">
        <h1 class="h2 fw-semibold mb-2">Mes commandes</h1>
        <p class="text-body-secondary mb-0">
          Suivez l’avancement de vos commandes. Le statut est mis à jour par le vendeur.
        </p>
      </header>

      <div v-if="loading" class="text-center py-5 text-body-secondary">
        <div class="spinner-border text-primary mb-3" role="status" aria-label="Chargement" />
        <div>Chargement de vos commandes…</div>
      </div>

      <div v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

      <div v-else-if="!orders.length" class="text-center py-5 rounded-4 border bg-body-secondary bg-opacity-25 px-3">
        <i class="ai-cart fs-1 text-primary opacity-50 mb-3 d-block" aria-hidden="true" />
        <p class="fw-medium mb-2">Vous n’avez pas encore de commande.</p>
        <router-link to="/catalog" class="btn btn-primary rounded-pill">Parcourir le catalogue</router-link>
      </div>

      <div v-else class="vstack gap-4">
        <article
          v-for="order in orders"
          :key="order.id"
          class="order-track-card card border shadow-sm overflow-hidden"
        >
          <div class="card-body p-4">
            <div class="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
              <div>
                <span class="text-body-secondary small d-block">Commande</span>
                <span class="h5 mb-0 fw-semibold">#{{ order.id }}</span>
                <span class="text-body-secondary small ms-2">{{ formatDate(order.createdAt) }}</span>
              </div>
              <div class="text-end">
                <span
                  class="badge rounded-pill px-3 py-2 order-status-pill"
                  :class="statusBadgeClass(order.status)"
                >
                  {{ statusLabel(order.status) }}
                </span>
                <div class="fw-semibold mt-2">{{ formatMoney(order.total) }}</div>
              </div>
            </div>

            <!-- Suivi par étapes -->
            <div v-if="order.status === 'cancelled'" class="alert alert-danger py-2 mb-3 mb-md-4" role="status">
              Cette commande a été annulée.
            </div>
            <div v-else class="order-steps mb-4" aria-label="Étapes de la commande">
              <div class="order-steps__rail">
                <template v-for="(step, idx) in trackingSteps" :key="step.key">
                  <div
                    class="order-steps__node"
                    :class="stepClass(order.status, idx)"
                  >
                    <span class="order-steps__dot" aria-hidden="true">
                      <i v-if="isStepDone(order.status, idx)" class="ai-check"></i>
                      <span v-else class="order-steps__num">{{ idx + 1 }}</span>
                    </span>
                    <span class="order-steps__label">{{ step.label }}</span>
                  </div>
                  <div
                    v-if="idx < trackingSteps.length - 1"
                    class="order-steps__bar"
                    :class="{ 'order-steps__bar--done': isStepDone(order.status, idx) }"
                    aria-hidden="true"
                  />
                </template>
              </div>
            </div>

            <div class="d-flex flex-wrap gap-2 align-items-center justify-content-between">
              <div class="small text-body-secondary">
                <span v-if="order.paymentMethod === 'card'">
                  Paiement : carte **** {{ order.paymentMeta?.cardLast4 || '••••' }}
                </span>
                <span v-else-if="order.paymentMethod === 'cash'">Paiement à la livraison</span>
                <span v-else>Paiement : {{ order.paymentMethod || '—' }}</span>
              </div>
              <button
                type="button"
                class="btn btn-sm btn-outline-primary rounded-pill"
                @click="toggleExpand(order.id)"
              >
                {{ expandedId === order.id ? 'Masquer le détail' : 'Voir le détail' }}
              </button>
            </div>

            <div v-if="expandedId === order.id" class="order-detail-expand pt-4 mt-3 border-top border-opacity-25">
              <div class="row g-4">
                <div class="col-md-6">
                  <h3 class="h6 fw-semibold mb-3">Livraison</h3>
                  <ul class="list-unstyled small text-body-secondary mb-0">
                    <li v-if="shipName(order)">
                      <strong class="text-body">{{ shipName(order) }}</strong>
                    </li>
                    <li v-if="shipLine(order)">{{ shipLine(order) }}</li>
                    <li v-if="shipCity(order)">{{ shipCity(order) }}</li>
                    <li v-if="shipPhone(order)">Tél. {{ shipPhone(order) }}</li>
                    <li v-if="shipEmail(order)">{{ shipEmail(order) }}</li>
                  </ul>
                </div>
                <div class="col-md-6">
                  <h3 class="h6 fw-semibold mb-3">Articles</h3>
                  <ul class="list-unstyled mb-0">
                    <li
                      v-for="line in order.items"
                      :key="line.id"
                      class="d-flex align-items-center gap-3 py-2 border-bottom border-opacity-10"
                    >
                      <router-link
                        :to="`/shop-single/${line.productId}`"
                        class="flex-shrink-0 rounded-3 bg-secondary bg-opacity-25 p-1"
                      >
                        <img
                          :src="lineImage(line)"
                          width="56"
                          height="56"
                          class="rounded-2"
                          style="object-fit: contain;"
                          :alt="line.productName"
                          loading="lazy"
                          @error="onLineImgError"
                        >
                      </router-link>
                      <div class="min-w-0 flex-grow-1">
                        <router-link
                          :to="`/shop-single/${line.productId}`"
                          class="text-body text-decoration-none fw-medium d-block text-truncate"
                        >
                          {{ line.productName }}
                        </router-link>
                        <span class="small text-body-secondary">Qté {{ line.quantity }} · {{ formatMoney(lineSubtotal(line)) }}</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios';

const API_BASE = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';

const PLACEHOLDER_IMG =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iNTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg==';

const STATUS_ORDER = ['pending', 'processing', 'shipped', 'delivered'];

export default {
  name: 'MyOrders',
  data() {
    return {
      orders: [],
      loading: true,
      error: '',
      expandedId: null,
      trackingSteps: [
        { key: 'pending', label: 'En attente' },
        { key: 'processing', label: 'En préparation' },
        { key: 'shipped', label: 'Expédiée' },
        { key: 'delivered', label: 'Livrée' },
      ],
    };
  },
  mounted() {
    this.loadOrders();
  },
  methods: {
    async loadOrders() {
      this.loading = true;
      this.error = '';
      try {
        const token = localStorage.getItem('authToken');
        const { data } = await axios.get(`${API_BASE}/orders/me`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        this.orders = Array.isArray(data) ? data : [];
      } catch (e) {
        if (e?.response?.status === 401) {
          this.$router.push({ path: '/sign-in', query: { redirect: '/my-orders' } });
          return;
        }
        if (e?.response?.status === 403) {
          this.error = 'Cette page est réservée aux comptes clients.';
        } else {
          this.error =
            e?.response?.data?.message ||
            e?.message ||
            'Impossible de charger vos commandes.';
        }
        this.orders = [];
      } finally {
        this.loading = false;
      }
    },
    toggleExpand(id) {
      this.expandedId = this.expandedId === id ? null : id;
    },
    statusIndex(status) {
      const i = STATUS_ORDER.indexOf(status);
      return i >= 0 ? i : 0;
    },
    isStepDone(status, stepIdx) {
      if (status === 'cancelled') return false;
      return this.statusIndex(status) > stepIdx;
    },
    isStepCurrent(status, stepIdx) {
      if (status === 'cancelled') return false;
      return this.statusIndex(status) === stepIdx;
    },
    stepClass(status, stepIdx) {
      if (status === 'cancelled') return 'order-steps__node--muted';
      if (this.isStepDone(status, stepIdx)) return 'order-steps__node--done';
      if (this.isStepCurrent(status, stepIdx)) return 'order-steps__node--current';
      return 'order-steps__node--muted';
    },
    statusLabel(status) {
      const map = {
        pending: 'En attente',
        processing: 'En préparation',
        shipped: 'Expédiée',
        delivered: 'Livrée',
        cancelled: 'Annulée',
      };
      return map[status] || status;
    },
    statusBadgeClass(status) {
      switch (status) {
        case 'pending':
          return 'bg-warning-subtle text-warning-emphasis';
        case 'processing':
          return 'bg-primary-subtle text-primary-emphasis';
        case 'shipped':
          return 'bg-info-subtle text-info-emphasis';
        case 'delivered':
          return 'bg-success-subtle text-success-emphasis';
        case 'cancelled':
          return 'bg-danger-subtle text-danger-emphasis';
        default:
          return 'bg-secondary-subtle text-secondary-emphasis';
      }
    },
    formatMoney(n) {
      const x = Number(n);
      if (Number.isNaN(x)) return '0,00 DT';
      return `${new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x)} DT`;
    },
    formatDate(iso) {
      if (!iso) return '';
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return String(iso).slice(0, 10);
      return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(d);
    },
    lineImage(line) {
      const u = line.productImage;
      if (u == null || String(u).trim() === '') return PLACEHOLDER_IMG;
      const s = String(u).trim();
      if (s.startsWith('data:') || /^https?:\/\//i.test(s)) return s;
      if (s.startsWith('//')) return `https:${s}`;
      const base = API_BASE.replace(/\/$/, '');
      if (s.startsWith('/')) return `${base}${s}`;
      return `${base}/${s.replace(/^\//, '')}`;
    },
    onLineImgError(e) {
      const el = e?.target;
      if (el && el.src !== PLACEHOLDER_IMG) {
        el.src = PLACEHOLDER_IMG;
      }
    },
    lineSubtotal(line) {
      return Number(line.priceAtPurchase) * Number(line.quantity);
    },
    shipAddr(o) {
      return o.shippingAddress && typeof o.shippingAddress === 'object' ? o.shippingAddress : {};
    },
    shipName(o) {
      const a = this.shipAddr(o);
      const n = [a.firstName, a.lastName].filter(Boolean).join(' ');
      return n || '';
    },
    shipLine(o) {
      const a = this.shipAddr(o);
      return [a.address, a.zipCode].filter(Boolean).join(', ') || '';
    },
    shipCity(o) {
      const a = this.shipAddr(o);
      return [a.city, a.country].filter(Boolean).join(', ') || '';
    },
    shipPhone(o) {
      return this.shipAddr(o).phone || '';
    },
    shipEmail(o) {
      return this.shipAddr(o).email || '';
    },
  },
};
</script>

<style scoped>
.order-track-card {
  border-radius: 1rem;
  border-color: rgba(0, 0, 0, 0.08) !important;
}

[data-bs-theme='dark'] .order-track-card {
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.order-status-pill {
  font-weight: 600;
  font-size: 0.85rem;
}

.order-steps__rail {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.25rem;
  flex-wrap: nowrap;
}

@media (max-width: 575.98px) {
  .order-steps__rail {
    flex-direction: column;
    align-items: stretch;
  }
  .order-steps__bar {
    display: none;
  }
  .order-steps__node {
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
  }
  .order-steps__label {
    text-align: left !important;
    max-width: none;
  }
}

.order-steps__node {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-width: 0;
}

.order-steps__dot {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  border: 2px solid var(--ar-border-color, rgba(0, 0, 0, 0.15));
  background: var(--bs-body-bg, #fff);
  color: var(--bs-body-color);
}

.order-steps__node--done .order-steps__dot {
  background: rgba(25, 135, 84, 0.15);
  border-color: rgba(25, 135, 84, 0.6);
  color: #198754;
}

.order-steps__node--current .order-steps__dot {
  background: rgba(var(--ar-primary-rgb, 198, 40, 40), 0.2);
  border-color: var(--ar-primary, #c62828);
  color: var(--ar-primary, #c62828);
  box-shadow: 0 0 0 3px rgba(var(--ar-primary-rgb, 198, 40, 40), 0.2);
}

.order-steps__node--muted .order-steps__dot {
  opacity: 0.55;
}

.order-steps__label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--bs-secondary-color);
  line-height: 1.25;
  max-width: 5.5rem;
}

.order-steps__node--current .order-steps__label {
  color: var(--bs-body-color);
}

.order-steps__bar {
  flex: 0 0 1.5rem;
  height: 3px;
  margin-top: 1rem;
  background: var(--ar-border-color, rgba(0, 0, 0, 0.12));
  border-radius: 2px;
  align-self: flex-start;
}

.order-steps__bar--done {
  background: rgba(25, 135, 84, 0.5);
}

.order-detail-expand {
  border-color: var(--ar-border-color, rgba(0, 0, 0, 0.08)) !important;
}
</style>
