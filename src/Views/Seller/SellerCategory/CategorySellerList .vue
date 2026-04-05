<template>
  <div class="announcements-management">
    <!-- Header + bouton -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h2 mb-0">Gestion des catégories</h1>
      <router-link to="/addSellerCategory">
        <button type="button" class="btn btn-primary">
          <i class="ai-circle-plus me-2 ms-n1"></i>Demander une catégorie
        </button>
      </router-link>
    </div>

    <!-- Barre de recherche (même style que gestion des annonces) -->
    <div class="filter-section mb-4">
      <div class="row g-3 align-items-end">
        <!-- Recherche par label -->
        <div class="col-md-6">
          <label class="form-label small mb-1">Recherche</label>
          <div class="input-group input-group-sm">
            <span class="input-group-text">
              <i class="ai-search"></i>
            </span>
            <input
              type="text"
              class="form-control"
              placeholder="Rechercher une catégorie..."
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

        <!-- Info nombre -->
        <div class="col-md-6 text-md-end mt-3 mt-md-0">
          <span class="text-muted small">
            {{ filteredCategories.length }} catégorie<span v-if="filteredCategories.length > 1">s</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Tableau des catégories -->
    <div class="card border-0 shadow-sm">
      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead>
            <tr>
              <th>Catégorie</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="3" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Chargement...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredCategories.length === 0">
              <td colspan="3" class="text-center py-4 text-muted">
                Aucune catégorie trouvée.
              </td>
            </tr>
            <tr
              v-else
              v-for="category in filteredCategories"
              :key="category.id"
            >
              <td class="fw-semibold">
                {{ category.label }}
              </td>
              <td class="text-muted">
                {{ category.description || '—' }}
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
  name: 'CategorySellerList',
  data() {
      return {
          categories: [],
          products: [],
          loading: false,
          error: null,
          searchQuery: '',
      };
  },
  computed: {
      // New computed property that adds product counts to categories
      categoriesWithProductCounts() {
          // Create a mapping of category ID to count
          const categoryCounts = {};
          
          // Count products for each category
          this.products.forEach(product => {
              if (product.category) {
                  categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
              }
          });
          
          // Return categories with product counts
          return this.categories.map(category => ({
              ...category,
              productCount: categoryCounts[category.id] || 0
          }));
      },

      filteredCategories() {
          const list = this.categoriesWithProductCounts;
          if (!this.searchQuery) return list;
          const q = this.searchQuery.toLowerCase();
          return list.filter(category =>
              (category.label || '').toLowerCase().includes(q) ||
              (category.description || '').toLowerCase().includes(q)
          );
      }
  },
  methods: {
      async fetchCategories() {
          try {
              const response = await axios.get('http://localhost:3000/categories');
              this.categories = response.data;
              console.log("Categories loaded:", this.categories);
          } catch (error) {
              console.error('Error fetching categories:', error);
              this.error = 'Failed to load categories';
          }
      },
      
      async fetchProducts() {
          this.loading = true;
          try {
              const response = await axios.get('http://localhost:3000/products');
              this.products = response.data;
              console.log("Products loaded:", this.products.length);
          } catch (error) {
              console.error('Error fetching products:', error);
              this.error = 'Failed to fetch products';
          } finally {
              this.loading = false;
          }
      },
      
      // Delete category from the backend and the local list
      async deleteCategory(categoryId, index) {
          try {
              const response = await axios.delete(`http://localhost:3000/categories/${categoryId}`);
              if (response.status === 200) {
                  this.categories.splice(index, 1);
              }
          } catch (error) {
              console.error("Error deleting category:", error);
              alert("Failed to delete category. Please try again.");
          }
      },
      
      // Update categories in the backend with product counts
      async updateCategoryProductCounts() {
          if (!this.categories || !this.products) return;
          
          try {
              const counts = {};
              
              // Count products for each category
              this.products.forEach(product => {
                  if (product.category) {
                      counts[product.category] = (counts[product.category] || 0) + 1;
                  }
              });
              
              // Update category records with counts
              for (const category of this.categories) {
                  const count = counts[category.id] || 0;
                  
                  // Only update if the count is different
                  if (category.numberOfProducts !== count) {
                      await axios.patch(`http://localhost:3000/categories/${category.id}`, {
                          numberOfProducts: count
                      });
                      console.log(`Updated count for category ${category.label} to ${count}`);
                  }
              }
              
              // Refresh categories after update
              await this.fetchCategories();
              
          } catch (error) {
              console.error('Error updating category product counts:', error);
          }
      }
  },
  async mounted() {
      // Load both categories and products on component mount
      await this.fetchCategories();
      await this.fetchProducts();
      
      // Update category counts in the backend
      this.updateCategoryProductCounts();
  },
};
</script>