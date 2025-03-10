<template>
  <div class="d-flex align-items-center justify-content-center min-vh-100 bg-light">
    <div class="col-lg-6 col-md-8 col-sm-10 bg-white shadow p-4 rounded">
      <h1 class="h2 mb-4 text-center">Edit Market</h1>
      <form @submit.prevent="handleSubmit">
        <div class="container">
          <!-- File input with preview -->
          <div class="mb-3">
            <label for="file-input" class="form-label">Market Logo</label>
            <input 
              class="form-control" 
              type="file" 
              id="file-input" 
              @change="handleFileUpload"
              accept="image/*"
            >
            <!-- Image preview -->
            <img 
              v-if="imagePreview || market.logo" 
              :src="imagePreview || market.logo" 
              class="mt-2 preview-image" 
              alt="Market Logo"
            />
          </div>

          <!-- Market name -->
          <div class="mb-3">
            <label for="name-input" class="form-label">Market Name</label>
            <input
              class="form-control"
              type="text"
              id="name-input"
              v-model="market.name"
              placeholder="Enter market name"
            >
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

          <!-- Number of followers -->
          <div class="mb-3">
            <label for="followers-input" class="form-label">Number of Followers</label>
            <input
              class="form-control"
              type="number"
              id="followers-input"
              v-model="market.followers"
              placeholder="Enter number of followers"
            >
          </div>

          <!-- Number of products -->
          <div class="mb-3">
            <label for="products-input" class="form-label">Number of Products</label>
            <input
              class="form-control"
              type="number"
              id="products-input"
              v-model="market.products"
              placeholder="Enter number of products"
            >
          </div>

          <!-- Button Container -->
          <div class="d-flex justify-content-center mt-3">
            <button type="submit" class="btn btn-primary mx-2">Save</button>
            <router-link to="/markets" class="btn btn-secondary mx-2">Cancel</router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EditMarket',
  data() {
    return {
      market: {
        name: '',
        description:'',
        followers: 0,
        products: 0,
        logo: null,
      },
      selectedFile: null,
      imagePreview: null
    };
  },
  methods: {
    async fetchMarketDetails() {
      const marketId = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:3000/markets/${marketId}`);
        this.market = response.data;
      } catch (error) {
        console.error('Error fetching market details:', error);
      }
    },

    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        this.imagePreview = URL.createObjectURL(this.selectedFile);
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
        return response.data.url; // Or response.data.secure_url depending on your backend response
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
      }
    },

    async handleSubmit() {
      const marketId = this.$route.params.id;
      try {
        // Upload new image if selected
        if (this.selectedFile) {
          const cloudinaryUrl = await this.uploadToCloudinary(this.selectedFile);
          this.market.logo = cloudinaryUrl;
        }

        // Update market with new data
        await axios.put(`http://localhost:3000/markets/${marketId}`, this.market);
        this.$router.push('/markets');
      } catch (error) {
        console.error('Error updating market:', error);
      }
    },
  },
  mounted() {
    this.fetchMarketDetails();
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