<template>
  <div class="container py-5 mt-4 mt-lg-5 mb-lg-4 my-xl-5">
    <div class="row pt-sm-2 pt-lg-0">
      <!-- Sidebar -->
      <aside class="col-lg-3 pe-lg-4 pe-xl-5 mt-n3">
        <div class="position-lg-sticky top-0">
          <div class="d-none d-lg-block" style="padding-top: 105px;"></div>
          <div class="offcanvas-lg offcanvas-start" id="sidebarAccount">
            <button 
              class="btn-close position-absolute top-0 end-0 mt-3 me-3 d-lg-none" 
              type="button" 
              data-bs-dismiss="offcanvas" 
              data-bs-target="#sidebarAccount"
              aria-label="Close"
            ></button>
            <div class="offcanvas-body">
              <nav class="nav flex-column pb-2 pb-lg-4 mb-3">
                <h4 class="fs-xs fw-medium text-body-secondary text-uppercase pb-1 mb-2">Menu</h4>
                <router-link class="nav-link fw-semibold py-2 px-0" to="/admin">
                  <i class="ai-dashboard fs-5 opacity-60 me-2"></i> Dashboard
                </router-link>
                <router-link class="nav-link fw-semibold py-2 px-0" to="/users">
                  <i class="ai-user-group fs-5 opacity-60 me-2"></i> Users
                </router-link>
                <router-link class="nav-link fw-semibold py-2 px-0" to="/markets">
                  <i class="ai-shopping-bag fs-5 opacity-60 me-2"></i> Markets
                </router-link>
                <router-link class="nav-link fw-semibold py-2 px-0" to="/category">
                  <i class="ai-grid fs-5 opacity-60 me-2"></i> Categories
                </router-link>
              </nav>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="col-lg-9 pt-4 pb-2 pb-sm-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="h2 mb-0">Markets List</h1>
          <router-link to="/addMarket">
            <button type="button" class="btn btn-primary">
              <i class="ai-circle-plus me-2 ms-n1"></i>Add Market
            </button>
          </router-link>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="alert alert-danger" role="alert">
          {{ error }}
          <button @click="fetchMarkets" class="btn btn-link">Retry</button>
        </div>

        <!-- Content -->
        <div v-else class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Market Logo</th>
                <th scope="col">Market Name</th>
                <th scope="col">Description</th>
                <th scope="col">Followers</th>
                <th scope="col">Products</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(market, index) in paginatedMarkets" :key="market.id">
                <th scope="row">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</th>
                <td>
                  <img 
                    :src="market.logo" 
                    :alt="market.name"
                    width="50" 
                    height="50"
                    class="rounded"
                    @error="handleImageError"
                  >
                </td>
                <td>{{ market.name }}</td>
                <td>{{ market.description }}</td>
                <td>{{ market.followers?.toLocaleString() || 0 }}</td>
                <td>{{ market.products?.toLocaleString() || 0 }}</td>
                <td>
                  <div class="btn-group">
                    <router-link 
                      :to="`/editMarket/${market.id}`"
                      class="btn btn-link"
                      title="Edit"
                    >
                      <i class="ai-edit fs-5"></i>
                    </router-link>
                    <button
                      @click="confirmDelete(market)"
                      class="btn btn-link"
                      title="Delete"
                    >
                      <i class="ai-trash fs-5"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="paginatedMarkets.length === 0">
                <td colspan="6" class="text-center py-4">No markets found</td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <nav v-if="totalPages > 1" aria-label="Page navigation">
            <div class="text-center">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a @click.prevent="prevPage" href="#" class="page-link">Prev</a>
                </li>
                <li class="page-item d-sm-none">
                  <span class="page-link pe-none">{{ currentPage }} / {{ totalPages }}</span>
                </li>
                <li 
                  v-for="page in pages" 
                  :key="page"
                  class="page-item d-none d-sm-block"
                  :class="{ active: currentPage === page }"
                >
                  <a 
                    @click.prevent="goToPage(page)" 
                    href="#" 
                    class="page-link"
                  >
                    {{ page }}
                  </a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <a @click.prevent="nextPage" href="#" class="page-link">Next</a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div 
      class="modal fade" 
      id="deleteModal" 
      tabindex="-1" 
      aria-labelledby="deleteModalLabel" 
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">Confirm Delete</h5>
            <button 
              type="button" 
              class="btn-close" 
              data-bs-dismiss="modal" 
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete the market "{{ selectedMarket?.name }}"?
            <div class="mt-2 text-danger">
              This action cannot be undone.
            </div>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button 
              type="button" 
              class="btn btn-danger" 
              @click="deleteMarket"
              :disabled="deleting"
            >
              {{ deleting ? 'Deleting...' : 'Delete' }}
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

export default {
  name: 'MarketsList',
  data() {
    return {
      markets: [],
      currentPage: 1,
      totalPages: 1,
      itemsPerPage: 5, // Changed to match users list
      loading: true,
      error: null,
      selectedMarket: null,
      deleting: false,
      deleteModal: null
    };
  },
  computed: {
    paginatedMarkets() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.markets.slice(start, end);
    },
    pages() {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }
  },
  methods: {
    async fetchMarkets() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('http://localhost:3000/markets');
        this.markets = response.data;
        this.totalPages = Math.ceil(this.markets.length / this.itemsPerPage);
      } catch (error) {
        this.error = 'Failed to fetch markets. Please try again.';
        console.error('Error fetching markets:', error);
      } finally {
        this.loading = false;
      }
    },
    confirmDelete(market) {
      this.selectedMarket = market;
      this.deleteModal.show();
    },
    async deleteMarket() {
      if (!this.selectedMarket) return;
      
      this.deleting = true;
      try {
        await axios.delete(`http://localhost:3000/markets/${this.selectedMarket.id}`);
        const index = this.markets.findIndex(m => m.id === this.selectedMarket.id);
        if (index !== -1) {
          this.markets.splice(index, 1);
          this.totalPages = Math.ceil(this.markets.length / this.itemsPerPage);
          if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages || 1;
          }
        }
        this.$toast?.success('Market deleted successfully');
        this.deleteModal.hide();
      } catch (error) {
        this.$toast?.error('Failed to delete market');
        console.error('Error deleting market:', error);
      } finally {
        this.deleting = false;
        this.selectedMarket = null;
      }
    },
    handleImageError(event) {
      event.target.src = '/placeholder-image.png'; // Replace with your placeholder image
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  },
  mounted() {
    this.deleteModal = new Modal(document.getElementById('deleteModal'));
  },
  created() {
    this.fetchMarkets();
  }
};
</script>

<style scoped>
.pagination {
  gap: 0.25rem;
}

.btn-link {
  color: inherit;
  text-decoration: none;
}

.btn-link:hover {
  color: var(--bs-primary);
}

.modal-header .btn-close {
  margin: -0.5rem -0.5rem -0.5rem auto;
}

img {
  object-fit: cover;
  border: 1px solid var(--bs-border-color);
}
</style>