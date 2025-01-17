<template>
<!-- Full-page container -->
<div class="d-flex align-items-center justify-content-center min-vh-100 bg-light">
  <!-- Form container with added space from top -->
  <div class="col-lg-4 col-md-5 col-sm-8 bg-white shadow p-2 rounded mt-5">
    <h1 class="h3 mb-3 text-center">Add Product</h1>


      <form @submit.prevent="addProduct">
        <div class="container">
          <!-- File input -->
          <div class="mb-3">
            <label for="image-input" class="form-label">Product Image</label>
            <input class="form-control" type="file" id="file-input" @change="handleFileChange" required />
          </div>
          <!-- Video input -->
          <div class="mb-3">
            <label for="video-input" class="form-label">Product Video</label>
            <input class="form-control" type="file" id="video-input" @change="handleVideoChange" />
          </div>

          <!-- Product Name -->
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

          <!-- Description -->
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




          <!-- Price -->
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

          <!-- Button Container -->
          <div class="d-flex justify-content-center mt-3">
            <button type="submit" class="btn btn-primary mx-2">Add</button>
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
import axios from "axios";

export default {
  name: "AddProduct",
  data() {
    return {
      product: {
        image: null,
        video: null,
        name: "",
        description: "",
        category: "",
        price: 0,
      },
      categories: [] 
    };
  },
  methods: {
  async fetchCategories() {
    try {
      const response = await axios.get("http://localhost:3000/categories");
      this.categories = response.data; // Assuming the API returns an array of categories
    } catch (error) {
      console.error("Error fetching categories:", error.response?.data || error.message);
    }
  },
  handleFileChange(event) {
    this.product.image = event.target.files[0];
  },
  handleVideoChange(event) {
    this.product.video = event.target.files[0];
  },
  async addProduct() {
    const formData = new FormData();
    formData.append("image", this.product.image);
    formData.append("video", this.product.video);
    formData.append("name", this.product.name);
    formData.append("description", this.product.description);
    formData.append("category", this.product.category); // This will send the selected category ID
    formData.append("price", this.product.price);

    try {
      const response = await axios.post("http://localhost:3000/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Product added successfully:", response.data);
      this.$router.push("/products");
    } catch (error) {
      console.error("Error adding product:", error.response?.data || error.message);
    }
  },
},
mounted() {
  this.fetchCategories();
},

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
</style>
