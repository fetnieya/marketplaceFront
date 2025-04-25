<template>
  <div class="d-flex align-items-center justify-content-center min-vh-100 bg-light">
    <div class="col-lg-4 col-md-5 col-sm-8 bg-white shadow p-2 rounded mt-5">
      <h1 class="h3 mb-3 text-center">Add Product</h1>
      <form @submit.prevent="addProduct">
        <div class="container">
          <!-- Image input with preview -->
          <div class="mb-3">
            <label for="image-input" class="form-label">Product Image</label>
            <input 
              class="form-control" 
              type="file" 
              id="image-input" 
              @change="handleImageChange" 
              accept="image/*"
              required 
            />
            <!-- Image preview -->
            <img 
              v-if="imagePreview" 
              :src="imagePreview" 
              class="mt-2 preview-image" 
              alt="Preview"
            />
          </div>

          <!-- Video input with preview -->
          <div class="mb-3">
            <label for="video-input" class="form-label">Product Video</label>
            <input 
              class="form-control" 
              type="file" 
              id="video-input" 
              @change="handleVideoChange"
              accept="video/*"
            />
            <!-- Video preview -->
            <video 
              v-if="videoPreview" 
              :src="videoPreview" 
              class="mt-2 preview-video" 
              controls
            ></video>
          </div>

          <!-- Rest of your form fields remain the same -->
          <div class="mb-3">
            <label for="name-input" class="form-label">Product Name</label>
            <input
              v-model="product.name"
              class="form-control"
              type="text"
              id="name-input"
              placeholder="Product name"
              required
            />
          </div>

          <div class="mb-3">
            <label for="description-input" class="form-label">Description</label>
            <textarea
              v-model="product.description"
              class="form-control"
              id="description-input"
              rows="5"
              placeholder="Product description"
              required
            ></textarea>
          </div>

          <div class="mb-3">
            <label for="category-input" class="form-label">Category</label>
            <select v-model="product.category" id="category-input" class="form-select" required>
              <option value="" disabled>Select category...</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.label }}
              </option>
            </select>
          </div>

          <label for="price-input" class="form-label">Price</label>
          <div class="input-group mb-3">
            <span class="input-group-text">
              <i class="ai-dollar"></i>
            </span>
            <input
              v-model="product.price"
              type="number"
              class="form-control"
              id="price-input"
              placeholder="Amount"
              required
            />
            <span class="input-group-text">.00</span>
          </div>

          <label for="discount-input" class="form-label">Discount</label>
          <div class="input-group mb-3">
            <span class="input-group-text">
              <i class="ai-dollar"></i>
            </span>
            <input
              v-model="product.discount"
              type="number"
              class="form-control"
              id="discount-input"
              placeholder="Amount"
              required
            />
            <span class="input-group-text">.00</span>
          </div>

          <div class="d-flex justify-content-center mt-3">
            <button type="submit" class="btn btn-primary mx-2" :disabled="isLoading">
              <span  class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              
            </button>
            <router-link to="/products">
              <button type="button" class="btn btn-secondary mx-2" :disabled="isLoading">Cancel</button>
            </router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AddProduct",
  data() {
    return {
      product: {
        name: "",
        description: "",
        category: "",
        price: 0,
        discount: 0,
        image: null,
        video: null
      },
      categories: [],
      imagePreview: null,
      videoPreview: null,
      selectedImage: null,
      selectedVideo: null,
      isLoading: false
    };
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get("http://localhost:3000/categories");
        this.categories = response.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
        alert("Failed to load categories. Please try again.");
      }
    },

    handleImageChange(event) {
      this.selectedImage = event.target.files[0];
      if (this.selectedImage) {
        this.imagePreview = URL.createObjectURL(this.selectedImage);
      }
    },

    handleVideoChange(event) {
      this.selectedVideo = event.target.files[0];
      if (this.selectedVideo) {
        this.videoPreview = URL.createObjectURL(this.selectedVideo);
      }
    },

    async uploadToCloudinary(file, type = 'image') {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('http://localhost:3000/upload/file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        console.log(`${type} upload response:`, response.data);
        return response.data.secure_url || response.data.url;
      } catch (error) {
        console.error(`Error uploading ${type}:`, error);
        throw new Error(`Failed to upload ${type}`);
      }
    },
    
    async addProduct() {
      try {
        this.isLoading = true;
        
        if (!this.selectedImage) {
          throw new Error('Product image is required');
        }
        
        // Upload image first
        let imageUrl = null;
        let videoUrl = null;

        imageUrl = await this.uploadToCloudinary(this.selectedImage, 'image');
        console.log('Uploaded image URL:', imageUrl);

        // Then upload video if exists
        if (this.selectedVideo) {
          videoUrl = await this.uploadToCloudinary(this.selectedVideo, 'video');
          console.log('Uploaded video URL:', videoUrl);
        }

        // Create product with URLs
        const productData = {
          name: this.product.name,
          description: this.product.description,
          category: this.product.category, // Fixed: use the selected category ID
          price: parseFloat(this.product.price),
          discount: parseFloat(this.product.discount),
          image: imageUrl,
          video: videoUrl
        };

        console.log('Sending product data:', productData);

        // Send to your backend
        const response = await axios.post('http://localhost:3000/products', productData);
        console.log('Product created:', response.data);
        
        // Navigate back to products list
        this.$router.push('/products');
      } catch (error) {
        console.error('Error in addProduct:', error);
        alert(error.message || 'Failed to add product');
      } finally {
        this.isLoading = false;
      }
    }
  },
  mounted() {
    this.fetchCategories();
  },
  beforeUnmount() {
    // Cleanup any object URLs to prevent memory leaks
    if (this.imagePreview) URL.revokeObjectURL(this.imagePreview);
    if (this.videoPreview) URL.revokeObjectURL(this.videoPreview);
  }
};
</script>

<style scoped>
.min-vh-100 {
  min-height: 100vh;
}

button {
  font-size: 16px;
  font-weight: 500;
}

.preview-image {
  max-width: 200px;
  max-height: 200px;
  object-fit: contain;
  display: block;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
}

.preview-video {
  max-width: 200px;
  max-height: 200px;
  display: block;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
}
</style>