<template>
  <!-- Full-page container -->
  <div class="d-flex align-items-center justify-content-center min-vh-100 bg-light">
    <!-- Form container -->
    <div class="col-lg-6 col-md-8 col-sm-10 bg-white shadow p-4 rounded">
      <h1 class="h2 mb-4 text-center">Edit Market</h1>
      <form @submit.prevent="handleSubmit">
        <div class="container">
          <!-- File input -->
          <div class="mb-3">
            <label for="file-input" class="form-label">Market Logo</label>
            <input class="form-control" type="file" id="file-input" @change="handleFileUpload">
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
            <!-- Edit Button -->
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
        followers: 0,
        products: 0,
        logo: "null", 
      },
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
    this.market.logo = event.target.files[0];
  },

  async handleSubmit() {
    const marketId = this.$route.params.id;
 
    try {
     

      await axios.put(`http://localhost:3000/markets/${marketId}`, this.market, {
      
      });

      this.$router.push('/markets');
    } catch (error) {
      console.error('Error updating market:', error);
    }
  },
},
  mounted() {
    this.fetchMarketDetails(); // Fetch market data when the component is mounted
  },
  
};
</script>
