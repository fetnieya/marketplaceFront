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
                  <i class="ai-grid fs-5 opacity-60 me-2"></i> Categorys
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
                    <h1 class="h2 mb-4">Category list</h1>
                    <router-link to='/addSellerCategory'>
                        <button type="button" class="btn btn-primary btn-sm ms-auto d-block">
                  <i class="ai-circle-plus me-2 ms-n1"></i>Request new category
              </button>
            </router-link>

                    <div class="row position-relative overflow-hidden gx-2 z-1">
                        <div class="table-responsive mt-3">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">label</th>
                                        <th scope="col">Number of products</th>
                                        <th scope="col">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="category in categories" :key="category.id">
    <td>{{ category.label }}</td>
    <td>{{ category.numberOfProducts }}</td>
    <td>{{ category.description }}</td>
                                        <td class="d-flex align-items-center">

</td>

                                    </tr>
                                </tbody>
                            </table>
                            <nav aria-label="Page navigation example">
                                <div class="text-center">
                                    <ul class="pagination justify-content-center">
                                        <li class="page-item">
                                            <a href="#" class="page-link">Prev</a>
                                        </li>
                                        <li class="page-item d-sm-none">
                                            <span class="page-link pe-none">2 / 5</span>
                                        </li>
                                        <li class="page-item d-none d-sm-block">
                                            <a href="#" class="page-link">1</a>
                                        </li>
                                        <li class="page-item active d-none d-sm-block" aria-current="page">
                                            <span class="page-link">
                                              2
                                              <span class="visually-hidden">(current)</span>
                                            </span>
                                        </li>
                                        <li class="page-item d-none d-sm-block">
                                            <a href="#" class="page-link">3</a>
                                        </li>
                                        <li class="page-item d-none d-sm-block">
                                            <a href="#" class="page-link">4</a>
                                        </li>
                                        <li class="page-item d-none d-sm-block">
                                            <a href="#" class="page-link">5</a>
                                        </li>
                                        <li class="page-item">
                                            <a href="#" class="page-link">Next</a>
                                        </li>
                                    </ul>
                                </div>
                            </nav>


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
      name : 'CategorySellerList',
      data() {
    return {
      categories: [] 
    };
  },

  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get('http://localhost:3000/categories');
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    // Delete category from the backend and the local list
    async deleteCategory(categoryId, index) {
            try {
                const response = await axios.delete(`http://localhost:3000/categories/${categoryId}`);
                if (response.status === 200) {
                    this.categories.splice(index, 1); 
                
                }
            } catch (error) {
                console.error("Error deleting category:", error);
                alert("Failed to delete category. Please try again.");
            }
        },
      
},  mounted() {
    this.fetchCategories(); 
  },
};
</script>
