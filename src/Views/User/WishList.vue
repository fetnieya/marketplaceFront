<template>
    <!-- Page container -->
    <div class="container py-5 mt-4 mt-lg-5 mb-lg-4 my-xl-5 d-flex justify-content-center align-items-center" style="min-height: 100vh;">
      <div class="row pt-sm-2 pt-lg-0 w-100">
        <!-- Page content -->
        <div class="col-lg-9 pt-4 pb-2 pb-sm-4 mx-auto">
          <div class="d-flex align-items-center mb-4">
            <h1 class="h2 mb-0">Favorites <span class="fs-base fw-normal text-body-secondary">({{ wishlistItems.length }} items)</span></h1>
            <button class="btn btn-sm btn-outline-danger ms-auto" type="button" @click="clearWishlist">
              <i class="ai-trash ms-n1 me-2"></i>
              Clear all
            </button>
          </div>
          
          <!-- Empty wishlist message -->
          <div v-if="wishlistItems.length === 0" class="card border-0 py-3 p-md-4 p-xl-5 p-xxl-6">
            <div class="card-body text-center py-5">
              <i class="ai-heart display-4 text-body-secondary mb-4"></i>
              <h3 class="h5 mb-3">Your wishlist is empty</h3>
              <p class="text-body-secondary mb-4">Browse our products and add your favorites to the wishlist</p>
              <router-link to="/catalog" class="btn btn-primary">
                Continue Shopping
              </router-link>
            </div>
          </div>
          
          <!-- Wishlist items -->
          <div v-else class="card border-0 py-3 p-md-4 p-xl-5 p-xxl-6">
            <div class="card-body pb-5">
              <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                <!-- Item -->
                <div class="col pb-2 pb-sm-3" v-for="item in wishlistItems" :key="item.id">
                  <div class="card-hover position-relative bg-secondary rounded-1 p-3 mb-4">
                    <button class="btn btn-icon btn-sm btn-light bg-light border-0 rounded-circle position-absolute top-0 end-0 mt-3 me-3 z-5" type="button" aria-label="Remove" @click="removeFromWishlist(item.id)">
                      <i class="ai-trash fs-xl text-danger"></i>
                    </button>
                    <div class="swiper swiper-nav-onhover" data-swiper-options='{"loop": true, "navigation": {"prevEl": ".btn-prev", "nextEl": ".btn-next"}}'>
                      <router-link class="swiper-wrapper" :to="`/shop-single/${item.id}`">
                        <div class="swiper-slide p-2 p-xl-4">
                          <img class="d-block mx-auto" :src="item.image" width="226" :alt="item.name">
                        </div>
                      </router-link>
                      <button class="btn btn-prev btn-icon btn-sm btn-light bg-light border-0 rounded-circle start-0" type="button" aria-label="Prev">
                        <i class="ai-chevron-left fs-xl text-nav"></i>
                      </button>
                      <button class="btn btn-next btn-icon btn-sm btn-light bg-light border-0 rounded-circle end-0" type="button" aria-label="Next">
                        <i class="ai-chevron-right fs-xl text-nav"></i>
                      </button>
                    </div>
                  </div>
                  <div class="d-flex mb-1">
                    <h3 class="h6 mb-0">
                      <router-link :to="`/shop-single/${item.id}`">{{ item.name }}</router-link>
                    </h3>
                  </div>
                  <div class="d-flex align-items-center">
                    <span class="me-2">${{ item.price.toFixed(2) }}</span>
                    <del class="fs-sm text-body-secondary" v-if="item.oldPrice">${{ item.oldPrice.toFixed(2) }}</del>
                    <div class="nav ms-auto" data-bs-toggle="tooltip" data-bs-template="<div class='tooltip fs-xs' role='tooltip'><div class='tooltip-inner bg-light text-body-secondary p-0'></div></div>" data-bs-placement="left" title="Add to cart">
                      <a class="nav-link fs-lg py-2 px-1" href="#" aria-label="Add to Cart" @click.prevent="addToCart(item)">
                        <i class="ai-cart"></i>
                      </a>
                    </div>
                  </div>
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
    name: "WishListComponent",
    data() {
      return {
        wishlistItems: []
      };
    },
    methods: {
      // Load wishlist items from localStorage
      loadWishlist() {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          this.wishlistItems = JSON.parse(savedWishlist);
        }
      },
      
      // Remove an item from the wishlist
      removeFromWishlist(productId) {
        this.wishlistItems = this.wishlistItems.filter(item => item.id !== productId);
        this.saveWishlist();
      },
      
      // Save wishlist to localStorage
      saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(this.wishlistItems));
      },
      
      // Clear all items from wishlist
      clearWishlist() {
        if (confirm('Are you sure you want to clear all items from your wishlist?')) {
          this.wishlistItems = [];
          localStorage.removeItem('wishlist');
        }
      },
      
      // Add item to cart
      addToCart(product) {
        // Get existing cart from localStorage
        let cart = [];
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          cart = JSON.parse(savedCart);
        }
        
        // Check if product already exists in cart
        const existingProductIndex = cart.findIndex(item => item.product.id === product.id);
        
        if (existingProductIndex !== -1) {
          // Product exists, increase quantity
          cart[existingProductIndex].quantity += 1;
        } else {
          // Add new product to cart
          cart.push({
            product,
            quantity: 1
          });
        }
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Show feedback to user
        alert(`Added ${product.name} to cart!`);
        
        // Optionally remove from wishlist after adding to cart
        // this.removeFromWishlist(product.id);
      }
    },
    created() {
      // Load wishlist when component is created
      this.loadWishlist();
    }
  }
  </script>