<template>
  <div class="admin-page-content">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <button 
            type="button" 
            class="btn btn-primary"
            @click="openAddSellerModal"
          >
            <i class="ai-user-plus me-2 ms-n1"></i>Ajouter un Vendeur
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
              placeholder="Rechercher un vendeur (nom, prénom, email, téléphone, CIN)..."
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
          <div v-if="searchQuery && filteredSellers.length > 0" class="text-muted small mt-2">
            {{ filteredSellers.length }} résultat(s) trouvé(s)
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
                <th scope="col">Prénom</th>
                <th scope="col">Nom</th>
                <th scope="col">E-mail</th>
                <th scope="col">Téléphone</th>
                <th scope="col">CIN</th>
                <th scope="col">Date de naissance</th>
                <th scope="col" class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="seller in paginatedSellers" :key="seller.id">
                <td>{{ seller.firstName }}</td>
                <td>{{ seller.lastName }}</td>
                <td>{{ seller.email }}</td>
                <td>{{ seller.phone || 'N/A' }}</td>
                <td>{{ seller.cin || 'N/A' }}</td>
                <td>{{ seller.dateOfBirth ? formatDate(seller.dateOfBirth) : 'N/A' }}</td>
                <td>
                  <div class="action-buttons">
                    <button
                      @click="viewSeller(seller)"
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
                      @click="openEditSellerModal(seller)"
                      type="button"
                      class="btn btn-action btn-edit"
                      title="Modifier"
                    >
                      <i class="ai-edit"></i>
                    </button>
                    <button
                      @click="confirmDelete(seller)"
                      type="button"
                      class="btn btn-action btn-delete"
                      title="Supprimer"
                    >
                      <i class="ai-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="paginatedSellers.length === 0 && !error">
                <td colspan="7" class="text-center py-5">
                  <div class="text-muted">
                    <i class="ai-store fs-1 d-block mb-3 opacity-50"></i>
                    <p class="mb-0 fs-5">{{ searchQuery ? 'Aucun résultat trouvé' : 'Aucun vendeur trouvé' }}</p>
                    <p class="mb-0 text-muted small">
                      {{ searchQuery ? 'Essayez de modifier votre recherche' : 'Les vendeurs apparaîtront ici une fois créés' }}
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Error State (afficher après le tableau) -->
          <div v-if="error" class="alert alert-danger mt-3" role="alert">
            <i class="ai-alert-circle me-2"></i>
            {{ error }}
            <button @click="fetchSellers" class="btn btn-link p-0 ms-2">Réessayer</button>
          </div>

          <!-- Pagination -->
          <nav v-if="filteredSellers.length > 0" aria-label="Navigation des pages" class="mt-4">
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
                {{ filteredSellers.length }} vendeur(s) 
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
            Êtes-vous sûr de vouloir supprimer le vendeur <strong>{{ selectedSeller?.firstName }} {{ selectedSeller?.lastName }}</strong> ?
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
              @click="deleteSeller"
              :disabled="deleting"
            >
              {{ deleting ? 'Suppression...' : 'Supprimer' }}
            </button>
          </div>
        </div>
      </div>
    </div>

  <!-- View Seller Details Modal -->
  <div 
    class="modal fade" 
    id="viewSellerModal" 
    tabindex="-1" 
    aria-labelledby="viewSellerModalLabel" 
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl modal-dialog-scrollable modern-modal-dialog">
      <div class="modal-content seller-modal-content modern-modal-content">
        <div class="modal-header seller-modal-header modern-modal-header">
          <div class="modal-header-content">
            <h5 class="modal-title" id="viewSellerModalLabel">
              <i class="ai-user me-2"></i>Détails du vendeur
            </h5>
          </div>
          <button 
            type="button" 
            class="btn-close seller-modal-close modern-modal-close" 
            data-bs-dismiss="modal" 
            aria-label="Fermer"
          ></button>
        </div>
        <div class="modal-body seller-modal-body modern-modal-body" v-if="viewedSeller">
          <!-- Profile Picture Section (Center) -->
          <div class="seller-profile-picture-center mb-3">
            <div class="seller-profile-picture-wrapper">
              <img 
                v-if="hasProfilePicture && profilePictureUrl"
                :src="profilePictureUrl" 
                :alt="`${viewedSeller.firstName} ${viewedSeller.lastName}`"
                class="seller-profile-picture"
                @error="handleImageError"
              />
              <div v-else class="seller-profile-picture-placeholder">
                <i class="ai-user"></i>
              </div>
            </div>
          </div>

          <!-- Details Section (Grid 3 rows x 2 columns) -->
          <div class="details-section-header mb-2">
            <h6 class="section-title">Informations personnelles</h6>
            <div class="section-divider"></div>
          </div>
          <div class="details-grid-3x2">
                <div class="detail-card detail-card-theme">
                  <div class="detail-icon-wrapper detail-icon-theme">
                    <i class="ai-user"></i>
                  </div>
                  <div class="detail-content">
                    <label class="detail-label">Prénom</label>
                    <div class="detail-value">{{ viewedSeller.firstName || 'N/A' }}</div>
                  </div>
                </div>
                
                <div class="detail-card detail-card-theme">
                  <div class="detail-icon-wrapper detail-icon-theme">
                    <i class="ai-user"></i>
                  </div>
                  <div class="detail-content">
                    <label class="detail-label">Nom</label>
                    <div class="detail-value">{{ viewedSeller.lastName || 'N/A' }}</div>
                  </div>
                </div>
                
                <div class="detail-card detail-card-theme">
                  <div class="detail-icon-wrapper detail-icon-theme">
                    <i class="ai-mail"></i>
                  </div>
                  <div class="detail-content">
                    <label class="detail-label">E-mail</label>
                    <div class="detail-value">
                      <a :href="`mailto:${viewedSeller.email}`">{{ viewedSeller.email || 'N/A' }}</a>
                    </div>
                  </div>
                </div>
                
                <div class="detail-card detail-card-theme">
                  <div class="detail-icon-wrapper detail-icon-theme">
                    <i class="ai-phone"></i>
                  </div>
                  <div class="detail-content">
                    <label class="detail-label">Téléphone</label>
                    <div class="detail-value">
                      <a v-if="viewedSeller.phone" :href="`tel:${viewedSeller.phone}`">
                        {{ viewedSeller.phone }}
                      </a>
                      <span v-else>N/A</span>
                    </div>
                  </div>
                </div>
                
                <div class="detail-card detail-card-cin">
                  <div class="detail-icon-wrapper detail-icon-cin">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                      <rect x="6" y="6" width="6" height="4" rx="1"></rect>
                      <line x1="6" y1="14" x2="18" y2="14"></line>
                      <line x1="6" y1="17" x2="12" y2="17"></line>
                      <circle cx="9" cy="8" r="1.5"></circle>
                    </svg>
                  </div>
                  <div class="detail-content">
                    <label class="detail-label">CIN</label>
                    <div class="detail-value">{{ viewedSeller.cin || 'N/A' }}</div>
                  </div>
                </div>
                
                <div class="detail-card detail-card-theme">
                  <div class="detail-icon-wrapper detail-icon-theme">
                    <i class="ai-calendar"></i>
                  </div>
                  <div class="detail-content">
                    <label class="detail-label">Date de naissance</label>
                    <div class="detail-value">
                      {{ viewedSeller.dateOfBirth ? formatDate(viewedSeller.dateOfBirth) : 'N/A' }}
                    </div>
                  </div>
                </div>
              </div>
        </div>
        <div class="modal-footer seller-modal-footer modern-modal-footer">
          <button 
            type="button" 
            class="btn btn-secondary modern-btn-secondary" 
            data-bs-dismiss="modal"
          >
            Fermer
          </button>
          <button 
            v-if="viewedSeller"
            type="button"
            class="btn btn-primary modern-btn-primary"
            @click="editSellerFromView"
          >
            <i class="ai-edit me-1"></i>Modifier
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Seller Modal -->
  <div 
    class="modal fade" 
    id="addSellerModal" 
    tabindex="-1" 
    aria-labelledby="addSellerModalLabel" 
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-scrollable modern-modal-dialog">
      <div class="modal-content seller-modal-content modern-modal-content">
        <div class="modal-header seller-modal-header modern-modal-header">
          <div class="modal-header-content">
            <h5 class="modal-title" id="addSellerModalLabel">
              <i class="ai-user-plus me-2"></i>Ajouter un Vendeur
            </h5>
          </div>
          <button 
            type="button" 
            class="btn-close seller-modal-close modern-modal-close" 
            data-bs-dismiss="modal" 
            aria-label="Fermer"
            @click="resetAddForm"
          ></button>
        </div>
        <div class="modal-body seller-modal-body modern-modal-body">
          <form @submit.prevent="addSeller">
            <div class="row g-3">
              <div class="col-md-6">
                <label for="add-first-name" class="form-label">Prénom <span class="text-danger">*</span></label>
                <input
                  v-model="newSeller.firstName"
                  class="form-control"
                  type="text"
                  id="add-first-name"
                  placeholder="John"
                  required
                />
              </div>

              <div class="col-md-6">
                <label for="add-last-name" class="form-label">Nom <span class="text-danger">*</span></label>
                <input
                  v-model="newSeller.lastName"
                  class="form-control"
                  type="text"
                  id="add-last-name"
                  placeholder="Doe"
                  required
                />
              </div>

              <div class="col-md-6">
                <label for="add-email" class="form-label">Email <span class="text-danger">*</span></label>
                <input
                  v-model="newSeller.email"
                  class="form-control"
                  type="email"
                  id="add-email"
                  placeholder="email@example.com"
                  required
                  :class="{'is-invalid': emailError}"
                />
                <div v-if="emailError" class="invalid-feedback">
                  Veuillez entrer un email valide.
                </div>
              </div>

              <div class="col-md-6">
                <label for="add-phone" class="form-label">Téléphone <span class="text-danger">*</span></label>
                <input
                  v-model="newSeller.phone"
                  class="form-control"
                  type="tel"
                  id="add-phone"
                  placeholder="12345678"
                  required
                />
              </div>

              <div class="col-md-6">
                <label for="add-cin" class="form-label">CIN <span class="text-danger">*</span></label>
                <input
                  v-model="newSeller.cin"
                  class="form-control"
                  type="text"
                  id="add-cin"
                  placeholder="AB123456"
                  required
                />
              </div>

              <div class="col-md-6">
                <label for="add-date-of-birth" class="form-label">Date de naissance <span class="text-danger">*</span></label>
                <input
                  v-model="newSeller.dateOfBirth"
                  class="form-control"
                  type="date"
                  id="add-date-of-birth"
                  required
                />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer seller-modal-footer modern-modal-footer">
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
            @click="addSeller"
            :disabled="submitting"
          >
            <span v-if="submitting" class="spinner-border spinner-border-sm me-1" role="status"></span>
            {{ submitting ? 'Ajout en cours...' : 'Ajouter' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Edit Seller Modal -->
  <div 
    class="modal fade" 
    id="editSellerModal" 
    tabindex="-1" 
    aria-labelledby="editSellerModalLabel" 
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-scrollable modern-modal-dialog">
      <div class="modal-content seller-modal-content modern-modal-content">
        <div class="modal-header seller-modal-header modern-modal-header">
          <div class="modal-header-content">
            <h5 class="modal-title" id="editSellerModalLabel">
              <i class="ai-edit me-2"></i>Modifier le Vendeur
            </h5>
          </div>
          <button 
            type="button" 
            class="btn-close seller-modal-close modern-modal-close" 
            data-bs-dismiss="modal" 
            aria-label="Fermer"
            @click="resetEditForm"
          ></button>
        </div>
        <div class="modal-body seller-modal-body modern-modal-body" v-if="editingSeller">
          <form @submit.prevent="updateSeller">
            <div class="row g-3">
              <div class="col-md-6">
                <label for="edit-first-name" class="form-label">Prénom <span class="text-danger">*</span></label>
                <input
                  v-model="editingSeller.firstName"
                  class="form-control"
                  type="text"
                  id="edit-first-name"
                  placeholder="John"
                  required
                />
              </div>

              <div class="col-md-6">
                <label for="edit-last-name" class="form-label">Nom <span class="text-danger">*</span></label>
                <input
                  v-model="editingSeller.lastName"
                  class="form-control"
                  type="text"
                  id="edit-last-name"
                  placeholder="Doe"
                  required
                />
              </div>

              <div class="col-md-6">
                <label for="edit-email" class="form-label">Email <span class="text-danger">*</span></label>
                <input
                  v-model="editingSeller.email"
                  class="form-control"
                  type="email"
                  id="edit-email"
                  placeholder="email@example.com"
                  required
                  :class="{'is-invalid': editEmailError}"
                />
                <div v-if="editEmailError" class="invalid-feedback">
                  Veuillez entrer un email valide.
                </div>
              </div>

              <div class="col-md-6">
                <label for="edit-phone" class="form-label">Téléphone <span class="text-danger">*</span></label>
                <input
                  v-model="editingSeller.phone"
                  class="form-control"
                  type="tel"
                  id="edit-phone"
                  placeholder="12345678"
                  required
                />
              </div>

              <div class="col-md-6">
                <label for="edit-cin" class="form-label">CIN <span class="text-danger">*</span></label>
                <input
                  v-model="editingSeller.cin"
                  class="form-control"
                  type="text"
                  id="edit-cin"
                  placeholder="AB123456"
                  required
                />
              </div>

              <div class="col-md-6">
                <label for="edit-date-of-birth" class="form-label">Date de naissance <span class="text-danger">*</span></label>
                <input
                  v-model="editingSeller.dateOfBirth"
                  class="form-control"
                  type="date"
                  id="edit-date-of-birth"
                  required
                />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer seller-modal-footer modern-modal-footer">
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
            @click="updateSeller"
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
  name: 'SellersListComponent',
  data() {
    return {
      apiBase: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000',
      sellers: [],
      searchQuery: '',
      currentPage: 1,
      totalPages: 1,
      itemsPerPage: 10,
      loading: true,
      error: null,
      selectedSeller: null,
      deleting: false,
      deleteModal: null,
      viewedSeller: null,
      viewModal: null,
      addModal: null,
      newSeller: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        cin: '',
        dateOfBirth: '',
      },
      emailError: false,
      submitting: false,
      editModal: null,
      editingSeller: null,
      editEmailError: false,
      updating: false
    };
  },
  computed: {
    filteredSellers() {
      if (!this.searchQuery.trim()) {
        return this.sellers;
      }
      
      const query = this.searchQuery.toLowerCase().trim();
      return this.sellers.filter(seller => {
        const firstName = (seller.firstName || '').toLowerCase();
        const lastName = (seller.lastName || '').toLowerCase();
        const email = (seller.email || '').toLowerCase();
        const phone = (seller.phone || '').toLowerCase();
        const cin = (seller.cin || '').toLowerCase();
        
        return firstName.includes(query) ||
               lastName.includes(query) ||
               email.includes(query) ||
               phone.includes(query) ||
               cin.includes(query) ||
               `${firstName} ${lastName}`.includes(query);
      });
    },
    paginatedSellers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredSellers.slice(start, end);
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
      return Math.max(1, Math.ceil(this.filteredSellers.length / this.itemsPerPage));
    },
    hasProfilePicture() {
      if (!this.viewedSeller) return false;
      const avatar = this.viewedSeller.avatar || this.viewedSeller.photo || this.viewedSeller.photoURL;
      return !!avatar && avatar.trim() !== '';
    },
    profilePictureUrl() {
      if (!this.viewedSeller) return '';
      let photo = this.viewedSeller.avatar || this.viewedSeller.photo || this.viewedSeller.photoURL || '';
      
      if (!photo || typeof photo !== 'string') return '';
      
      // Nettoyer les espaces et retours à la ligne
      photo = photo.trim().replace(/\s/g, '');
      
      if (!photo) return '';
      
      // Si la photo est déjà une URL complète (commence par http://, https://, ou data:)
      if (photo.startsWith('http://') || photo.startsWith('https://') || photo.startsWith('data:')) {
        return photo;
      }
      
      // Si c'est une chaîne base64, ajouter le préfixe data:image
      // Vérifier si c'est déjà du base64 valide (caractères alphanumériques, +, /, =)
      // Base64 peut contenir des caractères = à la fin pour le padding
      const base64Pattern = /^[A-Za-z0-9+/]+=*$/;
      if (base64Pattern.test(photo)) {
        // Déterminer le type MIME en fonction du début de la chaîne base64
        let mimeType = 'image/jpeg'; // par défaut
        
        // Décoder le début pour vérifier les signatures de fichier
        try {
          const decodedStart = atob(photo.substring(0, Math.min(20, photo.length)));
          const bytes = new Uint8Array(decodedStart.length);
          for (let i = 0; i < decodedStart.length; i++) {
            bytes[i] = decodedStart.charCodeAt(i);
          }
          
          // PNG: 89 50 4E 47 (0x89 0x50 0x4E 0x47)
          if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
            mimeType = 'image/png';
          }
          // JPEG: FF D8 FF
          else if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
            mimeType = 'image/jpeg';
          }
          // GIF: 47 49 46 38 (GIF8)
          else if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
            mimeType = 'image/gif';
          }
          // WebP: RIFF...WEBP
          else if (photo.substring(0, 4) === 'UklGR') {
            mimeType = 'image/webp';
          }
        } catch (e) {
          console.warn('Error detecting image type, using default JPEG:', e);
        }
        
        return `data:${mimeType};base64,${photo}`;
      }
      
      // Si ce n'est ni une URL ni du base64 valide, retourner vide pour éviter les erreurs
      console.warn('Invalid photo format, expected base64 or URL');
      return '';
    }
  },
  watch: {
    filteredSellers() {
      if (this.currentPage > this.totalPagesComputed) {
        this.currentPage = this.totalPagesComputed || 1;
      }
    }
  },
  methods: {
    async fetchSellers() {
      this.loading = true;
      this.error = null;
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          this.error = 'Vous devez être connecté pour voir les vendeurs.';
          this.loading = false;
          return;
        }

        const response = await axios.get(`${this.apiBase}/users/sellers`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        
        // Vérifier que la réponse est un tableau
        if (Array.isArray(response.data)) {
          this.sellers = response.data;
          this.totalPages = Math.max(1, Math.ceil(this.sellers.length / this.itemsPerPage));
          // Pas d'erreur si le tableau est vide, c'est normal - afficher "Aucun vendeur trouvé"
          this.error = null; // Toujours effacer l'erreur si la requête réussit
          if (response.data.length === 0) {
            console.log('Aucun vendeur trouvé dans la base de données');
          }
        } else {
          // Si la réponse n'est pas un tableau, on initialise un tableau vide
          this.sellers = [];
          this.totalPages = 1;
          this.error = null; // Pas d'erreur si on peut récupérer, juste initialiser à vide
          console.warn('Réponse inattendue du serveur:', response.data);
        }
      } catch (error) {
        console.error('Error fetching sellers:', error);
        
        // Gestion spécifique des erreurs
        if (error?.response?.status === 401) {
          this.error = 'Vous n\'êtes pas autorisé à voir les vendeurs. Veuillez vous reconnecter.';
        } else if (error?.response?.status === 404) {
          // 404 pourrait signifier que l'endpoint n'existe pas encore
          this.error = 'Endpoint non trouvé. Vérifiez la configuration du serveur.';
        } else if (error?.response?.status === 500) {
          // En cas d'erreur 500, vérifier si le backend a quand même retourné des données
          // (peut arriver si l'erreur est capturée mais qu'une réponse partielle est envoyée)
          if (error?.response?.data && Array.isArray(error.response.data)) {
            // Si le backend a retourné un tableau même avec un 500, l'utiliser
            this.sellers = error.response.data;
            this.totalPages = Math.max(1, Math.ceil(this.sellers.length / this.itemsPerPage));
            this.error = null;
          } else {
            // Sinon, erreur serveur réelle
            this.error = 'Erreur serveur lors du chargement. Veuillez réessayer.';
            this.sellers = [];
            this.totalPages = 1;
          }
        } else if (error?.code === 'ECONNREFUSED' || error?.message?.includes('Network Error')) {
          this.error = 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré.';
        } else {
          // Pour les autres erreurs, on essaie de récupérer le message
          const errorMessage = error?.response?.data?.message || error?.message || 'Erreur inconnue';
          // Si c'est une erreur serveur mais qu'on peut récupérer, on initialise à vide
          if (error?.response?.status >= 500) {
            this.error = `Erreur serveur: ${errorMessage}`;
            this.sellers = [];
            this.totalPages = 1;
          } else {
            this.error = `Échec du chargement des vendeurs: ${errorMessage}`;
          }
        }
        
        // En cas d'erreur, initialiser avec un tableau vide pour éviter les erreurs d'affichage
        if (!this.sellers || this.sellers.length === 0) {
          this.sellers = [];
          this.totalPages = 1;
        }
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    handleImageError(event) {
      console.error('Error loading profile picture:', event);
      // Cacher l'image en cas d'erreur
      if (event.target) {
        event.target.style.display = 'none';
      }
    },
    async viewSeller(seller) {
      // Nettoyer les backdrops existants avant d'ouvrir
      const existingBackdrops = document.querySelectorAll('.modal-backdrop');
      existingBackdrops.forEach(backdrop => backdrop.remove());
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      // Charger les données complètes du vendeur depuis l'API pour obtenir la photo
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${this.apiBase}/users/${seller.id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });
        this.viewedSeller = response.data;
      } catch (error) {
        console.error('Error fetching seller details:', error);
        // En cas d'erreur, utiliser les données du seller de la liste
        this.viewedSeller = seller;
      }
      
      if (this.viewModal) {
        this.viewModal.show();
      } else {
        // Initialiser la modal si elle n'est pas encore créée
        this.$nextTick(() => {
          try {
            const modalElement = document.getElementById('viewSellerModal');
            if (modalElement) {
              this.viewModal = new Modal(modalElement, {
                backdrop: true,
                keyboard: true,
                focus: true
              });
              this.viewModal.show();
            } else {
              console.error('View seller modal element not found');
            }
          } catch (error) {
            console.error('Error showing view modal:', error);
          }
        });
      }
    },
    closeViewModal() {
      if (this.viewModal) {
        this.viewModal.hide();
      }
      this.viewedSeller = null;
      // Nettoyer le backdrop si il existe
      this.$nextTick(() => {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
        // Retirer la classe modal-open du body
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      });
    },
    confirmDelete(seller) {
      this.selectedSeller = seller;
      if (this.deleteModal) {
        this.deleteModal.show();
      } else {
        // Fallback: try to initialize modal if it doesn't exist
        this.$nextTick(() => {
          const deleteModalElement = document.getElementById('deleteModal');
          if (deleteModalElement) {
            this.deleteModal = new Modal(deleteModalElement);
            this.deleteModal.show();
          }
        });
      }
    },
    async deleteSeller() {
      if (!this.selectedSeller) return;
      
      this.deleting = true;
      try {
        const token = localStorage.getItem('authToken');
        await axios.delete(`${this.apiBase}/users/${this.selectedSeller.id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });
        const index = this.sellers.findIndex(s => s.id === this.selectedSeller.id);
        if (index !== -1) {
          this.sellers.splice(index, 1);
          if (this.currentPage > this.totalPagesComputed) {
            this.currentPage = this.totalPagesComputed || 1;
          }
        }
        toast.success('Vendeur supprimé avec succès');
        if (this.deleteModal) {
          this.deleteModal.hide();
        }
        // S'assurer que le backdrop est nettoyé
        this.$nextTick(() => {
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.remove();
          }
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
        });
      } catch (error) {
        toast.error('Échec de la suppression du vendeur');
        console.error('Error deleting seller:', error);
      } finally {
        this.deleting = false;
        this.selectedSeller = null;
      }
    },
    goToPage(page) {
      if (typeof page === 'number' && page >= 1 && page <= this.totalPagesComputed) {
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
    },
    onSearch() {
      this.currentPage = 1;
    },
    clearSearch() {
      this.searchQuery = '';
      this.currentPage = 1;
    },
    openAddSellerModal() {
      // Nettoyer les backdrops existants avant d'ouvrir
      const existingBackdrops = document.querySelectorAll('.modal-backdrop');
      existingBackdrops.forEach(backdrop => backdrop.remove());
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      this.resetAddForm();
      
      if (this.addModal) {
        this.addModal.show();
      } else {
        this.$nextTick(() => {
          try {
            const modalElement = document.getElementById('addSellerModal');
            if (modalElement) {
              this.addModal = new Modal(modalElement, {
                backdrop: true,
                keyboard: true,
                focus: true
              });
              this.addModal.show();
            } else {
              console.error('Add seller modal element not found');
            }
          } catch (error) {
            console.error('Error showing add modal:', error);
          }
        });
      }
    },
    resetAddForm() {
      this.newSeller = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        cin: '',
        dateOfBirth: '',
      };
      this.emailError = false;
      this.submitting = false;
    },
    validateEmail() {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      this.emailError = !emailRegex.test(this.newSeller.email);
      return !this.emailError;
    },
    async addSeller() {
      if (this.submitting) {
        return;
      }

      if (!this.validateEmail()) {
        return;
      }

      this.submitting = true;
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          toast.error('Vous devez être connecté pour ajouter un vendeur.');
          return;
        }

        const userData = {
          ...this.newSeller,
          role: 'seller'
        };

        const response = await axios.post(`${this.apiBase}/users`, userData, {
          headers: { 
            Authorization: `Bearer ${token}` 
          },
          withCredentials: true,
        });

        console.log('Seller added successfully:', response.data);
        toast.success('Vendeur ajouté avec succès');
        
        // Fermer la modal
        if (this.addModal) {
          this.addModal.hide();
        }
        
        // Reset form
        this.resetAddForm();
        
        // Rafraîchir la liste des vendeurs
        await this.fetchSellers();
        
        // Nettoyer le backdrop
        this.$nextTick(() => {
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.remove();
          }
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
        });
      } catch (error) {
        console.error('Error adding seller:', error);
        console.error('Error response data:', error?.response?.data);
        
        let errorMessage = 'Échec de l\'ajout du vendeur.';
        
        if (error?.response?.status === 401) {
          errorMessage = 'Vous n\'êtes pas autorisé à effectuer cette action. Veuillez vous reconnecter.';
        } else if (error?.response?.status === 409 || error?.response?.status === 400) {
          // NestJS retourne un tableau de messages dans error.response.data.message
          const backendMessage = error?.response?.data?.message;
          if (Array.isArray(backendMessage) && backendMessage.length > 0) {
            errorMessage = backendMessage[0]; // Prendre le premier message
          } else if (typeof backendMessage === 'string') {
            errorMessage = backendMessage;
          } else {
            errorMessage = 'Les données fournies sont invalides.';
          }
        } else if (error?.response?.data?.message) {
          const backendMessage = error.response.data.message;
          errorMessage = Array.isArray(backendMessage) ? backendMessage[0] : backendMessage;
        }
        
        toast.error(errorMessage);
      } finally {
        this.submitting = false;
      }
    },
    editSellerFromView() {
      if (this.viewedSeller) {
        this.closeViewModal();
        this.$nextTick(() => {
          this.openEditSellerModal(this.viewedSeller);
        });
      }
    },
    async openEditSellerModal(seller) {
      // Nettoyer les backdrops existants avant d'ouvrir
      const existingBackdrops = document.querySelectorAll('.modal-backdrop');
      existingBackdrops.forEach(backdrop => backdrop.remove());
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      // Fermer la modal de vue si elle est ouverte
      if (this.viewModal) {
        this.viewModal.hide();
      }
      
      // Charger les données complètes du vendeur depuis l'API
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${this.apiBase}/users/${seller.id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });
        const userData = response.data;
        // Convertir la date de naissance au format YYYY-MM-DD pour l'input date
        if (userData.dateOfBirth) {
          const date = new Date(userData.dateOfBirth);
          if (!isNaN(date.getTime())) {
            userData.dateOfBirth = date.toISOString().split('T')[0];
          } else {
            userData.dateOfBirth = '';
          }
        } else {
          userData.dateOfBirth = '';
        }
        this.editingSeller = { ...userData };
        this.editEmailError = false;
      } catch (error) {
        console.error('Error fetching seller details for edit:', error);
        toast.error('Échec du chargement des détails du vendeur');
        return;
      }
      
      if (this.editModal) {
        this.editModal.show();
      } else {
        this.$nextTick(() => {
          try {
            const modalElement = document.getElementById('editSellerModal');
            if (modalElement) {
              this.editModal = new Modal(modalElement, {
                backdrop: true,
                keyboard: true,
                focus: true
              });
              this.editModal.show();
            } else {
              console.error('Edit seller modal element not found');
            }
          } catch (error) {
            console.error('Error showing edit modal:', error);
          }
        });
      }
    },
    resetEditForm() {
      this.editingSeller = null;
      this.editEmailError = false;
      this.updating = false;
    },
    validateEditEmail() {
      if (!this.editingSeller) return false;
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      this.editEmailError = !emailRegex.test(this.editingSeller.email);
      return !this.editEmailError;
    },
    async updateSeller() {
      if (this.updating || !this.editingSeller || !this.editingSeller.id) {
        return;
      }

      if (!this.validateEditEmail()) {
        return;
      }

      this.updating = true;
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          toast.error('Vous devez être connecté pour modifier un vendeur.');
          return;
        }

        const userData = {
          firstName: this.editingSeller.firstName,
          lastName: this.editingSeller.lastName,
          email: this.editingSeller.email,
          phone: this.editingSeller.phone,
          cin: this.editingSeller.cin,
          dateOfBirth: this.editingSeller.dateOfBirth,
        };

        const response = await axios.put(`${this.apiBase}/users/${this.editingSeller.id}`, userData, {
          headers: { 
            Authorization: `Bearer ${token}` 
          },
          withCredentials: true,
        });

        console.log('Seller updated successfully:', response.data);
        toast.success('Vendeur modifié avec succès');
        
        // Fermer la modal
        if (this.editModal) {
          this.editModal.hide();
        }
        
        // Reset form
        this.resetEditForm();
        
        // Rafraîchir la liste des vendeurs
        await this.fetchSellers();
        
        // Nettoyer le backdrop
        this.$nextTick(() => {
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.remove();
          }
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
        });
      } catch (error) {
        console.error('Error updating seller:', error);
        
        let errorMessage = 'Échec de la modification du vendeur.';
        
        if (error?.response?.status === 401) {
          errorMessage = 'Vous n\'êtes pas autorisé à effectuer cette action. Veuillez vous reconnecter.';
        } else if (error?.response?.status === 409 || error?.response?.status === 400) {
          errorMessage = error?.response?.data?.message || 'Les données fournies sont invalides.';
        } else if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        toast.error(errorMessage);
      } finally {
        this.updating = false;
      }
    }
  },
  mounted() {
    // Nettoyer tout backdrop résiduel au montage
    const existingBackdrop = document.querySelector('.modal-backdrop');
    if (existingBackdrop) {
      existingBackdrop.remove();
    }
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    this.$nextTick(() => {
      try {
        const deleteModalElement = document.getElementById('deleteModal');
        const viewModalElement = document.getElementById('viewSellerModal');
        const addModalElement = document.getElementById('addSellerModal');
        const editModalElement = document.getElementById('editSellerModal');
        
        if (deleteModalElement) {
          this.deleteModal = new Modal(deleteModalElement);
          deleteModalElement.addEventListener('hidden.bs.modal', () => {
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
              backdrop.remove();
            }
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
            keyboard: true,
            focus: true
          });
          viewModalElement.addEventListener('hidden.bs.modal', () => {
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => backdrop.remove());
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            this.viewedSeller = null;
          });
          viewModalElement.addEventListener('show.bs.modal', () => {
            const backdrops = document.querySelectorAll('.modal-backdrop');
            if (backdrops.length > 1) {
              backdrops.forEach((backdrop, index) => {
                if (index > 0) backdrop.remove();
              });
            }
          });
        } else {
          console.warn('View modal element not found');
        }
        
        if (addModalElement) {
          this.addModal = new Modal(addModalElement, {
            backdrop: true,
            keyboard: true,
            focus: true
          });
          addModalElement.addEventListener('hidden.bs.modal', () => {
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => backdrop.remove());
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            this.resetAddForm();
          });
          addModalElement.addEventListener('show.bs.modal', () => {
            const backdrops = document.querySelectorAll('.modal-backdrop');
            if (backdrops.length > 1) {
              backdrops.forEach((backdrop, index) => {
                if (index > 0) backdrop.remove();
              });
            }
          });
        } else {
          console.warn('Add seller modal element not found');
        }
        
        if (editModalElement) {
          this.editModal = new Modal(editModalElement, {
            backdrop: true,
            keyboard: true,
            focus: true
          });
          editModalElement.addEventListener('hidden.bs.modal', () => {
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => backdrop.remove());
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            this.resetEditForm();
          });
          editModalElement.addEventListener('show.bs.modal', () => {
            const backdrops = document.querySelectorAll('.modal-backdrop');
            if (backdrops.length > 1) {
              backdrops.forEach((backdrop, index) => {
                if (index > 0) backdrop.remove();
              });
            }
          });
        } else {
          console.warn('Edit seller modal element not found');
        }
      } catch (error) {
        console.error('Error initializing modals:', error);
      }
    });
  },
  beforeUnmount() {
    // Nettoyer les modals et le backdrop avant de détruire le composant
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
    // Nettoyer tout backdrop restant
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  },
  created() {
    this.fetchSellers();
  }
};
</script>

<style scoped>
.pagination {
  gap: 0.25rem;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

.btn-action {
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
}

.btn-action i {
  font-size: 16px;
}

.btn-view {
  background-color: #17a2b8;
  color: white;
  box-shadow: 0 2px 8px rgba(23, 162, 184, 0.25);
}

.btn-view i,
.btn-view svg {
  display: inline-block !important;
  width: 18px !important;
  height: 18px !important;
  line-height: 1;
  vertical-align: middle;
  color: #ffffff !important;
  fill: none !important;
  stroke: #ffffff !important;
  stroke-width: 2.5 !important;
  opacity: 1 !important;
}

.btn-view .visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
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
#viewSellerModal,
#addSellerModal,
#editSellerModal {
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

#viewSellerModal.show,
#addSellerModal.show,
#editSellerModal.show {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

#viewSellerModal .modal-backdrop {
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

#viewSellerModal.show .modern-modal-dialog,
#addSellerModal.show .modern-modal-dialog,
#editSellerModal.show .modern-modal-dialog {
  pointer-events: auto !important;
}

#viewSellerModal .modal-dialog,
#addSellerModal .modal-dialog,
#editSellerModal .modal-dialog {
  margin: 0 !important;
  max-width: 700px !important;
  width: auto !important;
  pointer-events: none !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  position: relative !important;
}

#addSellerModal .modal-dialog,
#editSellerModal .modal-dialog {
  max-width: 650px !important;
}

@media (max-width: 768px) {
  #viewSellerModal .modal-dialog,
  #addSellerModal .modal-dialog,
  #editSellerModal .modal-dialog {
    max-width: 95% !important;
    width: 95% !important;
    margin: 0 !important;
  }
  
  .modern-modal-dialog {
    max-width: 95% !important;
    margin: 0 !important;
    padding: 0.5rem !important;
  }
  
  #addSellerModal .modal-body,
  #editSellerModal .modal-body {
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

/* Completely isolated modal styles - prevent all inheritance from app CSS */
#viewSellerModal,
#addSellerModal,
#editSellerModal {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
}

#viewSellerModal *,
#addSellerModal *,
#editSellerModal * {
  box-sizing: border-box !important;
}

.table-hover tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.025);
}

[data-bs-theme="dark"] .table-hover tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

/* Profile Picture Styles */
.seller-profile-picture-center {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
}

.seller-profile-picture-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

.seller-profile-picture {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 4px 20px rgba(198, 40, 40, 0.3);
}

.seller-profile-picture-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #c62828 0%, #8b1c1c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
  box-shadow: 0 4px 20px rgba(198, 40, 40, 0.3);
}

.seller-profile-picture-placeholder i {
  font-size: 48px;
  color: white;
}

/* Removed styles for h4 and text-muted - name and email no longer displayed under profile picture */

.modern-modal-body .text-muted a {
  color: #c62828;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.modern-modal-body .text-muted a:hover {
  color: #8b1c1c;
  text-decoration: underline;
}

/* Removed dark theme style for h4 - no longer used */

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
.details-grid-3x2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, auto);
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .details-grid-3x2 {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    gap: 0.75rem;
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

.detail-card-cin {
  border-left-color: #c62828;
}

.detail-card-cin:hover {
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

.detail-icon-cin {
  background: linear-gradient(135deg, #c62828 0%, #8b1c1c 100%) !important;
  box-shadow: 0 4px 12px rgba(198, 40, 40, 0.3) !important;
  position: relative;
  z-index: 2;
}

.detail-icon-cin i,
.detail-icon-cin svg {
  color: #ffffff !important;
  fill: none !important;
  stroke: #ffffff !important;
  stroke-width: 2.5 !important;
  font-weight: bold;
  opacity: 1 !important;
  font-size: 20px !important;
  width: 20px !important;
  height: 20px !important;
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

.detail-value a {
  color: #c62828;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.detail-value a:hover {
  color: #8b1c1c;
  text-decoration: underline;
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

/* Dark Theme */
[data-bs-theme="dark"] #viewSellerModal .modern-modal-content,
[data-bs-theme="dark"] #addSellerModal .modern-modal-content,
[data-bs-theme="dark"] #editSellerModal .modern-modal-content {
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

[data-bs-theme="dark"] .detail-value a {
  color: #5fb896;
}

[data-bs-theme="dark"] .detail-value a:hover {
  color: #c62828;
}

[data-bs-theme="dark"] .modern-btn-secondary {
  background: #2d3748;
  color: #e2e8f0;
}

[data-bs-theme="dark"] .modern-btn-secondary:hover {
  background: #374151;
  color: #e2e8f0;
}

/* Form styles for Add and Edit Seller Modals - Completely isolated */
#addSellerModal .form-label,
#editSellerModal .form-label {
  font-weight: 600 !important;
  color: #2d3748 !important;
  margin-bottom: 0.5rem !important;
  font-size: 0.875rem !important;
  display: block !important;
}

#addSellerModal .form-control,
#editSellerModal .form-control {
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

#addSellerModal .form-control:focus,
#editSellerModal .form-control:focus {
  border-color: #c62828 !important;
  box-shadow: 0 0 0 0.2rem rgba(198, 40, 40, 0.25) !important;
  outline: none !important;
  background-color: #ffffff !important;
}

#addSellerModal .form-control.is-invalid,
#editSellerModal .form-control.is-invalid {
  border-color: #dc3545 !important;
}

#addSellerModal .invalid-feedback,
#editSellerModal .invalid-feedback {
  display: block !important;
  color: #dc3545 !important;
  font-size: 0.875rem !important;
  margin-top: 0.25rem !important;
  width: 100% !important;
}

#addSellerModal .text-danger,
#editSellerModal .text-danger {
  color: #dc3545 !important;
}

[data-bs-theme="dark"] #addSellerModal .form-label,
[data-bs-theme="dark"] #editSellerModal .form-label {
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] #addSellerModal .form-control,
[data-bs-theme="dark"] #editSellerModal .form-control {
  background-color: #2d3748 !important;
  border-color: #4a5568 !important;
  color: #e2e8f0 !important;
}

[data-bs-theme="dark"] #addSellerModal .form-control:focus,
[data-bs-theme="dark"] #editSellerModal .form-control:focus {
  background-color: #2d3748 !important;
  border-color: #c62828 !important;
  color: #e2e8f0 !important;
}
</style>
