<template>
  <div class="d-flex align-items-center justify-content-center min-vh-100 bg-light">
    <div class="col-lg-4 col-md-5 col-sm-8 bg-white shadow p-2 rounded mt-5">
      <h1 class="h3 mb-3 text-center">Edit Product</h1>
      <form @submit.prevent="updateProduct">
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
            />
            <!-- Image preview -->
            <img 
              v-if="imagePreview || product.image" 
              :src="imagePreview || product.image" 
              class="mt-2 preview-image" 
              alt="Product Preview"
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
              v-if="videoPreview || product.video" 
              :src="videoPreview || product.video" 
              class="mt-2 preview-video" 
              controls
            ></video>
          </div>

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
                {{ category.label || category.name }}
              </option>
            </select>
          </div>

          <label for="price-input" class="form-label">Price</label>
          <div class="input-group mb-3">
            <span class="input-group-text">$</span>
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
              placeholder="Discount"
              required
            />
            <span class="input-group-text">.00</span>
          </div>

          <div class="d-flex justify-content-center mt-3">
            <button type="submit" class="btn btn-primary mx-2">Save Changes</button>
            <router-link to="/products">
              <button type="button" class="btn btn-secondary mx-2">Cancel</button>
            </router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EditProduct',
  data() {
    return {
      product: {
        name: '',
        description: '',
        category: '',
        price: '',
        discount:'',
        image: '',
        video: ''
      },
      categories: [],
      imagePreview: null,
      videoPreview: null,
      selectedImage: null,
      selectedVideo: null
    };
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get("http://localhost:3000/categories");
        this.categories = response.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },

    async fetchProductDetails() {
      const productId = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:3000/products/${productId}`);
        this.product = response.data;
        
        // Make sure category is stored as an ID, not an object
        if (this.product.category && typeof this.product.category === 'object') {
          this.product.category = this.product.category.id;
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
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

    async uploadToCloudinary(file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('http://localhost:3000/upload/file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data.url;
      } catch (error) {
        console.error('Upload error:', error);
        throw error;
      }
    },

    async updateProduct() {
      const productId = this.$route.params.id;
      try {
        // Upload new image if selected
        if (this.selectedImage) {
          const imageUrl = await this.uploadToCloudinary(this.selectedImage);
          this.product.image = imageUrl;
        }

        // Upload new video if selected
        if (this.selectedVideo) {
          const videoUrl = await this.uploadToCloudinary(this.selectedVideo);
          this.product.video = videoUrl;
        }

        // Ensure the category is sent as an ID
        const categoryId = parseInt(this.product.category) || this.product.category;

        // Update product with new data
        await axios.put(`http://localhost:3000/products/${productId}`, {
          name: this.product.name,
          description: this.product.description,
          category: categoryId, // Ensure we're sending the ID, not the object
          price: parseFloat(this.product.price),
          discount: parseFloat(this.product.discount),
          image: this.product.image,
          video: this.product.video
        });

        this.$router.push('/products');
      } catch (error) {
        console.error('Error updating product:', error);
        alert('Failed to update product. Please try again.');
      }
    }
  },
  mounted() {
    this.fetchCategories();
    this.fetchProductDetails();
  },
  beforeUnmount() {
    // Cleanup preview URLs
    if (this.imagePreview) URL.revokeObjectURL(this.imagePreview);
    if (this.videoPreview) URL.revokeObjectURL(this.videoPreview);
  }
};
</script>

<style scoped>
.preview-image, .preview-video {
  max-width: 200px; 
  height: 100px;
  object-fit: contain;
  margin-top: 10px;
}
</style>