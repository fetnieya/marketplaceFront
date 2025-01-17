<template>
  <!-- Full-page container -->
  <div class="d-flex align-items-center justify-content-center min-vh-100 bg-light">
    <!-- Form container with added space from top -->
    <div class="col-lg-4 col-md-5 col-sm-8 bg-white shadow p-2 rounded mt-5">
      <h1 class="h3 mb-3 text-center">Edit Product</h1>
      <form @submit.prevent="updateProduct">
        <div class="container">
          <!-- File input for product image -->
          <div class="mb-3">
            <label for="image-input" class="form-label">Product Image</label>
            <input  class="form-control" type="file" id="image-input" @change="handleImageUpload">
          </div>
          
          <!-- File input for product video -->
          <div class="mb-3">
            <label for="video-input" class="form-label">Product Video</label>
            <input class="form-control" type="file" id="video-input" @change="handleVideoUpload">
          </div>

          <!-- Product Name input -->
          <div class="mb-3">
            <label for="text-input" class="form-label">Product Name</label>
            <input v-model="product.name" class="form-control" type="text" id="text-input" placeholder="Artisanal kale">
          </div>

          <!-- Description textarea -->
          <div class="mb-3">
            <label for="textarea-input" class="form-label">Description</label>
            <textarea v-model="product.description" class="form-control" id="textarea-input" rows="5" placeholder="Product description"></textarea>
          </div>

          <!-- Category -->
<div class="mb-3">
  <label for="category-input" class="form-label">Category</label>
  <select v-model="product.category" id="category-input" class="form-select" required>
    <option value="" disabled>Select category...</option>
    <option v-for="category in categories" :key="category.id" :value="category.id">
      {{ category.label }}
    </option>
  </select>
</div>


          <!-- Price input -->
          <label for="number-input" class="form-label">Price</label>
          <div class="input-group">
            <span class="input-group-text">$</span>
            <input v-model="product.price" type="number" class="form-control" placeholder="Amount">
            <span class="input-group-text">.00</span>
          </div>

          <!-- Button Container -->
          <div class="d-flex justify-content-center mt-3">
            <button type="submit" class="btn btn-primary mx-2">Save</button>

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
        image: '',
        video:''
      },
      categories: []
    };
  },
  methods: {
    async fetchCategories() {
    try {
      const response = await axios.get("http://localhost:3000/categories");
      this.categories = response.data; 
    } catch (error) {
      console.error("Error fetching categories:", error.response?.data || error.message);
    }
  },
    async fetchProductDetails() {
      const productId = this.$route.params.id; 
      try {
        const response = await axios.get(`http://localhost:3000/products/${productId}`);
        this.product = response.data;
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    },
    handleImageUpload(event) {
      this.product.image = event.target.files[0].product;
    },

    handleVideoUpload(event) {
      this.product.video = event.target.files[0].product;
    },
    async updateProduct() {
      const productId = this.$route.params.id;
      try {
        const formData = new FormData();
        formData.append('name', this.product.name);
        formData.append('description', this.product.description);
        formData.append('category', this.product.category);
        formData.append('price', this.product.price);
        if (this.product.image) {
          formData.append('image', this.product.image);
        }
        if (this.product.video) {
          formData.append('video', this.product.video);
        }
console.log('====================================');
console.log(formData);
console.log('====================================');
        await axios.put(`http://localhost:3000/products/${productId}`, this.product, {
         
        });
        this.$router.push('/products');
      } catch (error) {
        console.error('Error updating product:', error);
      }
    },
  },
  mounted() {
  this.fetchCategories();
},

  created() {
    this.fetchProductDetails(); 
  },
};
</script>
