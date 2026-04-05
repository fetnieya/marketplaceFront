<template>
  <div class="edit-announcement-page">
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-8 col-xl-7">
          <!-- Header -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="h2 mb-0">Modifier l'annonce</h1>
            <router-link to="/products">
              <button type="button" class="btn btn-outline-secondary">
                <i class="ai-x me-2"></i>Annuler
              </button>
            </router-link>
          </div>

          <!-- Form Card -->
          <div class="card border border-2">
            <div class="card-body p-4">
              <form @submit.prevent="updateProduct">
                <!-- Images Upload Section -->
                <div class="mb-4">
                  <label class="form-label fw-semibold">
                    Photos <span class="text-danger">*</span>
                    <span class="text-muted fs-sm ms-2">(Minimum 1, Maximum 10)</span>
                  </label>
                  <div class="images-upload-container">
                    <!-- Input pour sélectionner plusieurs images -->
                    <input 
                      ref="imageInput"
                      class="form-control d-none" 
                      type="file" 
                      id="images-input" 
                      @change="handleImagesChange" 
                      accept="image/*"
                      multiple
                    />
                    
                    <!-- Bouton pour déclencher la sélection -->
                    <button
                      type="button"
                      class="btn btn-outline-primary w-100 mb-3"
                      @click="$refs.imageInput.click()"
                      :disabled="allImages.length >= 10"
                    >
                      <i class="ai-image me-2"></i>
                      {{ allImages.length > 0 ? `Ajouter des photos (${allImages.length}/10)` : 'Sélectionner des photos' }}
                    </button>

                    <!-- Preview des images existantes et nouvelles -->
                    <div v-if="allImages.length > 0" class="images-preview-grid">
                      <div 
                        v-for="(image, index) in allImages" 
                        :key="`image-${index}`"
                        class="image-preview-item"
                      >
                        <div class="image-preview-container">
                          <img 
                            :src="image.url || image.preview" 
                            :alt="`Preview ${index + 1}`"
                            class="preview-image"
                            @error="handleImageError"
                          />
                          <button
                            type="button"
                            class="btn-remove-image"
                            @click="removeImage(index)"
                            title="Supprimer cette image"
                            :disabled="allImages.length === 1"
                          >
                            <i class="ai-x"></i>
                          </button>
                          <div class="image-index">{{ index + 1 }}</div>
                          <div v-if="image.isNew" class="image-badge-new">Nouvelle</div>
                        </div>
                      </div>
                    </div>

                    <!-- Message d'erreur -->
                    <div v-if="imageError" class="text-danger small mt-2">
                      <i class="ai-alert-circle me-1"></i>{{ imageError }}
                    </div>
                    <div v-if="!imageError && allImages.length > 0" class="text-success small mt-2">
                      <i class="ai-check-circle me-1"></i>{{ allImages.length }} photo(s)
                    </div>
                  </div>
                </div>

                <!-- Nom de l'annonce -->
                <div class="mb-3">
                  <label for="name-input" class="form-label fw-semibold">
                    Nom de l'annonce <span class="text-danger">*</span>
                  </label>
                  <input
                    v-model.trim="product.name"
                    class="form-control"
                    type="text"
                    id="name-input"
                    placeholder="Ex: Table en bois massif"
                    required
                  />
                </div>

                <!-- Description -->
                <div class="mb-3">
                  <label for="description-input" class="form-label fw-semibold">
                    Description <span class="text-danger">*</span>
                  </label>
                  <textarea
                    v-model.trim="product.description"
                    class="form-control"
                    id="description-input"
                    rows="5"
                    placeholder="Décrivez votre produit en détail..."
                    required
                  ></textarea>
                </div>

                <!-- Category -->
                <div class="mb-3">
                  <label for="category-input" class="form-label fw-semibold">
                    Catégorie <span class="text-danger">*</span>
                  </label>
                  <select 
                    v-model="product.category" 
                    id="category-input" 
                    class="form-select" 
                    required
                  >
                    <option value="" disabled>Sélectionner une catégorie...</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.label }}
                    </option>
                  </select>
                </div>

                <!-- Prix et Nombre de pièces -->
                <div class="row g-3 mb-3">
                  <div class="col-md-6">
                    <label for="price-input" class="form-label fw-semibold">
                      Prix <span class="text-danger">*</span>
                    </label>
                    <div class="input-group">
                      <input
                        v-model.number="product.price"
                        type="number"
                        class="form-control"
                        id="price-input"
                        placeholder="0"
                        step="0.01"
                        min="0"
                        required
                      />
                      <span class="input-group-text">DT</span>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label for="quantity-input" class="form-label fw-semibold">
                      Nombre de pièces <span class="text-danger">*</span>
                    </label>
                    <input
                      v-model.number="product.quantity"
                      type="number"
                      class="form-control"
                      id="quantity-input"
                      placeholder="1"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <!-- Statut -->
                <div class="mb-4">
                  <label for="status-input" class="form-label fw-semibold">
                    Statut
                  </label>
                  <select 
                    v-model="product.status" 
                    id="status-input" 
                    class="form-select"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="en_attente">En attente</option>
                    <option value="vendu">Vendu</option>
                  </select>
                </div>

                <!-- Error/Success Messages -->
                <div v-if="error" class="alert alert-danger mb-3" role="alert">
                  <i class="ai-alert-circle me-2"></i>{{ error }}
                </div>
                <div v-if="success" class="alert alert-success mb-3" role="alert">
                  <i class="ai-check-circle me-2"></i>{{ success }}
                </div>

                <!-- Submit Buttons -->
                <div class="d-flex justify-content-end gap-2 pt-3 border-top">
                  <router-link to="/products">
                    <button type="button" class="btn btn-secondary" :disabled="isLoading">
                      Annuler
                    </button>
                  </router-link>
                  <button 
                    type="submit" 
                    class="btn btn-primary" 
                    :disabled="isLoading || allImages.length === 0"
                  >
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    <i v-else class="ai-check me-2"></i>
                    {{ isLoading ? 'Enregistrement...' : 'Enregistrer les modifications' }}
                  </button>
                </div>
              </form>
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
  name: 'EditProduct',
  data() {
    return {
      apiBase: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000',
      product: {
        id: null,
        name: '',
        description: '',
        category: '',
        price: 0,
        quantity: 1,
        status: 'disponible',
        images: [],
        image: ''
      },
      categories: [],
      existingImages: [],
      newImages: [],
      isLoading: false,
      error: '',
      success: '',
      imageError: ''
    };
  },
  computed: {
    allImages() {
      // Combiner les images existantes et les nouvelles
      // existingImages contient déjà uniquement les URLs (filtrées dans fetchProductDetails)
      const existing = this.existingImages.map(url => ({ url, isNew: false }));
      const newOnes = this.newImages.map(img => ({ preview: img.preview, file: img.file, isNew: true }));
      return [...existing, ...newOnes];
    }
  },
  methods: {
    handleImageError(event) {
      // Si l'image ne peut pas être chargée (base64 tronqué), la cacher silencieusement
      const img = event.target;
      if (img.src && img.src.startsWith('data:image')) {
        img.style.display = 'none';
      }
    },
    async fetchCategories() {
      try {
        const response = await axios.get(`${this.apiBase}/categories`);
        this.categories = response.data || [];
      } catch (error) {
        console.error("Error fetching categories:", error);
        this.error = "Erreur lors du chargement des catégories.";
      }
    },

    async fetchProductDetails() {
      const productId = this.$route.params.id;
      this.isLoading = true;
      this.error = '';
      
      try {
        const response = await axios.get(`${this.apiBase}/products/${productId}`);
        const productData = response.data;
        
        this.product = {
          id: productData.id,
          name: productData.name || '',
          description: productData.description || '',
          category: productData.category?.id || productData.category || '',
          price: productData.price || 0,
          quantity: productData.quantity || productData.quantity || 1,
          status: productData.status || 'disponible',
          images: productData.images || [],
          image: productData.image || ''
        };

        // Charger les images existantes (nouveau format avec table Image)
        if (productData.images && Array.isArray(productData.images) && productData.images.length > 0) {
          // Si c'est un tableau d'objets Image (nouveau format)
          if (typeof productData.images[0] === 'object' && productData.images[0].url) {
            this.existingImages = productData.images.map(img => img.url);
          } else {
            // Si c'est un tableau de strings (ancien format pour compatibilité)
            this.existingImages = [...productData.images];
          }
        } else if (productData.image) {
          this.existingImages = [productData.image];
        } else {
          this.existingImages = [];
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        this.error = 'Erreur lors du chargement des détails de l\'annonce.';
      } finally {
        this.isLoading = false;
      }
    },

    handleImagesChange(event) {
      this.imageError = "";
      const files = Array.from(event.target.files || []);
      
      if (files.length === 0) return;

      // Vérifier le nombre total d'images
      const totalImages = this.allImages.length + files.length;
      if (totalImages > 10) {
        this.imageError = `Vous ne pouvez sélectionner que 10 photos maximum. Vous avez déjà ${this.allImages.length} photo(s).`;
        return;
      }

      // Traiter chaque fichier
      files.forEach(file => {
        if (!file.type.startsWith('image/')) {
          this.imageError = 'Veuillez sélectionner uniquement des images.';
          return;
        }

        // Créer un objet URL pour l'aperçu
        const reader = new FileReader();
        reader.onload = (e) => {
          this.newImages.push({
            file: file,
            preview: e.target.result
          });
        };
        reader.onerror = () => {
          this.imageError = 'Erreur lors de la lecture d\'une image.';
        };
        reader.readAsDataURL(file);
      });

      // Réinitialiser l'input pour permettre de sélectionner à nouveau
      if (event.target) {
        event.target.value = '';
      }
    },

    removeImage(index) {
      // Si c'est une image existante
      if (index < this.existingImages.length) {
        if (this.allImages.length === 1) {
          this.imageError = "Vous devez avoir au moins une photo.";
          return;
        }
        this.existingImages.splice(index, 1);
      } else {
        // C'est une nouvelle image
        const newIndex = index - this.existingImages.length;
        if (this.allImages.length === 1) {
          this.imageError = "Vous devez avoir au moins une photo.";
          return;
        }
        // Révoker l'URL de l'objet pour libérer la mémoire
        if (this.newImages[newIndex].preview && this.newImages[newIndex].preview.startsWith('blob:')) {
          URL.revokeObjectURL(this.newImages[newIndex].preview);
        }
        this.newImages.splice(newIndex, 1);
      }
      this.imageError = "";
    },

    async uploadImage(imageFile) {
      try {
        // Convertir l'image en base64 (comme pour le profil)
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            // Le résultat est déjà en base64 avec le préfixe data:image/...
            resolve(e.target.result);
          };
          reader.onerror = () => {
            reject(new Error('Erreur lors de la lecture de l\'image'));
          };
          reader.readAsDataURL(imageFile.file);
        });
      } catch (error) {
        console.error('Error converting image to base64:', error);
        throw new Error('Erreur lors de la conversion de l\'image');
      }
    },

    async updateProduct() {
      this.error = "";
      this.success = "";

      // Validation
      if (this.allImages.length === 0) {
        this.imageError = "Veuillez sélectionner au moins une photo.";
        return;
      }

      if (this.allImages.length > 10) {
        this.imageError = "Vous ne pouvez pas ajouter plus de 10 photos.";
        return;
      }

      const productId = this.$route.params.id;
      this.isLoading = true;

      try {
        // Convertir les nouvelles images en base64
        const newImageData = [];
        for (const image of this.newImages) {
          try {
            const base64Data = await this.uploadImage(image);
            newImageData.push(base64Data);
          } catch (uploadError) {
            console.error('Error converting image to base64:', uploadError);
            throw new Error('Erreur lors de la conversion d\'une image. Veuillez réessayer.');
          }
        }

        // Combiner les images existantes (déjà en base64 depuis le backend) et les nouvelles
        const allImageData = [...this.existingImages, ...newImageData];

        // S'assurer que la catégorie est un ID
        const categoryId = parseInt(this.product.category) || this.product.category;

        // Mettre à jour le produit
        const productData = {
          name: this.product.name,
          description: this.product.description,
          categoryId: categoryId, // Le DTO attend categoryId
          price: parseFloat(this.product.price),
          quantity: parseInt(this.product.quantity) || 1,
          status: this.product.status || 'disponible',
          images: allImageData, // Images en base64
          image: allImageData[0] // Image principale (première image) en base64
        };

        // Envoyer au backend avec authentification
        const token = localStorage.getItem('authToken');
        const config = {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          withCredentials: true,
        };

        await axios.put(`${this.apiBase}/products/${productId}`, productData, config);

        // Rediriger vers la liste
        this.$router.push('/products');
      } catch (error) {
        console.error('Error updating product:', error);
        this.error = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour de l\'annonce.';
      } finally {
        this.isLoading = false;
      }
    }
  },
  mounted() {
    this.fetchCategories();
    this.fetchProductDetails();
  },
  beforeUnmount() {
    // Nettoyer les URLs d'aperçu pour libérer la mémoire
    this.newImages.forEach(image => {
      if (image.preview && image.preview.startsWith('blob:')) {
        URL.revokeObjectURL(image.preview);
      }
    });
  }
};
</script>

<style scoped>
.edit-announcement-page {
  min-height: 100vh;
  background-color: var(--ar-secondary-bg, #f6f9fc);
}

[data-bs-theme="dark"] .edit-announcement-page {
  background-color: #0d1117;
}

/* Images Upload Container */
.images-upload-container {
  margin-top: 0.5rem;
}

/* Images Preview Grid */
.images-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.image-preview-item {
  position: relative;
}

.image-preview-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid var(--ar-border-color, rgba(0, 0, 0, 0.1));
  background-color: var(--ar-secondary-bg, #f6f9fc);
}

[data-bs-theme="dark"] .image-preview-container {
  border-color: rgba(255, 255, 255, 0.1);
  background-color: #1c2128;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remove-image {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: rgba(237, 80, 80, 0.9);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
}

.btn-remove-image:hover:not(:disabled) {
  background-color: rgba(237, 80, 80, 1);
  transform: scale(1.1);
}

.btn-remove-image:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.image-index {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.image-badge-new {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background-color: rgba(16, 185, 129, 0.9);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  z-index: 5;
}

/* Form Styles */
.card {
  background-color: var(--ar-body-bg, #fff);
  border-color: var(--ar-border-color, rgba(0, 0, 0, 0.1));
}

[data-bs-theme="dark"] .card {
  background-color: #161b22;
  border-color: rgba(255, 255, 255, 0.1);
}

.form-label {
  color: var(--ar-emphasis-color, #121519);
  margin-bottom: 0.5rem;
}

[data-bs-theme="dark"] .form-label {
  color: #fff;
}

.form-control:focus,
.form-select:focus {
  border-color: var(--ar-primary, #c62828);
  box-shadow: 0 0 0 0.2rem rgba(var(--ar-primary-rgb), 0.25);
}

/* Responsive */
@media (max-width: 575.98px) {
  .images-preview-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.75rem;
  }

  .card-body {
    padding: 1.5rem !important;
  }
}
</style>