<template>
  <div class="container py-5 mt-5">
    <div class="mb-4 pt-5">
      <div class="d-flex justify-content-between align-items-center border-bottom pb-3 pb-sm-4">
        <h1 class="d-flex align-items-center mb-1">
          Panier <span class="fs-base fw-normal text-body-secondary ms-3">({{ cartItems.length }} article{{ cartItems.length !== 1 ? 's' : '' }})</span>
        </h1>
      </div>
    </div>

    <div v-if="loadingCart" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-body-secondary">Chargement du panier...</p>
    </div>

    <div v-else-if="cartItems.length === 0" class="text-center py-5">
      <i class="ai-cart display-4 text-body-secondary mb-4"></i>
      <h3 class="h5 mb-3">Votre panier est vide</h3>
      <p class="text-body-secondary mb-4">Ajoutez des articles pour passer commande.</p>
      <router-link to="/catalog" class="btn btn-primary">Continuer les achats</router-link>
    </div>

    <div v-else class="mb-5">
      <div
        v-for="item in cartItems"
        :key="item.product.id"
        class="d-sm-flex align-items-center"
        :class="{ 'border-top py-4': item !== cartItems[0], 'pb-4': item === cartItems[0] }"
      >
        <router-link :to="`/shop-single/${item.product.id}`" class="d-inline-block flex-shrink-0 bg-secondary rounded-1 p-sm-2 p-md-3 mb-2 mb-sm-0">
          <img :src="getItemImage(item)" width="110" height="110" style="object-fit: contain;" :alt="item.product.name">
        </router-link>
        <div class="w-100 pt-1 ps-sm-4">
          <div class="d-flex">
            <div class="me-3">
              <h3 class="h5 mb-2">
                <router-link :to="`/shop-single/${item.product.id}`" class="text-body text-decoration-none">{{ item.product.name }}</router-link>
              </h3>
            </div>
            <div class="text-end ms-auto">
              <div class="fs-5 mb-2">{{ formatPrice((item.product.price || 0) * item.quantity) }}</div>
              <del v-if="item.product.oldPrice" class="text-body-secondary">{{ formatPrice((item.product.oldPrice || 0) * item.quantity) }}</del>
            </div>
          </div>
          <div class="count-input ms-n3">
            <button class="btn btn-icon fs-xl" type="button" @click="decrementQuantity(item.product.id)" :disabled="item.quantity <= 1">−</button>
            <input class="form-control" type="number" :value="item.quantity" readonly>
            <button class="btn btn-icon fs-xl" type="button" @click="incrementQuantity(item.product.id)">+</button>
          </div>
          <div class="nav justify-content-end mt-n5 mt-sm-n3">
            <a class="nav-link fs-xl p-2" href="#" aria-label="Retirer" @click.prevent="removeFromCart(item.product.id)">
              <i class="ai-trash"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div v-if="cartItems.length > 0 && !loadingCart" class="row mb-4">
      <div class="col-md-6 mb-3 mb-md-0">
        <div class="input-group border-dashed">
          <input class="form-control text-uppercase" type="text" placeholder="Code promo" v-model="couponCode">
          <button class="btn btn-secondary" type="button" @click="applyCoupon">Appliquer</button>
        </div>
      </div>
      <div class="col-md-6">
        <div class="d-flex align-items-center justify-content-md-end bg-light p-3 rounded">
          <span class="fs-xl me-3">Total :</span>
          <span class="h3 mb-0">{{ formatPrice(cartTotal) }}</span>
        </div>
      </div>
    </div>

    <div v-if="cartItems.length > 0 && !loadingCart" class="d-flex align-items-center justify-content-between">
      <router-link to="/catalog" class="btn btn-outline-secondary">
        <i class="ai-chevron-left me-2"></i>
        Continuer les achats
      </router-link>
      <router-link to="/checkout" class="btn btn-primary">
        Passer la commande
        <i class="ai-chevron-right ms-2"></i>
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { fetchCart, updateCartQuantity, removeFromCart as removeFromCartApi, setCartToStorage } from '../../utils/cart';

const placeholderImg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTEwIiBoZWlnaHQ9IjExMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTEwIiBoZWlnaHQ9IjExMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg==';

export default {
  name: 'ShoppingCart',
  data() {
    return {
      cartItems: [],
      couponCode: '',
      couponApplied: false,
      discount: 0,
      loadingCart: true,
    };
  },
  computed: {
    cartTotal() {
      const subtotal = this.cartItems.reduce((total, item) => {
        return total + (Number(item.product.price) || 0) * (item.quantity || 1);
      }, 0);
      return Math.max(0, subtotal - this.discount);
    },
  },
  methods: {
    formatPrice(price) {
      const n = Number(price);
      if (isNaN(n)) return '0,00 DT';
      return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + ' DT';
    },
    getItemImage(item) {
      const p = item.product;
      if (p?.image) return p.image;
      if (p?.images?.length && p.images[0]?.url) return p.images[0].url;
      return placeholderImg;
    },
    async loadCart() {
      this.loadingCart = true;
      try {
        this.cartItems = await fetchCart(axios);
      } finally {
        this.loadingCart = false;
      }
    },
    async incrementQuantity(productId) {
      const item = this.cartItems.find((i) => i.product.id === productId);
      if (!item) return;
      try {
        this.cartItems = await updateCartQuantity(axios, productId, item.quantity + 1);
      } catch {
        item.quantity += 1;
        setCartToStorage(this.cartItems);
      }
      window.dispatchEvent(new CustomEvent('cart-updated'));
    },
    async decrementQuantity(productId) {
      const item = this.cartItems.find((i) => i.product.id === productId);
      if (!item || item.quantity <= 1) return;
      try {
        this.cartItems = await updateCartQuantity(axios, productId, item.quantity - 1);
      } catch {
        item.quantity -= 1;
        setCartToStorage(this.cartItems);
      }
      window.dispatchEvent(new CustomEvent('cart-updated'));
    },
    async removeFromCart(productId) {
      if (!confirm('Retirer cet article du panier ?')) return;
      try {
        this.cartItems = await removeFromCartApi(axios, productId);
      } catch {
        this.cartItems = this.cartItems.filter((i) => i.product.id !== productId);
        setCartToStorage(this.cartItems);
      }
      window.dispatchEvent(new CustomEvent('cart-updated'));
    },
    applyCoupon() {
      if (String(this.couponCode).toUpperCase() === 'DISCOUNT10') {
        this.discount = this.cartTotal * 0.1;
        this.couponApplied = true;
        alert('Code appliqué : 10 % de réduction');
      } else {
        alert('Code promo invalide');
      }
    },
  },
  mounted() {
    this.loadCart();
  },
};
</script>