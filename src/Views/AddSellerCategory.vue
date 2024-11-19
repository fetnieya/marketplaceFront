<template>
    <!-- Page container -->
    <div class="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <!-- Form card -->
      <div class="card shadow-lg p-4" style="width: 100%; max-width: 600px;">
        <h1 class="h4 mb-4 text-center">Add Category</h1>
        <form>
          <!-- Text input -->
          <div class="mb-3">
            <label for="text-input" class="form-label">Label</label>
            <input class="form-control" type="text" id="text-input" placeholder="Artisanal kale">
          </div>
  
          <!-- Number input -->
          <div class="mb-3">
            <label for="number-input" class="form-label">Number of Products</label>
            <input class="form-control" type="number" id="number-input" placeholder="0">
          </div>
  
          <!-- Textarea -->
          <div class="form-floating mb-3">
            <textarea class="form-control" id="fl-textarea" style="height: 120px;" placeholder="Your message"></textarea>
            <label for="fl-textarea">Add your description please</label>
          </div>
  
          <!-- Buttons -->
            <!-- Button Container -->
            <div class="d-flex justify-content-center mt-3">
              <!-- Primary solid button -->
              <router-link to="/sellerCategory">
                <button type="button" class="btn btn-primary mx-2">Add</button>
              </router-link>
              <!-- Secondary solid button -->
              <router-link to="/selLerCategory">
                <button type="button" class="btn btn-secondary mx-2">Cancel</button>
              </router-link>
            </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AddSellerCategory',
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
  