<template>
  <!-- Full-page container -->
  <div class="d-flex align-items-center justify-content-center min-vh-100 bg-light">
    <!-- Form container -->
    <div class="col-lg-6 col-md-8 col-sm-10 bg-white shadow p-4 rounded">
      <h1 class="h2 mb-4 text-center">Add Market</h1>
      <form @submit.prevent="addMarket">
        <div class="container">
          <!-- File input for Market Logo -->
          <div class="mb-3">
            <label for="file-input" class="form-label">Market Logo</label>
            <input 
              
              class="form-control" 
              type="file" 
              id="file-input" 
              @change="handleFileChange"
              required
            />
          </div>

          <!-- Market Name input -->
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

          <!-- Number of followers input -->
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

          <!-- Number of products input -->
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

          <!-- Button Container -->
          <div class="d-flex justify-content-center mt-3">
            <!-- Primary solid button -->
            <button type="submit" class="btn btn-primary mx-2">Add</button>
            <!-- Secondary solid button -->
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
        followers: 0,
        products: 0
      }
    };
  },
  methods: {
    
    handleFileChange(event) {
      console.log(event.target.files);
      
      this.market.logo = event.target.files[0].name;
    },
    async addMarket() {
      const formData = new FormData();
      formData.append('logo', this.market.logo);
      formData.append('name', this.market.name);
      formData.append('followers', this.market.followers);
      formData.append('products', this.market.products);

     
        console.log(formData,this.market);
      

      try {
        const response = await axios.post('http://localhost:3000/markets', this.market, {
         
        });
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
</style>
