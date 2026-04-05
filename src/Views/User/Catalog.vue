<template>
  <!-- Page container -->
  <div class="container py-5 mt-5 mb-lg-4 mb-xl-5">
    <!-- Page title -->
    <div class="row pt-xl-3 mt-n1 mt-sm-0 mb-4">
      <div class="col-12">
        <h1 class="h2 mb-0">Annonces</h1>
      </div>
    </div>
    <div class="row pb-2 pb-sm-4">

      <!-- Sidebar (offcanvas on sreens < 992px) -->
      <aside class="col-lg-3">
        <div class="offcanvas-lg offcanvas-start" id="shopSidebar">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title">Filtres</h5>
            <button class="btn-close" type="button" data-bs-dismiss="offcanvas" data-bs-target="#shopSidebar" aria-label="Close"></button>
          </div>

          <!-- Body -->
          <div class="offcanvas-body pt-2 pt-lg-0 pe-lg-4 filter-sidebar">

            <!-- Categories -->
            <h3 class="h5">Categories</h3>
            <!-- Category (checkboxes) -->
            <div class="pb-2">
              <div class="form-check" v-for="(count, categoryId) in categoryFilters" :key="categoryId">
                <input class="form-check-input" type="checkbox" :value="categoryId" :id="'category-'+categoryId" 
                       v-model="selectedCategoryFilters" @change="applyFilters">
                <label class="form-check-label d-flex align-items-center" :for="'category-'+categoryId">
                  <span class="text-nav fw-medium">{{ getCategoryName(categoryId) }}</span>
                  <span class="fs-xs text-body-secondary ms-auto">{{ count }}</span>
                </label>
              </div>
            </div>

            <!-- Price (range slider + inputs) -->
            <div>
              <h3 class="h5">Price</h3>
              
              <div class="d-flex">
                <div class="d-flex align-items-center w-50">
                  <label class="form-label fs-xs me-2 mb-0" for="price-min">From</label>
                  <input class="form-control form-control-sm range-slider-value-min" type="number" 
                         style="max-width: 6rem;" id="price-min" placeholder="0" 
                         v-model="priceRange.min" @change="applyFilters">
                </div>
                <div class="d-flex align-items-center justify-content-end w-50">
                  <label class="form-label fs-xs me-2 mb-0" for="price-max">To</label>
                  <input class="form-control form-control-sm range-slider-value-max" type="number" 
                         style="max-width: 6rem;" id="price-max" placeholder="10000" 
                         v-model="priceRange.max" @change="applyFilters">
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Product grid -->
      <div class="col-lg-9">
        <!-- Search bar -->
        <div class="filter-section mb-4">
          <div class="row g-3 align-items-end">
            <div class="col-md-8">
              <label class="form-label small mb-1">Recherche</label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="ai-search"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Rechercher une annonce..."
                  v-model="searchQuery"
                  @input="updateSearchRoute"
                />
                <button 
                  v-if="searchQuery" 
                  class="btn btn-outline-secondary" 
                  type="button"
                  @click="searchQuery = ''; updateSearchRoute();"
                >
                  <i class="ai-x"></i>
                </button>
              </div>
            </div>
            <div class="col-md-4">
              <label class="form-label small mb-1">Trier par</label>
              <select class="form-select" v-model="sortOption" @change="applySort">
                <option value="popular">Plus populaires</option>
                <option value="low-high">Prix croissant</option>
                <option value="high-low">Prix décroissant</option>
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Active filters -->
        <div class="d-flex flex-wrap gap-2 mb-4" v-if="hasActiveFilters">
          <span class="badge bg-secondary text-nav fs-xs border rounded-pill d-flex align-items-center" 
                v-for="filter in activeFilters" :key="filter.type + filter.value">
            {{ filter.label }}: {{ filter.value }}
            <button class="btn btn-icon btn-xs ms-2" type="button" @click="removeFilter(filter)">
              <i class="ai-cross-alt fs-xs"></i>
            </button>
          </span>
          <button class="btn btn-outline-secondary btn-sm rounded-pill" @click="clearAllFilters">
            <i class="ai-cross-alt me-1 fs-xs"></i>
            Tout effacer
          </button>
        </div>
        
        <!-- Loading indicator -->
        <div class="text-center py-5" v-if="loading">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Chargement...</span>
          </div>
          <p class="mt-2">Chargement des annonces...</p>
        </div>
        
        <!-- Error message -->
        <div class="text-center py-5" v-else-if="error">
          <div class="alert alert-danger">
            {{ error }}
          </div>
        </div>
        
        <!-- No products message -->
        <div class="text-center py-5" v-else-if="filteredProducts.length === 0">
          <i class="ai-box fs-1 d-block mb-3 opacity-50"></i>
          <p class="fs-5 text-muted mb-0">Aucune annonce ne correspond à vos critères.</p>
          <button class="btn btn-outline-primary mt-3" @click="clearAllFilters">
            Effacer tous les filtres
          </button>
        </div>
        
        <!-- Announcements Grid (like ProductsList) -->
        <div v-else class="announcements-grid">
          <div 
            v-for="product in filteredProducts" 
            :key="product.id"
            class="announcement-card"
            @click="goToProductDetail(product.id)"
            style="cursor: pointer;"
          >
            <!-- Image principale -->
            <div class="card-image-container">
              <img 
                :src="getMainImage(product)" 
                :alt="product.name"
                class="card-image"
                @error="handleImageError"
                loading="lazy"
              />
              <!-- Badge wishlist -->
              <button 
                class="btn btn-icon btn-sm btn-light bg-light border-0 rounded-circle position-absolute top-0 end-0 mt-3 me-3 z-5" 
                type="button" 
                aria-label="Add to Favorites"
                @click.stop="toggleWishlist(product)">
                <i class="ai-heart fs-xl" :class="isInWishlist(product.id) ? 'text-danger' : 'text-nav'"></i>
              </button>
              <!-- Indicateur multiple images -->
              <span v-if="getImageCount(product) > 1" class="images-count-badge">
                <i class="ai-image"></i> {{ getImageCount(product) }}
              </span>
            </div>

            <!-- Card Body -->
            <div class="card-body-content">
              <h3 class="card-title">{{ product.name }}</h3>
              <p class="card-description">{{ truncateText(product.description, 100) }}</p>
              
              <div class="card-meta">
                <span class="card-category">
                  <i class="ai-grid"></i> {{ getCategoryName(product.category) }}
                </span>
                <span class="card-price">{{ formatPrice(product.price) }}</span>
              </div>

              <!-- Vendeur -->
              <div class="card-stats card-seller-row" v-if="product.sellerName">
                <router-link
                  v-if="product.sellerId"
                  :to="{ name: 'SellerStore', params: { sellerId: String(product.sellerId) } }"
                  class="card-quantity d-inline-flex align-items-center gap-2 text-decoration-none text-body-secondary"
                  @click.stop
                >
                  <span class="catalog-seller-avatar rounded-circle overflow-hidden flex-shrink-0">
                    <img
                      v-if="product.sellerPhoto"
                      :src="product.sellerPhoto"
                      alt=""
                      class="w-100 h-100 object-fit-cover"
                    />
                    <span v-else class="catalog-seller-initials">{{ sellerInitialsFromName(product.sellerName) }}</span>
                  </span>
                  <span class="text-truncate">{{ product.sellerName }}</span>
                </router-link>
                <span v-else class="card-quantity d-inline-flex align-items-center gap-2">
                  <span class="catalog-seller-avatar rounded-circle overflow-hidden flex-shrink-0">
                    <img
                      v-if="product.sellerPhoto"
                      :src="product.sellerPhoto"
                      alt=""
                      class="w-100 h-100 object-fit-cover"
                    />
                    <span v-else class="catalog-seller-initials">{{ sellerInitialsFromName(product.sellerName) }}</span>
                  </span>
                  <span class="text-truncate">{{ product.sellerName }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="row gy-3 align-items-center pt-3 pt-sm-4 mt-md-2" v-if="!loading && filteredProducts.length > 0">
          <div class="col col-md-4 col-6 order-md-1 order-1">
            <div class="d-flex align-items-center">
              <span class="text-body-secondary fs-sm">Show</span>
              <select class="form-select form-select-flush w-auto" v-model="productsPerPage" @change="updatePagination">
                <option value="12">12</option>
                <option value="18">18</option>
                <option value="24">24</option>
                <option value="30">30</option>
              </select>
            </div>
          </div>
          <div class="col col-md-4 col-12 order-md-2 order-3 text-center">
            <button class="btn btn-primary w-md-auto w-100" type="button" @click="loadMoreProducts" 
                    v-if="currentPage < totalPages">Load more products</button>
          </div>
          <div class="col col-md-4 col-6 order-md-3 order-2">
            <nav aria-label="Page navigation">
              <ul class="pagination pagination-sm justify-content-end">
                <li class="page-item" v-for="page in paginationPages" :key="page" 
                    :class="{ 'active': page === currentPage }">
                  <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Sidebar toggle button -->
  <button class="d-lg-none btn btn-sm fs-sm btn-primary w-100 rounded-0 fixed-bottom" type="button" 
          data-bs-toggle="offcanvas" data-bs-target="#shopSidebar">
    <i class="ai-filter me-2"></i>
    Filtres
  </button>

  <!-- Vue détaillée du produit (plein écran) -->
  <div v-if="showProductDetail && selectedProductDetail" class="product-detail-overlay">
    <div class="product-detail-container">
      <!-- Header avec flèche de retour -->
      <div class="product-detail-header">
        <button @click="closeProductDetail" class="btn-back">
          <i class="ai-arrow-left"></i>
        </button>
        <h2 class="product-detail-title">{{ selectedProductDetail.name }}</h2>
      </div>
      
      <!-- Contenu détaillé -->
      <div class="product-detail-content">
        <div class="row g-4">
          <!-- Images -->
          <div class="col-md-6">
            <div class="product-detail-images">
              <div class="image-gallery-wrapper">
                <!-- Liste verticale des miniatures -->
                <div v-if="getAllImages(selectedProductDetail).length > 1" class="image-thumbnails-vertical">
                  <div 
                    v-for="(image, index) in getAllImages(selectedProductDetail)" 
                    :key="index"
                    @click="currentImageIndex = index"
                    :class="['thumbnail-item', { active: currentImageIndex === index }]"
                  >
                    <img 
                      :src="image" 
                      :alt="`${selectedProductDetail.name} - Image ${index + 1}`"
                      class="thumbnail-image"
                    />
                  </div>
                </div>
                
                <!-- Image principale -->
                <div class="image-main-container">
                  <img 
                    v-if="getCurrentImage(selectedProductDetail)"
                    :src="getCurrentImage(selectedProductDetail)" 
                    :alt="selectedProductDetail.name"
                    class="product-detail-main-image"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <!-- Détails -->
          <div class="col-md-6">
            <div class="product-detail-info">
              <!-- Titre -->
              <h1 class="product-detail-name">{{ selectedProductDetail.name }}</h1>
              
              <!-- Prix principal -->
              <div class="product-detail-price-main">
                {{ formatPrice(selectedProductDetail.price) }}
              </div>
              
              <!-- Description -->
              <div class="product-detail-description">
                {{ selectedProductDetail.description }}
              </div>
              
              <!-- Informations avec icônes -->
              <div class="product-info-grid">
                <div class="info-item-modern">
                  <div class="info-icon">
                    <i class="ai-grid"></i>
                  </div>
                  <div class="info-content">
                    <div class="info-label">Catégorie</div>
                    <div class="info-value">{{ getCategoryName(selectedProductDetail.category) }}</div>
                  </div>
                </div>
                
                <div class="info-item-modern" v-if="selectedProductDetail.sellerName">
                  <div class="info-icon">
                    <i class="ai-user"></i>
                  </div>
                  <div class="info-content">
                    <div class="info-label">Vendeur</div>
                    <div class="info-value d-flex align-items-center gap-2 flex-wrap">
                      <span class="catalog-seller-avatar rounded-circle overflow-hidden flex-shrink-0">
                        <img
                          v-if="selectedProductDetail.sellerPhoto"
                          :src="selectedProductDetail.sellerPhoto"
                          alt=""
                          class="w-100 h-100 object-fit-cover"
                        />
                        <span v-else class="catalog-seller-initials">{{ sellerInitialsFromName(selectedProductDetail.sellerName) }}</span>
                      </span>
                      <router-link
                        v-if="selectedProductDetail.sellerId"
                        :to="{ name: 'SellerStore', params: { sellerId: String(selectedProductDetail.sellerId) } }"
                        class="text-body text-decoration-none"
                      >
                        {{ selectedProductDetail.sellerName }}
                      </router-link>
                      <template v-else>{{ selectedProductDetail.sellerName }}</template>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Actions -->
              <div class="product-detail-actions-modern">
                <router-link 
                  :to="`/shop-single/${selectedProductDetail.id}`"
                  class="btn-action-modern btn-edit"
                >
                  <i class="ai-eye"></i>
                  <span>Voir les détails</span>
                </router-link>
                <button
                  @click="toggleWishlist(selectedProductDetail)"
                  class="btn-action-modern btn-delete"
                  :class="{ 'btn-wishlist-active': isInWishlist(selectedProductDetail.id) }"
                >
                  <i class="ai-heart"></i>
                  <span>{{ isInWishlist(selectedProductDetail.id) ? 'Retirer des favoris' : 'Ajouter aux favoris' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { addToCart as addToCartApi } from '../../utils/cart';
import { toast } from '../../utils/toast';

const API_BASE = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';

export default {
  name: "CatalogComponent",
  data() {
    return {
      apiBase: API_BASE,
      products: [],
      categories: [],
      wishlist: [],
      selectedCategoryFilters: [],
      priceRange: {
        min: 0,
        max: 100
      },
      
      // Sorting and pagination
      sortOption: "popular",
      currentPage: 1,
      productsPerPage: 12,
      loading: false,
      error: null,
      searchQuery: '',
      itemsPerPage: 12,
      selectedProductDetail: null,
      showProductDetail: false,
      currentImageIndex: 0
    };
  },
  computed: {
    // Products with allProducts reference fixed
    allProducts() {
      return this.products || [];
    },
    
    // Modified to show all categories from admin list with product counts
    categoryFilters() {
      const counts = {};
      
      // Initialize all categories from admin list with zero count
      if (this.categories && this.categories.length > 0) {
        this.categories.forEach(category => {
          counts[category.id] = 0;
        });
      }
      
      // Then count products in each category (API: categoryId ou category { id })
      this.allProducts.forEach(product => {
        const cid = this.getProductCategoryId(product);
        if (cid != null && counts[cid] !== undefined) {
          counts[cid]++;
        }
      });
      
      return counts;
    },
    
    // Calculate category counts for API sharing
    categoryProductCounts() {
      const counts = {};
      
      this.allProducts.forEach(product => {
        const cid = this.getProductCategoryId(product);
        if (cid != null) {
          counts[cid] = (counts[cid] || 0) + 1;
        }
      });
      
      return counts;
    },
    
    searchQueryNormalized() {
      return this.normalizeSearchString(this.searchQuery);
    },

    // Apply all filters to products
    filteredProducts() {
      let result = [...this.allProducts];
      const searchQuery = this.searchQueryNormalized;
      
      // Apply category filter
      if (this.selectedCategoryFilters.length > 0) {
        result = result.filter(product => {
          const cid = this.getProductCategoryId(product);
          return cid != null && this.selectedCategoryFilters.some(fid => fid == cid);
        });
      }
      
      // Apply price range filter
      result = result.filter(product => {
        const price = this.normalizePrice(product.price);
        return price >= this.priceRange.min && price <= this.priceRange.max;
      });

      // Apply search filter
      if (searchQuery) {
        result = result.filter(product => this.matchesSearch(product, searchQuery));
      }
      
      // Apply sorting
      result = this.sortProducts(result);
      
      // Apply pagination
      const startIndex = (this.currentPage - 1) * this.productsPerPage;
      return result.slice(startIndex, startIndex + this.productsPerPage);
    },
    
    // Total number of products after filtering
    totalFilteredProducts() {
      let result = [...this.allProducts];
      const searchQuery = this.searchQueryNormalized;
      
      // Apply category filter
      if (this.selectedCategoryFilters.length > 0) {
        result = result.filter(product => {
          const cid = this.getProductCategoryId(product);
          return cid != null && this.selectedCategoryFilters.some(fid => fid == cid);
        });
      }
      
      // Apply price range filter
      result = result.filter(product => {
        const price = this.normalizePrice(product.price);
        return price >= this.priceRange.min && price <= this.priceRange.max;
      });

      // Apply search filter
      if (searchQuery) {
        result = result.filter(product => this.matchesSearch(product, searchQuery));
      }
      
      return result.length;
    },
    
    // Calculate total pages for pagination
    totalPages() {
      return Math.ceil(this.totalFilteredProducts / this.productsPerPage);
    },
    
    // Generate array of page numbers for pagination
    paginationPages() {
      const pages = [];
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
      return pages;
    },
    
    // Determine if any filters are active
    hasActiveFilters() {
      return this.activeFilters.length > 0;
    },
    
    // Get array of active filters for display
    activeFilters() {
      const filters = [];
      
      // Add category filters
      this.selectedCategoryFilters.forEach(category => {
        filters.push({
          type: 'category',
          label: 'Category',
          value: this.getCategoryName(category)
        });
      });
      
      // Add price filter if different from default
      if (this.priceRange.min > 0 || this.priceRange.max < 100) {
        filters.push({
          type: 'price',
          label: 'Price',
          value: `$${this.priceRange.min} - $${this.priceRange.max}`
        });
      }

      if (this.searchQueryNormalized) {
        filters.push({
          type: 'search',
          label: 'Search',
          value: this.searchQuery.trim()
        });
      }
      
      return filters;
    }
  },
  watch: {
    products: {
      handler(newProducts) {
        if (newProducts && newProducts.length > 0) {
          this.updateCategoryProductCounts();
        }
      },
      immediate: true
    },
    '$route.query.q'(nextQuery) {
      this.searchQuery = typeof nextQuery === 'string' ? nextQuery.trim() : '';
      this.currentPage = 1;
    },
    '$route.query.categoryId'(next) {
      this.applyCategoryIdFromRoute(next);
    }
  },
  methods: {
    applyCategoryIdFromRoute(categoryIdRaw) {
      const raw = categoryIdRaw != null ? String(categoryIdRaw) : '';
      if (!raw) {
        return;
      }
      const n = Number(raw);
      if (Number.isNaN(n)) {
        return;
      }
      this.selectedCategoryFilters = [n];
      this.currentPage = 1;
    },

    sellerInitialsFromName(name) {
      const n = String(name || '').trim();
      if (!n) return '?';
      const parts = n.split(/\s+/);
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      return n.slice(0, 2).toUpperCase();
    },

    // Normalize price to ensure it's always a number
    normalizePrice(price) {
      if (price === null || price === undefined || price === '') {
        return 0;
      }
      const numPrice = typeof price === 'string' ? parseFloat(price) : Number(price);
      return isNaN(numPrice) ? 0 : numPrice;
    },
    
    // Format price for display
    formatPrice(price) {
      const numPrice = this.normalizePrice(price);
      return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(numPrice) + ' DT';
    },
    
    normalizeSearchString(value) {
      return String(value || '').toLowerCase().trim();
    },

    matchesSearch(product, query) {
      if (!query) return true;
      const name = product?.name || '';
      const description = product?.description || '';
      const category = this.getCategoryName(product?.category);
      const market =
        product?.market != null && product.market !== ''
          ? this.formatMarketName(product.market)
          : '';
      const seller = product?.sellerName || '';
      const haystack = `${name} ${description} ${category} ${market} ${seller}`.toLowerCase();
      return haystack.includes(query);
    },

    updateSearchRoute() {
      const trimmed = this.searchQuery.trim();
      const nextQuery = { ...this.$route.query };
      if (trimmed) {
        nextQuery.q = trimmed;
      } else {
        delete nextQuery.q;
      }
      this.$router.replace({ path: this.$route.path, query: nextQuery });
    },

    async fetchCategories() {
      try {
        const response = await axios.get(`${this.apiBase}/categories`);
        this.categories = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        console.log("Categories loaded:", this.categories);
        
        // Update category product counts after loading categories
        if (this.products.length > 0) {
          this.updateCategoryProductCounts();
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        this.error = 'Failed to load categories';
      }
    },
    
    // New method to update all categories with product counts
    async updateCategoryProductCounts() {
      if (!this.categories || this.categories.length === 0) return;
      
      const counts = this.categoryProductCounts;
      
      // Update each category with its product count
      const updatedCategories = this.categories.map(category => {
        const count = counts[category.id] || 0;
        
        // Only send update request if the count is different
        if (category.numberOfProducts !== count) {
          return {
            ...category,
            numberOfProducts: count
          };
        }
        return category;
      });
      
      // Update categories in local state
      this.categories = updatedCategories;
      
      // Update counts in backend
      try {
        for (const category of updatedCategories) {
          if (category.numberOfProducts !== undefined) {
            await axios.patch(`${this.apiBase}/categories/${category.id}`, {
              numberOfProducts: category.numberOfProducts
            });
          }
        }
        console.log("Updated category product counts in backend");
      } catch (error) {
        console.error("Failed to update category product counts:", error);
      }
    },
    
    /** Pour la recherche texte si le produit a un champ market */
    formatMarketName(marketId) {
      if (!marketId) return '';
      if (typeof marketId === 'string') {
        return marketId
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
      return String(marketId);
    },

    /** ID catégorie depuis l’API (categoryId ou relation category { id }) */
    getProductCategoryId(product) {
      if (!product) return null;
      if (product.categoryId != null && product.categoryId !== '') {
        const n = Number(product.categoryId);
        return Number.isNaN(n) ? null : n;
      }
      const c = product.category;
      if (c == null || c === '') return null;
      if (typeof c === 'object' && c.id != null) {
        const n = Number(c.id);
        return Number.isNaN(n) ? null : n;
      }
      const n = Number(c);
      return Number.isNaN(n) ? null : n;
    },

    getCategoryName(categoryOrId) {
      if (categoryOrId == null || categoryOrId === '') return 'Unknown Category';
      if (typeof categoryOrId === 'object') {
        const label = categoryOrId.label;
        if (label) return String(label).trim() || 'Unknown Category';
        const id = categoryOrId.id;
        if (id != null) {
          const category = this.categories.find(cat => cat.id == id);
          return category ? category.label : 'Unknown Category';
        }
        return 'Unknown Category';
      }
      const category = this.categories.find(cat => cat.id == categoryOrId);
      return category ? category.label : 'Unknown Category';
    },

    async fetchProducts() {
      this.loading = true;
      this.error = null;
      try {
        // Fetch categories first
        await this.fetchCategories();
        
        const response = await axios.get(`${this.apiBase}/products`);
        const rawProducts = Array.isArray(response.data) ? response.data : (response.data?.data || response.data?.products || []);
        // Normalize products - ensure price is always a number
        this.products = rawProducts.map(product => ({
          ...product,
          price: this.normalizePrice(product.price),
          oldPrice: product.oldPrice ? this.normalizePrice(product.oldPrice) : null
        }));
        console.log("Products loaded:", this.products.length);
        
        // Set initial price range based on product data
        if (this.products.length > 0) {
          const prices = this.products.map(p => p.price).filter(p => typeof p === 'number' && !isNaN(p));
          if (prices.length > 0) {
            this.priceRange.min = Math.floor(Math.min(...prices));
            this.priceRange.max = Math.ceil(Math.max(...prices));
          }
        }
        
      } catch (error) {
        this.error = 'Failed to fetch products. Please try again.';
        console.error('Error fetching products:', error);
      } finally {
        this.loading = false;
      }
    },
    
    // Get product name using category ID
    getProductName(categoryId) {
      return this.getCategoryName(categoryId);
    },
    
    // Apply all filters
    applyFilters() {
      this.currentPage = 1; // Reset to first page when filters change
    },
    
    // Remove a specific filter
    removeFilter(filter) {
      if (filter.type === 'category') {
        this.selectedCategoryFilters = this.selectedCategoryFilters.filter(cat => {
          return this.getCategoryName(cat) !== filter.value;
        });
      } else if (filter.type === 'price') {
        this.priceRange.min = 0;
        const prices = this.allProducts.map(p => this.normalizePrice(p.price)).filter(p => !isNaN(p) && p > 0);
        this.priceRange.max = prices.length > 0 ? Math.max(...prices) : 100;
      } else if (filter.type === 'search') {
        this.searchQuery = '';
        this.updateSearchRoute();
      }
      this.applyFilters();
    },
    
    // Clear all filters
    clearAllFilters() {
      this.selectedCategoryFilters = [];
      this.searchQuery = '';
      this.updateSearchRoute();
      
      // Reset price range to min/max of available products
      if (this.allProducts.length > 0) {
        const prices = this.allProducts.map(p => this.normalizePrice(p.price)).filter(p => !isNaN(p) && p > 0);
        if (prices.length > 0) {
          this.priceRange.min = Math.floor(Math.min(...prices));
          this.priceRange.max = Math.ceil(Math.max(...prices));
        } else {
          this.priceRange.min = 0;
          this.priceRange.max = 100;
        }
      } else {
        this.priceRange.min = 0;
        this.priceRange.max = 100;
      }
      
      this.applyFilters();
    },
    
    // Apply sorting
    applySort() {
      // No additional action needed as computed property handles this
    },
    
    // Sort products based on selected option
    sortProducts(products) {
      const sortedProducts = [...products];
      
      switch (this.sortOption) {
        case 'low-high':
          return sortedProducts.sort((a, b) => {
            const priceA = this.normalizePrice(a.price);
            const priceB = this.normalizePrice(b.price);
            return priceA - priceB;
          });
        case 'high-low':
          return sortedProducts.sort((a, b) => {
            const priceA = this.normalizePrice(a.price);
            const priceB = this.normalizePrice(b.price);
            return priceB - priceA;
          });
        case 'az':
          return sortedProducts.sort((a, b) => {
            const nameA = this.getProductName(a.category) || '';
            const nameB = this.getProductName(b.category) || '';
            return nameA.localeCompare(nameB);
          });
        case 'za':
          return sortedProducts.sort((a, b) => {
            const nameA = this.getProductName(a.category) || '';
            const nameB = this.getProductName(b.category) || '';
            return nameB.localeCompare(nameA);
          });
        case 'rating':
          // Would need actual rating data - for now just return unsorted
          return sortedProducts;
        case 'popular':
        default:
          // This would typically be based on a popularity metric
          // For now, just return the original order
          return sortedProducts;
      }
    },
    
    // Update products per page
    updatePagination() {
      this.currentPage = 1; // Reset to first page when changing items per page
    },
    
    // Go to specific page
    goToPage(page) {
      this.currentPage = page;
      // In a real application, you might want to scroll to top of products
      window.scrollTo(0, 0);
    },
    
    // Load more products (increment page)
    loadMoreProducts() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    
    async addToCart(product) {
      if (!product?.id) return;
      const snapshot = {
        id: product.id,
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice ?? null,
        image: this.getMainImage(product),
        images: product.images,
      };
      try {
        await addToCartApi(axios, product.id, 1, snapshot);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cart-updated'));
        }
        toast.cart(`« ${product.name} » ajouté au panier`);
      } catch (e) {
        toast.error('Impossible d\'ajouter au panier. Réessayez.');
      }
    },
    
    // Wishlist methods
    isInWishlist(productId) {
      return this.wishlist.some(item => item.id === productId);
    },
    
    toggleWishlist(product) {
      if (this.isInWishlist(product.id)) {
        this.removeFromWishlist(product.id);
      } else {
        this.addToWishlist(product);
      }
    },
    
    addToWishlist(product) {
      if (!this.isInWishlist(product.id)) {
        this.wishlist.push(product);
        this.saveWishlistToStorage();
      }
    },
    
    removeFromWishlist(productId) {
      this.wishlist = this.wishlist.filter(item => item.id !== productId);
      this.saveWishlistToStorage();
    },
    
    saveWishlistToStorage() {
      localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    },
    
    loadWishlistFromStorage() {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        this.wishlist = JSON.parse(savedWishlist);
      }
    },

    // Image methods (like ProductsList)
    getMainImage(product) {
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        const firstImage = product.images[0];
        if (typeof firstImage === 'object' && firstImage !== null && firstImage.url) {
          return firstImage.url;
        }
        if (typeof firstImage === 'string') {
          return firstImage;
        }
      }
      if (product.image) {
        return product.image;
      }
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BdWN1bmUgaW1hZ2U8L3RleHQ+PC9zdmc+';
    },

    getImageCount(product) {
      if (product.images && Array.isArray(product.images)) {
        return product.images.length;
      }
      return product.image ? 1 : 0;
    },

    getAllImages(product) {
      const images = [];
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        product.images.forEach(image => {
          if (typeof image === 'object' && image !== null && image.url) {
            images.push(image.url);
          } else if (typeof image === 'string') {
            images.push(image);
          }
        });
      } else if (product.image) {
        images.push(product.image);
      }
      return images;
    },

    getCurrentImage(product) {
      const images = this.getAllImages(product);
      if (images.length > 0 && this.currentImageIndex < images.length) {
        return images[this.currentImageIndex];
      }
      return images[0] || null;
    },

    truncateText(text, maxLength) {
      if (!text) return '';
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    },

    goToProductDetail(productId) {
      this.$router.push({ path: `/shop-single/${productId}` });
    },

    openProductDetail(product) {
      this.selectedProductDetail = product;
      this.currentImageIndex = 0;
      this.showProductDetail = true;
      document.body.style.overflow = 'hidden';
    },

    closeProductDetail() {
      this.showProductDetail = false;
      this.selectedProductDetail = null;
      this.currentImageIndex = 0;
      document.body.style.overflow = '';
    },

    handleImageError(event) {
      if (event.target.dataset.errorHandled) {
        return;
      }
      event.target.dataset.errorHandled = 'true';
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BdWN1bmUgaW1hZ2U8L3RleHQ+PC9zdmc+';
      event.target.style.objectFit = 'cover';
    }
  },
  created() {
    this.searchQuery = typeof this.$route.query.q === 'string' ? this.$route.query.q.trim() : '';
    this.applyCategoryIdFromRoute(this.$route.query.categoryId);
    // Load initial data
    this.fetchProducts();
    this.loadWishlistFromStorage();
  }
};
</script>

<style scoped>
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

.filter-sidebar {
  background-color: var(--ar-secondary-bg, #f6f9fc);
}

[data-bs-theme="dark"] .filter-sidebar {
  background-color: #1c2128;
}

/* Cards Grid */
.announcements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .announcements-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
}

/* Announcement Card */
.announcement-card {
  background-color: var(--ar-body-bg, #fff);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--ar-border-color, rgba(0, 0, 0, 0.1));
}

[data-bs-theme="dark"] .announcement-card {
  background-color: #161b22;
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.announcement-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

[data-bs-theme="dark"] .announcement-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
}

/* Image Container */
.card-image-container {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  background-color: var(--ar-secondary-bg, #f6f9fc);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.announcement-card:hover .card-image {
  transform: scale(1.05);
}

/* Images Count Badge */
.images-count-badge {
  position: absolute;
  bottom: 12px;
  right: 12px;
  padding: 0.35rem 0.7rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Card Body */
.card-body-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--ar-emphasis-color, #121519);
  line-height: 1.4;
}

[data-bs-theme="dark"] .card-title {
  color: #fff;
}

.card-description {
  font-size: 0.875rem;
  color: var(--ar-body-color-secondary, #6b7280);
  margin-bottom: 1rem;
  line-height: 1.5;
  flex: 1;
}

[data-bs-theme="dark"] .card-description {
  color: rgba(255, 255, 255, 0.7);
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--ar-border-color, rgba(0, 0, 0, 0.1));
}

[data-bs-theme="dark"] .card-meta {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.card-category {
  font-size: 0.8rem;
  color: var(--ar-body-color-secondary, #6b7280);
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

[data-bs-theme="dark"] .card-category {
  color: rgba(255, 255, 255, 0.6);
}

.card-price {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--ar-primary, #c62828);
}

[data-bs-theme="dark"] .card-price {
  color: #60d9a0;
}

.card-stats {
  margin-bottom: 1rem;
}

.card-quantity {
  font-size: 0.875rem;
  color: var(--ar-body-color-secondary, #6b7280);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

[data-bs-theme="dark"] .card-quantity {
  color: rgba(255, 255, 255, 0.7);
}

/* Vue détaillée du produit */
.product-detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--ar-body-bg, #fff);
  z-index: 1050;
  overflow-y: auto;
}

[data-bs-theme="dark"] .product-detail-overlay {
  background-color: #0d1117;
}

.product-detail-container {
  min-height: 100vh;
  padding: 2rem;
}

.product-detail-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--ar-border-color, rgba(0, 0, 0, 0.1));
}

[data-bs-theme="dark"] .product-detail-header {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.btn-back {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--ar-emphasis-color, #121519);
  cursor: pointer;
  padding: 0.5rem;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

[data-bs-theme="dark"] .btn-back {
  color: #fff;
}

.btn-back:hover {
  color: var(--ar-primary, #c62828);
}

.product-detail-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--ar-emphasis-color, #121519);
}

[data-bs-theme="dark"] .product-detail-title {
  color: #fff;
}

.product-detail-content {
  margin-top: 2rem;
}

.product-detail-images {
  position: relative;
  width: 100%;
}

.image-gallery-wrapper {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.image-thumbnails-vertical {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 0.5rem;
  min-width: 80px;
  flex-shrink: 0;
}

.thumbnail-item {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  background-color: var(--ar-secondary-bg, #f6f9fc);
  flex-shrink: 0;
}

.thumbnail-item:hover {
  border-color: var(--ar-primary, #c62828);
  transform: scale(1.05);
}

.thumbnail-item.active {
  border-color: var(--ar-primary, #c62828);
  border-width: 3px;
  box-shadow: 0 0 0 2px rgba(var(--ar-primary-rgb), 0.2);
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-main-container {
  flex: 1;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background-color: var(--ar-secondary-bg, #f6f9fc);
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-detail-main-image {
  width: 100%;
  height: auto;
  max-height: 600px;
  object-fit: contain;
  display: block;
  border-radius: 12px;
}

.product-detail-info {
  padding-left: 1.5rem;
}

.product-detail-name {
  font-size: 2rem;
  font-weight: 700;
  color: var(--ar-emphasis-color, #121519);
  margin-bottom: 1rem;
  line-height: 1.2;
}

[data-bs-theme="dark"] .product-detail-name {
  color: #fff;
}

.product-detail-price-main {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--ar-primary, #c62828);
  margin-bottom: 1.5rem;
  line-height: 1;
}

[data-bs-theme="dark"] .product-detail-price-main {
  color: #60d9a0;
}

.product-detail-description {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--ar-body-color, #6c757d);
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--ar-border-color, rgba(0, 0, 0, 0.08));
}

.product-info-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.info-item-modern {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.info-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--ar-primary, #c62828) 0%, rgba(var(--ar-primary-rgb), 0.8) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon i {
  font-size: 1.5rem !important;
  color: #ffffff !important;
}

.info-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--ar-body-color-secondary, #9ca3af);
}

.info-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--ar-emphasis-color, #121519);
}

.product-detail-actions-modern {
  display: flex;
  gap: 1rem;
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--ar-border-color, rgba(0, 0, 0, 0.08));
}

.btn-action-modern {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-edit {
  background: linear-gradient(135deg, var(--ar-primary, #c62828) 0%, rgba(var(--ar-primary-rgb), 0.9) 100%);
  color: #fff;
}

.btn-delete {
  background: transparent;
  color: #ef4444;
  border: 2px solid #ef4444;
}

.btn-delete:hover {
  background: #ef4444;
  color: #fff;
}

.btn-wishlist-active {
  background: #ef4444;
  color: #fff;
  border-color: #ef4444;
}

@media (max-width: 768px) {
  .announcements-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .card-image-container {
    height: 200px;
  }

  .image-gallery-wrapper {
    flex-direction: column;
  }
  
  .image-thumbnails-vertical {
    flex-direction: row;
    max-height: 100px;
    overflow-x: auto;
    overflow-y: hidden;
    width: 100%;
  }
  
  .product-detail-info {
    padding-left: 0;
    padding-top: 1.5rem;
  }
}

.catalog-seller-avatar {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #c62828, #e57373);
  font-size: 0.65rem;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.catalog-seller-initials {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.card-seller-row .card-quantity {
  max-width: 100%;
}
</style>
