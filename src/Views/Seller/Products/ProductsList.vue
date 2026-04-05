<template>
  <div class="announcements-management">
    <!-- Header avec titre et bouton Ajouter -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h2 mb-0">Gestion des annonces</h1>
      <router-link to="/addProduct">
        <button type="button" class="btn btn-primary">
          <i class="ai-circle-plus me-2 ms-n1"></i>Ajouter une annonce
        </button>
      </router-link>
    </div>

    <!-- Barre de recherche et filtres -->
    <div class="filter-section mb-4">
      <div class="row g-3 align-items-end">
        <!-- Recherche par nom -->
        <div class="col-md-5">
          <label class="form-label small mb-1">Recherche</label>
          <div class="input-group input-group-sm">
            <span class="input-group-text">
              <i class="ai-search"></i>
            </span>
            <input 
              type="text" 
              class="form-control" 
              placeholder="Rechercher par nom..."
              v-model="searchQuery"
              @input="onSearch"
            />
            <button 
              v-if="searchQuery" 
              class="btn btn-outline-secondary" 
              type="button"
              @click="clearSearch"
            >
              <i class="ai-x"></i>
            </button>
          </div>
        </div>

        <!-- Filtre par catégorie -->
        <div class="col-md-3">
          <label class="form-label small mb-1">Catégorie</label>
          <select 
            class="form-select form-select-sm" 
            v-model="selectedCategory"
            @change="onCategoryFilter"
          >
            <option value="">Toutes les catégories</option>
            <option 
              v-for="category in categories" 
              :key="category.id" 
              :value="category.id"
            >
              {{ category.label }}
            </option>
          </select>
        </div>

        <!-- Filtre par statut -->
        <div class="col-md-2">
          <label class="form-label small mb-1">Statut</label>
          <select 
            class="form-select form-select-sm" 
            v-model="selectedStatus"
            @change="onStatusFilter"
          >
            <option value="">Tous les statuts</option>
            <option value="disponible">Disponible</option>
            <option value="en_attente">En attente</option>
            <option value="vendu">Vendu</option>
          </select>
        </div>

        <!-- Bouton réinitialiser -->
        <div class="col-md-2">
          <button 
            v-if="searchQuery || selectedCategory || selectedStatus"
            class="btn btn-outline-secondary btn-sm w-100" 
            type="button"
            @click="resetFilters"
          >
            <i class="ai-rotate-cw me-1"></i>Réinitialiser
          </button>
        </div>
      </div>
      
      <div v-if="searchQuery || selectedCategory || selectedStatus" class="text-muted small mt-2">
        {{ filteredProducts.length }} annonce(s) trouvée(s)
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
      <button @click="fetchProducts" class="btn btn-link">Réessayer</button>
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
                
                <!-- Informations avec icônes (style moderne) -->
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
                  
                  <div class="info-item-modern">
                    <div class="info-icon">
                      <i class="ai-box"></i>
                    </div>
                    <div class="info-content">
                      <div class="info-label">Quantité</div>
                      <div class="info-value">{{ selectedProductDetail.quantity || 0 }} pièce(s)</div>
                    </div>
                  </div>
                  
                  <div class="info-item-modern">
                    <div class="info-icon">
                      <i class="ai-circle-check"></i>
                    </div>
                    <div class="info-content">
                      <div class="info-label">Statut</div>
                      <div class="info-value" :class="getStatusClass(selectedProductDetail.status)">
                        {{ getStatusLabel(selectedProductDetail.status) }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Actions -->
                <div class="product-detail-actions-modern">
                  <router-link 
                    :to="`/editProduct/${selectedProductDetail.id}`"
                    class="btn-action-modern btn-edit"
                  >
                    <i class="ai-edit"></i>
                    <span>Modifier</span>
                  </router-link>
                  <button
                    @click="confirmDelete(selectedProductDetail)"
                    class="btn-action-modern btn-delete"
                  >
                    <i class="ai-trash"></i>
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cards Grid -->
    <div v-else-if="paginatedProducts.length > 0" class="announcements-grid">
      <div 
        v-for="product in paginatedProducts" 
        :key="product.id"
        class="announcement-card"
        @click="openProductDetail(product)"
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
          <!-- Badge statut -->
          <span 
            class="status-badge" 
            :class="getStatusClass(product.status)"
          >
            {{ getStatusLabel(product.status) }}
          </span>
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

          <!-- Nombre de pièces et statut -->
          <div class="card-stats">
            <span v-if="product.quantity !== undefined && product.quantity !== null" class="card-quantity">
              <i class="ai-box"></i> {{ product.quantity }} pièce(s)
            </span>
          </div>

          <!-- Actions -->
          <div class="card-actions" @click.stop>
            <router-link 
              :to="`/editProduct/${product.id}`"
              class="btn btn-sm btn-outline-primary"
            >
              <i class="ai-edit"></i> Modifier
            </router-link>
            <button
              @click="confirmDelete(product)"
              class="btn btn-sm btn-outline-danger"
            >
              <i class="ai-trash"></i> Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state text-center py-5">
      <i class="ai-box fs-1 d-block mb-3 opacity-50"></i>
      <p class="fs-5 text-muted mb-0">
        {{ searchQuery || selectedCategory || selectedStatus ? 'Aucune annonce trouvée' : 'Aucune annonce pour le moment' }}
      </p>
      <router-link v-if="!searchQuery && !selectedCategory && !selectedStatus" to="/addProduct" class="btn btn-primary mt-3">
        <i class="ai-circle-plus me-2"></i>Créer votre première annonce
      </router-link>
    </div>

    <!-- Pagination -->
    <nav v-if="totalPages > 1" aria-label="Page navigation" class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a @click.prevent="prevPage" href="#" class="page-link">Précédent</a>
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
          <a @click.prevent="nextPage" href="#" class="page-link">Suivant</a>
        </li>
      </ul>
    </nav>

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
            <h5 class="modal-title" id="deleteModalLabel">Confirmer la suppression</h5>
            <button 
              type="button" 
              class="btn-close" 
              @click="cancelDelete"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            Êtes-vous sûr de vouloir supprimer l'annonce "{{ selectedProduct?.name }}" ?
            <div class="mt-2 text-danger">
              Cette action est irréversible.
            </div>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="cancelDelete"
            >
              Annuler
            </button>
            <button 
              type="button" 
              class="btn btn-danger" 
              @click="deleteProduct"
              :disabled="deleting"
            >
              <span v-if="deleting" class="spinner-border spinner-border-sm me-2"></span>
              {{ deleting ? 'Suppression...' : 'Supprimer' }}
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
  name: 'ProductsList',
  data() {
    return {
      apiBase: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000',
      products: [],
      categories: [],
      currentPage: 1,
      totalPages: 1,
      itemsPerPage: 12,
      loading: true,
      error: null,
      selectedProduct: null,
      deleting: false,
      deleteModal: null,
      searchQuery: '',
      selectedCategory: '',
      selectedStatus: '',
      selectedProductDetail: null,
      showProductDetail: false,
      currentImageIndex: 0
    };
  },
  computed: {
    filteredProducts() {
      let filtered = [...this.products];

      // Filtre par recherche
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(query)
        );
      }

      // Filtre par catégorie
      if (this.selectedCategory) {
        filtered = filtered.filter(p => p.category == this.selectedCategory);
      }

      // Filtre par statut
      if (this.selectedStatus) {
        filtered = filtered.filter(p => (p.status || 'disponible') === this.selectedStatus);
      }

      return filtered;
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredProducts.slice(start, end);
    },
    pages() {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }
  },
  methods: {
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      try {
        await this.fetchCategories();

        const sellerId = this.getCurrentSellerId();
        if (!sellerId) {
          throw new Error('Compte vendeur non trouvé. Veuillez vous reconnecter.');
        }

        const response = await axios.get(`${this.apiBase}/products`, {
          params: { sellerId }
        });
        this.products = response.data || [];
        this.updatePagination();
      } catch (error) {
        this.error = 'Erreur lors du chargement des annonces. Veuillez réessayer.';
        console.error('Error fetching products:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async fetchCategories() {
      try {
        const response = await axios.get(`${this.apiBase}/categories`);
        this.categories = response.data || [];
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    
    getCategoryName(productCategory) {
      // Si product.category est un objet (avec id et label)
      if (productCategory && typeof productCategory === 'object') {
        return productCategory.label || 'Catégorie inconnue';
      }
      // Si c'est un ID
      if (productCategory) {
        const category = this.categories.find(cat => cat.id == productCategory);
        return category ? category.label : 'Catégorie inconnue';
      }
      return 'Catégorie inconnue';
    },

    getMainImage(product) {
      // Support du nouveau format (table Image) - comme la photo de profil
      // Les images sont stockées en base64 dans la colonne url de la table Image
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        const firstImage = product.images[0];
        
        // Si c'est un tableau d'objets Image (nouveau format avec table Image)
        if (typeof firstImage === 'object' && firstImage !== null) {
          // L'objet Image a une propriété url qui contient la data URL base64
          // (comme la photo de profil stockée dans avatar/photo)
          if (firstImage.url) {
            return firstImage.url;
          }
        }
        // Si c'est un tableau de strings (ancien format - data URL directe)
        if (typeof firstImage === 'string') {
          return firstImage;
        }
      }
      // Fallback sur l'image principale (colonnes image du produit)
      if (product.image) {
        return product.image;
      }
      // Utiliser une image placeholder en data URL SVG
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BdWN1bmUgaW1hZ2U8L3RleHQ+PC9zdmc+';
    },

    getImageCount(product) {
      // Support du nouveau format (table Image) et de l'ancien format (compatibilité)
      if (product.images && Array.isArray(product.images)) {
        return product.images.length;
      }
      return product.image ? 1 : 0;
    },

    getStatusClass(status) {
      const statusMap = {
        'disponible': 'status-available',
        'en_attente': 'status-pending',
        'vendu': 'status-sold'
      };
      return statusMap[status || 'disponible'] || 'status-available';
    },

    getStatusLabel(status) {
      const statusMap = {
        'disponible': 'Disponible',
        'en_attente': 'En attente',
        'vendu': 'Vendu'
      };
      return statusMap[status || 'disponible'] || 'Disponible';
    },

    formatPrice(price) {
      if (!price) return '0,00 DT';
      return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price) + ' DT';
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

    nextImage() {
      if (this.selectedProductDetail) {
        const totalImages = this.getAllImages(this.selectedProductDetail).length;
        if (this.currentImageIndex < totalImages - 1) {
          this.currentImageIndex++;
        }
      }
    },

    previousImage() {
      if (this.currentImageIndex > 0) {
        this.currentImageIndex--;
      }
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

    truncateText(text, maxLength) {
      if (!text) return '';
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    },

    onSearch() {
      this.currentPage = 1;
      this.updatePagination();
    },

    onCategoryFilter() {
      this.currentPage = 1;
      this.updatePagination();
    },

    onStatusFilter() {
      this.currentPage = 1;
      this.updatePagination();
    },

    clearSearch() {
      this.searchQuery = '';
      this.currentPage = 1;
      this.updatePagination();
    },

    resetFilters() {
      this.searchQuery = '';
      this.selectedCategory = '';
      this.selectedStatus = '';
      this.currentPage = 1;
      this.updatePagination();
    },

    updatePagination() {
      this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages || 1;
      }
    },
    
    confirmDelete(product) {
      this.selectedProduct = product;
      if (!this.deleteModal) {
        this.deleteModal = new Modal(document.getElementById('deleteModal'));
      }
      this.deleteModal.show();
    },
    
    cancelDelete() {
      if (this.deleting) return;
      this.selectedProduct = null;
      if (this.deleteModal) {
        this.deleteModal.hide();
      }
    },
  
    async deleteProduct() {
      if (!this.selectedProduct) return;
      
      this.deleting = true;
      try {
        const token = localStorage.getItem('authToken');
        const config = {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          withCredentials: true,
        };
        await axios.delete(`${this.apiBase}/products/${this.selectedProduct.id}`, config);
        const index = this.products.findIndex(p => p.id === this.selectedProduct.id);
        if (index !== -1) {
          this.products.splice(index, 1);
          this.updatePagination();
        }
        if (this.deleteModal) {
          this.deleteModal.hide();
        }
        this.selectedProduct = null;
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Erreur lors de la suppression de l\'annonce');
      } finally {
        this.deleting = false;
      }
    },
    
    handleImageError(event) {
      // Éviter la boucle infinie en utilisant une image transparente
      // Si l'image a déjà été changée une fois, ne pas la changer à nouveau
      if (event.target.dataset.errorHandled) {
        return;
      }
      event.target.dataset.errorHandled = 'true';
      // Utiliser une image transparente en data URL
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BdWN1bmUgaW1hZ2U8L3RleHQ+PC9zdmc+';
      // Empêcher l'image de se recharger
      event.target.style.objectFit = 'cover';
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
    },

    getCurrentSellerId() {
      try {
        const storedUser = localStorage.getItem('currentUser');
        const user = storedUser ? JSON.parse(storedUser) : null;
        return user?.id || null;
      } catch (error) {
        console.error('Unable to read current user from storage', error);
        return null;
      }
    }
  },
 
  mounted() {
    // Initialize modal if needed
  },
 
  created() {
    this.fetchProducts();
  },
 
  beforeUnmount() {
    if (this.deleteModal) {
      this.deleteModal.dispose();
    }
  }
};
</script>

<style scoped>
.announcements-management {
  width: 100%;
}

.filter-section {
  background-color: var(--ar-secondary-bg, #f6f9fc);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--ar-border-color, rgba(0, 0, 0, 0.1));
}

.filter-section .form-label {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

[data-bs-theme="dark"] .filter-section {
  background-color: #1c2128;
  border-color: rgba(255, 255, 255, 0.1);
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

/* Status Badge */
.status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

[data-bs-theme="dark"] .status-badge {
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
}

.status-available {
  color: #10b981 !important;
  background-color: rgba(16, 185, 129, 0.15) !important;
}

.status-pending {
  color: #f97316 !important;
  background-color: rgba(249, 115, 22, 0.15) !important;
}

.status-sold {
  color: #dc2626 !important;
  background-color: rgba(220, 38, 38, 0.15) !important;
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

.card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
}

.card-actions .btn {
  flex: 1;
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
}

/* Empty State */
.empty-state {
  padding: 4rem 2rem;
}

/* Pagination */
.pagination {
  gap: 0.25rem;
}

.page-link {
  color: var(--ar-body-color, #121519);
  border-color: var(--ar-border-color, rgba(0, 0, 0, 0.1));
}

[data-bs-theme="dark"] .page-link {
  color: rgba(255, 255, 255, 0.7);
  border-color: rgba(255, 255, 255, 0.1);
  background-color: #161b22;
}

.page-link:hover {
  color: var(--ar-primary, #c62828);
  background-color: var(--ar-secondary-bg, #f6f9fc);
  border-color: var(--ar-border-color, rgba(0, 0, 0, 0.1));
}

[data-bs-theme="dark"] .page-link:hover {
  color: #60d9a0;
  background-color: #1c2128;
}

.page-item.active .page-link {
  background-color: var(--ar-primary, #c62828);
  border-color: var(--ar-primary, #c62828);
  color: #fff;
}

[data-bs-theme="dark"] .page-item.active .page-link {
  background-color: #60d9a0;
  border-color: #60d9a0;
  color: #000;
}

.page-item.disabled .page-link {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 767.98px) {
  .announcements-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .filter-section {
    padding: 1rem;
  }

  .card-image-container {
    height: 200px;
  }
}
/* Vue détaillée du produit (plein écran) */
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

.product-detail-images {
  width: 100%;
}

.image-gallery-wrapper {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

/* Liste verticale des miniatures (style Facebook Marketplace) */
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

/* Scrollbar moderne pour les miniatures */
.image-thumbnails-vertical::-webkit-scrollbar {
  width: 6px;
}

.image-thumbnails-vertical::-webkit-scrollbar-track {
  background: var(--ar-secondary-bg, #f6f9fc);
  border-radius: 10px;
}

[data-bs-theme="dark"] .image-thumbnails-vertical::-webkit-scrollbar-track {
  background: #1c2128;
}

.image-thumbnails-vertical::-webkit-scrollbar-thumb {
  background: var(--ar-border-color, rgba(0, 0, 0, 0.2));
  border-radius: 10px;
  transition: background 0.2s;
}

[data-bs-theme="dark"] .image-thumbnails-vertical::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}

.image-thumbnails-vertical::-webkit-scrollbar-thumb:hover {
  background: var(--ar-primary, #c62828);
}

[data-bs-theme="dark"] .image-thumbnails-vertical::-webkit-scrollbar-thumb:hover {
  background: #60d9a0;
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

[data-bs-theme="dark"] .thumbnail-item {
  background-color: #1c2128;
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

[data-bs-theme="dark"] .thumbnail-item.active {
  box-shadow: 0 0 0 2px rgba(96, 217, 160, 0.3);
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Container de l'image principale */
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

[data-bs-theme="dark"] .image-main-container {
  background-color: #1c2128;
}

.product-detail-main-image {
  width: 100%;
  height: auto;
  max-height: 600px;
  object-fit: contain;
  display: block;
  border-radius: 12px;
}

/* Responsive */
@media (max-width: 768px) {
  .image-gallery-wrapper {
    flex-direction: column;
  }
  
  .image-thumbnails-vertical {
    flex-direction: row;
    max-height: 100px;
    overflow-x: auto;
    overflow-y: hidden;
    width: 100%;
    padding-bottom: 0.5rem;
    padding-right: 0;
    min-width: auto;
  }
  
  .thumbnail-item {
    width: 80px;
    height: 80px;
  }
}

/* Informations du produit - Style moderne */
.product-detail-info {
  padding-left: 1.5rem;
}

[data-bs-theme="dark"] .product-detail-info {
  color: #fff;
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

[data-bs-theme="dark"] .product-detail-description {
  color: rgba(255, 255, 255, 0.8);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

/* Grille d'informations avec icônes */
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
  transition: transform 0.2s ease;
}

.info-item-modern:hover {
  transform: translateX(4px);
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
  box-shadow: 0 4px 12px rgba(var(--ar-primary-rgb), 0.25);
}

.info-icon i {
  font-size: 1.5rem !important;
  line-height: 1 !important;
  display: inline-block !important;
  color: #ffffff !important;
  opacity: 1 !important;
  visibility: visible !important;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

[data-bs-theme="dark"] .info-icon {
  background: linear-gradient(135deg, #60d9a0 0%, rgba(96, 217, 160, 0.8) 100%);
  box-shadow: 0 4px 12px rgba(96, 217, 160, 0.25);
}

[data-bs-theme="dark"] .info-icon i {
  color: #ffffff !important;
  opacity: 1 !important;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
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

[data-bs-theme="dark"] .info-label {
  color: rgba(255, 255, 255, 0.5);
}

.info-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--ar-emphasis-color, #121519);
}

[data-bs-theme="dark"] .info-value {
  color: #fff;
}

/* Actions modernes */
.product-detail-actions-modern {
  display: flex;
  gap: 1rem;
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--ar-border-color, rgba(0, 0, 0, 0.08));
}

[data-bs-theme="dark"] .product-detail-actions-modern {
  border-top-color: rgba(255, 255, 255, 0.1);
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
  box-shadow: 0 4px 12px rgba(var(--ar-primary-rgb), 0.3);
}

[data-bs-theme="dark"] .btn-edit {
  background: linear-gradient(135deg, #60d9a0 0%, rgba(96, 217, 160, 0.9) 100%);
  box-shadow: 0 4px 12px rgba(96, 217, 160, 0.3);
}

.btn-edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(var(--ar-primary-rgb), 0.4);
}

[data-bs-theme="dark"] .btn-edit:hover {
  box-shadow: 0 6px 16px rgba(96, 217, 160, 0.4);
}

.btn-delete {
  background: transparent;
  color: #ef4444;
  border: 2px solid #ef4444;
}

.btn-delete:hover {
  background: #ef4444;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-action-modern i {
  font-size: 1.125rem;
}

/* Responsive */
@media (max-width: 768px) {
  .product-detail-info {
    padding-left: 0;
    padding-top: 1.5rem;
  }
  
  .product-detail-name {
    font-size: 1.5rem;
  }
  
  .product-detail-price-main {
    font-size: 2rem;
  }
  
  .product-detail-actions-modern {
    flex-direction: column;
  }
}

/* Amélioration hover pour les cartes */
.announcement-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.announcement-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

[data-bs-theme="dark"] .announcement-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}
</style>