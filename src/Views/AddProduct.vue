<template>
    
    <!-- Full-page container -->
    <div class="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <!-- Form container -->
      <div class="col-lg-6 col-md-12 col-sm-10 bg-white shadow p-4 rounded">
        <h1 class="h2 mb-4 text-center">Add Product</h1>
        <form>
            <div class="container">
                           <!-- File input -->
                           <div class="mb-3">
                                <label for="file-input" class="form-label">Product Image</label>
                                <input class="form-control" type="file" id="file-input">
                            </div>
                            <!-- Video input -->
                            <div class="mb-3">
                                <label for="file-input" class="form-label">Product Video</label>
                                <input class="form-control" type="file" id="file-input">
                            </div>

                            <div class="mb-3">
                                <label for="text-input" class="form-label">Product Name</label>
                                <input class="form-control" type="text" id="text-input" placeholder="Artisanal kale">
                            </div>

                            <!-- Description -->
                            <div class="mb-3">
                                <label for="textarea-input" class="form-label">Description</label>
                                <textarea class="form-control" id="textarea-input" rows="5" placeholder="Product description"></textarea>
                            </div>


                            <!-- Category -->
                            <div class="mb-3">
                                <label for="textarea-input" class="form-label">Category</label>
                                <select id="inline-form-select" class="form-select">
                                <option value="">Choose category...</option>
                                <option value="1">Category One</option>
                                <option value="2">Category Two</option>
                                <option value="3">Category Three</option>
                              </select>
                            </div>

                            <!-- Addons on both sides -->
                            <label for="number-input" class="form-label">Price</label>
                            <div class="input-group">

                                <span class="input-group-text">
                                  <i class="ai-dollar"></i>
                               </span>
                                <input type="text" class="form-control" placeholder="Amount">
                                <span class="input-group-text">.00</span>
                            </div>
            <!-- Button Container -->
            <div class="d-flex justify-content-center mt-3">
              <!-- Primary solid button -->
              <router-link to="products">
                <button type="button" class="btn btn-primary mx-2">Add</button>
              </router-link>
              <!-- Secondary solid button -->
              <router-link to="products">
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
    name:'AddProduct'
}
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
