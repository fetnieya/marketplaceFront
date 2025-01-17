<template>
  <!-- Page container -->
  <div class="d-flex justify-content-center align-items-center min-vh-100 bg-light">
    <!-- Form card -->
    <div class="card shadow-lg p-4" style="width: 100%; max-width: 600px;">
      <h1 class="h4 mb-4 text-center">Add Category</h1>
      <form @submit.prevent="addCategory">
        <!-- Text input -->
        <div class="mb-3">
          <label for="text-input" class="form-label">Label</label>
          <input
            class="form-control"
            type="text"
            id="text-input"
            v-model="category.label"
            placeholder="Enter category label"
            required
          />
        </div>

        <!-- Number input -->
        <div class="mb-3">
          <label for="number-input" class="form-label">Number of Products</label>
          <input
            class="form-control"
            type="number"
            id="number-input"
            v-model="category.numberOfProducts"
            placeholder="Enter number of products"
            required
          />
        </div>

        <!-- Textarea -->
        <div class="form-floating mb-3">
          <textarea
            class="form-control"
            id="fl-textarea"
            v-model="category.description"
            style="height: 120px;"
            placeholder="Add your description"
            required
          ></textarea>
          <label for="fl-textarea">Add your description please</label>
        </div>

        <!-- Buttons -->
        <div class="d-flex justify-content-center mt-3">
          <!-- Primary solid button -->
          <button type="submit" class="btn btn-primary mx-2">Add</button>
          <!-- Secondary solid button with router-link -->
          <router-link to="/category" class="btn btn-secondary mx-2">
            Cancel
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "AddCategory",
  data() {
    return {
      category: {
        label: "",
        numberOfProducts: 0,
        description: "",
      },
    };
  },
  methods: {
    async addCategory() {
      if (!this.category.label || !this.category.description) {
        alert("Label and Description are required");
        return;
      }

      try {
        // Sending the POST request with JSON body to the backend
        const response = await axios.post("http://localhost:3000/categories", this.category, {
          headers: {
            "Content-Type": "application/json", // Sending as JSON
          },
        });

        console.log("Category added successfully:", response.data);
        this.$router.push("/category"); // Redirect to the category list page
      } catch (error) {
        console.error("Error adding category:", error);
        alert("Error adding category. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
/* Ensuring the parent container takes full height */
.min-vh-100 {
  min-height: 100vh;
}

/* Adding box shadow and rounded corners to the form */
.card {
  border-radius: 12px;
  background-color: #fff;
}

/* Styling buttons for better appearance */
button {
  font-size: 16px;
  font-weight: 500;
}
</style>
