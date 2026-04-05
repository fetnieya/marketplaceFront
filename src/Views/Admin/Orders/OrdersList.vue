<template>
  <div class="orders-management">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h1 class="h2 mb-1">Gestion de commande</h1>
            <p class="text-muted mb-0">
              Suivez, filtrez et exportez vos commandes.
            </p>
          </div>
          <div class="d-flex flex-wrap gap-2">
            <button type="button" class="btn btn-outline-secondary" @click="exportToExcel">
              <i class="ai-file-text me-2"></i> Excel
            </button>
            <button type="button" class="btn btn-outline-secondary" @click="exportToPdf">
              <i class="ai-file me-2"></i> PDF
            </button>
          </div>
        </div>

        <!-- Filtres -->
        <div class="filter-section mb-4">
          <div class="row g-3 align-items-end">
            <!-- Recherche par client / ID -->
            <div class="col-md-5">
              <label class="form-label small mb-1">Recherche</label>
              <div class="input-group input-group-sm">
                <span class="input-group-text">
                  <i class="ai-search"></i>
                </span>
                <input
                  v-model="search"
                  type="text"
                  class="form-control"
                  placeholder="Rechercher (ID, client...)"
                />
              </div>
            </div>

            <!-- Filtre par date -->
            <div class="col-md-3">
              <label class="form-label small mb-1">Date</label>
              <input
                v-model="date"
                type="date"
                class="form-control form-control-sm"
              />
            </div>

            <!-- Filtre par statut -->
            <div class="col-md-3">
              <label class="form-label small mb-1">Statut</label>
              <select v-model="status" class="form-select form-select-sm">
                <option value="">Tous les statuts</option>
                <option
                  v-for="option in statusOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>

            <!-- Bouton reset -->
            <div class="col-md-1">
              <button
                v-if="search || date || status"
                type="button"
                class="btn btn-outline-secondary btn-sm w-100"
                @click="resetFilters"
              >
                <i class="ai-rotate-cw"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Card : bannière "Pas de commande" ou tableau -->
        <div class="card shadow-sm border-0">
          <div v-if="loadingOrders" class="p-5 text-center text-muted">
            <div class="spinner-border text-primary mb-2" role="status" aria-label="Chargement" />
            <div>Chargement des commandes…</div>
          </div>
          <!-- Message lorsqu'il n'y a aucune commande (style bannière comme erreur abonnés) -->
          <div v-else-if="!filteredOrders.length" class="alert order-empty-alert m-3" role="alert">
            {{ hasOrders ? 'Aucune commande trouvée avec ces filtres.' : 'Pas de commande' }}
          </div>
          <div v-else-if="filteredOrders.length" class="table-responsive">
            <table class="table align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Client</th>
                  <th scope="col">Produits</th>
                  <th scope="col">Date</th>
                  <th scope="col" class="text-end">Montant</th>
                  <th scope="col">Paiement</th>
                  <th scope="col">Statut</th>
                  <th scope="col" class="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in paginatedOrders" :key="order.id">
                  <td class="fw-semibold">
                    #{{ order.id }}
                  </td>
                  <td>
                    <div class="fw-semibold">{{ order.client }}</div>
                    <div class="text-muted fs-sm">{{ order.clientEmail }}</div>
                  </td>
                  <td>
                    <div v-if="order.products && order.products.length">
                      <div
                        v-for="(product, index) in order.products"
                        :key="index"
                        class="order-product-name"
                      >
                        {{ product.name }}
                      </div>
                    </div>
                    <span v-else class="text-muted fs-sm">Aucun produit</span>
                  </td>
                  <td>{{ order.date }}</td>
                  <td class="text-end fw-semibold">{{ formatMoney(order.amount) }}</td>
                  <td class="fs-sm text-muted">{{ paymentLabel(order) }}</td>
                  <td>
                    <span
                      class="badge rounded-pill px-2 py-1 order-status-badge"
                      :class="statusBadgeClass(order.status)"
                    >
                      {{ statusLabel(order.status) }}
                    </span>
                  </td>
                  <td class="text-center">
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-secondary btn-action-eye"
                      title="Voir le détail de la commande"
                      @click="openOrderDetail(order)"
                    >
                      <svg class="icon-eye" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Fenêtre détail de commande (style demande de catégorie) -->
          <div v-if="selectedOrder" class="order-detail-overlay" @click.self="closeOrderDetail">
            <div class="order-detail-modal">
              <div class="order-detail-header">
                <h2 class="order-detail-title">Détail de la commande</h2>
                <button type="button" class="btn btn-order-detail-close" @click="closeOrderDetail">
                  <i class="ai-x me-1"></i>Annuler
                </button>
              </div>
              <p class="order-detail-subtitle">
                Consultez les informations de la commande ci-dessous. Vous pouvez modifier le statut si besoin.
              </p>
              <div class="order-detail-body">
                <div class="mb-3">
                  <label class="form-label order-detail-label">N° commande</label>
                  <input type="text" class="form-control order-detail-input" :value="selectedOrder.id" readonly />
                </div>
                <div class="mb-3">
                  <label class="form-label order-detail-label">Client</label>
                  <input type="text" class="form-control order-detail-input" :value="selectedOrder.client" readonly />
                </div>
                <div class="mb-3">
                  <label class="form-label order-detail-label">Email</label>
                  <input type="text" class="form-control order-detail-input" :value="selectedOrder.clientEmail" readonly />
                </div>
                <div class="mb-3">
                  <label class="form-label order-detail-label">Date</label>
                  <input type="text" class="form-control order-detail-input" :value="selectedOrder.date" readonly />
                </div>
                <div class="mb-3">
                  <label class="form-label order-detail-label">Produits</label>
                  <textarea
                    class="form-control order-detail-input order-detail-textarea"
                    readonly
                    rows="3"
                    :value="detailProductNamesText"
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label order-detail-label">Montant (vos articles)</label>
                  <input type="text" class="form-control order-detail-input" :value="formatMoney(selectedOrder.amount)" readonly />
                </div>
                <div v-if="selectedOrder.paymentMethod === 'card'" class="mb-3">
                  <label class="form-label order-detail-label">Paiement carte</label>
                  <input
                    type="text"
                    class="form-control order-detail-input"
                    :value="cardDetailText(selectedOrder)"
                    readonly
                  />
                </div>
                <div class="mb-4">
                  <label class="form-label order-detail-label">Statut de la commande</label>
                  <select
                    v-model="selectedOrder.status"
                    class="form-select order-detail-select order-status-select"
                    :class="statusSelectClass(selectedOrder.status)"
                    @change="onStatusChange(selectedOrder)"
                  >
                    <option
                      v-for="option in statusOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </div>
                <div class="d-flex justify-content-end">
                  <button type="button" class="btn btn-primary" @click="closeOrderDetail">
                    <i class="ai-check me-1" aria-hidden="true"></i>Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div
            v-if="!loadingOrders && filteredOrders.length && totalPages > 1"
            class="card-footer d-flex justify-content-between align-items-center flex-wrap gap-2"
          >
            <span class="text-muted fs-sm">
              Page {{ currentPage }} sur {{ totalPages }}
            </span>
            <nav aria-label="Pagination des commandes">
              <ul class="pagination mb-0">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a href="#" class="page-link" @click.prevent="prevPage">
                    <i class="ai-chevron-left"></i>
                  </a>
                </li>
                <li
                  v-for="page in totalPages"
                  :key="page"
                  class="page-item"
                  :class="{ active: page === currentPage }"
                >
                  <a
                    href="#"
                    class="page-link"
                    @click.prevent="goToPage(page)"
                  >
                    {{ page }}
                  </a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <a href="#" class="page-link" @click.prevent="nextPage">
                    <i class="ai-chevron-right"></i>
                  </a>
                </li>
              </ul>
            </nav>
        </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios';

const API_BASE = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';

export default {
  name: 'OrdersList',
  data() {
    return {
      loadingOrders: false,
      search: '',
      date: '',
      status: '',
      currentPage: 1,
      itemsPerPage: 5,
      orders: [],
      statusOptions: [
        { value: 'pending', label: 'En attente' },
        { value: 'shipped', label: 'Expédiée' },
        { value: 'delivered', label: 'Livrée' },
        { value: 'processing', label: 'En préparation' },
        { value: 'cancelled', label: 'Annulée' },
      ],
      selectedOrder: null,
    };
  },
  computed: {
    hasOrders() {
      return this.orders.length > 0;
    },
    detailProductNamesText() {
      return this.selectedOrder ? this.productNamesList(this.selectedOrder) : '';
    },
    filteredOrders() {
      return this.orders.filter((order) => {
        const searchLower = this.search.toLowerCase();
        const idStr = String(order.id ?? '');
        const matchesSearch =
          !searchLower ||
          idStr.toLowerCase().includes(searchLower) ||
          order.client.toLowerCase().includes(searchLower) ||
          order.clientEmail.toLowerCase().includes(searchLower);

        const matchesDate = !this.date || order.date === this.date;
        const matchesStatus = !this.status || order.status === this.status;

        return matchesSearch && matchesDate && matchesStatus;
      });
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredOrders.length / this.itemsPerPage));
    },
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredOrders.slice(start, end);
    },
  },
  watch: {
    search() {
      this.currentPage = 1;
    },
    date() {
      this.currentPage = 1;
    },
    status() {
      this.currentPage = 1;
    },
  },
  mounted() {
    this.fetchSellerOrders();
  },
  methods: {
    async fetchSellerOrders() {
      this.loadingOrders = true;
      try {
        const token = localStorage.getItem('authToken');
        const { data } = await axios.get(`${API_BASE}/orders/seller`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const list = Array.isArray(data) ? data : [];
        this.orders = list.map((o) => this.mapApiOrder(o));
      } catch (e) {
        console.error(e);
        this.orders = [];
        if (e?.response?.status === 401) {
          this.$router?.push?.({ path: '/sign-in', query: { redirect: '/orders' } });
        } else if (e?.response?.status !== 403) {
          const msg = e?.response?.data?.message || 'Impossible de charger les commandes.';
          alert(msg);
        }
      } finally {
        this.loadingOrders = false;
      }
    },
    mapApiOrder(o) {
      const c = o.client || {};
      return {
        numericId: o.id,
        id: String(o.id),
        client: [c.firstName, c.lastName].filter(Boolean).join(' ') || '—',
        clientEmail: c.email || '—',
        date: o.createdAt ? String(o.createdAt).slice(0, 10) : '',
        amount: Number(o.sellerSubtotal) || 0,
        status: o.status || 'pending',
        paymentMethod: o.paymentMethod || '',
        paymentMeta: o.paymentMeta || null,
        products: (o.myItems || []).map((i) => ({ name: i.productName || 'Produit' })),
      };
    },
    formatMoney(n) {
      const x = Number(n);
      if (Number.isNaN(x)) return '0,00 DT';
      return `${new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x)} DT`;
    },
    paymentLabel(order) {
      if (order.paymentMethod === 'card') {
        const last4 = order.paymentMeta?.cardLast4;
        return last4 ? `Carte •••• ${last4}` : 'Carte';
      }
      if (order.paymentMethod === 'cash') return 'À la livraison';
      return order.paymentMethod || '—';
    },
    cardDetailText(order) {
      const h = order.paymentMeta?.cardHolder;
      const last4 = order.paymentMeta?.cardLast4;
      if (h && last4) return `${h} — **** ${last4}`;
      if (last4) return `**** ${last4}`;
      return 'Carte bancaire';
    },
    resetFilters() {
      this.search = '';
      this.date = '';
      this.status = '';
    },
    openOrderDetail(order) {
      this.selectedOrder = order;
    },
    closeOrderDetail() {
      this.selectedOrder = null;
    },
    productNamesList(order) {
      if (!order || !order.products || !order.products.length) {
        return 'Aucun produit';
      }
      return order.products.map((p) => p.name).join('\n');
    },
    async onStatusChange(order) {
      if (!order?.numericId) return;
      const token = localStorage.getItem('authToken');
      try {
        await axios.patch(
          `${API_BASE}/orders/${order.numericId}/status`,
          { status: order.status },
          { headers: token ? { Authorization: `Bearer ${token}` } : {} },
        );
      } catch (e) {
        const msg = e?.response?.data?.message || 'Mise à jour du statut impossible.';
        alert(msg);
        await this.fetchSellerOrders();
      }
    },
    statusLabel(status) {
      const found = this.statusOptions.find((s) => s.value === status);
      return found ? found.label : status;
    },
    statusBadgeClass(status) {
      switch (status) {
        case 'pending':
          return 'bg-warning-subtle text-warning-emphasis';
        case 'shipped':
          return 'bg-info-subtle text-info-emphasis';
        case 'delivered':
          return 'bg-success-subtle text-success-emphasis';
        case 'processing':
          return 'bg-primary-subtle text-primary-emphasis';
        case 'cancelled':
          return 'bg-danger-subtle text-danger-emphasis';
        default:
          return 'bg-secondary-subtle text-secondary-emphasis';
      }
    },
    statusSelectClass(status) {
      switch (status) {
        case 'pending':
          return 'status-pending-select';
        case 'shipped':
          return 'status-shipped-select';
        case 'delivered':
          return 'status-delivered-select';
        case 'processing':
          return 'status-processing-select';
        case 'cancelled':
          return 'status-cancelled-select';
        default:
          return '';
      }
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },
    exportToExcel() {
      const headers = ['ID', 'Client', 'Email', 'Date', 'Montant', 'Paiement', 'Statut'];
      const rows = this.filteredOrders.map((order) => [
        order.id,
        order.client,
        order.clientEmail,
        order.date,
        this.formatMoney(order.amount),
        this.paymentLabel(order),
        this.statusLabel(order.status),
      ]);

      const csvContent = [headers, ...rows]
        .map((row) =>
          row
            .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
            .join(';'),
        )
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'commandes.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    exportToPdf() {
      const printContent = `
        <html>
          <head>
            <title>Commandes</title>
            <style>
              body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 24px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
              th { background-color: #f8f9fa; text-align: left; }
            </style>
          </head>
          <body>
            <h2>Liste des commandes</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Montant</th>
                  <th>Paiement</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                ${this.filteredOrders
                  .map(
                    (order) => `
                      <tr>
                        <td>${order.id}</td>
                        <td>${order.client}</td>
                        <td>${order.clientEmail}</td>
                        <td>${order.date}</td>
                        <td>${this.formatMoney(order.amount)}</td>
                        <td>${this.paymentLabel(order)}</td>
                        <td>${this.statusLabel(order.status)}</td>
                      </tr>
                    `,
                  )
                  .join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      if (!printWindow) return;
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    },
  },
};
</script>

<style scoped>
.orders-management {
  width: 100%;
}

.filter-section {
  background-color: var(--ar-secondary-bg, #f6f9fc);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--ar-border-color, rgba(0, 0, 0, 0.1));
}

[data-bs-theme="dark"] .filter-section {
  background-color: #1c2128;
  border-color: rgba(255, 255, 255, 0.1);
}

.order-product-name {
  font-size: 0.85rem;
  color: var(--ar-body-color, #121519);
}

[data-bs-theme="dark"] .order-product-name {
  color: rgba(255, 255, 255, 0.85);
}

.order-status-select {
  min-width: 140px;
}

.order-status-badge {
  font-size: 0.8rem;
  font-weight: 600;
}

/* Bannière "Pas de commande" (même style que message erreur abonnés) */
.order-empty-alert {
  border-radius: 12px;
  border: 1px solid rgba(220, 53, 69, 0.4);
  background-color: #21262d;
  color: #f85149;
  font-size: 1rem;
  padding: 1rem 1.25rem;
}

[data-bs-theme="light"] .order-empty-alert {
  background-color: #fff5f5;
  color: #dc3545;
  border-color: rgba(220, 53, 69, 0.3);
}

.btn-action-eye .icon-eye {
  display: inline-block;
  vertical-align: middle;
  color: currentColor;
}
.btn-action-eye:hover .icon-eye {
  color: currentColor;
}

.status-pending-select {
  background-color: rgba(249, 115, 22, 0.1);
  color: #f97316;
}

.status-shipped-select {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.status-delivered-select {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-processing-select {
  background-color: rgba(37, 99, 235, 0.1);
  color: #2563eb;
}

.status-cancelled-select {
  background-color: rgba(220, 38, 38, 0.1);
  color: #dc2626;
}

.pagination .page-link {
  border-radius: 999px;
}

.card {
  border-radius: 1rem;
}

/* Fenêtre détail commande – style comme "Demander une nouvelle catégorie" */
.order-detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.order-detail-modal {
  background-color: #1c2128;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  max-width: 520px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.order-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem 0;
}

.order-detail-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.btn-order-detail-close {
  background-color: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-order-detail-close:hover {
  background-color: rgba(255, 255, 255, 0.12);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.2);
}

.order-detail-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  padding: 0.75rem 1.5rem 0;
  margin: 0;
}

.order-detail-body {
  padding: 1rem 1.5rem 1.5rem;
}

.order-detail-label {
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.35rem;
}

.order-detail-input,
.order-detail-select {
  background-color: #21262d;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
}

.order-detail-input::placeholder,
.order-detail-textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.order-detail-textarea {
  min-height: 80px;
  resize: vertical;
}

.order-detail-body .btn-primary {
  border-radius: 8px;
  padding: 0.5rem 1.25rem;
}
</style>

