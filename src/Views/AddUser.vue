<template>
    <!-- Full-page container -->
    <div class="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <!-- Form container -->
      <div class="col-lg-6 col-md-8 col-sm-10 bg-white shadow p-4 rounded">
        <h1 class="h2 mb-4 text-center">Add User</h1>
        <form>
          <div class="container">
            <!-- Text input -->
            <div class="mb-3">
              <label for="first-name-input" class="form-label">First Name</label>
              <input
                class="form-control"
                type="text"
                id="first-name-input"
                placeholder="Artisanal kale"
              />
            </div>
  
            <div class="mb-3">
              <label for="last-name-input" class="form-label">Last Name</label>
              <input
                class="form-control"
                type="text"
                id="last-name-input"
                placeholder="Artisanal kale"
              />
            </div>
  
            <!-- Email input -->
            <div class="mb-3">
              <label for="email-input" class="form-label">Email</label>
              <input
                class="form-control"
                type="email"
                id="email-input"
                placeholder="email@example.com"
              />
            </div>
  
            <!-- Phone Input -->
            <div class="mb-3">
              <label for="tel-input" class="form-label">Phone</label>
              <input
                class="form-control"
                type="tel"
                id="tel-input"
                placeholder="1-(770)-334-2518"
              />
            </div>
  
            <!-- Button Container -->
            <div class="d-flex justify-content-center mt-3">
              <!-- Primary solid button -->
              <router-link to="/users">
                <button type="button" class="btn btn-primary mx-2">Add</button>
              </router-link>
              <!-- Secondary solid button -->
              <router-link to="/users">
                <button type="button" class="btn btn-secondary mx-2">Cancel</button>
              </router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AddUser',
  };
  </script>
  
  <style scoped>
  /* Ensuring the parent container takes full height */
  .min-vh-100 {
    min-height: 100vh;
  }
  .bg-light {
    background-color: #f8f9fa !important;
  }
  </style>
  