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
                    <h1 class="h2 mb-4">Comments list</h1>
                    <div class="row position-relative overflow-hidden gx-2 z-1">
                        <div class="table-responsive mt-3">
                            <!-- Item -->
                            <div class="card border-0 mb-4">
                                <div class="card-body">
                                    <div class="d-flex align-items-center mb-3">
                                        <img class="rounded-circle" src="../assets/img/avatar/22.jpg" width="60" alt="Jane Cooper">
                                        <div class="ps-3 d-flex justify-content-between w-100">
                                            <div>
                                                <div class="h6 mb-1">Jane Cooper</div>
                                                <div class="fs-sm text-body-secondary">Medical Assistant</div>
                                            </div>
                                            <i class="ai-trash fs-5 opacity-60"></i>
                                        </div>
                                    </div>
                                    <p class="card-text">Very good quality.</p>
                                </div>
                            </div>
                            <!-- Item -->
                            <div class="card border-0">
                                <div class="card-body">
                                    <div class="d-flex align-items-center mb-3">
                                        <img class="rounded-circle" src="../assets/img/avatar/25.jpg" width="60" alt="Cameron Williamson">
                                        <div class="ps-3 d-flex justify-content-between w-100">
                                            <div>
                                                <div class="h6 mb-1">Cameron Williamson</div>
                                                <div class="fs-sm text-body-secondary">Marketing Coordinator</div>
                                            </div>
                                            <i class="ai-trash fs-5 opacity-60"></i>
                                        </div>
                                    </div>
                                    <p class="card-text">Very helpful!!</p>
                                </div>
                            </div>
                        </div>

                    </div>
                    </div>
              </div>
    </div>
  </template>
<script>
export default {
    name:'UserComments',
}
</script>