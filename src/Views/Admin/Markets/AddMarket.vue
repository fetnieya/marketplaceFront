<template>
  <div class="d-flex align-items-center justify-content-center min-vh-100 bg-light">
    <div class="col-lg-6 col-md-8 col-sm-10 bg-white shadow p-4 rounded">
      <h1 class="h2 mb-4 text-center">Add Market</h1>
      <form @submit.prevent="addMarket">
        <div class="container">
          <!-- File input with preview -->
          <div class="mb-3">
            <label for="file-input" class="form-label">Market Logo</label>
            <input
              class="form-control"
              type="file"
              id="file-input"
              @change="handleFileChange"
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

          <!-- Other inputs remain the same -->
          <div class="mb-3">
            <label for="name-input" class="form-label">Market Name</label>
            <input
              v-model="market.name"
              class="form-control"
              type="text"
              id="name-input"
              placeholder="Artisanal kale"
              required
            />
          </div>
   <!-- Textarea -->
   <div class="form-floating mb-3">
          <textarea
            class="form-control"
            id="fl-textarea"
            v-model="market.description"
            style="height: 120px;"
            placeholder="Add your description"
            required
          ></textarea>
          <label for="fl-textarea">Add your description please</label>
        </div>
          <div class="mb-3">
            <label for="followers-input" class="form-label">Number of Followers</label>
            <input
              v-model="market.followers"
              class="form-control"
              type="number"
              id="followers-input"
              placeholder="0"
              required
            />
          </div>

          <div class="mb-3">
            <label for="products-input" class="form-label">Number of Products</label>
            <input
              v-model="market.products"
              class="form-control"
              type="number"
              id="products-input"
              placeholder="0"
              required
            />
          </div>

          <div class="d-flex justify-content-center mt-3">
            <button type="submit" class="btn btn-primary mx-2">Add</button>
            <router-link to="/markets">
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
  name: 'AddMarket',
  data() {
    return {
      market: {
        logo: '',
        name: '',
        description:'',
        followers: 0,
        products: 0
      },
      selectedFile: null,
      imagePreview: null
    };
  },
  methods: {
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
      // Create preview
      this.imagePreview = URL.createObjectURL(this.selectedFile);
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
        return response.data.url; // Or response.data.secure_url depending on your backend response
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
      }
    },

    async addMarket() {
      try {
        // First, upload the image to Cloudinary
        if (this.selectedFile) {
          const cloudinaryUrl = await this.uploadToCloudinary(this.selectedFile);
          this.market.logo = cloudinaryUrl;
        }

        // Then, create the market with the Cloudinary URL
        const response = await axios.post('http://localhost:3000/markets', this.market);
        console.log('Market added successfully:', response.data);
        this.$router.push('/markets');
      } catch (error) {
        console.error('Error details:', error.response?.data || error.message);
      }
    },
  },
};
</script>

<style scoped>
.min-vh-100 {
  min-height: 100vh;
}

.bg-light {
  background-color: #f8f9fa !important;
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
</style>