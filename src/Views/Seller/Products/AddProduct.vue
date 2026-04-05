<template>
  <div class="add-announcement-page">
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-8 col-xl-7">
          <!-- Header -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="h2 mb-0">Créer une annonce</h1>
            <router-link to="/products">
              <button type="button" class="btn btn-outline-secondary">
                <i class="ai-x me-2"></i>Annuler
              </button>
            </router-link>
          </div>

          <!-- Form Card -->
          <div class="card border border-2">
            <div class="card-body p-4">
              <form @submit.prevent="addProduct">
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
                      :disabled="selectedImages.length >= 10"
                    >
                      <i class="ai-image me-2"></i>
                      {{ selectedImages.length > 0 ? `Ajouter des photos (${selectedImages.length}/10)` : 'Sélectionner des photos' }}
                    </button>

                    <!-- Preview des images sélectionnées -->
                    <div v-if="selectedImages.length > 0" class="images-preview-grid">
                      <div 
                        v-for="(image, index) in selectedImages" 
                        :key="index"
                        class="image-preview-item"
                      >
                        <div class="image-preview-container">
                          <img 
                            :src="image.preview" 
                            :alt="`Preview ${index + 1}`"
                            class="preview-image"
                          />
                          <button
                            type="button"
                            class="btn-remove-image"
                            @click="removeImage(index)"
                            title="Supprimer cette image"
                          >
                            <i class="ai-x"></i>
                          </button>
                          <div class="image-index">{{ index + 1 }}</div>
                        </div>
                      </div>
                    </div>

                    <!-- Message d'erreur -->
                    <div v-if="imageError" class="text-danger small mt-2">
                      <i class="ai-alert-circle me-1"></i>{{ imageError }}
                    </div>
                    <div v-if="!imageError && selectedImages.length > 0" class="text-success small mt-2">
                      <i class="ai-check-circle me-1"></i>{{ selectedImages.length }} photo(s) sélectionnée(s)
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
                  <div class="form-text">
                    Le statut par défaut est "Disponible". Vous pouvez le modifier plus tard.
                  </div>
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
                    :disabled="isLoading || selectedImages.length === 0"
                  >
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    <i v-else class="ai-check me-2"></i>
                    {{ isLoading ? 'Création...' : 'Créer l\'annonce' }}
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
import axios from "axios";

export default {
  name: "AddProduct",
  data() {
    return {
      apiBase: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000',
      product: {
        name: "",
        description: "",
        category: "",
        price: 0,
        quantity: 1,
        status: "disponible"
      },
      categories: [],
      selectedImages: [],
      isLoading: false,
      error: "",
      success: "",
      imageError: ""
    };
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get(`${this.apiBase}/categories`);
        this.categories = response.data || [];
      } catch (error) {
        console.error("Error fetching categories:", error);
        this.error = "Erreur lors du chargement des catégories.";
      }
    },

    handleImagesChange(event) {
      this.imageError = "";
      const files = Array.from(event.target.files || []);
      
      if (files.length === 0) return;

      // Vérifier le nombre total d'images
      const totalImages = this.selectedImages.length + files.length;
      if (totalImages > 10) {
        this.imageError = `Vous ne pouvez sélectionner que 10 photos maximum. Vous avez déjà ${this.selectedImages.length} photo(s).`;
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
          this.selectedImages.push({
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
      // Révoker l'URL de l'objet pour libérer la mémoire
      if (this.selectedImages[index].preview && this.selectedImages[index].preview.startsWith('blob:')) {
        URL.revokeObjectURL(this.selectedImages[index].preview);
      }
      this.selectedImages.splice(index, 1);
      this.imageError = "";
    },

    async convertImageToBlob(imageData) {
      // Si c'est déjà une data URL, la convertir en blob
      try {
        const response = await fetch(imageData);
        const blob = await response.blob();
        return blob;
      } catch (error) {
        // Si ça échoue, essayer de convertir directement
        const base64Data = imageData.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: 'image/jpeg' });
      }
    },

    async uploadImage(imageFile) {
      try {
        // Créer un FormData avec le fichier
        const formData = new FormData();
        formData.append('file', imageFile.file);

        // Upload vers le backend (sans limite de taille côté client)
        const response = await axios.post(`${this.apiBase}/upload/file`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        return response.data.url || response.data.secure_url || response.data;
      } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Erreur lors de l\'upload de l\'image');
      }
    },
    
    async addProduct() {
      this.error = "";
      this.success = "";

      // Validation
      if (this.selectedImages.length === 0) {
        this.imageError = "Veuillez sélectionner au moins une photo.";
        return;
      }

      if (this.selectedImages.length > 10) {
        this.imageError = "Vous ne pouvez pas ajouter plus de 10 photos.";
        return;
      }

      try {
        this.isLoading = true;
        const sellerId = this.getCurrentSellerId();
        
        if (!sellerId) {
          throw new Error('Compte vendeur non trouvé. Veuillez vous reconnecter.');
        }

        // Upload toutes les images
        const imageUrls = [];
        for (const image of this.selectedImages) {
          try {
            const url = await this.uploadImage(image);
            imageUrls.push(url);
          } catch (uploadError) {
            console.error('Error uploading image:', uploadError);
            throw new Error('Erreur lors de l\'upload d\'une image. Veuillez réessayer.');
          }
        }

        // Créer le produit avec les URLs des images
        const productData = {
          name: this.product.name,
          description: this.product.description,
          categoryId: parseInt(this.product.category) || this.product.category, // Le DTO attend categoryId
          price: parseFloat(this.product.price),
          quantity: parseInt(this.product.quantity) || 1,
          status: this.product.status || "disponible",
          images: imageUrls, // Tableau d'images
          image: imageUrls[0], // Image principale (première image)
          sellerId
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

        const response = await axios.post(`${this.apiBase}/products`, productData, config);
        console.log('Product created:', response.data);
        
        // Rediriger vers la liste
        this.$router.push('/products');
      } catch (error) {
        console.error('Error in addProduct:', error);
        this.error = error.response?.data?.message || error.message || 'Erreur lors de la création de l\'annonce.';
      } finally {
        this.isLoading = false;
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
    this.fetchCategories();
  },
  beforeUnmount() {
    // Nettoyer les URLs d'aperçu pour libérer la mémoire
    this.selectedImages.forEach(image => {
      if (image.preview && image.preview.startsWith('blob:')) {
        URL.revokeObjectURL(image.preview);
      }
    });
  }
};
</script>

<style scoped>
.add-announcement-page {
  min-height: 100vh;
  background-color: var(--ar-secondary-bg, #f6f9fc);
}

[data-bs-theme="dark"] .add-announcement-page {
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

.btn-remove-image:hover {
  background-color: rgba(237, 80, 80, 1);
  transform: scale(1.1);
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