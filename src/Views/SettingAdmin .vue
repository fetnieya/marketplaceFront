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
                    <h1 class="h2 mb-2">Settings</h1>

                    <section class="card border border-2 py-1 p-md-2 p-xl-3 p-xxl-4 mb-3">

                        <div class="card-body">
                           
                            <div class="d-flex align-items-center">
                                <div class="dropdown">
                                    <a class="d-flex flex-column justify-content-end position-relative overflow-hidden rounded-circle bg-size-cover bg-position-center flex-shrink-0" href="#" data-bs-toggle="dropdown" aria-expanded="false" style="width: 80px; height: 80px; background-image: url(../assets/img/avatar/02.jpg);"
                                        aria-label="Upload picture">
                                        <span class="d-block text-light text-center lh-1 pb-1" style="background-color: rgba(0,0,0,.5)">
                              <i class="ai-camera"></i>
                             </span>
                                    </a>
                                    <div class="dropdown-menu my-1">
                                        <a class="dropdown-item fw-normal" href="#">
                                            <i class="ai-camera fs-base opacity-70 me-2"></i> Upload new photo
                                        </a>
                                        <a class="dropdown-item text-danger fw-normal" href="#">
                                            <i class="ai-trash fs-base me-2"></i> Delete photo
                                        </a>
                                    </div>
                                </div>
                                <div class="ps-3">
                                    <h3 class="h6 mb-1">Profile picture</h3>
                                    <p class="fs-sm text-body-secondary mb-0">PNG or JPG no bigger than 1000px wide and tall.</p>
                                </div>
                              </div>
                             <div class="row g-3 g-sm-4 mt-0 mt-lg-2">
                                <div class="col-sm-6">
                                    <label class="form-label" for="fn">First name</label>
                                    <input class="form-control" type="text" value="Isabella" id="fn">
                                </div>
                                <div class="col-sm-6">
                                    <label class="form-label" for="ln">Last name</label>
                                    <input class="form-control" type="text" value="Bocouse" id="ln">
                                </div>
                                <div class="col-sm-6">
                                    <label class="form-label" for="email">Email address</label>
                                    <input class="form-control" type="email" value="bocouse@example.com" id="email">
                                </div>
                                <div class="col-sm-6">
                                    <label class="form-label" for="phone">Phone <span class="text-body-secondary">(optional)</span></label>
                                    <input class="form-control" type="tel" data-format='{"numericOnly": true, "delimiters": ["+1 ", " ", " "], "blocks": [0, 3, 3, 2]}' placeholder="+1 ___ ___ __" id="phone">
                                </div>




                                <div class="col-12">
                                    <label class="form-label" for="bio">Bio</label>
                                    <textarea class="form-control" rows="5" placeholder="Add a bio" id="bio"></textarea>
                                </div>
                                <div class="col-12 d-sm-flex align-items-center pt-sm-2 pt-md-3">
                                    <div class="form-label text-body-secondary mb-2 mb-sm-0 me-sm-4">Gender:</div>
                                    <div class="form-check form-check-inline mb-0">
                                        <input class="form-check-input" type="radio" name="gender" value="Male" id="male">
                                        <label class="form-check-label" for="male">Male</label>
                                    </div>
                                    <div class="form-check form-check-inline mb-0">
                                        <input class="form-check-input" type="radio" name="gender" value="Female" checked id="female">
                                        <label class="form-check-label" for="female">Female</label>
                                    </div>
                                    <div class="form-check form-check-inline mb-0">
                                        <input class="form-check-input" type="radio" name="gender" value="Other" id="other">
                                        <label class="form-check-label" for="other">Other</label>
                                    </div>
                                </div>
                                <div class="col-12 d-sm-flex align-items-center">

                                    <div class="col-12 d-flex justify-content-end pt-3">
                                        <button class="btn btn-secondary" type="button">Cancel</button>
                                        <button class="btn btn-primary ms-3" type="button">Save changes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </section>
                     <!-- Password -->
                     <section class="card border border-2 py-1 p-md-2 p-xl-3 p-xxl-4 mb-3">
                        <div class="card-body">
                            <div class="d-flex align-items-center pb-4 mt-sm-n1 mb-0 mb-lg-1 mb-xl-3">
                                <i class="ai-lock-closed text-primary lead pe-1 me-2"></i>
                                <h2 class="h4 mb-0">Password change</h2>
                            </div>
                            <div class="row align-items-center g-3 g-sm-4 pb-3">
                                <div class="col-sm-6">
                                    <label class="form-label" for="current-pass">Current password</label>
                                    <div class="password-toggle">
                                        <input class="form-control" type="password" value="hidden@password" id="current-pass">
                                        <label class="password-toggle-btn" aria-label="Show/hide password">
                        <input class="password-toggle-check" type="checkbox">
                        <span class="password-toggle-indicator"></span>
                      </label>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <a class="d-inline-block fs-sm fw-semibold text-decoration-none mt-sm-4" href="account-password-recovery.html">Forgot password?</a>
                                </div>
                                <div class="col-sm-6">
                                    <label class="form-label" for="new-pass">New password</label>
                                    <div class="password-toggle">
                                        <input class="form-control" type="password" id="new-pass">
                                        <label class="password-toggle-btn" aria-label="Show/hide password">
                        <input class="password-toggle-check" type="checkbox">
                        <span class="password-toggle-indicator"></span>
                      </label>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <label class="form-label" for="confirm-pass">Confirm new password</label>
                                    <div class="password-toggle">
                                        <input class="form-control" type="password" id="confirm-pass">
                                        <label class="password-toggle-btn" aria-label="Show/hide password">
                        <input class="password-toggle-check" type="checkbox"><span class="password-toggle-indicator"></span>
                      </label>
                                    </div>
                                </div>
                            </div>
                            <div class="alert alert-info d-flex my-3 my-sm-4">
                                <i class="ai-circle-info fs-xl me-2"></i>
                                <p class="mb-0">Password must be minimum 8 characters long - the more, the better.</p>
                            </div>
                            <div class="d-flex justify-content-end pt-3">
                                <button class="btn btn-secondary" type="button">Cancel</button>
                                <button class="btn btn-primary ms-3" type="button">Save changes</button>
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
    name :'SettingAdmin '
}
</script>