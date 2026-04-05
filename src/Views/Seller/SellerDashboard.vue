<template>
  <div class="seller-dashboard-content">
    <div v-if="loading" class="text-center py-5 text-body-secondary">
      Chargement des statistiques…
    </div>

    <template v-else>
      <div v-if="error" class="alert alert-warning" role="alert">
        {{ error }}
        <span class="d-block small mt-1 mb-0">
          Les chiffres ci-dessous peuvent être à zéro si l’API n’a pas répondu.
        </span>
      </div>

      <div class="row g-3 g-xl-4 mb-4">
        <div class="col-md-4 col-sm-6">
          <div class="h-100 bg-secondary rounded-3 text-center p-4">
            <h2 class="h6 pb-2 mb-1">Produits</h2>
            <div class="h2 text-primary mb-2">{{ stats.products }}</div>
            <p class="fs-sm text-body-secondary mb-0">Annonces publiées</p>
          </div>
        </div>
        <div class="col-md-4 col-sm-6">
          <div class="h-100 bg-secondary rounded-3 text-center p-4">
            <h2 class="h6 pb-2 mb-1">Commandes</h2>
            <div class="h2 text-primary mb-2">{{ stats.orders }}</div>
            <p class="fs-sm text-body-secondary mb-0">Impliquant vos articles</p>
          </div>
        </div>
        <div class="col-md-4 col-sm-12">
          <div class="h-100 bg-secondary rounded-3 text-center p-4">
            <h2 class="h6 pb-2 mb-1">Chiffre d'affaires</h2>
            <div class="h2 text-primary mb-2">{{ formatMoney(stats.revenue) }}</div>
            <p class="fs-sm text-body-secondary mb-0">Sur vos ventes</p>
          </div>
        </div>
      </div>

      <div class="row g-3 g-xl-4 mb-4">
        <div class="col-md-4 col-sm-6 mx-auto">
          <div class="h-100 bg-secondary rounded-3 text-center p-4">
            <h2 class="h6 pb-2 mb-1">Abonnés</h2>
            <div class="h2 text-primary mb-2">{{ stats.followers }}</div>
            <p class="fs-sm text-body-secondary mb-0">Clients qui vous suivent</p>
          </div>
        </div>
      </div>

      <!-- Modèle : articles vendus (unités) -->
      <div class="row g-4 mb-4">
        <div class="col-12">
          <div class="border border-primary border-opacity-25 rounded-3 p-4 bg-body-secondary bg-opacity-25">
            <h2 class="h5 mb-2">Prévision des ventes — modèle {{ predictionModelLabel }}</h2>
            <p class="text-body-secondary small mb-3">
              {{ stats.prediction?.metricLabel }}.
              {{ stats.prediction?.disclaimer }}
            </p>
            <div class="chart-wrap chart-wrap-tall mb-4">
              <LineChart
                v-if="predictionLineData"
                :data="predictionLineData"
                :options="lineOptions"
              />
              <p v-else class="text-center text-muted py-4 mb-0">
                Données de prévision indisponibles.
              </p>
            </div>
            <div class="table-responsive" v-if="stats.prediction?.forecast?.length">
              <table class="table table-sm table-bordered mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Mois</th>
                    <th class="text-end">Unités prévues</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in stats.prediction.forecast" :key="row.month">
                    <td>{{ formatMonthLong(row.month) }}</td>
                    <td class="text-end fw-medium">
                      {{ formatInt(row.value) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-12">
          <div class="h-100 border rounded-3 p-4">
            <h2 class="h6 text-center text-sm-start mb-4">CA des 6 derniers mois</h2>
            <div class="chart-wrap">
              <Bar v-if="revenueChartData" :data="revenueChartData" :options="barOptions" />
              <p v-else class="text-center text-muted py-5 mb-0">
                Pas encore de ventes sur cette période.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4 mt-0">
        <div class="col-12">
          <div class="border rounded-3 p-4">
            <h2 class="h6 mb-2">Rappel</h2>
            <p class="text-body-secondary mb-0 fs-sm">
              Le graphique ci-dessus montre votre CA ; la prévision porte sur le nombre d’articles (quantités)
              vendus via vos lignes de commande.
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import axios from 'axios';
import { Bar, Line as LineChart } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  LineController,
  Filler,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  LineController,
  Filler,
);

function emptySellerStats() {
  return {
    products: 0,
    followers: 0,
    orders: 0,
    revenue: 0,
    monthly: [],
    prediction: null,
  };
}

export default {
  name: 'SellerDashboard',
  components: { Bar, LineChart },
  data() {
    return {
      apiBase: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000',
      loading: true,
      error: null,
      stats: emptySellerStats(),
      barOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
      lineOptions: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'top' },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
            title: { display: true, text: 'Unités' },
          },
        },
      },
    };
  },
  computed: {
    predictionModelLabel() {
      return this.stats.prediction?.model === 'linear_regression'
        ? 'régression linéaire (12 mois)'
        : 'statistique';
    },
    predictionLineData() {
      const p = this.stats.prediction;
      if (!p || (!p.historical?.length && !p.forecast?.length)) {
        return null;
      }
      const h = p.historical || [];
      const f = p.forecast || [];
      const labels = [
        ...h.map((x) => this.formatMonthLabel(x.month)),
        ...f.map((x) => this.formatMonthLabel(x.month)),
      ];
      return {
        labels,
        datasets: [
          {
            label: 'Réalisé (historique)',
            data: [...h.map((x) => x.value), ...f.map(() => null)],
            borderColor: 'rgba(25, 135, 84, 1)',
            backgroundColor: 'rgba(25, 135, 84, 0.08)',
            fill: true,
            tension: 0.25,
            spanGaps: false,
          },
          {
            label: 'Prévision (5 mois)',
            data: [...h.map(() => null), ...f.map((x) => x.value)],
            borderColor: 'rgba(253, 126, 20, 1)',
            backgroundColor: 'rgba(253, 126, 20, 0.06)',
            borderDash: [8, 4],
            fill: true,
            tension: 0.25,
            spanGaps: false,
          },
        ],
      };
    },
    revenueChartData() {
      if (!this.stats?.monthly?.length) return null;
      const labels = this.stats.monthly.map((m) => this.formatMonthLabel(m.month));
      return {
        labels,
        datasets: [
          {
            label: 'CA (TND)',
            data: this.stats.monthly.map((m) => m.revenue),
            backgroundColor: 'rgba(13, 110, 253, 0.55)',
            borderColor: 'rgba(13, 110, 253, 1)',
            borderWidth: 1,
          },
        ],
      };
    },
  },
  mounted() {
    this.loadStats();
  },
  methods: {
    normalizeSeller(data) {
      const d = data && typeof data === 'object' ? data : {};
      return {
        products: Number(d.products) || 0,
        followers: Number(d.followers) || 0,
        orders: Number(d.orders) || 0,
        revenue: Number(d.revenue) || 0,
        monthly: Array.isArray(d.monthly) ? d.monthly : [],
        prediction:
          d.prediction && typeof d.prediction === 'object' ? d.prediction : null,
      };
    },
    formatMoney(n) {
      const v = Number(n);
      if (Number.isNaN(v)) return '—';
      return `${v.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TND`;
    },
    formatInt(n) {
      const v = Math.round(Number(n));
      if (Number.isNaN(v)) return '—';
      return v.toLocaleString('fr-FR');
    },
    formatMonthLabel(ym) {
      if (!ym || typeof ym !== 'string') return '';
      const [y, m] = ym.split('-').map(Number);
      if (!y || !m) return ym;
      const d = new Date(y, m - 1, 1);
      return d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
    },
    formatMonthLong(ym) {
      if (!ym || typeof ym !== 'string') return '';
      const [y, m] = ym.split('-').map(Number);
      if (!y || !m) return ym;
      const d = new Date(y, m - 1, 1);
      return d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    },
    async loadStats() {
      this.loading = true;
      this.error = null;
      const token = localStorage.getItem('authToken');
      if (!token) {
        this.error = 'Connexion requise.';
        this.stats = emptySellerStats();
        this.loading = false;
        return;
      }
      try {
        const { data } = await axios.get(`${this.apiBase}/dashboard/seller`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        this.stats = this.normalizeSeller(data);
      } catch (e) {
        const msg =
          e.response?.data?.message ||
          (Array.isArray(e.response?.data?.message)
            ? e.response.data.message.join(' ')
            : null) ||
          e.message ||
          'Impossible de charger le tableau de bord.';
        this.error = typeof msg === 'string' ? msg : 'Erreur de chargement.';
        this.stats = emptySellerStats();
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.seller-dashboard-content {
  width: 100%;
}
.chart-wrap {
  position: relative;
  height: 280px;
}
.chart-wrap-tall {
  height: 340px;
}
</style>
