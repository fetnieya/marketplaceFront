<template>
  <!-- Page container -->
  <div class="container py-5 mt-5 mb-lg-4 mb-xl-5">  
    <!-- Banner -->
    <section class="rounded-1 overflow-hidden mb-5" style="background-color: #e3e5e9;" data-bs-theme="light">
      <div class="row align-items-center g-0">
        <div class="col-md-6 offset-xl-1 text-center text-md-start">
          <div class="py-4 px-4 px-sm-5 pe-md-0 ps-xl-4">
            <p class="text-body fs-xs text-uppercase pt-3 pt-md-0 mb-3 mb-lg-4">Best selling</p>
            <h2 class="h1 pb-2 pb-xl-3">Cozy corner for the living room at a <span class="text-primary">discount up to 40%</span></h2>
            <a class="btn btn-sm btn-outline-dark" href="#" data-bs-theme="light">Explore</a>
          </div>
        </div>
        <div class="col-md-6 col-xl-5 d-flex justify-content-end">
          <img src="@/assets/img/shop/banner.jpg" width="491" alt="Banner">
        </div>
      </div>
    </section>

    <!-- Page title -->
    <div class="row pt-xl-3 mt-n1 mt-sm-0">
      <div class="col-lg-9 offset-lg-3 pt-lg-3">
        <h1 class="pb-2 pb-sm-3">Selected for you</h1>
      </div>
    </div>
    <div class="row pb-2 pb-sm-4">

      <!-- Sidebar (offcanvas on sreens < 992px) -->
      <aside class="col-lg-3">
        <div class="offcanvas-lg offcanvas-start" id="shopSidebar">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title">Filters</h5>
            <button class="btn-close" type="button" data-bs-dismiss="offcanvas" data-bs-target="#shopSidebar" aria-label="Close"></button>
          </div>

          <!-- Body -->
          <div class="offcanvas-body pt-2 pt-lg-0 pe-lg-4">

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

            <div class="my-4"></div>
            <!-- Market (checkboxes) -->
            <h3 class="h5">Markets</h3>
            <div class="pb-2">
              <div v-if="!marketsLoading && markets.length > 0">
                <div class="form-check" v-for="market in markets" :key="market.id">
                  <input class="form-check-input" type="checkbox" :value="market.id" :id="'market-'+market.id" 
                         v-model="selectedMarketFilters" @change="applyFilters">
                  <label class="form-check-label d-flex align-items-center" :for="'market-'+market.id">
                    <span class="text-nav fw-medium">{{ market.name }}</span>
                    <span class="fs-xs text-body-secondary ms-auto">{{ getMarketCount(market.id) }}</span>
                  </label>
                </div>
              </div>
              <div v-else-if="marketsLoading" class="text-center py-2">
                <small class="text-muted">Loading markets...</small>
              </div>
              <div v-else class="text-center py-2">
                <small class="text-muted">No markets available</small>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Product grid -->
      <div class="col-lg-9">

        <!-- Active filters + Sorting -->
        <div class="d-flex align-items-start justify-content-between mb-4">
          <div class="d-flex flex-wrap gap-2 mb-3" v-if="hasActiveFilters">
            <span class="badge bg-secondary text-nav fs-xs border rounded-pill d-flex align-items-center" 
                  v-for="filter in activeFilters" :key="filter.type + filter.value">
              {{ filter.label }}: {{ filter.value }}
              <button class="btn btn-icon btn-xs ms-2" type="button" @click="removeFilter(filter)">
                <i class="ai-cross-alt fs-xs"></i>
              </button>
            </span>
            <button class="btn btn-outline-secondary btn-xs rounded-pill" @click="clearAllFilters">
              <i class="ai-cross-alt me-1 fs-xs"></i>
              Clear all
            </button>
          </div>
          
          <div class="d-flex align-items-center flex-shrink-0 mb-2">
            <span class="text-body-secondary text-nowrap fs-sm">Sort by:</span>
            <select class="form-select form-select-flush py-0" v-model="sortOption" @change="applySort">
              <option value="popular">Most popular</option>
              <option value="low-high">Low-High price</option>
              <option value="high-low">High-Low price</option>
              <option value="rating">Average rating</option>
              <option value="az">A-Z order</option>
              <option value="za">Z-A order</option>
            </select>
          </div>
        </div>
        
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          <!-- Loading indicator -->
          <div class="col-12 text-center py-5" v-if="loading">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading products...</p>
          </div>
          
          <!-- Error message -->
          <div class="col-12 text-center py-5" v-else-if="error">
            <div class="alert alert-danger">
              {{ error }}
            </div>
          </div>
          
          <!-- No products message -->
          <div class="col-12 text-center py-5" v-else-if="filteredProducts.length === 0">
            <p>No products match your filter criteria.</p>
            <button class="btn btn-outline-primary mt-2" @click="clearAllFilters">
              Clear all filters
            </button>
          </div>
          
          <!-- Product items -->
          <div class="col pb-2 pb-sm-3" v-else v-for="product in filteredProducts" :key="product.id">
            <div class="card-hover position-relative bg-secondary rounded-1 p-3 mb-4">
              <span class="badge bg-danger bg-opacity-10 text-danger position-absolute top-0 start-0 mt-3 ms-3" 
                    v-if="product.sale">Sale</span>
                    <button class="btn btn-icon btn-sm btn-light bg-light border-0 rounded-circle position-absolute top-0 end-0 mt-3 me-3 z-5" 
                    type="button" 
                    aria-label="Add to Favorites"
                    @click.prevent="toggleWishlist(product)">
                    <i class="ai-heart fs-xl" :class="isInWishlist(product.id) ? 'text-danger' : 'text-nav'"></i>
                  </button>
              <div class="swiper swiper-nav-onhover">
                <router-link class="swiper-wrapper" :to="`/shop-single/${product.id}`">
                  <div class="swiper-slide p-2 p-xl-4">
                    <img class="d-block mx-auto" :src="product.image" width="226" :alt="product.name">
                  </div>
                </router-link>
                <button class="btn btn-prev btn-icon btn-sm btn-light bg-light border-0 rounded-circle start-0" type="button" aria-label="Prev">
                  <i class="ai-chevron-left fs-xl text-nav"></i>
                </button>
                <button class="btn btn-next btn-icon btn-sm btn-light bg-light border-0 rounded-circle end-0" type="button" aria-label="Next">
                  <i class="ai-chevron-right fs-xl text-nav"></i>
                </button>
              </div>
            </div>
            <div class="d-flex mb-1">
              <h3 class="h6 mb-0">
                <router-link :to="`/shop-single/${product.id}`">{{ product.name }}</router-link>
              </h3>
              <div class="d-flex ps-2 mt-n1 ms-auto"></div>
            </div>
            <div class="d-flex align-items-center">
              <span class="me-2">${{ product.price.toFixed(2) }}</span>
              <del class="fs-sm text-body-secondary" v-if="product.oldPrice">${{ product.oldPrice.toFixed(2) }}</del>
              <div class="nav ms-auto" data-bs-toggle="tooltip" data-bs-placement="left" title="Add to cart">
                <a class="nav-link fs-lg py-2 px-1" href="#" aria-label="Add to Cart" @click.prevent="addToCart(product)">
                  <i class="ai-cart"></i>
                </a>
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
    Filters
  </button>
</template>

<script>
import axios from 'axios';

export default {
  name: "CatalogComponent",
  data() {
    return {
      products: [],
      categories: [],
      wishlist: [],
      markets: [],
      selectedCategoryFilters: [],
      selectedMarketFilters: [],
      priceRange: {
        min: 0,
        max: 100
      },
      
      // Sorting and pagination
      sortOption: "popular",
      currentPage: 1,
      productsPerPage: 12,
      cart: [],
      loading: false,
      marketsLoading: false,
      error: null,
      itemsPerPage: 12
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
      
      // Then count products in each category
      this.allProducts.forEach(product => {
        if (product.category && counts[product.category] !== undefined) {
          counts[product.category]++;
        }
      });
      
      return counts;
    },
    
    // Calculate category counts for API sharing
    categoryProductCounts() {
      const counts = {};
      
      // Count products in each category
      this.allProducts.forEach(product => {
        if (product.category) {
          counts[product.category] = (counts[product.category] || 0) + 1;
        }
      });
      
      return counts;
    },
    
    // Market filter counts are now calculated based on markets collection
    marketFilters() {
      const counts = {};
      if (this.markets && this.markets.length > 0) {
        this.markets.forEach(market => {
          counts[market.id] = this.getMarketCount(market.id);
        });
      }
      return counts;
    },
    
    // Apply all filters to products
    filteredProducts() {
      let result = [...this.allProducts];
      
      // Apply category filter
      if (this.selectedCategoryFilters.length > 0) {
        result = result.filter(product => 
          this.selectedCategoryFilters.includes(product.category)
        );
      }
      
      // Apply market filter
      if (this.selectedMarketFilters.length > 0) {
        result = result.filter(product => 
          this.selectedMarketFilters.includes(product.market)
        );
      }
      
      // Apply price range filter
      result = result.filter(product => 
        product.price >= this.priceRange.min && 
        product.price <= this.priceRange.max
      );
      
      // Apply sorting
      result = this.sortProducts(result);
      
      // Apply pagination
      const startIndex = (this.currentPage - 1) * this.productsPerPage;
      return result.slice(startIndex, startIndex + this.productsPerPage);
    },
    
    // Total number of products after filtering
    totalFilteredProducts() {
      let result = [...this.allProducts];
      
      // Apply category filter
      if (this.selectedCategoryFilters.length > 0) {
        result = result.filter(product => 
          this.selectedCategoryFilters.includes(product.category)
        );
      }
      
      // Apply market filter
      if (this.selectedMarketFilters.length > 0) {
        result = result.filter(product => 
          this.selectedMarketFilters.includes(product.market)
        );
      }
      
      // Apply price range filter
      result = result.filter(product => 
        product.price >= this.priceRange.min && 
        product.price <= this.priceRange.max
      );
      
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
      
      // Add market filters
      this.selectedMarketFilters.forEach(market => {
        filters.push({
          type: 'market',
          label: 'Market',
          value: this.getMarketName(market)
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
      
      return filters;
    }
  },
  watch: {
    // Watch for changes to products to ensure markets are loaded after products
    products: {
      handler(newProducts) {
        if (newProducts && newProducts.length > 0) {
          this.reloadMarketFilters();
          this.updateCategoryProductCounts();
        }
      },
      immediate: true
    }
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get('http://localhost:3000/categories');
        this.categories = response.data;
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
            await axios.patch(`http://localhost:3000/categories/${category.id}`, {
              numberOfProducts: category.numberOfProducts
            });
          }
        }
        console.log("Updated category product counts in backend");
      } catch (error) {
        console.error("Failed to update category product counts:", error);
      }
    },
    
    async fetchMarkets() {
      this.marketsLoading = true;
      try {
        const response = await axios.get('http://localhost:3000/markets');
        
        // Process market data - ensure all markets have proper id and name
        this.markets = response.data.map(market => {
          // If market doesn't have an id, use the name as id
          if (!market.id && market.name) {
            return { ...market, id: market.name };
          }
          // If market doesn't have a name, use the id as name
          if (!market.name && market.id) {
            return { ...market, name: this.formatMarketName(market.id) };
          }
          return market;
        });
        
        console.log("Markets loaded from API:", this.markets);
      } catch (error) {
        console.error('Error fetching markets:', error);
        
        // Create markets from product data if API fails
        if (this.products && this.products.length > 0) {
          console.log('Creating markets from product data');
          const uniqueMarketIds = [...new Set(this.products.map(p => p.market).filter(m => m))];
          this.markets = uniqueMarketIds.map(marketId => ({
            id: marketId,
            name: this.formatMarketName(marketId)
          }));
          console.log('Markets created from products:', this.markets);
        }
      } finally {
        this.marketsLoading = false;
      }
    },
    
    // Helper method to format market names
    formatMarketName(marketId) {
      if (!marketId) return 'Unknown';
      
      // Convert marketId to a readable format (e.g., "us_market" to "US Market")
      if (typeof marketId === 'string') {
        return marketId
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
      return String(marketId);
    },
    
    // Get the count of products for each market
    getMarketCount(marketId) {
      return this.allProducts.filter(product => product.market == marketId).length;
    },
    
    // Ensure markets are available for filtering
    reloadMarketFilters() {
      // If we don't have markets but have products, create markets from products
      if ((!this.markets || this.markets.length === 0) && this.products.length > 0) {
        this.fetchMarkets();
      }
    },
    
    getCategoryName(categoryId) {
      if (!categoryId) return 'Unknown Category';
      
      const category = this.categories.find(cat => cat.id == categoryId);
      return category ? category.label : 'Unknown Category';
    },
    
    getMarketName(marketId) {
      if (!marketId) return 'Unknown Market';
      
      const market = this.markets.find(m => m.id == marketId);
      return market ? market.name : this.formatMarketName(marketId);
    },
    
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      try {
        // Fetch categories first
        await this.fetchCategories();
        
        const response = await axios.get('http://localhost:3000/products');
        this.products = response.data;
        console.log("Products loaded:", this.products.length);
        
        // Set initial price range based on product data
        if (this.products.length > 0) {
          const prices = this.products.map(p => p.price);
          this.priceRange.min = Math.floor(Math.min(...prices));
          this.priceRange.max = Math.ceil(Math.max(...prices));
        }
        
        // Now fetch markets AFTER we have products
        await this.fetchMarkets();
        
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
      } else if (filter.type === 'market') {
        this.selectedMarketFilters = this.selectedMarketFilters.filter(market => {
          return this.getMarketName(market) !== filter.value;
        });
      } else if (filter.type === 'price') {
        this.priceRange.min = 0;
        this.priceRange.max = Math.max(...this.allProducts.map(p => p.price), 100);
      }
      this.applyFilters();
    },
    
    // Clear all filters
    clearAllFilters() {
      this.selectedCategoryFilters = [];
      this.selectedMarketFilters = [];
      
      // Reset price range to min/max of available products
      if (this.allProducts.length > 0) {
        const prices = this.allProducts.map(p => p.price);
        this.priceRange.min = Math.floor(Math.min(...prices));
        this.priceRange.max = Math.ceil(Math.max(...prices));
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
          return sortedProducts.sort((a, b) => a.price - b.price);
        case 'high-low':
          return sortedProducts.sort((a, b) => b.price - a.price);
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
    
    // Add product to cart
    addToCart(product) {
      this.cart.push(product);
      // In a real app, you would show some feedback to the user
      alert(`Added ${this.getProductName(product.category)} to cart!`);
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
    }
  },
  created() {
    // Load initial data
    this.fetchProducts();
    this.loadWishlistFromStorage();
  }
};
</script>