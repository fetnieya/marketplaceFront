<template>
    
    <!-- Full-page container -->
    <div class="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <!-- Form container -->
      <div class="col-lg-6 col-md-8 col-sm-10 bg-white shadow p-4 rounded">
        <h1 class="h2 mb-4 text-center">Add Market</h1>
        <form>
            <div class="container">
                            <!-- File input -->
                            <div class="mb-3">
                                <label for="file-input" class="form-label">Market Logo</label>
                                <input class="form-control" type="file" id="file-input">
                            </div>

                            <div class="mb-3">
                                <label for="text-input" class="form-label">Market Name</label>
                                <input class="form-control" type="text" id="text-input" placeholder="Artisanal kale">
                            </div>

                            <!-- Number input -->
                            <div class="mb-3">
                                <label for="number-input" class="form-label">Number of followers</label>
                                <input class="form-control" type="number" id="number-input" placeholder="0">
                            </div>
                            <!-- Number input -->
                            <div class="mb-3">
                                <label for="number-input" class="form-label">Number of products</label>
                                <input class="form-control" type="number" id="number-input" placeholder="0">
                            </div>
            <!-- Button Container -->
            <div class="d-flex justify-content-center mt-3">
              <!-- Primary solid button -->
              <router-link to="/markets">
                <button type="button" class="btn btn-primary mx-2">Add</button>
              </router-link>
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
export default {
    name:'AddMarket',
}
</script>