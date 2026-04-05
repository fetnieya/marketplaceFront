<template>
  <div class="admin-page-content">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <button 
            type="button" 
            class="btn btn-primary"
            @click="openAddCategoryModal"
          >
            <i class="ai-circle-plus me-2 ms-n1"></i>Ajouter une Catégorie
          </button>
        </div>

        <!-- Search Bar -->
        <div class="mb-4">
          <div class="input-group">
            <span class="input-group-text">
              <i class="ai-search"></i>
            </span>
            <input 
              type="text" 
              class="form-control" 
              placeholder="Rechercher une catégorie (nom, description)..."
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
          <div v-if="searchQuery && filteredCategories.length > 0" class="text-muted small mt-2">
            {{ filteredCategories.length }} résultat(s) trouvé(s)
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Chargement...</span>
          </div>
        </div>

        <!-- Content -->
        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead class="table-light">
              <tr>
                <th scope="col">Libellé</th>
                <th scope="col">Nombre de produits</th>
                <th scope="col">Description</th>
                <th scope="col" class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in paginatedCategories" :key="category.id">
                <td>{{ category.label }}</td>
                <td>{{ category.numberOfProducts || 0 }}</td>
                <td>{{ category.description || 'N/A' }}</td>
                <td>
                  <div class="action-buttons">
                    <button
                      @click="viewCategory(category)"
                      type="button"
                      class="btn btn-action btn-view"
                      title="Voir les détails"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      <span class="visually-hidden">Voir</span>
                    </button>
                    <button
                      @click="openEditCategoryModal(category)"
                      type="button"
                      class="btn btn-action btn-edit"
                      title="Modifier"
                    >
                      <i class="ai-edit"></i>
                    </button>
                    <button
                      @click="confirmDelete(category)"
                      type="button"
                      class="btn btn-action btn-delete"
                      title="Supprimer"
                    >
                      <i class="ai-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="paginatedCategories.length === 0 && !error">
                <td colspan="4" class="text-center py-5">
                  <div class="text-muted">
                    <i class="ai-grid fs-1 d-block mb-3 opacity-50"></i>
                    <p class="mb-0 fs-5">{{ searchQuery ? 'Aucun résultat trouvé' : 'Aucune catégorie trouvée' }}</p>
                    <p class="mb-0 text-muted small">
                      {{ searchQuery ? 'Essayez de modifier votre recherche' : 'Les catégories apparaîtront ici une fois créées' }}
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Error State -->
          <div v-if="error" class="alert alert-danger mt-3" role="alert">
            <i class="ai-alert-circle me-2"></i>
            {{ error }}
            <button @click="fetchCategories" class="btn btn-link p-0 ms-2">Réessayer</button>
          </div>

          <!-- Pagination -->
          <nav v-if="filteredCategories.length > 0" aria-label="Navigation des pages" class="mt-4">
            <div class="text-center">
              <ul v-if="totalPagesComputed > 1" class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a @click.prevent="prevPage" href="#" class="page-link">Précédent</a>
                </li>
                <li 
                  v-for="page in displayedPages" 
                  :key="page"
                  class="page-item"
                  :class="{ active: currentPage === page, disabled: page === '...' }"
                >
                  <a 
                    v-if="page !== '...'"
                    @click.prevent="goToPage(page)" 
                    href="#" 
                    class="page-link"
                  >
                    {{ page }}
                  </a>
                  <span v-else class="page-link">{{ page }}</span>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPagesComputed }">
                  <a @click.prevent="nextPage" href="#" class="page-link">Suivant</a>
                </li>
              </ul>
              <div class="text-muted small mt-2">
                {{ filteredCategories.length }} catégorie(s) 
                <span v-if="totalPagesComputed > 1">
                  - Page {{ currentPage }} sur {{ totalPagesComputed }}
                </span>
              </div>
            </div>
          </nav>
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
          <h5 class="modal-title" id="deleteModalLabel">Confirmer la suppression</h5>
          <button 
            type="button" 
            class="btn-close" 
            data-bs-dismiss="modal" 
            aria-label="Fermer"
          ></button>
        </div>
        <div class="modal-body">
          Êtes-vous sûr de vouloir supprimer la catégorie <strong>{{ selectedCategory?.label }}</strong> ?
          <div v-if="selectedCategory?.numberOfProducts > 0" class="mt-2 text-danger">
            <i class="ai-alert-circle me-1"></i>
            Attention : Cette catégorie contient {{ selectedCategory.numberOfProducts }} produit(s).
          </div>
        </div>
        <div class="modal-footer">
          <button 
            type="button" 
            class="btn btn-secondary" 
            data-bs-dismiss="modal"
          >
            Annuler
          </button>
          <button 
            type="button" 
            class="btn btn-danger" 
            @click="deleteCategory"
            :disabled="deleting"
          >
            {{ deleting ? 'Suppression...' : 'Supprimer' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- View Category Details Modal -->
  <div 
    class="modal fade" 
    id="viewCategoryModal" 
    tabindex="-1" 
    aria-labelledby="viewCategoryModalLabel" 
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl modal-dialog-scrollable modern-modal-dialog">
      <div class="modal-content category-modal-content modern-modal-content">
        <div class="modal-header category-modal-header modern-modal-header">
          <div class="modal-header-content">
            <h5 class="modal-title" id="viewCategoryModalLabel">
              <i class="ai-grid me-2"></i>Détails de la catégorie
            </h5>
          </div>
          <button 
            type="button" 
            class="btn-close category-modal-close modern-modal-close" 
            data-bs-dismiss="modal" 
            aria-label="Fermer"
          ></button>
        </div>
        <div class="modal-body category-modal-body modern-modal-body" v-if="viewedCategory">
          <!-- Details Section -->
          <div class="details-section-header mb-4">
            <h6 class="section-title">Informations de la catégorie</h6>
            <div class="section-divider"></div>
          </div>
          
          <!-- Simple layout: Label and Description -->
          <div class="category-view-simple">
            <div class="category-view-item mb-4">
              <label class="detail-label">Libellé</label>
              <div class="detail-value-large">{{ viewedCategory.label || 'N/A' }}</div>
            </div>

            <div class="category-view-item mb-4">
              <label class="detail-label">Nombre de produits</label>
              <div class="detail-value-large">{{ viewedCategory.numberOfProducts || 0 }}</div>
            </div>

            <div class="category-view-item">
              <label class="detail-label">Description</label>
              <div class="detail-value-large">{{ viewedCategory.description || 'N/A' }}</div>
            </div>
          </div>
        </div>
        <div class="modal-footer category-modal-footer modern-modal-footer">
          <button 
            type="button" 
            class="btn btn-secondary modern-btn-secondary" 
            data-bs-dismiss="modal"
          >
            Fermer
          </button>
          <button 
            v-if="viewedCategory"
            type="button"
            class="btn btn-primary modern-btn-primary"
            @click="editCategoryFromView"
          >
            <i class="ai-edit me-1"></i>Modifier
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Category Modal -->
  <div 
    class="modal fade" 
    id="addCategoryModal" 
    tabindex="-1" 
    aria-labelledby="addCategoryModalLabel" 
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-scrollable modern-modal-dialog">
      <div class="modal-content category-modal-content modern-modal-content">
        <div class="modal-header category-modal-header modern-modal-header">
          <div class="modal-header-content">
            <h5 class="modal-title" id="addCategoryModalLabel">
              <i class="ai-circle-plus me-2"></i>Ajouter une Catégorie
            </h5>
          </div>
          <button 
            type="button" 
            class="btn-close category-modal-close modern-modal-close" 
            data-bs-dismiss="modal" 
            aria-label="Fermer"
            @click="resetAddForm"
          ></button>
        </div>
        <div class="modal-body category-modal-body modern-modal-body">
          <form @submit.prevent="addCategory">
            <div class="row g-3">
              <div class="col-12">
                <label for="add-label" class="form-label">Libellé <span class="text-danger">*</span></label>
                <input
                  v-model="newCategory.label"
                  class="form-control"
                  type="text"
                  id="add-label"
                  placeholder="Nom de la catégorie"
                  required
                />
              </div>

              <div class="col-12">
                <label for="add-description" class="form-label">Description <span class="text-danger">*</span></label>
                <textarea
                  v-model="newCategory.description"
                  class="form-control"
                  id="add-description"
                  placeholder="Description de la catégorie"
                  rows="4"
                  required
                ></textarea>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer category-modal-footer modern-modal-footer">
          <button 
            type="button" 
            class="btn btn-secondary modern-btn-secondary" 
            data-bs-dismiss="modal"
            @click="resetAddForm"
            :disabled="submitting"
          >
            Annuler
          </button>
          <button 
            type="button" 
            class="btn btn-primary modern-btn-primary" 
            @click="addCategory"
            :disabled="submitting"
          >
            <span v-if="submitting" class="spinner-border spinner-border-sm me-1" role="status"></span>
            {{ submitting ? 'Ajout en cours...' : 'Ajouter' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Edit Category Modal -->
  <div 
    class="modal fade" 
    id="editCategoryModal" 
    tabindex="-1" 
    aria-labelledby="editCategoryModalLabel" 
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-scrollable modern-modal-dialog">
      <div class="modal-content category-modal-content modern-modal-content">
        <div class="modal-header category-modal-header modern-modal-header">
          <div class="modal-header-content">
            <h5 class="modal-title" id="editCategoryModalLabel">
              <i class="ai-edit me-2"></i>Modifier la Catégorie
            </h5>
          </div>
          <button 
            type="button" 
            class="btn-close category-modal-close modern-modal-close" 
            data-bs-dismiss="modal" 
            aria-label="Fermer"
            @click="resetEditForm"
          ></button>
        </div>
        <div class="modal-body category-modal-body modern-modal-body" v-if="editingCategory">
          <form @submit.prevent="updateCategory">
            <div class="row g-3">
              <div class="col-12">
                <label for="edit-label" class="form-label">Libellé <span class="text-danger">*</span></label>
                <input
                  v-model="editingCategory.label"
                  class="form-control"
                  type="text"
                  id="edit-label"
                  placeholder="Nom de la catégorie"
                  required
                />
              </div>

              <div class="col-12">
                <label for="edit-description" class="form-label">Description <span class="text-danger">*</span></label>
                <textarea
                  v-model="editingCategory.description"
                  class="form-control"
                  id="edit-description"
                  placeholder="Description de la catégorie"
                  rows="4"
                  required
                ></textarea>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer category-modal-footer modern-modal-footer">
          <button 
            type="button" 
            class="btn btn-secondary modern-btn-secondary" 
            data-bs-dismiss="modal"
            @click="resetEditForm"
            :disabled="updating"
          >
            Annuler
          </button>
          <button 
            type="button" 
            class="btn btn-primary modern-btn-primary" 
            @click="updateCategory"
            :disabled="updating"
          >
            <span v-if="updating" class="spinner-border spinner-border-sm me-1" role="status"></span>
            {{ updating ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Modal } from 'bootstrap';
import { toast } from '@/utils/toast';

export default {
  name: 'CategoryListComponent',
  data() {
    return {
      apiBase: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000',
      categories: [],
      searchQuery: '',
      currentPage: 1,
      totalPages: 1,
      itemsPerPage: 10,
      loading: true,
      error: null,
      selectedCategory: null,
      deleting: false,
      deleteModal: null,
      viewedCategory: null,
      viewModal: null,
      addModal: null,
      newCategory: {
        label: '',
        description: '',
      },
      submitting: false,
      editModal: null,
      editingCategory: null,
      updating: false
    };
  },
  computed: {
    filteredCategories() {
      if (!this.searchQuery.trim()) {
        return this.categories;
      }
      
      const query = this.searchQuery.toLowerCase().trim();
      return this.categories.filter(category => {
        const label = (category.label || '').toLowerCase();
        const description = (category.description || '').toLowerCase();
        
        return label.includes(query) || description.includes(query);
      });
    },
    paginatedCategories() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredCategories.slice(start, end);
    },
    displayedPages() {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];
      let l;
      const total = this.totalPagesComputed;

      range.push(1);

      for (let i = this.currentPage - delta; i <= this.currentPage + delta; i++) {
        if (i < total && i > 1) {
          range.push(i);
        }
      }

      if (total > 1) {
        range.push(total);
      }

      for (let i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push('...');
          }
        }
        rangeWithDots.push(i);
        l = i;
      }

      return rangeWithDots;
    },
    totalPagesComputed() {
      return Math.max(1, Math.ceil(this.filteredCategories.length / this.itemsPerPage));
    }
  },
  watch: {
    filteredCategories() {
      if (this.currentPage > this.totalPagesComputed) {
        this.currentPage = this.totalPagesComputed || 1;
      }
    }
  },
  methods: {
    async fetchCategories() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${this.apiBase}/categories`);
        
        if (Array.isArray(response.data)) {
          this.categories = response.data;
          this.totalPages = Math.max(1, Math.ceil(this.categories.length / this.itemsPerPage));
          this.error = null;
        } else {
          this.categories = [];
          this.totalPages = 1;
          this.error = null;
          console.warn('Réponse inattendue du serveur:', response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        
        if (error?.response?.status === 404) {
          this.error = 'Endpoint non trouvé. Vérifiez la configuration du serveur.';
        } else if (error?.code === 'ECONNREFUSED' || error?.message?.includes('Network Error')) {
          this.error = 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré.';
        } else {
          const errorMessage = error?.response?.data?.message || error?.message || 'Erreur inconnue';
          this.error = `Échec du chargement des catégories: ${errorMessage}`;
        }
        
        if (!this.categories || this.categories.length === 0) {
          this.categories = [];
          this.totalPages = 1;
        }
      } finally {
        this.loading = false;
      }
    },
    onSearch() {
      this.currentPage = 1;
    },
    clearSearch() {
      this.searchQuery = '';
      this.currentPage = 1;
    },
    async viewCategory(category) {
      const existingBackdrops = document.querySelectorAll('.modal-backdrop');
      existingBackdrops.forEach(backdrop => backdrop.remove());
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      try {
        const response = await axios.get(`${this.apiBase}/categories/${category.id}`);
        this.viewedCategory = response.data;
      } catch (error) {
        console.error('Error fetching category details:', error);
        this.viewedCategory = category;
      }
      
      if (this.viewModal) {
        this.viewModal.show();
      } else {
        try {
          const modalElement = document.getElementById('viewCategoryModal');
          if (modalElement) {
            this.viewModal = new Modal(modalElement, {
              backdrop: true,
              keyboard: true
            });
            this.viewModal.show();
          } else {
            console.error('View category modal element not found');
          }
        } catch (error) {
          console.error('Error showing view modal:', error);
        }
      }
    },
    closeViewModal() {
      if (this.viewModal) {
        this.viewModal.hide();
      }
      setTimeout(() => {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }, 150);
    },
    confirmDelete(category) {
      this.selectedCategory = category;
      if (this.deleteModal) {
        this.deleteModal.show();
      } else {
        try {
          const deleteModalElement = document.getElementById('deleteModal');
          if (deleteModalElement) {
            this.deleteModal = new Modal(deleteModalElement);
            this.deleteModal.show();
          } else {
            console.error('Delete modal element not found');
          }
        } catch (error) {
          console.error('Error showing delete modal:', error);
        }
      }
    },
    async deleteCategory() {
      if (!this.selectedCategory) return;
      
      this.deleting = true;
      try {
        const token = localStorage.getItem('authToken');
        await axios.delete(`${this.apiBase}/categories/${this.selectedCategory.id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });
        
        const index = this.categories.findIndex(c => c.id === this.selectedCategory.id);
        if (index !== -1) {
          this.categories.splice(index, 1);
          if (this.currentPage > this.totalPagesComputed) {
            this.currentPage = this.totalPagesComputed || 1;
          }
        }
        
        toast.success('Catégorie supprimée avec succès');
        
        if (this.deleteModal) {
          this.deleteModal.hide();
        }
        setTimeout(() => {
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) backdrop.remove();
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
        }, 150);
      } catch (error) {
        console.error('Error deleting category:', error);
        let errorMessage = 'Échec de la suppression de la catégorie.';
        
        if (error?.response?.status === 401) {
          errorMessage = 'Vous n\'êtes pas autorisé à effectuer cette action.';
        } else if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        toast.error(errorMessage);
      } finally {
        this.deleting = false;
        this.selectedCategory = null;
      }
    },
    openAddCategoryModal() {
      const existingBackdrops = document.querySelectorAll('.modal-backdrop');
      existingBackdrops.forEach(backdrop => backdrop.remove());
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      if (this.addModal) {
        this.addModal.show();
      } else {
        try {
          const modalElement = document.getElementById('addCategoryModal');
          if (modalElement) {
            this.addModal = new Modal(modalElement, {
              backdrop: true,
              keyboard: true
            });
            this.addModal.show();
          } else {
            console.error('Add category modal element not found');
          }
        } catch (error) {
          console.error('Error showing add modal:', error);
        }
      }
    },
    resetAddForm() {
      this.newCategory = {
        label: '',
        description: '',
      };
      this.submitting = false;
    },
    async addCategory() {
      if (this.submitting) return;
      
      if (!this.newCategory.label || !this.newCategory.description) {
        toast.warning('Le libellé et la description sont requis');
        return;
      }

      this.submitting = true;
      try {
        const token = localStorage.getItem('authToken');
        await axios.post(`${this.apiBase}/categories`, {
          label: this.newCategory.label,
          description: this.newCategory.description,
        }, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });

        toast.success('Catégorie ajoutée avec succès');
        
        if (this.addModal) {
          this.addModal.hide();
        }
        setTimeout(() => {
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) backdrop.remove();
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
        }, 150);
        
        this.resetAddForm();
        await this.fetchCategories();
      } catch (error) {
        console.error('Error adding category:', error);
        let errorMessage = 'Échec de l\'ajout de la catégorie.';
        
        if (error?.response?.status === 401) {
          errorMessage = 'Vous n\'êtes pas autorisé à effectuer cette action.';
          this.$router.push('/sign-in');
        } else if (error?.response?.status === 409 || error?.response?.status === 400) {
          errorMessage = error?.response?.data?.message || 'Les données fournies sont invalides.';
        } else if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        toast.error(errorMessage);
      } finally {
        this.submitting = false;
      }
    },
    editCategoryFromView() {
      this.closeViewModal();
      setTimeout(() => {
        this.openEditCategoryModal(this.viewedCategory);
      }, 150);
    },
    async openEditCategoryModal(category) {
      const existingBackdrops = document.querySelectorAll('.modal-backdrop');
      existingBackdrops.forEach(backdrop => backdrop.remove());
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      this.closeViewModal();
      
      try {
        const response = await axios.get(`${this.apiBase}/categories/${category.id}`);
        this.editingCategory = { ...response.data };
      } catch (error) {
        console.error('Error fetching category for edit:', error);
        this.editingCategory = { ...category };
      }
      
      if (this.editModal) {
        this.editModal.show();
      } else {
        try {
          const modalElement = document.getElementById('editCategoryModal');
          if (modalElement) {
            this.editModal = new Modal(modalElement, {
              backdrop: true,
              keyboard: true
            });
            this.editModal.show();
          } else {
            console.error('Edit category modal element not found');
          }
        } catch (error) {
          console.error('Error showing edit modal:', error);
        }
      }
    },
    resetEditForm() {
      this.editingCategory = null;
      this.updating = false;
    },
    async updateCategory() {
      if (!this.editingCategory || this.updating) return;
      
      if (!this.editingCategory.label || !this.editingCategory.description) {
        toast.warning('Le libellé et la description sont requis');
        return;
      }

      this.updating = true;
      try {
        const token = localStorage.getItem('authToken');
        await axios.put(`${this.apiBase}/categories/${this.editingCategory.id}`, {
          label: this.editingCategory.label,
          description: this.editingCategory.description,
        }, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });

        toast.success('Catégorie mise à jour avec succès');
        
        if (this.editModal) {
          this.editModal.hide();
        }
        setTimeout(() => {
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) backdrop.remove();
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
        }, 150);
        
        this.resetEditForm();
        await this.fetchCategories();
      } catch (error) {
        console.error('Error updating category:', error);
        let errorMessage = 'Échec de la mise à jour de la catégorie.';
        
        if (error?.response?.status === 401) {
          errorMessage = 'Vous n\'êtes pas autorisé à effectuer cette action.';
        } else if (error?.response?.status === 409 || error?.response?.status === 400) {
          errorMessage = error?.response?.data?.message || 'Les données fournies sont invalides.';
        } else if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        toast.error(errorMessage);
      } finally {
        this.updating = false;
      }
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPagesComputed) {
        this.currentPage = page;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPagesComputed) {
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
    const existingBackdrop = document.querySelector('.modal-backdrop');
    if (existingBackdrop) {
      existingBackdrop.remove();
    }
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    try {
      const deleteModalElement = document.getElementById('deleteModal');
      const viewModalElement = document.getElementById('viewCategoryModal');
      const addModalElement = document.getElementById('addCategoryModal');
      const editModalElement = document.getElementById('editCategoryModal');

      if (deleteModalElement) {
        this.deleteModal = new Modal(deleteModalElement);
        deleteModalElement.addEventListener('hidden.bs.modal', () => {
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) backdrop.remove();
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
        });
      } else {
        console.warn('Delete modal element not found');
      }

      if (viewModalElement) {
        this.viewModal = new Modal(viewModalElement, {
          backdrop: true,
          keyboard: true
        });
        viewModalElement.addEventListener('hidden.bs.modal', () => {
          const backdrops = document.querySelectorAll('.modal-backdrop');
          backdrops.forEach(b => b.remove());
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
        });
        viewModalElement.addEventListener('show.bs.modal', () => {
          const backdrops = document.querySelectorAll('.modal-backdrop');
          backdrops.forEach(b => b.remove());
          document.body.classList.add('modal-open');
        });
      } else {
        console.warn('View modal element not found');
      }

      if (addModalElement) {
        this.addModal = new Modal(addModalElement, {
          backdrop: true,
          keyboard: true
        });
        addModalElement.addEventListener('hidden.bs.modal', () => {
          const backdrops = document.querySelectorAll('.modal-backdrop');
          backdrops.forEach(b => b.remove());
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
          this.resetAddForm();
        });
        addModalElement.addEventListener('show.bs.modal', () => {
          const backdrops = document.querySelectorAll('.modal-backdrop');
          backdrops.forEach(b => b.remove());
          document.body.classList.add('modal-open');
        });
      } else {
        console.warn('Add category modal element not found');
      }

      if (editModalElement) {
        this.editModal = new Modal(editModalElement, {
          backdrop: true,
          keyboard: true
        });
        editModalElement.addEventListener('hidden.bs.modal', () => {
          const backdrops = document.querySelectorAll('.modal-backdrop');
          backdrops.forEach(b => b.remove());
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
          this.resetEditForm();
        });
        editModalElement.addEventListener('show.bs.modal', () => {
          const backdrops = document.querySelectorAll('.modal-backdrop');
          backdrops.forEach(b => b.remove());
          document.body.classList.add('modal-open');
        });
      } else {
        console.warn('Edit category modal element not found');
      }
    } catch (error) {
      console.error('Error initializing modals:', error);
    }
  },
  created() {
    this.fetchCategories();
  },
  beforeUnmount() {
    if (this.viewModal) {
      this.viewModal.dispose();
    }
    if (this.addModal) {
      this.addModal.dispose();
    }
    if (this.editModal) {
      this.editModal.dispose();
    }
    if (this.deleteModal) {
      this.deleteModal.dispose();
    }
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
}
</script>

<style scoped>
.admin-page-content {
  padding: 2rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

.btn-action {
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-action i,
.btn-action svg {
  font-size: 16px;
  color: white;
}

.btn-view {
  background-color: #17a2b8;
  color: white;
  box-shadow: 0 2px 8px rgba(23, 162, 184, 0.25);
}

.btn-view:hover {
  background-color: #138496;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(23, 162, 184, 0.4);
  color: white;
}

.btn-view:hover i,
.btn-view:hover svg {
  color: #ffffff !important;
  fill: none !important;
  stroke: #ffffff !important;
  stroke-width: 2.5 !important;
  opacity: 1 !important;
}

.btn-edit {
  background-color: #c62828;
  color: white;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(198, 40, 40, 0.25);
}

.btn-edit:hover {
  background-color: #8b1c1c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(198, 40, 40, 0.4);
  color: white;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

.btn-delete:hover {
  background-color: #c82333;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);
}

[data-bs-theme="dark"] .btn-view {
  background-color: #17a2b8;
  box-shadow: 0 2px 8px rgba(23, 162, 184, 0.3);
  color: white;
}

[data-bs-theme="dark"] .btn-view i,
[data-bs-theme="dark"] .btn-view svg {
  color: white !important;
  fill: none !important;
  stroke: #ffffff !important;
  opacity: 1 !important;
}

[data-bs-theme="dark"] .btn-view:hover {
  background-color: #138496;
  box-shadow: 0 4px 12px rgba(23, 162, 184, 0.5);
  color: white;
}

[data-bs-theme="dark"] .btn-view:hover i,
[data-bs-theme="dark"] .btn-view:hover svg {
  color: white !important;
  fill: none !important;
  stroke: #ffffff !important;
  opacity: 1 !important;
}

[data-bs-theme="dark"] .btn-edit {
  background-color: #c62828;
  box-shadow: 0 2px 8px rgba(198, 40, 40, 0.3);
}

[data-bs-theme="dark"] .btn-edit:hover {
  background-color: #8b1c1c;
  box-shadow: 0 4px 12px rgba(198, 40, 40, 0.5);
}

[data-bs-theme="dark"] .btn-delete {
  background-color: #dc3545;
}

[data-bs-theme="dark"] .btn-delete:hover {
  background-color: #bb2d3b;
}

.modal-header .btn-close {
  margin: -0.5rem -0.5rem -0.5rem auto;
}

/* Modern Modal Styles 2026 - Completely Isolated from app CSS */
#viewCategoryModal,
#addCategoryModal,
#editCategoryModal {
  z-index: 1055 !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  height: 100% !important;
  overflow-x: hidden !important;
  overflow-y: auto !important;
  outline: 0 !important;
  display: none !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
}

#viewCategoryModal.show,
#addCategoryModal.show,
#editCategoryModal.show {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

#viewCategoryModal .modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1050;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
}

.modern-modal-dialog {
  position: relative;
  width: auto;
  margin: 0;
  max-width: 700px;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  flex: 0 0 auto;
}

#viewCategoryModal.show .modern-modal-dialog,
#addCategoryModal.show .modern-modal-dialog,
#editCategoryModal.show .modern-modal-dialog {
  pointer-events: auto !important;
}

#viewCategoryModal .modal-dialog,
#addCategoryModal .modal-dialog,
#editCategoryModal .modal-dialog {
  margin: 0 !important;
  max-width: 700px !important;
  width: auto !important;
  pointer-events: none !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  position: relative !important;
}

#addCategoryModal .modal-dialog,
#editCategoryModal .modal-dialog {
  max-width: 650px !important;
}

@media (max-width: 768px) {
  #viewCategoryModal .modal-dialog,
  #addCategoryModal .modal-dialog,
  #editCategoryModal .modal-dialog {
    max-width: 95% !important;
    width: 95% !important;
    margin: 0 !important;
  }
  
  .modern-modal-dialog {
    max-width: 95% !important;
    margin: 0 !important;
    padding: 0.5rem !important;
  }
  
  #addCategoryModal .modal-body,
  #editCategoryModal .modal-body {
    padding: 1rem 1.5rem !important;
  }
}

.modern-modal-content {
  all: initial;
  display: flex !important;
  flex-direction: column !important;
  position: relative !important;
  width: 100% !important;
  pointer-events: auto !important;
  background-color: #ffffff !important;
  background-clip: padding-box !important;
  border: none !important;
  border-radius: 16px !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(198, 40, 40, 0.1) !important;
  outline: 0 !important;
  max-height: 80vh !important;
  overflow: hidden !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
  box-sizing: border-box !important;
}

.modern-modal-header {
  all: initial;
  padding: 1.25rem 2rem !important;
  border-bottom: 1px solid rgba(198, 40, 40, 0.1) !important;
  background: linear-gradient(135deg, #c62828 0%, #8b1c1c 100%) !important;
  color: white !important;
  position: relative !important;
  flex-shrink: 0 !important;
  border-radius: 16px 16px 0 0 !important;
  margin: 0 !important;
  border-width: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  font-family: inherit !important;
}

.modern-modal-header .modal-header-content {
  display: flex;
  align-items: center;
}

.modern-modal-header .modal-title {
  color: white !important;
  font-weight: 700;
  font-size: 1.35rem;
  letter-spacing: -0.02em;
  margin: 0;
  display: flex;
  align-items: center;
}

.modern-modal-header .modal-title i {
  font-size: 1.5rem;
}

.modern-modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  margin: 0;
  padding: 0.5rem;
  opacity: 1 !important;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9) !important;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  cursor: pointer;
}

.modern-modal-close:hover {
  opacity: 1 !important;
  background: rgba(255, 255, 255, 1) !important;
  transform: scale(1.1);
  border-color: rgba(255, 255, 255, 1);
}

.modern-modal-close::before {
  content: "×";
  font-size: 28px;
  font-weight: bold;
  color: #c62828 !important;
  line-height: 1;
  filter: none !important;
  opacity: 1 !important;
}

.modern-modal-close:hover::before {
  color: #8b1c1c !important;
}

.modern-modal-body {
  all: initial;
  padding: 1.25rem 1.75rem !important;
  overflow-y: auto !important;
  flex: 1 !important;
  min-height: 0 !important;
  max-height: calc(80vh - 120px) !important;
  background: linear-gradient(to bottom, #fafbfc 0%, #ffffff 100%) !important;
  scrollbar-width: thin !important;
  scrollbar-color: #c62828 transparent !important;
  position: relative !important;
  z-index: 1 !important;
  display: block !important;
  font-family: inherit !important;
  box-sizing: border-box !important;
}

@media (max-width: 768px) {
  .modern-modal-body {
    padding: 1rem 1.5rem !important;
  }
  
  .modern-modal-header {
    padding: 1rem 1.5rem !important;
  }
  
  .modern-modal-header .modal-title {
    font-size: 1.25rem !important;
  }
}

.modern-modal-body::-webkit-scrollbar {
  width: 8px;
}

.modern-modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.modern-modal-body::-webkit-scrollbar-thumb {
  background: #c62828;
  border-radius: 4px;
}

.modern-modal-body::-webkit-scrollbar-thumb:hover {
  background: #8b1c1c;
}

.modern-modal-footer {
  all: initial;
  padding: 1rem 2rem !important;
  border-top: 1px solid rgba(198, 40, 40, 0.1) !important;
  flex-shrink: 0 !important;
  background-color: #ffffff !important;
  border-radius: 0 0 16px 16px !important;
  display: flex !important;
  justify-content: flex-end !important;
  gap: 1rem !important;
  margin: 0 !important;
  border-width: 0 !important;
  font-family: inherit !important;
  box-sizing: border-box !important;
}

@media (max-width: 768px) {
  .modern-modal-footer {
    padding: 1rem 1.5rem !important;
    flex-direction: column-reverse;
  }
  
  .modern-modal-footer .btn {
    width: 100%;
  }
}

/* Category View Simple Styles */
.category-view-simple {
  display: flex;
  flex-direction: column;
}

.category-view-item {
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(198, 40, 40, 0.1);
}

.category-view-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.detail-value-large {
  font-size: 1.125rem;
  font-weight: 500;
  color: #2d3748;
  word-break: break-word;
  line-height: 1.6;
  margin-top: 0.5rem;
}

[data-bs-theme="dark"] .detail-value-large {
  color: #e2e8f0;
}

[data-bs-theme="dark"] .category-view-item {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

/* Details Section Header */
.details-section-header {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
}

.section-divider {
  height: 4px;
  width: 60px;
  background: linear-gradient(90deg, #c62828 0%, #8b1c1c 100%);
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(198, 40, 40, 0.2);
}

/* Details Grid */
.details-grid-2x1 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.detail-card-full {
  grid-column: 1 / -1;
}

@media (max-width: 768px) {
  .details-grid-2x1 {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .detail-card-full {
    grid-column: 1;
  }
}

/* Detail Cards */
.detail-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  box-shadow: 0 2px 12px rgba(198, 40, 40, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 4px solid;
  position: relative;
  overflow: visible;
  z-index: 1;
}

.detail-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(198, 40, 40, 0.3), transparent);
}

.detail-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(198, 40, 40, 0.15);
}

.detail-card-theme {
  border-left-color: #c62828;
}

.detail-card-theme:hover {
  border-left-color: #8b1c1c;
}

.detail-card-full {
  border-left-color: #c62828;
}

.detail-card-full:hover {
  border-left-color: #8b1c1c;
}

/* Detail Icon Wrappers */
.detail-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 20px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.detail-card:hover .detail-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.detail-icon-theme {
  background: linear-gradient(135deg, #c62828 0%, #8b1c1c 100%);
  box-shadow: 0 4px 12px rgba(198, 40, 40, 0.3);
}

/* Detail Content */
.detail-content {
  flex: 1;
  min-width: 0;
}

.detail-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #718096;
  margin-bottom: 0.5rem;
}

.detail-value {
  font-size: 1rem;
  font-weight: 500;
  color: #2d3748;
  word-break: break-word;
  line-height: 1.5;
}

/* Modern Buttons */
.modern-btn-primary {
  background: linear-gradient(135deg, #c62828 0%, #8b1c1c 100%);
  border: none;
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(198, 40, 40, 0.3);
}

.modern-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(198, 40, 40, 0.4);
  background: linear-gradient(135deg, #8b1c1c 0%, #2d5c4d 100%);
  color: white;
}

.modern-btn-secondary {
  background: #f0f0f0;
  border: none;
  color: #576071;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.modern-btn-secondary:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
  color: #576071;
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.025);
}

[data-bs-theme="dark"] .table-hover tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

/* Dark Theme */
[data-bs-theme="dark"] #viewCategoryModal .modern-modal-content,
[data-bs-theme="dark"] #addCategoryModal .modern-modal-content,
[data-bs-theme="dark"] #editCategoryModal .modern-modal-content {
  background: #1a202c !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(198, 40, 40, 0.2) !important;
}

[data-bs-theme="dark"] .modern-modal-header {
  background: linear-gradient(135deg, #c62828 0%, #8b1c1c 100%) !important;
  border-bottom-color: rgba(255, 255, 255, 0.1) !important;
}

[data-bs-theme="dark"] .modern-modal-body {
  background: linear-gradient(to bottom, #1a202c 0%, #121519 100%) !important;
}

[data-bs-theme="dark"] .modern-modal-footer {
  background-color: #1a202c !important;
  border-top-color: rgba(255, 255, 255, 0.1) !important;
}

[data-bs-theme="dark"] .detail-card {
  background: #2d3748;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

[data-bs-theme="dark"] .detail-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

[data-bs-theme="dark"] .section-title {
  color: #f7fafc;
}

[data-bs-theme="dark"] .detail-label {
  color: #a0aec0;
}

[data-bs-theme="dark"] .detail-value {
  color: #e2e8f0;
}

[data-bs-theme="dark"] .modern-btn-secondary {
  background: #2d3748;
  color: #e2e8f0;
}

[data-bs-theme="dark"] .modern-btn-secondary:hover {
  background: #374151;
  color: #e2e8f0;
}

/* Form styles for Add and Edit Category Modals */
#addCategoryModal .form-label,
#editCategoryModal .form-label {
  font-weight: 600 !important;
  color: #2d3748 !important;
  margin-bottom: 0.5rem !important;
  font-size: 0.875rem !important;
  display: block !important;
}

#addCategoryModal .form-control,
#editCategoryModal .form-control {
  border: 1px solid #e2e8f0 !important;
  border-radius: 8px !important;
  padding: 0.625rem 0.875rem !important;
  transition: all 0.2s ease !important;
  width: 100% !important;
  font-size: 0.9375rem !important;
  line-height: 1.5 !important;
  color: #2d3748 !important;
  background-color: #ffffff !important;
}

#addCategoryModal .form-control:focus,
#editCategoryModal .form-control:focus {
  border-color: #c62828 !important;
  box-shadow: 0 0 0 0.2rem rgba(198, 40, 40, 0.25) !important;
  outline: none !important;
  background-color: #ffffff !important;
}

#addCategoryModal .form-control.is-invalid,
#editCategoryModal .form-control.is-invalid {
  border-color: #dc3545 !important;
}

#addCategoryModal .invalid-feedback,
#editCategoryModal .invalid-feedback {
  display: block !important;
  color: #dc3545 !important;
  font-size: 0.875rem !important;
  margin-top: 0.25rem !important;
  width: 100% !important;
}

#addCategoryModal .text-danger,
#editCategoryModal .text-danger {
  color: #dc3545 !important;
}

[data-bs-theme="dark"] #addCategoryModal .form-label,
[data-bs-theme="dark"] #editCategoryModal .form-label {
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] #addCategoryModal .form-control,
[data-bs-theme="dark"] #editCategoryModal .form-control {
  background-color: #2d3748 !important;
  border-color: #4a5568 !important;
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] #addCategoryModal .form-control:focus,
[data-bs-theme="dark"] #editCategoryModal .form-control:focus {
  background-color: #2d3748 !important;
  border-color: #c62828 !important;
  color: #e2e8f0 !important;
}
</style>
