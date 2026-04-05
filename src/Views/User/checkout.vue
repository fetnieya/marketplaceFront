<template>
  <div class="checkout-page container-fluid">
    <div class="d-none d-lg-block bg-secondary position-fixed top-0 start-0 h-100 checkout-page__bg"></div>

    <!-- Panier vide -->
    <div v-if="!loadingCart && cartItems.length === 0" class="container position-relative z-2 py-5 mt-4 text-center checkout-page__empty">
      <i class="ai-cart checkout-page__empty-icon text-primary opacity-75 mb-4"></i>
      <h1 class="display-6 fw-semibold mb-3">Votre panier est vide</h1>
      <p class="text-body-secondary fs-lg mb-5 mx-auto" style="max-width: 420px;">Ajoutez des articles avant de passer au paiement.</p>
      <router-link to="/cart" class="btn btn-lg btn-outline-secondary me-2 mb-2">Voir le panier</router-link>
      <router-link to="/catalog" class="btn btn-lg btn-primary mb-2">Continuer les achats</router-link>
    </div>

    <form
      v-else
      class="needs-validation container position-relative z-2 pt-4 pt-lg-5 pb-lg-5 pb-md-4 pb-2"
      novalidate
      @submit.prevent="placeOrder"
    >
      <div class="row g-4 g-xl-5">
        <div class="col-lg-6">
          <header class="checkout-page__header border-bottom border-opacity-25 pb-4 mb-4 mt-2 mt-lg-3">
            <h1 class="display-5 fw-semibold mb-2">Paiement</h1>
            <p class="text-body-secondary fs-lg mb-0">Finalisez votre commande en quelques étapes.</p>
          </header>

          <h3 class="checkout-page__section-title">
            1.<span class="text-decoration-underline ms-1">Adresse de livraison</span>
          </h3>
          <div class="row g-4 pb-4 pb-md-5 mb-3 mb-md-1">
            <div class="col-sm-6">
              <label class="form-label fs-base" for="c-fn">Prénom</label>
              <input v-model="form.firstName" class="form-control form-control-lg" type="text" placeholder="Votre prénom" required id="c-fn">
            </div>
            <div class="col-sm-6">
              <label class="form-label fs-base" for="c-ln">Nom</label>
              <input v-model="form.lastName" class="form-control form-control-lg" type="text" placeholder="Votre nom" required id="c-ln">
            </div>
            <div class="col-sm-6">
              <label class="form-label fs-base" for="c-email">Email</label>
              <div class="position-relative">
                <i class="ai-mail fs-lg position-absolute top-50 start-0 translate-middle-y ms-3"></i>
                <input v-model="form.email" class="form-control form-control-lg ps-5" type="email" placeholder="Adresse email" required id="c-email">
              </div>
            </div>
            <div class="col-sm-6">
              <label class="form-label fs-base" for="c-phone">Téléphone</label>
              <div class="position-relative">
                <i class="ai-phone fs-lg position-absolute top-50 start-0 translate-middle-y ms-3"></i>
                <input v-model="form.phone" class="form-control form-control-lg ps-5" type="tel" placeholder="+216 __ ___ ___" required id="c-phone">
              </div>
            </div>
            <div class="col-12">
              <label class="form-label fs-base" for="c-governorate">Gouvernorat</label>
              <select v-model="form.city" class="form-select form-select-lg" required id="c-governorate">
                <option value="" selected disabled>Choisir un gouvernorat</option>
                <option v-for="gov in gouvernorats" :key="gov" :value="gov">{{ gov }}</option>
              </select>
            </div>
            <div class="col-sm-6">
              <label class="form-label fs-base" for="c-zip">Code postal</label>
              <input v-model="form.zipCode" class="form-control form-control-lg" type="text" placeholder="1xxx" required id="c-zip">
            </div>
            <div class="col-sm-6">
              <label class="form-label fs-base" for="c-address">Adresse</label>
              <input v-model="form.address" class="form-control form-control-lg" type="text" placeholder="Rue, numéro, quartier" required id="c-address">
            </div>
            <div class="col-12">
              <label class="form-label fs-base" for="c-notes">Notes de commande <span class="text-body-secondary">(facultatif)</span></label>
              <textarea v-model="form.notes" class="form-control form-control-lg" rows="5" id="c-notes" placeholder="Instructions pour le livreur..."></textarea>
            </div>
          </div>

          <h3 class="checkout-page__section-title">2.<span class="text-decoration-underline ms-1">Mode de livraison</span></h3>
          <div class="form-check checkout-page__option mb-4">
            <input v-model="form.shippingMethod" class="form-check-input" type="radio" name="shipping" value="standard" id="standard">
            <label class="form-check-label d-flex justify-content-between" for="standard">
              <span>
                <span class="d-block fs-base text-dark fw-medium mb-1">Livraison standard</span>
                <span class="text-body">Livraison sous 5 à 8 jours ouvrés</span>
              </span>
              <span class="fs-base text-dark fw-semibold">8,00 DT</span>
            </label>
          </div>
          <div class="form-check checkout-page__option mb-4">
            <input v-model="form.shippingMethod" class="form-check-input" type="radio" name="shipping" value="express" id="express">
            <label class="form-check-label d-flex justify-content-between" for="express">
              <span>
                <span class="d-block fs-base text-dark fw-medium mb-1">Livraison express</span>
                <span class="text-body">Livraison sous 3 à 5 jours ouvrés</span>
              </span>
              <span class="fs-base text-dark fw-semibold">15,00 DT</span>
            </label>
          </div>
          <div class="form-check checkout-page__option mb-4">
            <input v-model="form.shippingMethod" class="form-check-input" type="radio" name="shipping" value="local" id="local">
            <label class="form-check-label d-flex justify-content-between" for="local">
              <span>
                <span class="d-block fs-base text-dark fw-medium mb-1">Retrait sur place</span>
                <span class="text-body">Sous 1 à 2 jours ouvrés</span>
              </span>
              <span class="fs-base text-dark fw-semibold">Gratuit</span>
            </label>
          </div>

          <h3 class="checkout-page__section-title mt-n4 mt-md-n3 pt-5 pb-2 pb-sm-3">
            3.<span class="text-decoration-underline ms-1">Mode de paiement</span>
          </h3>
          <div class="form-check checkout-page__option mb-4">
            <input v-model="form.paymentMethod" class="form-check-input" type="radio" name="payment" value="card" id="card">
            <label class="form-check-label" for="card">
              <span>
                <span class="d-block fs-base text-dark fw-medium mb-1">Carte bancaire</span>
                <span class="text-body">Mastercard, Maestro, American Express, Visa acceptées</span>
              </span>
            </label>
          </div>
          <div class="form-check checkout-page__option mb-4">
            <input v-model="form.paymentMethod" class="form-check-input" type="radio" name="payment" value="cash" id="cash">
            <label class="form-check-label" for="cash">
              <span>
                <span class="d-block fs-base text-dark fw-medium mb-1">Paiement à la livraison</span>
                <span class="text-body">Payer en espèces à la réception</span>
              </span>
            </label>
          </div>

          <!-- Formulaire carte (simulation — seuls les 4 derniers chiffres et le titulaire sont envoyés au serveur) -->
          <div v-if="form.paymentMethod === 'card'" class="checkout-page__card-panel rounded-4 border p-4 mb-4">
            <p class="small text-body-secondary mb-3">
              Saisissez les informations de votre carte. Le paiement est simulé à des fins de démonstration ; le numéro complet et le cryptogramme ne sont jamais stockés.
            </p>
            <div class="mb-3">
              <label class="form-label fs-base" for="c-card-name">Titulaire de la carte</label>
              <input
                id="c-card-name"
                v-model="cardForm.holder"
                class="form-control form-control-lg"
                type="text"
                autocomplete="cc-name"
                placeholder="Nom comme sur la carte"
              >
            </div>
            <div class="mb-3">
              <label class="form-label fs-base" for="c-card-num">Numéro de carte</label>
              <input
                id="c-card-num"
                :value="cardNumberDisplay"
                class="form-control form-control-lg font-monospace"
                type="text"
                inputmode="numeric"
                autocomplete="cc-number"
                placeholder="1234 5678 9012 3456"
                maxlength="19"
                @input="onCardNumberInput"
              >
            </div>
            <div class="row g-3">
              <div class="col-sm-6">
                <label class="form-label fs-base" for="c-card-exp">Expiration (MM/AA)</label>
                <input
                  id="c-card-exp"
                  v-model="cardForm.expiry"
                  class="form-control form-control-lg font-monospace"
                  type="text"
                  inputmode="numeric"
                  autocomplete="cc-exp"
                  placeholder="MM/AA"
                  maxlength="5"
                  @input="formatExpiry"
                >
              </div>
              <div class="col-sm-6">
                <label class="form-label fs-base" for="c-card-cvv">CVV</label>
                <input
                  id="c-card-cvv"
                  v-model="cardForm.cvv"
                  class="form-control form-control-lg font-monospace"
                  type="password"
                  inputmode="numeric"
                  autocomplete="cc-csc"
                  placeholder="•••"
                  maxlength="4"
                >
              </div>
            </div>
          </div>

          <div class="d-none d-lg-block pt-5 mt-n3">
            <div class="form-check mb-4">
              <input v-model="form.saveInfo" class="form-check-input" type="checkbox" id="save-info">
              <label class="form-check-label" for="save-info">
                <span class="text-body-secondary">Vos informations seront utilisées pour traiter votre commande.</span>
              </label>
            </div>
            <button class="btn btn-lg btn-primary px-5 py-3 rounded-pill" type="submit" :disabled="submitting">
              {{ submitting ? 'Envoi en cours…' : 'Passer la commande' }}
            </button>
          </div>
        </div>

        <!-- Récapitulatif (depuis le panier) -->
        <div class="col-lg-5 offset-lg-1 pt-1">
          <aside class="checkout-page__summary rounded-4 border shadow-sm p-4 p-lg-5 mt-lg-4">
            <h2 class="h3 fw-semibold pb-3 mb-0 border-bottom border-opacity-25">
              Récapitulatif <span class="fs-5 fw-normal text-body-secondary">({{ cartItems.length }} article{{ cartItems.length !== 1 ? 's' : '' }})</span>
            </h2>

            <div
              v-for="item in cartItems"
              :key="item.product.id"
              class="d-sm-flex align-items-center border-top py-4"
            >
              <router-link :to="`/shop-single/${item.product.id}`" class="d-inline-block flex-shrink-0 bg-secondary rounded-3 p-2 p-sm-3 mb-2 mb-sm-0 checkout-page__thumb">
                <img :src="getItemImage(item)" width="132" height="132" class="checkout-page__thumb-img" :alt="item.product.name">
              </router-link>
              <div class="w-100 pt-1 ps-sm-4">
                <div class="d-flex">
                  <div class="me-3">
                    <h3 class="h5 mb-2">
                      <router-link :to="`/shop-single/${item.product.id}`" class="text-body text-decoration-none">{{ item.product.name }}</router-link>
                    </h3>
                  </div>
                  <div class="text-end ms-auto">
                    <div class="fs-4 fw-semibold mb-1">{{ formatPrice((item.product.price || 0) * item.quantity) }}</div>
                    <del v-if="item.product.oldPrice" class="text-body-secondary small">{{ formatPrice((item.product.oldPrice || 0) * item.quantity) }}</del>
                  </div>
                </div>
                <div class="text-body-secondary fs-lg">Qté : {{ item.quantity }}</div>
              </div>
            </div>

            <div class="border-top pt-4 mb-3">
              <div class="input-group input-group-lg border-dashed" style="max-width: 100%;">
                <input v-model="couponCode" class="form-control text-uppercase" type="text" placeholder="Code promo">
                <button class="btn btn-secondary px-4" type="button" @click.prevent="applyCoupon">Appliquer</button>
              </div>
            </div>
            <ul class="list-unstyled py-2 mb-0 fs-lg">
              <li class="d-flex justify-content-between mb-3">
                <span>Sous-total</span><span class="fw-semibold ms-2">{{ formatPrice(subtotal) }}</span>
              </li>
              <li class="d-flex justify-content-between mb-2">
                <span>Livraison</span><span class="fw-semibold ms-2">{{ formatPrice(shippingCost) }}</span>
              </li>
            </ul>
            <div class="d-flex align-items-baseline justify-content-between checkout-page__total rounded-3 px-4 py-4 mt-2">
              <span class="fs-4 fw-semibold mb-0">Total</span>
              <span class="checkout-page__total-amount text-dark mb-0 lh-1">{{ formatPrice(total) }}</span>
            </div>
          </aside>
        </div>
      </div>

      <div class="d-lg-none pb-2 mt-2 mt-lg-0 pt-4 pt-lg-5">
        <div class="form-check mb-4">
          <input v-model="form.saveInfo" class="form-check-input" type="checkbox" id="save-info2">
          <label class="form-check-label" for="save-info2">
            <span class="text-body-secondary">Vos informations seront utilisées pour traiter votre commande.</span>
          </label>
        </div>
        <button class="btn btn-lg btn-primary w-100 w-sm-auto px-5 py-3 rounded-pill" type="submit" :disabled="submitting">
          {{ submitting ? 'Envoi en cours…' : 'Passer la commande' }}
        </button>
      </div>
    </form>

    <!-- Modal confirmation paiement par carte -->
    <div
      v-if="showCardConfirmModal"
      class="checkout-card-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="card-confirm-title"
      @click.self="closeCardModal"
    >
      <div class="checkout-card-modal card border-0 shadow-lg">
        <div class="card-body p-4 p-md-5">
          <h2 id="card-confirm-title" class="h4 fw-semibold mb-2">Confirmer le paiement</h2>
          <p class="text-body-secondary mb-4">
            Vous allez débiter <strong>{{ formatPrice(total) }}</strong> sur la carte se terminant par <strong>{{ cardLast4Display }}</strong>.
          </p>
          <div class="d-flex flex-wrap gap-2 justify-content-end">
            <button type="button" class="btn btn-outline-secondary rounded-pill px-4" @click="closeCardModal">
              Annuler
            </button>
            <button
              type="button"
              class="btn btn-primary rounded-pill px-4"
              :disabled="submitting"
              @click="confirmCardPayment"
            >
              {{ submitting ? 'Traitement…' : 'Valider le paiement' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { fetchCart, getCurrentUser, setCartToStorage } from '../../utils/cart';

const API_BASE = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
const placeholderImg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTEwIiBoZWlnaHQ9IjExMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTEwIiBoZWlnaHQ9IjExMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg==';

const SHIPPING_PRICES = { standard: 8, express: 15, local: 0 };

function luhnCheck(digits) {
  const arr = String(digits)
    .replace(/\D/g, '')
    .split('')
    .reverse()
    .map((c) => parseInt(c, 10));
  let sum = 0;
  for (let i = 0; i < arr.length; i += 1) {
    let n = arr[i];
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
}

// Les 24 gouvernorats de la Tunisie
const GOUVERNORATS_TUNISIE = [
  'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba',
  'Kairouan', 'Kasserine', 'Kébili', 'Le Kef', 'Mahdia', 'Manouba', 'Médenine',
  'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine',
  'Tozeur', 'Tunis', 'Zaghouan',
];

export default {
  name: 'CheckoutPay',
  data() {
    return {
      gouvernorats: GOUVERNORATS_TUNISIE,
      cartItems: [],
      loadingCart: true,
      submitting: false,
      couponCode: '',
      discount: 0,
      form: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: 'Tunisie',
        city: '',
        zipCode: '',
        address: '',
        notes: '',
        shippingMethod: 'express',
        paymentMethod: 'card',
        saveInfo: true,
      },
      cardDigits: '',
      cardForm: {
        holder: '',
        expiry: '',
        cvv: '',
      },
      showCardConfirmModal: false,
    };
  },
  computed: {
    subtotal() {
      const s = this.cartItems.reduce((sum, item) => {
        return sum + (Number(item.product.price) || 0) * (item.quantity || 1);
      }, 0);
      return Math.max(0, s - this.discount);
    },
    shippingCost() {
      return SHIPPING_PRICES[this.form.shippingMethod] ?? 15;
    },
    total() {
      return this.subtotal + this.shippingCost;
    },
    cardNumberDisplay() {
      const d = String(this.cardDigits).replace(/\D/g, '').slice(0, 19);
      return d.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    },
    cardLast4Display() {
      const d = String(this.cardDigits).replace(/\D/g, '');
      return d.length >= 4 ? d.slice(-4) : '••••';
    },
  },
  watch: {
    'form.paymentMethod'(v) {
      if (v !== 'card') {
        this.showCardConfirmModal = false;
      }
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
    fillUserIfAvailable() {
      const user = getCurrentUser();
      if (!user) return;
      if (user.firstName) this.form.firstName = user.firstName;
      if (user.lastName) this.form.lastName = user.lastName;
      if (user.email) this.form.email = user.email;
      if (user.phone) this.form.phone = user.phone;
    },
    applyCoupon() {
      if (String(this.couponCode).toUpperCase() === 'DISCOUNT10') {
        const beforeDiscount = this.cartItems.reduce((sum, item) => sum + (Number(item.product.price) || 0) * (item.quantity || 1), 0);
        this.discount = beforeDiscount * 0.1;
        this.$nextTick(() => { alert('Code appliqué : 10 % de réduction'); });
      } else {
        alert('Code promo invalide');
      }
    },
    onCardNumberInput(e) {
      const raw = String(e.target.value || '').replace(/\D/g, '').slice(0, 19);
      this.cardDigits = raw;
    },
    formatExpiry(e) {
      const digits = String(e.target.value || '').replace(/\D/g, '').slice(0, 4);
      if (digits.length <= 2) {
        this.cardForm.expiry = digits;
      } else {
        this.cardForm.expiry = `${digits.slice(0, 2)}/${digits.slice(2)}`;
      }
    },
    validateCardForm() {
      const holder = String(this.cardForm.holder || '').trim();
      if (!holder) {
        return 'Indiquez le titulaire de la carte.';
      }
      const digits = String(this.cardDigits).replace(/\D/g, '');
      if (digits.length < 13 || digits.length > 19) {
        return 'Numéro de carte invalide.';
      }
      if (!luhnCheck(digits)) {
        return 'Numéro de carte invalide (contrôle).';
      }
      const exp = String(this.cardForm.expiry || '').trim();
      const m = exp.match(/^(\d{2})\/(\d{2})$/);
      if (!m) {
        return 'Date d’expiration au format MM/AA.';
      }
      const mm = parseInt(m[1], 10);
      const yy = parseInt(m[2], 10);
      if (mm < 1 || mm > 12) {
        return 'Mois d’expiration invalide.';
      }
      const year = 2000 + yy;
      const lastValid = new Date(year, mm, 0, 23, 59, 59, 999);
      if (lastValid < new Date()) {
        return 'La carte est expirée.';
      }
      const cvv = String(this.cardForm.cvv || '').replace(/\D/g, '');
      if (cvv.length < 3 || cvv.length > 4) {
        return 'CVV invalide (3 ou 4 chiffres).';
      }
      return null;
    },
    closeCardModal() {
      if (this.submitting) return;
      this.showCardConfirmModal = false;
    },
    async placeOrder() {
      if (this.cartItems.length === 0) {
        this.$router.push('/cart');
        return;
      }
      const user = getCurrentUser();
      if (!user || !user.id) {
        this.$router.push({ path: '/sign-in', query: { redirect: '/checkout' } });
        return;
      }
      if (this.form.paymentMethod === 'card') {
        const cardErr = this.validateCardForm();
        if (cardErr) {
          alert(cardErr);
          return;
        }
        this.showCardConfirmModal = true;
        return;
      }
      await this.submitOrder();
    },
    async confirmCardPayment() {
      await this.submitOrder();
    },
    async submitOrder() {
      const user = getCurrentUser();
      if (!user || !user.id) {
        this.$router.push({ path: '/sign-in', query: { redirect: '/checkout' } });
        return;
      }
      this.submitting = true;
      try {
        const shippingAddress = {
          firstName: this.form.firstName,
          lastName: this.form.lastName,
          email: this.form.email,
          phone: this.form.phone,
          country: this.form.country,
          city: this.form.city,
          zipCode: this.form.zipCode,
          address: this.form.address,
          notes: this.form.notes || undefined,
        };
        const items = this.cartItems.map((item) => ({
          productId: Number(item.product.id),
          quantity: Number(item.quantity) || 1,
          price: Number(item.product.price) || 0,
        }));
        const token = localStorage.getItem('authToken');
        const paymentMethod = this.form.paymentMethod || 'card';
        const digits = String(this.cardDigits).replace(/\D/g, '');
        const body = {
          items,
          shippingAddress,
          paymentMethod,
          ...(paymentMethod === 'card'
            ? {
                paymentMeta: {
                  cardLast4: digits.slice(-4),
                  cardHolder: String(this.cardForm.holder || '').trim(),
                },
              }
            : {}),
        };
        await axios.post(`${API_BASE}/orders`, body, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        this.showCardConfirmModal = false;
        setCartToStorage([]);
        window.dispatchEvent(new CustomEvent('cart-updated'));
        this.$router.push({ path: '/', query: { orderSuccess: '1' } });
      } catch (err) {
        if (err?.response?.status === 401) {
          this.$router.push({ path: '/sign-in', query: { redirect: '/checkout' } });
          return;
        }
        const msg = err?.response?.data?.message || err?.message || 'Erreur lors de la commande.';
        alert(msg);
      } finally {
        this.submitting = false;
      }
    },
  },
  mounted() {
    this.loadCart();
    this.fillUserIfAvailable();
  },
};
</script>

<style scoped>
.checkout-page__bg {
  width: min(52.5%, 720px);
}

.checkout-page__empty-icon {
  font-size: clamp(4rem, 12vw, 6.5rem);
  line-height: 1;
}

.checkout-page__header {
  border-color: var(--ar-primary, #c62828) !important;
}

.checkout-page__section-title {
  font-size: clamp(1rem, 2.5vw, 1.15rem);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--bs-body-color);
  padding-bottom: 0.75rem;
}

@media (min-width: 576px) {
  .checkout-page__section-title {
    padding-bottom: 1rem;
  }
}

.checkout-page__option {
  padding: 1rem 1.125rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.55);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.checkout-page__option:has(.form-check-input:checked) {
  border-color: rgba(var(--ar-primary-rgb, 200, 165, 96), 0.65);
  box-shadow: 0 0 0 1px rgba(var(--ar-primary-rgb, 198, 40, 40), 0.25);
}

.checkout-page__option .form-check-input {
  width: 1.15rem;
  height: 1.15rem;
  margin-top: 0.2rem;
}

.checkout-page__summary {
  background: var(--bs-body-bg, #fff);
  border-color: rgba(0, 0, 0, 0.06) !important;
}

.checkout-page__thumb-img {
  width: 132px;
  height: 132px;
  object-fit: contain;
  display: block;
}

.checkout-page__total {
  background: rgba(var(--ar-primary-rgb, 198, 40, 40), 0.12);
}

.checkout-page__total-amount {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
}

[data-bs-theme='dark'] .checkout-page__option {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
}

[data-bs-theme='dark'] .checkout-page__summary {
  border-color: rgba(255, 255, 255, 0.1) !important;
}

[data-bs-theme='dark'] .checkout-page__total {
  background: rgba(var(--ar-primary-rgb, 239, 83, 80), 0.15);
}

.checkout-page__card-panel {
  background: rgba(var(--ar-primary-rgb, 198, 40, 40), 0.06);
  border-color: rgba(0, 0, 0, 0.08) !important;
}

[data-bs-theme='dark'] .checkout-page__card-panel {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.checkout-card-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1080;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.checkout-card-modal {
  max-width: 420px;
  width: 100%;
  border-radius: 1rem;
}
</style>
