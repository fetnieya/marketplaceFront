<template>
    <!-- Page wrapper -->
    <main class="page-wrapper">
      <div class="d-lg-flex position-relative h-100">

        <!-- Home button -->
        <router-link class="text-nav btn btn-icon bg-light border rounded-circle position-absolute top-0 end-0 p-0 mt-3 me-3 mt-sm-4 me-sm-4" to="/" data-bs-toggle="tooltip" data-bs-placement="left" title="Back to home" aria-label="Back to home">
          <i class="ai-home"></i>
        </router-link>

        <!-- Sign in form -->
        <div class="d-flex flex-column align-items-center w-lg-50 h-100 px-3 px-lg-5 pt-5">
          <div class="w-100 mt-auto" style="max-width: 526px;">
            <h1>Sign in to Around</h1>
            <p class="pb-3 mb-3 mb-lg-4">Don't have an account yet?&nbsp;&nbsp;<router-link to="/sign-up">Register here!</router-link></p>
            <form class="needs-validation" novalidate>
              <div class="pb-3 mb-3">
                <div class="position-relative">
                  <i class="ai-mail fs-lg position-absolute top-50 start-0 translate-middle-y ms-3"></i>
                  <input class="form-control form-control-lg ps-5" type="email" placeholder="Email address" required>
                </div>
              </div>
              <div class="mb-4">
                <div class="position-relative">
                  <i class="ai-lock-closed fs-lg position-absolute top-50 start-0 translate-middle-y ms-3"></i>
                  <div class="password-toggle">
                    <input class="form-control form-control-lg ps-5" type="password" placeholder="Password" required>
                    <label class="password-toggle-btn" aria-label="Show/hide password">
                      <input class="password-toggle-check" type="checkbox"><span class="password-toggle-indicator"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="d-flex flex-wrap align-items-center justify-content-between pb-4">
                <div class="form-check my-1">
                  <input class="form-check-input" type="checkbox" id="keep-signedin">
                  <label class="form-check-label ms-1" for="keep-signedin">Keep me signed in</label>
                </div>
                <router-link class="fs-sm fw-semibold text-decoration-none my-1" to="/resetPass">Forgot password?</router-link>
              </div>
              <button class="btn btn-lg btn-primary w-100 mb-4" type="submit">Sign in</button>

              <!-- Sign in with social account -->
              <h2 class="h6 text-center pt-3 pt-lg-4 mb-4">Or sign in with your social account</h2>
              <div class="row row-cols-1 row-cols-sm-2 gy-3">
                <div class="col">
                  <a class="btn btn-icon btn-outline-secondary btn-google btn-lg w-100" href="https://accounts.google.com/v3/signin/identifier?elo=1&ifkv=AcMMx-elTb39yLjPjCn8EtbPyTAPwFmL2R4ePwT5QgHT0GZp7Qi5En4E0Htm1W77ZFtbIBzRxUv5&ddm=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin&continue=https%3A%2F%2Faccounts.google.com%2FManageAccount%3Fnc%3D1">
                    <i class="ai-google fs-xl me-2"></i>
                    Google
                  </a>
                </div>
                <div class="col">
                  <a class="btn btn-icon btn-outline-secondary btn-facebook btn-lg w-100" href="https://www.facebook.com/">
                    <i class="ai-facebook fs-xl me-2"></i>
                    Facebook
                  </a>
                </div>
              </div>
            </form>
          </div>

          <!-- Copyright -->
          <p class="nav w-100 fs-sm pt-5 mt-auto mb-5" style="max-width: 526px;"><span class="text-body-secondary">&copy; All rights reserved. Made by</span><a class="nav-link d-inline-block p-0 ms-1" href="https://localscope.dev/" target="_blank" rel="noopener">Localscope Software</a></p>
        </div>

        
        <!-- Cover image -->
        <div class="w-50">
    <img src="@/assets/img/account/cover.jpg" alt="Cover Photo" class="img-fluid">
  </div>      </div>
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
export default{
    name:"SignInComponent"
}
</script>