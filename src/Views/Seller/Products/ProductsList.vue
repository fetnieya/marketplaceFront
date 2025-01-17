<template>
  <!-- Page container -->
  <div class="container py-5 mt-4 mt-lg-5 mb-lg-4 my-xl-5">
     <div class="row pt-sm-2 pt-lg-0">

        <!-- Sidebar (offcanvas on sreens < 992px) -->
        <aside class="col-lg-3 pe-lg-4 pe-xl-5 mt-n3">
           <div class="d-none d-lg-block" style="padding-top: 105px;"></div>
           <div class="offcanvas-lg offcanvas-start" id="sidebarAccount">
              <button class="btn-close position-absolute top-0 end-0 mt-3 me-3 d-lg-none" type="button" data-bs-dismiss="offcanvas" data-bs-target="#sidebarAccount" aria-label="Close"></button>
              <div class="offcanvas-body">
                 <nav class="nav flex-column pb-2 pb-lg-4 mb-3">
                    <h4 class="fs-xs fw-medium text-body-secondary text-uppercase pb-1 mb-2">Menu</h4>
                    <router-link class="nav-link fw-semibold py-2 px-0" to="/seller">
                       <i class="ai-dashboard fs-5 opacity-60 me-2"></i> Dashboard
                    </router-link>
                    <router-link class="nav-link fw-semibold py-2 px-0" to="/followers">
                       <i class="ai-user-check fs-5 opacity-60 me-2"></i> Followers
                    </router-link>
                    <router-link class="nav-link fw-semibold py-2 px-0" to="/products">
                       <i class="ai-dots fs-5 opacity-60 me-2"></i> Products
                    </router-link>
                    <router-link class="nav-link fw-semibold py-2 px-0" to="/sellerCategory">
                       <i class="ai-grid fs-5 opacity-60 me-2"></i> Categories
                    </router-link>
                    <router-link class="nav-link fw-semibold py-2 px-0" to="/comments">
                       <i class="ai-messages fs-5 opacity-60 me-2"></i> Comments
                    </router-link>
                 </nav>
              </div>
           </div>
        </aside>

        <!-- Page content -->
        <div class="col-lg-9 pt-4 pb-2 pb-sm-4">
           <h1 class="h2 mb-4">Products list</h1>
           <router-link to='/addProduct'>
              <button type="button" class="btn btn-primary btn-sm ms-auto d-block">
                 <i class="ai-circle-plus me-2 ms-n1"></i>Add product
              </button>
           </router-link>

           <div class="row position-relative overflow-hidden gx-2 z-1">
              <div class="table-responsive mt-3">
                 <table class="table">
                    <thead>
                       <tr>
                          <th scope="col">#</th>
                          <th scope="col">Product Image</th>
                          <th scope="col">Product Video</th>
                          <th scope="col">Product Name</th>
                          <th scope="col">Product Description</th>
                          <th scope="col">Product Category</th>
                          <th scope="col">Product Price</th>
                          <th scope="col">Action</th>
                       </tr>
                    </thead>
                    <tbody>
                       <tr v-for="(product, index) in products" :key="product.id">
                          <th scope="row">{{ index + 1 }}</th>
                          <td><img :src="product.image" alt="Product Image" style="max-width: 100px;"></td>
                          <td>
                             <!-- Display product video or placeholder if not available -->
                             <a v-if="product.videoUrl" :href="product.videoUrl" target="_blank">Watch Video</a>
                             <span v-else>VD</span>
                          </td>
                          <td>{{ product.name }}</td>
                          <td>{{ product.description }}</td>
                          <td>{{ product.category }}</td>
                          <td>{{ product.price }} €</td>
                          <td class="d-flex align-items-center">
                             <!-- Edit Button -->
                             <router-link :to="`/editProduct/${product.id}`" class="btn btn-link fw-semibold py-2 px-0" title="Edit">
                                <i class="ai-edit fs-5 me-2"></i>
                             </router-link>

                             <!-- Delete Button -->
                             <button @click="deleteProduct(product.id, index)" class="btn btn-link fw-semibold py-2 px-0" title="Delete">
                                <i class="ai-trash fs-5"></i>
                             </button>
                          </td>
                       </tr>
                    </tbody>
                 </table>
              </div>
           </div>

           <!-- Divider for dark mode only -->
           <hr class="d-none d-dark-mode-block">

           <!-- Sidebar toggle button -->
           <button class="d-lg-none btn btn-sm fs-sm btn-primary w-100 rounded-0 fixed-bottom" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarAccount">
              <i class="ai-menu me-2"></i>
              Account menu
           </button>
        </div>
     </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
 name: 'ProductsList',
 data() {
   return {
     products: [],
   };
 },
 methods: {
   // Fetch products from the API
   async fetchProducts() {
     try {
       const response = await axios.get("http://localhost:3000/products"); 
       this.products = response.data;
     } catch (error) {
       console.error('Error fetching products:', error);
     }
   },

  
   async deleteProduct(productId, index) {
     try {
      
      
         await axios.delete(`http://localhost:3000/products/${productId}`);
         this.products.splice(index, 1); 
       
       
     } catch (error) {
       console.error('Error deleting product:', error);
       alert('Failed to delete product');
     }
   }
 },
 mounted() {
   this.fetchProducts(); // Fetch products when component is mounted
 }
};
</script>
