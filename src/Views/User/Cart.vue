<template>
  <div class="container py-5 mt-5">
    <!-- Title -->
    <div class="mb-4 pt-5">
      <div class="d-flex justify-content-between align-items-center border-bottom pb-3 pb-sm-4">
        <h1 class="d-flex align-items-center mb-1">
          Your cart <span class="fs-base fw-normal text-body-secondary ms-3">({{ cartItems.length }} items)</span>
        </h1>
      </div>
    </div>

    <!-- Empty cart message -->
    <div v-if="cartItems.length === 0" class="text-center py-5">
      <i class="ai-cart display-4 text-body-secondary mb-4"></i>
      <h3 class="h5 mb-3">Your cart is empty</h3>
      <p class="text-body-secondary mb-4">Add items to your cart to proceed with your purchase</p>
      <router-link to="/" class="btn btn-primary">
        Continue Shopping
      </router-link>
    </div>

    <!-- Cart Items -->
    <div v-else class="mb-5">
      <!-- Cart Item -->
      <div 
        v-for="item in cartItems" 
        :key="item.product.id" 
        class="d-sm-flex align-items-center" 
        :class="{ 'border-top py-4': item !== cartItems[0], 'pb-4': item === cartItems[0] }"
      >
        <a class="d-inline-block flex-shrink-0 bg-secondary rounded-1 p-sm-2 p-md-3 mb-2 mb-sm-0" :href="`/shop-single/${item.product.id}`">
          <img :src="item.product.image" width="110" :alt="item.product.name">
        </a>
        <div class="w-100 pt-1 ps-sm-4">
          <div class="d-flex">
            <div class="me-3">
              <h3 class="h5 mb-2">
                <a :href="`/shop-single/${item.product.id}`">{{ item.product.name }}</a>
              </h3>
              <div class="d-flex flex-wrap">
                <!-- Product options could go here -->
              </div>
            </div>
            <div class="text-end ms-auto">
              <div class="fs-5 mb-2">${{ (item.product.price * item.quantity).toFixed(2) }}</div>
              <del v-if="item.product.oldPrice" class="text-body-secondary ms-auto">
                ${{ (item.product.oldPrice * item.quantity).toFixed(2) }}
              </del>
            </div>
          </div>
          <div class="count-input ms-n3">
            <button 
              class="btn btn-icon fs-xl" 
              type="button" 
              @click="decrementQuantity(item.product.id)"
              :disabled="item.quantity <= 1"
            >-</button>
            <input 
              class="form-control" 
              type="number" 
              :value="item.quantity" 
              readonly
            >
            <button 
              class="btn btn-icon fs-xl" 
              type="button" 
              @click="incrementQuantity(item.product.id)"
            >+</button>
          </div>
          <div class="nav justify-content-end mt-n5 mt-sm-n3">
            <a 
              class="nav-link fs-xl p-2" 
              href="#" 
              data-bs-toggle="tooltip" 
              title="Remove" 
              aria-label="Remove"
              @click.prevent="removeFromCart(item.product.id)"
            >
              <i class="ai-trash"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Coupon input + Total -->
    <div v-if="cartItems.length > 0" class="row mb-4">
      <div class="col-md-6 mb-3 mb-md-0">
        <div class="input-group border-dashed">
          <input class="form-control text-uppercase" type="text" placeholder="Your coupon code" v-model="couponCode">
          <button class="btn btn-secondary" type="button" @click="applyCoupon">Apply coupon</button>
        </div>
      </div>
      <div class="col-md-6">
        <div class="d-flex align-items-center justify-content-md-end bg-light p-3 rounded">
          <span class="fs-xl me-3">Total:</span>
          <span class="h3 mb-0">${{ cartTotal.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <!-- Action buttons -->
    <div v-if="cartItems.length > 0" class="d-flex align-items-center justify-content-between">
      <router-link to="/" class="btn btn-outline-secondary">
        <i class="ai-chevron-left me-2"></i>
        Continue shopping
      </router-link>
      <router-link to="/checkout" class="btn btn-primary">
        Proceed to checkout
        <i class="ai-chevron-right ms-2"></i>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShoppingCart",
  data() {
    return {
      cartItems: [],
      couponCode: '',
      couponApplied: false,
      discount: 0
    };
  },
  computed: {
    cartTotal() {
      const subtotal = this.cartItems.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
      }, 0);
      
      return subtotal - this.discount;
    }
  },
  methods: {
    loadCart() {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.cartItems = JSON.parse(savedCart);
      }
    },
    
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    },
    
    incrementQuantity(productId) {
      const item = this.cartItems.find(item => item.product.id === productId);
      if (item) {
        item.quantity += 1;
        this.saveCart();
      }
    },
    
    decrementQuantity(productId) {
      const item = this.cartItems.find(item => item.product.id === productId);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        this.saveCart();
      }
    },
    
    removeFromCart(productId) {
      if (confirm('Are you sure you want to remove this item from your cart?')) {
        this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
        this.saveCart();
      }
    },
    
    clearCart() {
      if (confirm('Are you sure you want to clear your cart?')) {
        this.cartItems = [];
        localStorage.removeItem('cart');
      }
    },
    
    applyCoupon() {
      // This is a placeholder for coupon logic
      // In a real application, you would validate the coupon code with an API
      if (this.couponCode.toUpperCase() === 'DISCOUNT10') {
        this.discount = this.cartTotal * 0.1; // 10% discount
        this.couponApplied = true;
        alert('Coupon applied! 10% discount');
      } else {
        alert('Invalid coupon code');
      }
    }
  },
  mounted() {
    this.loadCart();
  }
}
</script>