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
                                      <router-link  class="nav-link fw-semibold py-2 px-0" to="/admin">
                                          <i class="ai-dashboard  fs-5 opacity-60 me-2"></i> Dashboard
                                      </router-link>
                                      <router-link class="nav-link fw-semibold py-2 px-0" to="/users">
                                          <i class="ai-user-group fs-5 opacity-60 me-2"></i> Users
                                      </router-link>
                                      <router-link class="nav-link fw-semibold py-2 px-0" to="/markets">
                                          <i class="ai-shopping-bag fs-5 opacity-60 me-2"></i> Markets
                                      </router-link>
                                      <router-link class="nav-link fw-semibold py-2 px-0" to="/category">
                                          <i class="ai-grid fs-5 opacity-60 me-2"></i> Categorys
                                      </router-link>
                                  </nav>
  
                              </div>
                          </div>
                  </aside>
                  <!-- Page content -->
  
                  <div class="col-lg-9 pt-4 pb- pb-sm-4">
                    <h1 class="h2 mb-2">Overview</h1>

                    <section class="card border border-2 py-1 p-md-2 p-xl-3 p-xxl-4 mb-3">

                        <div class="card-body">
                            <div class="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3">
                                <i class="ai-user text-primary lead pe-1 me-2"></i>
                                <h2 class="h4 mb-0">Basic info</h2>
                                <router-link class="btn btn-sm btn-secondary ms-auto" to="/settingAdmin">
                                    <i class="ai-edit ms-n1 me-2"></i> Edit info
                                </router-link>
                            </div>
                            <div class="d-md-flex align-items-center">
                                <div class="d-sm-flex align-items-center">
                                    <img src="../assets/img/avatar/02.jpg" alt="User Avatar" class="rounded-circle" style="width: 80px; height: 80px; object-fit: cover;">
                                    <div class="pt-3 pt-sm-0 ps-sm-3">
                                        <h3 class="h5 mb-2">Isabella Bocouse<i class="ai-circle-check-filled fs-base text-success ms-2"></i></h3>
                                        <div class="text-body-secondary fw-medium d-flex flex-wrap flex-sm-nowrap align-iteems-center">
                                            <div class="d-flex align-items-center me-3">
                                                <i class="ai-mail me-1"></i> email@example.com
                                            </div>
                                            <div class="d-flex align-items-center text-nowrap">
                                                <i class="ai-map-pin me-1"></i> USA, $
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div class="row py-4 mb-2 mb-sm-3">
                                <div class="col-md-6 mb-4 mb-md-0">
                                    <table class="table mb-0">
                                        <tbody>
                                            <tr>
                                                <td class="border-0 text-body-secondary py-1 px-0">Phone</td>
                                                <td class="border-0 text-dark fw-medium py-1 ps-3">+1 234 567 890</td>
                                            </tr>
                                            <tr>
                                                <td class="border-0 text-body-secondary py-1 px-0">Email</td>
                                                <td class="border-0 text-dark fw-medium py-1 ps-3">Isabella@gmail.com</td>
                                            </tr>
                                            <tr>
                                                <td class="border-0 text-body-secondary py-1 px-0">Gender</td>
                                                <td class="border-0 text-dark fw-medium py-1 ps-3">Female</td>
                                            </tr>
                                            <tr>
                                                <td class="border-0 text-body-secondary py-1 px-0">Address</td>
                                                <td class="border-0 text-dark fw-medium py-1 ps-3">4>Toronto, Ontario, M3J 3H9,Canada</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </div>

                        </div>
                    </section>
  
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
export default {
    name:'OverviewAdmin'
}
</script>
