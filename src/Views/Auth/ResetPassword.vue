<template>
    <!-- Page wrapper -->
    <main class="page-wrapper d-flex justify-content-center align-items-center min-vh-100">
      <div class="d-flex flex-column align-items-center px-3 pt-5">
  
        <!-- Home button -->
        <router-link class="text-nav btn btn-icon bg-light border rounded-circle position-absolute top-0 end-0 z-2 p-0 mt-3 me-3 mt-sm-4 me-sm-4" to="/" data-bs-toggle="tooltip" data-bs-placement="left" title="Back to home" aria-label="Back to home">
          <i class="ai-home"></i>
        </router-link>
  
        <!-- Content -->
        <div class="mt-auto" style="max-width: 700px;">
          <h1 class="pt-3 pb-2 pb-lg-3">Forgot your password?</h1>
          <p class="pb-2">Change your password in three easy steps. This helps to keep your new password secure.</p>
          <ul class="list-unstyled pb-2 pb-lg-0 mb-4 mb-lg-5">
            <li class="d-flex mb-2">
              <span class="text-primary fw-semibold me-2">1.</span>
              Fill in your email address below.
            </li>
            <li class="d-flex mb-2">
              <span class="text-primary fw-semibold me-2">2.</span>
              We'll email you a temporary code.
            </li>
            <li class="d-flex mb-2">
              <span class="text-primary fw-semibold me-2">3.</span>
              Use the code to change your password on our secure website.
            </li>
          </ul>
          <div class="card border-0 bg-primary" data-bs-theme="dark">
            <form class="card-body">
              <div class="mb-4">
                <div class="position-relative">
                  <i class="ai-mail fs-lg position-absolute top-50 start-0 translate-middle-y text-light opacity-80 ms-3"></i>
                  <input class="form-control form-control-lg ps-5" type="email" placeholder="Email address" required>
                </div>
              </div>
              <button class="btn btn-light" type="submit">Get new password</button>
            </form>
          </div>
        </div>
  
        <!-- Copyright -->
        <p class="nav w-100 fs-sm pt-5 mt-auto mb-5" style="max-width: 526px;">
          <span class="text-body-secondary">&copy; All rights reserved. Made by</span>
          <a class="nav-link d-inline-block p-0 ms-1" href="https://localscope.dev/" target="_blank" rel="noopener">Localscope Software</a>
        </p>
      </div>
    </main>
  
    <!-- Back to top button -->
    <a class="btn-scroll-top" href="#top" data-scroll aria-label="Scroll back to top">
      <svg viewBox="0 0 40 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10"></circle>
      </svg>
      <i class="ai-arrow-up"></i>
    </a>
  </template>
  
  <script>
  export default {
    name: 'ResetPassword'
  }
  </script>
  