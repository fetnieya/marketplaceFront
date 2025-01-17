<template>
  <!-- Page container -->
  <div class="d-flex justify-content-center align-items-center min-vh-100 bg-light">
    <!-- Form card -->
    <div class="card shadow-lg p-4" style="width: 100%; max-width: 600px;">
      <h1 class="h4 mb-4 text-center">Edit Category</h1>
      <form @submit.prevent="handleSubmit">
        <!-- Text input -->
        <div class="mb-3">
          <label for="text-input" class="form-label">Label</label>
          <input
            class="form-control"
            type="text"
            id="text-input"
            v-model="category.label"
            placeholder="Category Name"
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
            placeholder="0"
          />
        </div>

        <!-- Textarea -->
        <div class="form-floating mb-3">
          <textarea
            class="form-control"
            id="fl-textarea"
            v-model="category.description"
            placeholder="Your message"
          ></textarea>
          <label for="fl-textarea">Add your description please</label>
        </div>

        <!-- Button Container -->
        <div class="d-flex justify-content-center mt-3">
          <!-- Primary solid button -->
          <button type="submit" class="btn btn-primary mx-2">Save</button>          <!-- Secondary solid button -->
          <router-link to="/category" class="btn btn-secondary mx-2">Cancel</router-link>

        </div>
      </form>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name: 'EditCategory',
  data() {
    return {
      category: {
        label: '',
        numberOfProducts: '',
        description: '',
      },
    };
  },
  methods: {
    async fetchCategory() {
      const categoryId = this.$route.params.id; 
      console.log('====================================');
      console.log(categoryId);
      console.log('====================================');
      try {
        const response = await axios.get(`http://localhost:3000/categories/${categoryId}`);
        this.category = response.data;
      } catch (error) {
        console.error('Error fetching category:', error);
       
      }
    },
    async handleSubmit() {
  const categoryId = this.$route.params.id; 
  try {
    await axios.put(`http://localhost:3000/categories/${categoryId}`, this.category);
    this.$router.push('/category'); 
  } catch (error) {
    console.error('Error updating category:', error);
  }
}
,
  },
  mounted() {
    this.fetchCategory(); 
  },
};
</script>

