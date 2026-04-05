<template>
    <!-- Page container -->
    <div class="container py-5 mt-4 mt-lg-5 mb-lg-4 my-xl-5 d-flex justify-content-center align-items-center" style="min-height: 100vh;">
      <div class="row pt-sm-2 pt-lg-0 w-100">
        <!-- Page content -->
        <div class="col-lg-9 pt-4 pb-2 pb-sm-4 mx-auto">
          <div class="d-flex align-items-center mb-4">
            <h1 class="h2 mb-0">Favorites <span class="fs-base fw-normal text-body-secondary">({{ wishlistItems.length }} items)</span></h1>
            <button class="btn btn-sm btn-outline-danger ms-auto" type="button" @click="clearWishlist">
              <i class="ai-trash ms-n1 me-2"></i>
              Clear all
            </button>
          </div>
          
          <!-- Empty wishlist message -->
          <div v-if="wishlistItems.length === 0" class="card border-0 py-3 p-md-4 p-xl-5 p-xxl-6">
            <div class="card-body text-center py-5">
              <i class="ai-heart display-4 text-body-secondary mb-4"></i>
              <h3 class="h5 mb-3">Your wishlist is empty</h3>
              <p class="text-body-secondary mb-4">Browse our products and add your favorites to the wishlist</p>
              <router-link to="/catalog" class="btn btn-primary">
                Continue Shopping
              </router-link>
            </div>
          </div>
          
          <!-- Wishlist items -->
          <div v-else class="announcements-grid">
            <!-- Item -->
            <div 
              v-for="item in wishlistItems" 
              :key="item.id"
              class="announcement-card"
              @click="openProductDetail(item)"
              style="cursor: pointer;"
            >
              <!-- Image principale -->
              <div class="card-image-container">
                <img 
                  :src="getMainImage(item)" 
                  :alt="item.name"
                  class="card-image"
                  @error="handleImageError"
                  loading="lazy"
                />
                <!-- Badge wishlist -->
                <button 
                  class="btn btn-icon btn-sm btn-light bg-light border-0 rounded-circle position-absolute top-0 end-0 mt-3 me-3 z-5" 
                  type="button" 
                  aria-label="Remove"
                  @click.stop="removeFromWishlist(item.id)">
                  <i class="ai-trash fs-xl text-danger"></i>
                </button>
                <!-- Indicateur multiple images -->
                <span v-if="getImageCount(item) > 1" class="images-count-badge">
                  <i class="ai-image"></i> {{ getImageCount(item) }}
                </span>
              </div>

              <!-- Card Body -->
              <div class="card-body-content">
                <h3 class="card-title">{{ item.name }}</h3>
                <p class="card-description">{{ truncateText(item.description, 100) }}</p>
                
                <div class="card-meta">
                  <span class="card-category" v-if="item.category">
                    <i class="ai-grid"></i> {{ getCategoryName(item.category) }}
                  </span>
                  <span class="card-price">{{ formatPrice(item.price) }}</span>
                </div>

                <!-- Vendeur -->
                <div class="card-stats" v-if="item.sellerName">
                  <span class="card-quantity">
                    <i class="ai-user"></i> {{ item.sellerName }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
                <div class="info-item-modern" v-if="selectedProductDetail.category">
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
                    <div class="info-value">{{ selectedProductDetail.sellerName }}</div>
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
                  @click="removeFromWishlist(selectedProductDetail.id); closeProductDetail();"
                  class="btn-action-modern btn-delete"
                >
                  <i class="ai-trash"></i>
                  <span>Retirer des favoris</span>
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

  export default {
    name: "WishListComponent",
    data() {
      return {
        wishlistItems: [],
        categories: [],
        selectedProductDetail: null,
        showProductDetail: false,
        currentImageIndex: 0
      };
    },
    methods: {
      // Load wishlist items from localStorage
      loadWishlist() {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          this.wishlistItems = JSON.parse(savedWishlist);
        }
      },
      
      async fetchCategories() {
        try {
          const response = await axios.get('http://localhost:3000/categories');
          this.categories = response.data;
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      },

      getCategoryName(categoryOrId) {
        if (categoryOrId == null || categoryOrId === '') return 'Catégorie inconnue';
        if (typeof categoryOrId === 'object') {
          if (categoryOrId.label) return String(categoryOrId.label).trim() || 'Catégorie inconnue';
          const id = categoryOrId.id;
          if (id != null) {
            const category = this.categories.find(cat => cat.id == id);
            return category ? category.label : 'Catégorie inconnue';
          }
          return 'Catégorie inconnue';
        }
        const category = this.categories.find(cat => cat.id == categoryOrId);
        return category ? category.label : 'Catégorie inconnue';
      },

      formatPrice(price) {
        if (!price) return '0,00 DT';
        const numPrice = typeof price === 'string' ? parseFloat(price) : Number(price);
        if (isNaN(numPrice)) return '0,00 DT';
        return new Intl.NumberFormat('fr-FR', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(numPrice) + ' DT';
      },

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
      },
      
      // Remove an item from the wishlist
      removeFromWishlist(productId) {
        this.wishlistItems = this.wishlistItems.filter(item => item.id !== productId);
        this.saveWishlist();
      },
      
      // Save wishlist to localStorage
      saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(this.wishlistItems));
      },
      
      // Clear all items from wishlist
      clearWishlist() {
        if (confirm('Êtes-vous sûr de vouloir supprimer tous les articles de votre liste de souhaits ?')) {
          this.wishlistItems = [];
          localStorage.removeItem('wishlist');
        }
      }
    },
    created() {
      // Load wishlist when component is created
      this.loadWishlist();
      this.fetchCategories();
    }
  }
  </script>

  <style scoped>
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

  .card-description {
    font-size: 0.875rem;
    color: var(--ar-body-color-secondary, #6b7280);
    margin-bottom: 1rem;
    line-height: 1.5;
    flex: 1;
  }

  .card-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--ar-border-color, rgba(0, 0, 0, 0.1));
  }

  .card-category {
    font-size: 0.8rem;
    color: var(--ar-body-color-secondary, #6b7280);
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .card-price {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--ar-primary, #c62828);
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

  /* Vue détaillée - mêmes styles que Catalog.vue */
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

  .btn-back {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--ar-emphasis-color, #121519);
    cursor: pointer;
    padding: 0.5rem;
    margin-right: 1rem;
  }

  .product-detail-title {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 600;
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
    min-width: 80px;
  }

  .thumbnail-item {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid transparent;
  }

  .thumbnail-item.active {
    border-color: var(--ar-primary, #c62828);
    border-width: 3px;
  }

  .image-main-container {
    flex: 1;
    border-radius: 12px;
    overflow: hidden;
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
  }

  .product-detail-name {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .product-detail-price-main {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--ar-primary, #c62828);
    margin-bottom: 1.5rem;
  }

  .product-detail-description {
    font-size: 1rem;
    line-height: 1.6;
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
  }

  .info-icon i {
    font-size: 1.5rem !important;
    color: #ffffff !important;
  }

  .info-content {
    flex: 1;
  }

  .info-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--ar-body-color-secondary, #9ca3af);
  }

  .info-value {
    font-size: 1rem;
    font-weight: 600;
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

  @media (max-width: 768px) {
    .announcements-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .card-image-container {
      height: 200px;
    }
  }
  </style>