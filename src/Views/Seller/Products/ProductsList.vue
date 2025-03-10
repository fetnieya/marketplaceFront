<template>
   <div class="container py-5 mt-4 mt-lg-5 mb-lg-4 my-xl-5">
     <div class="row pt-sm-2 pt-lg-0">
       <!-- Sidebar -->
       <aside class="col-lg-3 pe-lg-4 pe-xl-5 mt-n3">
         <div class="position-lg-sticky top-0">
           <div class="d-none d-lg-block" style="padding-top: 105px;"></div>
           <div class="offcanvas-lg offcanvas-start" id="sidebarAccount">
             <button 
               class="btn-close position-absolute top-0 end-0 mt-3 me-3 d-lg-none" 
               type="button" 
               data-bs-dismiss="offcanvas" 
               data-bs-target="#sidebarAccount"
               aria-label="Close"
             ></button>
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
         </div>
       </aside>
 
       <!-- Main Content -->
       <div class="col-lg-9 pt-4 pb-2 pb-sm-4">
         <div class="d-flex justify-content-between align-items-center mb-4">
           <h1 class="h2 mb-0">Products List</h1>
           <router-link to="/addProduct">
             <button type="button" class="btn btn-primary">
               <i class="ai-circle-plus me-2 ms-n1"></i>Add Product
             </button>
           </router-link>
         </div>
 
         <!-- Loading State -->
         <div v-if="loading" class="text-center py-5">
           <div class="spinner-border text-primary" role="status">
             <span class="visually-hidden">Loading...</span>
           </div>
         </div>
 
         <!-- Error State -->
         <div v-else-if="error" class="alert alert-danger" role="alert">
           {{ error }}
           <button @click="fetchProducts" class="btn btn-link">Retry</button>
         </div>
 
         <!-- Content -->
         <div v-else class="table-responsive">
           <table class="table">
             <thead>
               <tr>
                 <th scope="col">#</th>
                 <th scope="col">Image</th>
                 <th scope="col">Video</th>
                 <th scope="col">Name</th>
                 <th scope="col">Description</th>
                 <th scope="col">Category</th>
                 <th scope="col">Price</th>
                 <th scope="col">Discount</th>
                 <th scope="col">Action</th>
               </tr>
             </thead>
             <tbody>
               <tr v-for="(product, index) in paginatedProducts" :key="product.id">
                 <th scope="row">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</th>
                 <td>
                   <img 
                     :src="product.image" 
                     :alt="product.name"
                     class="product-thumbnail cursor-pointer"
                     @click="openImage(product.image)"
                     @error="handleImageError"
                   >
                 </td>
                 <td>
                   <div v-if="product.video" class="video-container">
                     <video 
                       :src="product.video"
                       class="video-thumbnail"
                       controls
                     ></video>
                   </div>
                   <span v-else class="text-muted">No video</span>
                 </td>
                 <td>{{ product.name }}</td>
                 <td>{{ product.description }}</td>
                 <td>{{ product.category }}</td>
                 <td>{{ product.price }} €</td>
                 <td>{{ product.discount }} €</td>
                 <td>
                   <div class="btn-group">
                     <router-link 
                       :to="`/editProduct/${product.id}`"
                       class="btn btn-link"
                       title="Edit"
                     >
                       <i class="ai-edit fs-5"></i>
                     </router-link>
                     <button
                       @click="confirmDelete(product)"
                       class="btn btn-link"
                       title="Delete"
                     >
                       <i class="ai-trash fs-5"></i>
                     </button>
                   </div>
                 </td>
               </tr>
               <tr v-if="paginatedProducts.length === 0">
                 <td colspan="8" class="text-center py-4">No products found</td>
               </tr>
             </tbody>
           </table>
 
           <!-- Pagination -->
           <nav v-if="totalPages > 1" aria-label="Page navigation">
             <div class="text-center">
               <ul class="pagination justify-content-center">
                 <li class="page-item" :class="{ disabled: currentPage === 1 }">
                   <a @click.prevent="prevPage" href="#" class="page-link">Prev</a>
                 </li>
                 <li class="page-item d-sm-none">
                   <span class="page-link pe-none">{{ currentPage }} / {{ totalPages }}</span>
                 </li>
                 <li 
                   v-for="page in pages" 
                   :key="page"
                   class="page-item d-none d-sm-block"
                   :class="{ active: currentPage === page }"
                 >
                   <a 
                     @click.prevent="goToPage(page)" 
                     href="#" 
                     class="page-link"
                   >
                     {{ page }}
                   </a>
                 </li>
                 <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                   <a @click.prevent="nextPage" href="#" class="page-link">Next</a>
                 </li>
               </ul>
             </div>
           </nav>
         </div>
       </div>
     </div>
 
     <!-- Delete Confirmation Modal -->
     <div 
      class="modal fade" 
      id="deleteModal" 
      tabindex="-1" 
      aria-labelledby="deleteModalLabel" 
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">Confirm Delete</h5>
            <button 
              type="button" 
              class="btn-close" 
              @click="cancelDelete"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete the product "{{ selectedProduct?.name }}"?
            <div class="mt-2 text-danger">
              This action cannot be undone.
            </div>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="cancelDelete"
            >
              Cancel
            </button>
            <button 
              type="button" 
              class="btn btn-danger" 
              @click="deleteProduct"
              :disabled="deleting"
            >
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
 
     <!-- Image Preview Modal -->
     <div 
       class="modal fade" 
       id="imageModal" 
       tabindex="-1" 
       aria-labelledby="imageModalLabel" 
       aria-hidden="true"
     >
       <div class="modal-dialog modal-lg">
         <div class="modal-content">
           <div class="modal-header">
             <h5 class="modal-title" id="imageModalLabel">Product Image</h5>
             <button 
               type="button" 
               class="btn-close" 
               data-bs-dismiss="modal" 
               aria-label="Close"
             ></button>
           </div>
           <div class="modal-body text-center">
             <img 
               :src="selectedImage" 
               class="img-fluid" 
               alt="Product preview"
             >
           </div>
         </div>
       </div>
     </div>
   </div>
 </template>
 
 <script>
 import axios from 'axios';
 import { Modal } from 'bootstrap';
 
 export default {
  name: 'ProductsList',
  data() {
    return {
      products: [],
      currentPage: 1,
      totalPages: 1,
      itemsPerPage: 5,
      loading: true,
      error: null,
      selectedProduct: null,
      selectedImage: null,
      deleting: false,
      deleteModal: null,
      imageModal: null
    };
  },
   computed: {
     paginatedProducts() {
       const start = (this.currentPage - 1) * this.itemsPerPage;
       const end = start + this.itemsPerPage;
       return this.products.slice(start, end);
     },
     pages() {
       return Array.from({ length: this.totalPages }, (_, i) => i + 1);
     }
   },
   methods: {
     async fetchProducts() {
       this.loading = true;
       this.error = null;
       try {
         const response = await axios.get('http://localhost:3000/products');
         this.products = response.data;
         this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
       } catch (error) {
         this.error = 'Failed to fetch products. Please try again.';
         console.error('Error fetching products:', error);
       } finally {
         this.loading = false;
       }
     },
     confirmDelete(product) {
      this.selectedProduct = product;
      this.deleteModal = new Modal(document.getElementById('deleteModal'));
      this.deleteModal.show();
    },

    cancelDelete() {
      if (this.deleting) return; // Don't allow cancel while deleting
      this.selectedProduct = null;
      this.deleteModal.hide();
    },
   
    async deleteProduct() {
      if (!this.selectedProduct) return;
      
      this.deleting = true;
      try {
        await axios.delete(`http://localhost:3000/products/${this.selectedProduct.id}`);
        const index = this.products.findIndex(p => p.id === this.selectedProduct.id);
        if (index !== -1) {
          this.products.splice(index, 1);
          this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
          if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages || 1;
          }
        }
        this.$toast?.success('Product deleted successfully');
        this.deleteModal.hide();
        this.selectedProduct = null;
      } catch (error) {
        this.$toast?.error('Failed to delete product');
        console.error('Error deleting product:', error);
      } finally {
        this.deleting = false;
      }
    },
     openImage(imageUrl) {
       this.selectedImage = imageUrl;
       this.imageModal.show();
     },
     handleImageError(event) {
       event.target.src = '/placeholder-image.png'; // Replace with your placeholder image
     },
     goToPage(page) {
       if (page >= 1 && page <= this.totalPages) {
         this.currentPage = page;
       }
     },
     nextPage() {
       if (this.currentPage < this.totalPages) {
         this.currentPage++;
       }
     },
     prevPage() {
       if (this.currentPage > 1) {
         this.currentPage--;
       }
     }
   },
   mounted() {
     this.imageModal = new Modal(document.getElementById('imageModal'));
   },
   created() {
     this.fetchProducts();
   },
   beforeUnmount() {
    // Clean up modals when component is destroyed
    if (this.deleteModal) {
      this.deleteModal.dispose();
    }
    if (this.imageModal) {
      this.imageModal.dispose();
    }
  }
};
</script>
 
 <style scoped>
 .product-thumbnail {
   width: 80px;
   height: 80px;
   object-fit: cover;
   cursor: pointer;
   border-radius: 4px;
   transition: transform 0.2s;
 }
 
 .product-thumbnail:hover {
   transform: scale(1.05);
 }
 
 .video-container {
   width: 80px;
   height: 80px;
 }
 
 .video-thumbnail {
   width: 100%;
   height: 100%;
   object-fit: cover;
   border-radius: 4px;
 }
 
 .pagination {
   gap: 0.25rem;
 }
 
 .btn-link {
   color: inherit;
   text-decoration: none;
 }
 
 .btn-link:hover {
   color: var(--bs-primary);
 }
 
 .modal-header .btn-close {
   margin: -0.5rem -0.5rem -0.5rem auto;
 }
 </style>