<template>
    <section class="shop-single">
        <!-- Fil d'Ariane -->
        <nav class="breadcrumb-wrap" aria-label="Fil d'Ariane">
            <div class="container">
                <ol class="breadcrumb breadcrumb-product mb-0 py-3 py-lg-4">
                    <li class="breadcrumb-item"><router-link to="/">Accueil</router-link></li>
                    <li class="breadcrumb-item"><router-link to="/catalog">Catalogue</router-link></li>
                    <li
                      v-if="product"
                      class="breadcrumb-item active"
                      aria-current="page"
                    >
                      <span class="breadcrumb-product-title">{{ product.name }}</span>
                    </li>
                </ol>
            </div>
        </nav>

        <div class="container container-product py-4 py-lg-5">
            <!-- Chargement -->
            <div v-if="loading" class="product-loading text-center py-5">
                <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Chargement...</span>
                </div>
                <p class="text-body-secondary mb-0">Chargement des détails du produit...</p>
            </div>

            <!-- Erreur -->
            <div v-else-if="error" class="product-error text-center py-5">
                <div class="alert-product alert alert-light border shadow-sm rounded-3 py-4 px-4 mx-auto" style="max-width: 420px;">
                    <i class="ai-alert-circle fs-1 text-danger d-block mb-3"></i>
                    <p class="mb-3">{{ error }}</p>
                    <router-link to="/catalog" class="btn btn-primary rounded-pill px-4">
                        Retour au catalogue
                    </router-link>
                </div>
            </div>

            <!-- Contenu produit -->
            <div v-else-if="product" class="product-layout">
                <div class="row g-4 g-lg-5">
                    <!-- Colonne images -->
                    <div class="col-lg-6">
                        <div class="product-media">
                            <div class="product-image-wrapper rounded-3 overflow-hidden bg-light">
                                <img
                                    :src="mainProductImage || placeholderImage"
                                    :alt="product.name"
                                    class="product-main-image"
                                />
                            </div>
                            <!-- Galerie miniatures -->
                            <div v-if="productGallery.length > 1" class="product-gallery mt-3">
                                <button
                                    v-for="(img, idx) in productGallery"
                                    :key="idx"
                                    type="button"
                                    class="gallery-thumb rounded-2 overflow-hidden"
                                    :class="{ active: currentGalleryIndex === idx }"
                                    @click="currentGalleryIndex = idx"
                                >
                                    <img :src="img" :alt="`${product.name} - ${idx + 1}`" />
                                </button>
                            </div>
                            <!-- Vidéo -->
                            <div v-if="product.video" class="product-video-wrapper rounded-3 overflow-hidden mt-3 bg-dark">
                                <video class="w-100" controls>
                                    <source :src="product.video" type="video/mp4" />
                                </video>
                            </div>
                        </div>
                    </div>

                    <!-- Colonne infos + actions -->
                    <div class="col-lg-6">
                        <div class="product-info-card position-lg-sticky product-info-sticky-lg">
                            <h1 class="product-title">{{ product.name }}</h1>
                            <div class="product-price-block mb-3">
                                <span class="product-price">{{ formatPrice(product.price) }}</span>
                                <del v-if="product.oldPrice" class="product-old-price ms-2">{{ formatPrice(product.oldPrice) }}</del>
                                <span v-if="product.sale" class="badge bg-danger ms-2">Promo</span>
                            </div>
                            <p class="product-description">{{ product.description }}</p>

                            <!-- Vendeur (ligne compacte) -->
                            <div v-if="sellerDisplayName" class="product-seller-ref mb-4">
                                <span class="text-body-secondary small">Vendu par</span>
                                <router-link
                                    v-if="product.sellerId"
                                    :to="sellerCatalogLink"
                                    class="fw-semibold ms-1"
                                >{{ sellerDisplayName }}</router-link>
                                <span v-else class="fw-semibold ms-1">{{ sellerDisplayName }}</span>
                            </div>

                            <!-- Quantité + Panier -->
                            <div class="product-actions border-top border-bottom py-4 my-4">
                                <div class="quantity-row d-flex align-items-center flex-wrap gap-3">
                                    <div class="quantity-selector d-flex align-items-center rounded-3 border bg-light overflow-hidden">
                                        <button type="button" class="btn qty-btn" @click="decrementQuantity" aria-label="Diminuer">−</button>
                                        <input type="number" class="qty-input" :value="quantity" readonly min="1" aria-label="Quantité">
                                        <button type="button" class="btn qty-btn" @click="incrementQuantity" aria-label="Augmenter">+</button>
                                    </div>
                                    <button type="button" class="btn btn-add-cart flex-grow-1 flex-lg-grow-0" @click="addToCart">
                                        <i class="ai-cart me-2"></i>Ajouter au panier
                                    </button>
                                </div>
                            </div>

                            <!-- Carte vendeur -->
                            <div v-if="sellerDisplayName" class="seller-card rounded-3 p-3 p-md-4">
                                <div class="d-flex align-items-center flex-wrap gap-3">
                                    <div class="seller-avatar rounded-circle flex-shrink-0 overflow-hidden">
                                        <img
                                            v-if="sellerPhotoUrl"
                                            :src="sellerPhotoUrl"
                                            alt=""
                                            class="seller-avatar-img"
                                        />
                                        <span v-else class="seller-initials">{{ sellerInitials }}</span>
                                    </div>
                                    <div class="seller-info flex-grow-1 min-w-0">
                                        <div class="small text-body-secondary">Vendu par</div>
                                        <router-link
                                            v-if="product.sellerId"
                                            :to="sellerCatalogLink"
                                            class="seller-name fw-semibold text-body text-decoration-none"
                                        >{{ sellerDisplayName }}</router-link>
                                        <div v-else class="seller-name fw-semibold">{{ sellerDisplayName }}</div>
                                    </div>
                                    <div class="seller-actions d-flex flex-wrap gap-2 flex-shrink-0 align-items-center">
                                        <button
                                            v-if="canFollowSeller"
                                            type="button"
                                            class="btn btn-primary btn-sm rounded-pill px-3"
                                            @click="toggleSellerFollow"
                                        >
                                            {{ isFollowingSeller ? 'Abonné' : 'Suivre' }}
                                        </button>
                                        <router-link
                                            v-else-if="!currentUser && product.sellerId"
                                            :to="{ path: '/sign-in', query: { redirect: $route.fullPath } }"
                                            class="btn btn-outline-primary btn-sm rounded-pill px-3"
                                        >
                                            Se connecter pour suivre
                                        </router-link>
                                        <span v-else-if="currentUser && !isClientUser" class="small text-body-secondary">
                                            Réservé aux comptes clients
                                        </span>
                                        <router-link :to="sellerCatalogLink" class="btn btn-outline-primary btn-sm rounded-pill px-3">
                                            Voir les annonces
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Avis clients (commentaires) -->
                <div v-if="product" class="reviews-section mt-5 pt-5 border-top">
                    <h2 class="section-title h5 mb-4">Avis clients</h2>
                    <!-- Résumé des notes -->
                    <div class="reviews-summary rounded-3 p-4 mb-4">
                        <div class="d-flex flex-wrap align-items-center gap-4">
                            <div class="reviews-stars-display">
                                <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= Math.round(reviewStats.average) }">★</span>
                            </div>
                            <div>
                                <div class="reviews-average">{{ formatReviewScore(reviewStats.average) }} sur 5</div>
                                <div class="text-body-secondary small">{{ reviewStats.count }} Commentaire{{ reviewStats.count !== 1 ? 's' : '' }}</div>
                            </div>
                        </div>
                    </div>
                    <!-- Formulaire d'ajout d'avis (utilisateur connecté) -->
                    <div v-if="currentUser && !submittingReview" class="review-form-card rounded-3 p-4 mb-4 border">
                        <h3 class="h6 mb-3">Laisser un avis</h3>
                        <form @submit.prevent="submitReview">
                            <div class="mb-3">
                                <label class="form-label small">Note</label>
                                <div class="d-flex gap-1">
                                    <button v-for="i in 5" :key="i" type="button" class="btn btn-star-input" :class="{ active: reviewForm.rating >= i }" @click="reviewForm.rating = i">
                                        ★
                                    </button>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label small">Votre commentaire</label>
                                <textarea v-model="reviewForm.comment" class="form-control" rows="3" placeholder="Partagez votre expérience..." required></textarea>
                            </div>
                            <div class="row g-2 mb-3">
                                <div class="col-md-6">
                                    <label class="form-label small">Couleur (optionnel)</label>
                                    <input v-model="reviewForm.productColor" type="text" class="form-control form-control-sm" placeholder="ex. Noir">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small">Taille (optionnel)</label>
                                    <input v-model="reviewForm.productSize" type="text" class="form-control form-control-sm" placeholder="ex. M">
                                </div>
                            </div>
                            <div class="form-check mb-3">
                                <input v-model="reviewForm.verifiedPurchase" type="checkbox" class="form-check-input" id="verifiedPurchase">
                                <label class="form-check-label small" for="verifiedPurchase">Achat vérifié</label>
                            </div>
                            <button type="submit" class="btn btn-primary rounded-pill px-4" :disabled="!reviewForm.comment.trim()">
                                Publier mon avis
                            </button>
                        </form>
                    </div>
                    <div v-else-if="!currentUser" class="alert alert-light border mb-4 small">
                        <router-link to="/sign-in">Connectez-vous</router-link> pour laisser un avis.
                    </div>
                    <!-- Liste des avis -->
                    <div v-if="loadingReviews" class="text-center py-4">
                        <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                    </div>
                    <div v-else-if="reviews.length === 0" class="text-body-secondary small py-3">
                        Aucun avis pour le moment. Soyez le premier à donner votre avis !
                    </div>
                    <div v-else class="reviews-list">
                        <article v-for="r in reviews" :key="r.id" class="review-card rounded-3 p-3 p-md-4 mb-3 border">
                            <div class="d-flex gap-3">
                                <div class="review-avatar rounded-circle flex-shrink-0">
                                    {{ r.userInitials }}
                                </div>
                                <div class="flex-grow-1 min-w-0">
                                    <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
                                        <span class="fw-semibold">{{ r.userName }}</span>
                                        <span class="badge bg-secondary bg-opacity-75 small">TN</span>
                                        <div class="review-rating-stars small">
                                            <span v-for="i in 5" :key="i" class="star-small" :class="{ filled: i <= r.rating }">★</span>
                                        </div>
                                    </div>
                                    <p class="review-comment mb-2">{{ r.comment }}</p>
                                    <div v-if="r.productColor || r.productSize" class="small text-body-secondary mb-2">
                                        <span v-if="r.productColor">Couleur: {{ r.productColor }}</span>
                                        <span v-if="r.productColor && r.productSize"> / </span>
                                        <span v-if="r.productSize">Taille: {{ r.productSize }}</span>
                                    </div>
                                    <div class="d-flex flex-wrap align-items-center gap-3 small text-body-secondary">
                                        <span>{{ formatReviewDate(r.createdAt) }}</span>
                                        <span v-if="r.verifiedPurchase" class="text-success">
                                            ✓ Achat vérifié
                                        </span>
                                        <button type="button" class="btn btn-link btn-sm p-0 text-body-secondary" @click="markHelpful(r.id)">
                                            Utile ? ({{ r.helpfulCount }})
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                    <p class="small text-body-secondary mt-3">*Il peut y avoir des variations dues à la lumière.</p>
                </div>

                <!-- Produits de la même catégorie -->
                <div v-if="product && (sameCategoryProducts.length > 0 || loadingSameCategory)" class="same-category-section mt-5 pt-5 border-top">
                    <h2 class="section-title h5 mb-4">Produits de la même catégorie</h2>
                    <div v-if="loadingSameCategory" class="text-center py-4">
                        <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                    </div>
                    <div v-else class="same-category-grid">
                        <router-link
                            v-for="p in sameCategoryProducts"
                            :key="p.id"
                            :to="`/shop-single/${p.id}`"
                            class="suggestion-card rounded-3 overflow-hidden"
                        >
                            <div class="suggestion-card-image">
                                <img :src="getSuggestionImage(p)" :alt="p.name" />
                            </div>
                            <div class="suggestion-card-body">
                                <h3 class="suggestion-card-title">{{ p.name }}</h3>
                                <span class="suggestion-card-price">{{ formatPrice(p.price) }}</span>
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>

            <!-- Produit introuvable -->
            <div v-else class="text-center py-5">
                <p class="text-body-secondary mb-3">Produit introuvable.</p>
                <router-link to="/catalog" class="btn btn-primary rounded-pill">Retour au catalogue</router-link>
            </div>
        </div>
    </section>
</template>

<script>
import axios from 'axios';
import { addToCart as addToCartApi } from '../../utils/cart';
import { showToast } from '../../utils/toast';

export default {
    name: "ShopSingle",
    props: {
        id: {
            type: String,
            required: false
        }
    },
    data() {
        return {
            apiBase: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000',
            product: null,
            loading: false,
            error: null,
            quantity: 1,
            currentGalleryIndex: 0,
            isFollowingSeller: false,
            sameCategoryProducts: [],
            loadingSameCategory: false,
            reviews: [],
            reviewStats: { average: 0, count: 0 },
            loadingReviews: false,
            reviewForm: { rating: 5, comment: '', productColor: '', productSize: '', verifiedPurchase: false },
            submittingReview: false,
            quickPrompts: [
                'Top discounts',
                'Gifts under $50',
                'Best in electronics'
            ]
        }
    },
    computed: {
        chatStorageKey() {
            if (!this.product) return null;
            return `chatThread_${this.product.id}`;
        },
        sellerDisplayName() {
            // Nom du vendeur importé du backend (sellerName ou relation seller)
            if (this.product?.sellerName) return this.product.sellerName;
            const s = this.product?.seller;
            if (s) {
                const name = [s.firstName, s.lastName].filter(Boolean).join(' ').trim();
                return name || s.email || '';
            }
            return '';
        },
        sellerInitials() {
            if (!this.sellerDisplayName) return '';
            return this.sellerDisplayName
                .split(' ')
                .filter(Boolean)
                .map(part => part[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
        },
        sellerCatalogLink() {
            if (!this.product?.sellerId) return '/catalog';
            return { name: 'SellerStore', params: { sellerId: String(this.product.sellerId) } };
        },
        sellerPhotoUrl() {
            const p = this.product?.sellerPhoto;
            return p && typeof p === 'string' ? p : null;
        },
        productGallery() {
            if (!this.product) return [];
            const images = this.product.images;
            if (images && Array.isArray(images) && images.length > 0) {
                return images.map((img) => (img && img.url) || (typeof img === 'string' ? img : '')).filter(Boolean);
            }
            if (this.product.image) return [this.product.image];
            return [];
        },
        mainProductImage() {
            const g = this.productGallery;
            if (g.length === 0) return '';
            const idx = Math.min(this.currentGalleryIndex, g.length - 1);
            return g[idx] || g[0];
        },
        placeholderImage() {
            return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkF1Y3VuZSBpbWFnZTwvdGV4dD48L3N2Zz4=';
        },
        currentUser() {
            try {
                const u = localStorage.getItem('currentUser');
                return u ? JSON.parse(u) : null;
            } catch {
                return null;
            }
        },
        isClientUser() {
            return (this.currentUser?.role || '').toLowerCase() === 'client';
        },
        canFollowSeller() {
            if (!this.product?.sellerId || !this.currentUser || !this.isClientUser) return false;
            return this.currentUser.id !== this.product.sellerId;
        },
    },
    methods: {
        getAuthHeaders() {
            const token = localStorage.getItem('authToken');
            return token ? { Authorization: `Bearer ${token}` } : {};
        },

        async fetchProductById() {
            this.loading = true;
            this.error = null;
            try {
                const productId = this.id || this.$route.params.id;
                
                if (!productId) {
                    this.error = 'Product ID is missing';
                    return;
                }

                const response = await axios.get(
                    `${this.apiBase}/products/${productId}`,
                    { headers: this.getAuthHeaders() }
                );
                this.product = response.data;
                this.currentGalleryIndex = 0;
                await this.loadSellerFollowState();
                this.fetchSameCategoryProducts();
                this.fetchReviews();

                if (!this.product) {
                    this.error = 'Product not found';
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                this.error = 'Failed to fetch product details. Please try again.';
            } finally {
                this.loading = false;
            }
        },
        
        incrementQuantity() {
            this.quantity++;
        },
        
        decrementQuantity() {
            if (this.quantity > 1) {
                this.quantity--;
            }
        },
        
        async addToCart() {
            if (!this.product) return;
            const qty = Math.max(1, parseInt(this.quantity, 10) || 1);
            const productSnapshot = {
                id: this.product.id,
                name: this.product.name,
                price: this.product.price,
                oldPrice: this.product.oldPrice ?? null,
                image: this.mainProductImage || this.product.image,
                images: this.product.images,
            };
            try {
                await addToCartApi(axios, this.product.id, qty, productSnapshot);
                this.$nextTick(() => {
                    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cart-updated'));
                });
                showToast(
                    `${qty} × ${this.product.name} ajouté au panier`,
                    'success',
                    3500,
                    { title: 'Panier' },
                );
            } catch (err) {
                showToast('Impossible d\'ajouter au panier. Réessayez.', 'error');
            }
        },

        async loadSellerFollowState() {
            if (!this.product?.sellerId) {
                this.isFollowingSeller = false;
                return;
            }
            if (!this.currentUser || !this.isClientUser) {
                this.isFollowingSeller = false;
                return;
            }
            try {
                const response = await axios.get(
                    `${this.apiBase}/followers/status/${this.product.sellerId}`,
                    { headers: this.getAuthHeaders() },
                );
                this.isFollowingSeller = !!response.data?.following;
            } catch (error) {
                console.error('Unable to load follow status', error);
                this.isFollowingSeller = false;
            }
        },

        async toggleSellerFollow() {
            if (!this.product?.sellerId || !this.canFollowSeller) return;
            try {
                if (this.isFollowingSeller) {
                    await axios.delete(
                        `${this.apiBase}/followers/by-seller/${this.product.sellerId}`,
                        { headers: this.getAuthHeaders() },
                    );
                    this.isFollowingSeller = false;
                } else {
                    await axios.post(
                        `${this.apiBase}/followers`,
                        { sellerId: this.product.sellerId },
                        { headers: this.getAuthHeaders() },
                    );
                    this.isFollowingSeller = true;
                }
            } catch (error) {
                console.error('Unable to update follow', error);
                if (typeof alert === 'function') {
                    alert("Impossible de mettre à jour l'abonnement. Réessayez.");
                }
            }
        },

        formatPrice(price) {
            if (price == null || price === '') return '—';
            const num = typeof price === 'string' ? parseFloat(price) : Number(price);
            if (isNaN(num)) return '—';
            return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num) + ' DT';
        },

        async fetchSameCategoryProducts() {
            const categoryId = this.product?.categoryId ?? this.product?.category;
            if (categoryId == null) return;
            this.loadingSameCategory = true;
            try {
                const res = await axios.get(`${this.apiBase}/products`, {
                    params: { categoryId },
                    headers: this.getAuthHeaders(),
                });
                const list = Array.isArray(res.data) ? res.data : [];
                const currentId = this.product?.id;
                this.sameCategoryProducts = list
                    .filter((p) => p.id !== currentId)
                    .slice(0, 8);
            } catch (err) {
                console.warn('Same category products:', err);
                this.sameCategoryProducts = [];
            } finally {
                this.loadingSameCategory = false;
            }
        },

        getSuggestionImage(p) {
            if (p?.images?.length && p.images[0]?.url) return p.images[0].url;
            if (typeof p?.image === 'string') return p.image;
            return this.placeholderImage;
        },

        async fetchReviews() {
            const productId = this.product?.id;
            if (!productId) return;
            this.loadingReviews = true;
            try {
                const res = await axios.get(`${this.apiBase}/reviews/product/${productId}`, { headers: this.getAuthHeaders() });
                this.reviews = res.data?.reviews ?? [];
                this.reviewStats = res.data?.stats ?? { average: 0, count: 0 };
            } catch (err) {
                console.warn('Fetch reviews:', err);
                this.reviews = [];
                this.reviewStats = { average: 0, count: 0 };
            } finally {
                this.loadingReviews = false;
            }
        },

        async submitReview() {
            if (!this.product?.id || !this.reviewForm.comment.trim()) return;
            this.submittingReview = true;
            try {
                await axios.post(
                    `${this.apiBase}/reviews`,
                    {
                        productId: this.product.id,
                        rating: this.reviewForm.rating,
                        comment: this.reviewForm.comment.trim(),
                        productColor: this.reviewForm.productColor.trim() || undefined,
                        productSize: this.reviewForm.productSize.trim() || undefined,
                        verifiedPurchase: this.reviewForm.verifiedPurchase,
                    },
                    { headers: this.getAuthHeaders() }
                );
                this.reviewForm = { rating: 5, comment: '', productColor: '', productSize: '', verifiedPurchase: false };
                await this.fetchReviews();
            } catch (err) {
                console.error('Submit review:', err);
                alert('Impossible de publier l\'avis. Réessayez plus tard.');
            } finally {
                this.submittingReview = false;
            }
        },

        async markHelpful(reviewId) {
            try {
                const res = await axios.post(`${this.apiBase}/reviews/${reviewId}/helpful`);
                const r = this.reviews.find((x) => x.id === reviewId);
                if (r && res.data?.helpfulCount != null) r.helpfulCount = res.data.helpfulCount;
            } catch (err) {
                console.warn('Mark helpful:', err);
            }
        },

        formatReviewScore(value) {
            if (value == null || isNaN(value)) return '0';
            return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);
        },

        formatReviewDate(dateStr) {
            if (!dateStr) return '';
            const d = new Date(dateStr);
            return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
        }
    },
    watch: {
        '$route.params.id'() {
            this.fetchProductById();
        }
    },
    created() {
        this.fetchProductById();
    },
    mounted() {
        window.__openProductChat = this.openChat;
        window.addEventListener('open-chatbot', this.openChat);
        window.addEventListener('toggle-chatbot', this.toggleChat);
    },
    beforeUnmount() {
        if (window.__openProductChat === this.openChat) {
            delete window.__openProductChat;
        }
        window.removeEventListener('open-chatbot', this.openChat);
        window.removeEventListener('toggle-chatbot', this.toggleChat);
    }
}
</script>

<style scoped>
.shop-single {
    min-height: 60vh;
    background: var(--ar-secondary-bg, #f8fafb);
}

.breadcrumb-wrap {
    background: var(--ar-body-bg, #fff);
    border-bottom: 1px solid var(--ar-border-color, #e9ecef);
    /* Marge sous la navbar : le padding du layout peut être léger sur certains viewports */
    padding-top: 0.25rem;
}

.breadcrumb-wrap .breadcrumb {
    background: none;
    padding: 0;
}

/* Le thème met .breadcrumb-item en flex + align-items:center ; overflow:hidden sur le <li> coupait les ascendants */
.breadcrumb-wrap .breadcrumb-product {
    align-items: center;
    row-gap: 0.25rem;
}

.breadcrumb-wrap .breadcrumb-item a {
    color: var(--ar-primary, #c62828);
    text-decoration: none;
}

.breadcrumb-wrap .breadcrumb-item a:hover {
    text-decoration: underline;
}

.breadcrumb-wrap .breadcrumb-item.active {
    color: var(--ar-body-color-secondary, #6c757d);
    min-width: 0;
    align-items: center;
}

.breadcrumb-wrap .breadcrumb-product-title {
    display: block;
    max-width: min(72vw, 28rem);
    overflow-x: hidden;
    overflow-y: visible;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.5;
    padding-block: 0.125em;
}

.container-product {
    max-width: 1100px;
}

/* Mise en page produit */
.product-media {
    position: relative;
}

.product-image-wrapper {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    border: 1px solid var(--ar-border-color, #e9ecef);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.product-main-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.product-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.gallery-thumb {
    width: 56px;
    height: 56px;
    padding: 0;
    border: 2px solid transparent;
    background: var(--ar-body-bg, #fff);
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.gallery-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.gallery-thumb:hover,
.gallery-thumb.active {
    border-color: var(--ar-primary, #c62828);
    box-shadow: 0 0 0 2px rgba(var(--ar-primary-rgb), 0.2);
}

.product-video-wrapper video {
    max-height: 320px;
    width: 100%;
    display: block;
}

/* Bloc infos produit */
.product-info-card {
    background: var(--ar-body-bg, #fff);
    border-radius: 1rem;
    padding: 1.625rem 1.25rem 1.5rem;
    border: 1px solid var(--ar-border-color, #e9ecef);
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
    overflow: visible;
}

@media (min-width: 992px) {
    .product-info-sticky-lg {
        top: var(--asmad-fixed-navbar-height, 7rem);
        align-self: flex-start;
        max-height: calc(100dvh - var(--asmad-fixed-navbar-height, 7rem) - 1.5rem);
        overflow-y: auto;
    }
}

.product-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--ar-emphasis-color, #1a1d21);
    margin-top: 0;
    margin-bottom: 0.5rem;
    line-height: 1.35;
    padding-top: 0.12em;
    overflow: visible;
}

.product-price-block {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
}

.product-price {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--ar-primary, #c62828);
}

.product-old-price {
    font-size: 1rem;
    color: var(--ar-body-color-secondary, #6c757d);
}

.product-description {
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--ar-body-color, #374151);
    margin-bottom: 0;
}

.product-seller-ref {
    font-size: 0.9rem;
}

/* Quantité + panier */
.quantity-selector {
    min-width: 130px;
}

.qty-btn {
    width: 44px;
    height: 44px;
    padding: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--ar-emphasis-color, #1a1d21);
    background: transparent;
    border: none;
    line-height: 1;
}

.qty-btn:hover {
    background: var(--ar-secondary-bg, #f1f3f5);
    color: var(--ar-primary, #c62828);
}

.qty-input {
    width: 48px;
    border: none;
    background: transparent;
    text-align: center;
    font-size: 1rem;
    font-weight: 600;
}

.btn-add-cart {
    background: var(--ar-primary, #c62828);
    color: #fff;
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    border-radius: 0.75rem;
    border: none;
    transition: background 0.2s, transform 0.15s;
}

.btn-add-cart:hover {
    background: #3a7762;
    color: #fff;
    transform: translateY(-1px);
}

/* Carte vendeur */
.seller-card {
    background: var(--ar-secondary-bg, #f8fafb);
    border: 1px solid var(--ar-border-color, #e9ecef);
}

.seller-avatar {
    width: 52px;
    height: 52px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--ar-primary, #c62828) 0%, rgba(var(--ar-primary-rgb), 0.85) 100%);
}

.seller-avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.seller-initials {
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.02em;
}

.seller-name {
    font-size: 1rem;
    color: var(--ar-emphasis-color, #1a1d21);
}

/* Avis clients */
.reviews-section .section-title {
    font-weight: 700;
    color: var(--ar-emphasis-color, #1a1d21);
}

.reviews-summary {
    background: var(--ar-secondary-bg, #f8fafb);
    border: 1px solid var(--ar-border-color, #e9ecef);
}

.reviews-stars-display .star {
    color: #dee2e6;
    font-size: 1.75rem;
}

.reviews-stars-display .star.filled {
    color: #ffc107;
}

.reviews-average {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--ar-emphasis-color, #1a1d21);
}

.review-form-card .btn-star-input {
    padding: 0.25rem 0.5rem;
    font-size: 1.5rem;
    color: #dee2e6;
    background: none;
    border: none;
    line-height: 1;
}

.review-form-card .btn-star-input.active,
.review-form-card .btn-star-input:hover {
    color: #ffc107;
}

.review-card {
    background: var(--ar-body-bg, #fff);
}

.review-avatar {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--ar-primary, #c62828) 0%, rgba(var(--ar-primary-rgb), 0.85) 100%);
    color: #fff;
    font-weight: 700;
    font-size: 0.95rem;
}

.review-rating-stars .star-small {
    color: #dee2e6;
}

.review-rating-stars .star-small.filled {
    color: #ffc107;
}

.review-comment {
    font-size: 0.95rem;
    line-height: 1.5;
    color: var(--ar-body-color, #374151);
    margin-bottom: 0;
}

/* Produits de la même catégorie */
.same-category-section .section-title {
    font-weight: 700;
    color: var(--ar-emphasis-color, #1a1d21);
}

.same-category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
}

@media (min-width: 576px) {
    .same-category-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (min-width: 992px) {
    .same-category-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 1.25rem;
    }
}

.suggestion-card {
    display: flex;
    flex-direction: column;
    background: var(--ar-body-bg, #fff);
    border: 1px solid var(--ar-border-color, #e9ecef);
    text-decoration: none;
    color: inherit;
    transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
}

.suggestion-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    border-color: var(--ar-primary, #c62828);
    color: inherit;
}

.suggestion-card-image {
    aspect-ratio: 1;
    background: var(--ar-secondary-bg, #f8fafb);
    overflow: hidden;
}

.suggestion-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.suggestion-card-body {
    padding: 0.75rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.suggestion-card-title {
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: var(--ar-emphasis-color, #1a1d21);
}

.suggestion-card-price {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--ar-primary, #c62828);
}

@media (max-width: 991.98px) {
    .product-info-card {
        padding: 1.25rem;
    }

    .product-title {
        font-size: 1.35rem;
    }

    .product-price {
        font-size: 1.5rem;
    }
}
</style>
