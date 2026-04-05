<template>
  
        <!-- Hero — crème, texte à gauche / logo à droite (logo en haut sur mobile) -->
        <section class="hero-asmad-band" aria-label="Bienvenue">
            <div class="hero-asmad-pattern hero-asmad-pattern--left" aria-hidden="true"></div>
            <div class="hero-asmad-pattern hero-asmad-pattern--bottom" aria-hidden="true"></div>
            <div class="hero-asmad-texture" aria-hidden="true"></div>
            <div class="container position-relative py-5">
                <div class="row align-items-center justify-content-center g-4 g-lg-5">
                    <div class="col-12 col-lg-6 order-2 order-lg-1">
                        <div class="hero-asmad-text-inner px-2 px-lg-0 text-center text-lg-start">
                            <h1 class="hero-asmad-title mb-0">
                                Un seul marché. Mille possibilités.
                            </h1>
                            <p class="hero-asmad-stat mb-0 mt-3">
                                +200 artisans tunisiens
                            </p>
                            <p class="hero-asmad-lead mb-0 mt-2">
                                Produits d'exception, directement de Tunisie.
                            </p>
                            <router-link class="btn hero-btn-explore btn-lg mt-4" to="/catalog">
                                Explorer maintenant
                            </router-link>
                        </div>
                    </div>
                    <div class="col-12 col-lg-6 order-1 order-lg-2">
                        <div class="hero-asmad-logo-panel d-flex justify-content-center align-items-center py-2 py-lg-4">
                            <div class="hero-asmad-logo-wrap">
                                <AsmadLogo :icon-size="150" :hide-tagline="false" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- À propos d'Asmad -->
        <section class="container py-5 my-lg-3 my-xl-4">
            <div class="row justify-content-center">
                <div class="col-lg-10 col-xl-8 text-center">
                    <h2 class="h2 mb-4">Comment ça fonctionne ?</h2>
                    <p class="lead text-body-secondary mb-4">
                        Asmad est une marketplace en ligne où des vendeurs s'inscrivent sur notre plateforme 
                        et publient leurs annonces de produits ou services. 
                        Des milliers de choix, un seul marché.
                    </p>
                    <div class="row g-4 mt-3">
                <div class="col-md-4">
                            <div class="text-center">
                                <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
                                    <i class="ai-user-plus fs-2 text-primary"></i>
                        </div>
                                <h4 class="h5 mb-2">Vendeurs s'inscrivent</h4>
                                <p class="small text-body-secondary mb-0">Les vendeurs créent leur compte et rejoignent la plateforme</p>
                </div>
                        </div>
                        <div class="col-md-4">
                            <div class="text-center">
                                <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
                                    <i class="ai-file-plus fs-2 text-primary"></i>
                                </div>
                                <h4 class="h5 mb-2">Ils publient des annonces</h4>
                                <p class="small text-body-secondary mb-0">Les vendeurs créent et publient leurs annonces de produits</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="text-center">
                                <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
                                    <i class="ai-search fs-2 text-primary"></i>
                                </div>
                                <h4 class="h5 mb-2">Vous découvrez</h4>
                                <p class="small text-body-secondary mb-0">Parcourez les annonces et trouvez ce qui vous intéresse</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Produits en direct (API) -->
        <section class="container py-5 my-lg-3 my-xl-4">
            <div class="text-center mb-4">
                <h2 class="h2 mb-2">Sélection du moment</h2>
                <p class="text-body-secondary mb-0">
                    Découvrez les dernières annonces — chaque fiche affiche le badge
                    <span class="text-primary fw-semibold">100&nbsp;% tunisien</span>.
                </p>
            </div>

            <div class="text-center py-5" v-if="loading">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Chargement...</span>
                </div>
                <p class="mt-3 text-body-secondary mb-0">Chargement des annonces…</p>
            </div>

            <div class="alert alert-danger" v-else-if="loadError" role="alert">
                {{ loadError }}
            </div>

            <div v-else>
                <div class="row g-4" v-if="featuredProducts.length">
                    <div
                        v-for="product in featuredProducts"
                        :key="product.id"
                        class="col-6 col-md-4 col-lg-3"
                    >
                        <div class="card h-100 border-0 shadow-sm home-product-card position-relative">
                            <span class="badge home-badge-tn-product position-absolute top-0 start-0 m-2 z-1">100&nbsp;% TN</span>
                            <div class="ratio ratio-1x1 bg-body-secondary overflow-hidden rounded-top">
                                <img
                                    :src="getMainImage(product)"
                                    :alt="product.name"
                                    class="object-fit-cover w-100 h-100"
                                    loading="lazy"
                                    @error="handleImageError"
                                />
                            </div>
                            <div class="card-body d-flex flex-column">
                                <h3 class="h6 card-title mb-1">{{ truncateText(product.name, 48) }}</h3>
                                <p class="small text-body-secondary flex-grow-1 mb-2">{{ truncateText(product.description, 70) }}</p>
                                <div class="d-flex align-items-center justify-content-between gap-2 mt-auto">
                                    <span class="fw-semibold text-primary">{{ formatPrice(product.price) }}</span>
                                    <button
                                        type="button"
                                        class="btn btn-sm btn-primary rounded-pill position-relative z-2"
                                        @click.stop="addProductToCart(product)"
                                    >
                                        Panier
                                    </button>
                                </div>
                                <router-link
                                    :to="'/shop-single/' + product.id"
                                    class="btn btn-link btn-sm p-0 mt-1 align-self-start position-relative z-2"
                                >
                                    Voir l’annonce
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
                <p class="text-center text-body-secondary mb-0" v-else>
                    Aucune annonce pour le moment.
                    <router-link to="/catalog" class="fw-medium">Parcourir le catalogue</router-link>
                </p>

                <div class="text-center mt-4" v-if="promoProducts.length">
                    <h3 class="h5 mb-3">Promotions</h3>
                    <div class="row g-3 justify-content-center">
                        <div
                            v-for="product in promoProducts"
                            :key="'promo-' + product.id"
                            class="col-6 col-md-4 col-lg-3"
                        >
                            <div class="card border-0 shadow-sm h-100 home-product-card position-relative">
                                <span class="badge bg-danger position-absolute top-0 end-0 m-2 z-1">Promo</span>
                                <span class="badge home-badge-tn-product position-absolute top-0 start-0 m-2 z-1">100&nbsp;% TN</span>
                                <div class="ratio ratio-4x3 bg-body-secondary overflow-hidden rounded-top">
                                    <img
                                        :src="getMainImage(product)"
                                        :alt="product.name"
                                        class="object-fit-cover w-100 h-100"
                                        loading="lazy"
                                        @error="handleImageError"
                                    />
                                </div>
                                <div class="card-body py-3">
                                    <h4 class="h6 mb-1">{{ truncateText(product.name, 40) }}</h4>
                                    <div class="d-flex align-items-baseline gap-2">
                                        <span class="fw-semibold text-primary">{{ formatPrice(effectivePrice(product)) }}</span>
                                        <span v-if="hasDiscount(product)" class="small text-body-secondary text-decoration-line-through">{{ formatPrice(product.price) }}</span>
                                    </div>
                                    <router-link
                                        :to="'/shop-single/' + product.id"
                                        class="btn btn-outline-primary btn-sm w-100 mt-2 rounded-pill"
                                    >
                                        Voir l’annonce
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>


        <!-- Catégories — fond pastel, cartes avec icônes -->
        <section class="categories-hero-section position-relative overflow-hidden">
            <div class="categories-blobs" aria-hidden="true">
                <div class="categories-blob categories-blob--lavender"></div>
                <div class="categories-blob categories-blob--rose"></div>
                <div class="categories-blob categories-blob--sky"></div>
            </div>
            <div class="container position-relative z-2 categories-section-inner py-5">
                <div class="row justify-content-center">
                    <div class="col-12 col-xl-10 text-center">
                        <h2 class="categories-section-heading mb-3 mb-lg-4">
                            Explorez les catégories
                        </h2>
                        <p class="categories-lead mb-2">
                            Découvrez une multitude d'annonces organisées par catégories.
                        </p>
                        <p class="categories-lead categories-lead--muted mb-4 mb-lg-5">
                            Chaque catégorie regroupe les offres de nos vendeurs partenaires.
                        </p>
                        <router-link
                            class="btn btn-primary btn-lg px-4 px-md-5 py-3 rounded-pill categories-cta-btn"
                            to="/catalog"
                        >
                            Voir toutes les catégories
                            <i class="ai-arrow-right ms-2 categories-cta-btn__icon" aria-hidden="true"></i>
                        </router-link>

                        <div
                            class="row g-3 g-md-4 justify-content-center mt-5 pt-1 pt-lg-2"
                            v-if="categoriesPreview.length"
                        >
                            <div
                                v-for="(cat, idx) in categoriesPreview"
                                :key="cat.id"
                                class="col-6 col-sm-4 col-md-4 col-lg-3 col-xl-2"
                            >
                                <router-link
                                    :to="{ path: '/catalog', query: { categoryId: String(cat.id) } }"
                                    class="home-category-card text-decoration-none d-flex flex-column align-items-center h-100"
                                    :class="'home-category-card--accent-' + (idx % 6)"
                                >
                                    <span class="home-category-card__icon-wrap">
                                        <i
                                            class="home-category-card__icon"
                                            :class="categoryIconFor(cat.label)"
                                            aria-hidden="true"
                                        ></i>
                                    </span>
                                    <span class="home-category-card__label">{{ cat.label }}</span>
                                    <span
                                        class="home-category-card__meta"
                                        v-if="cat.numberOfProducts != null"
                                    >
                                        {{ cat.numberOfProducts }} annonce{{
                                            cat.numberOfProducts !== 1 ? 's' : ''
                                        }}
                                    </span>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>







        <!-- Features (carousel on screens < 992px) -->
        <section class="container py-5 mt-2 mb-3 mt-sm-3 mb-sm-4 my-md-4 my-lg-5">
            <div class="swiper home-features-swiper pb-xxl-4 mb-xl-2">
                <div class="swiper-wrapper">

                    <!-- Item -->
                    <div class="swiper-slide text-center text-sm-start">
                        <div class="text-primary mb-3 mb-sm-4">
                            <i class="ai-user-check fs-1"></i>
                        </div>
                        <h3 class="h5 mb-2 mb-sm-3">Vendeurs vérifiés</h3>
                        <p class="fs-sm mb-0">Tous nos vendeurs sont inscrits et vérifiés sur la plateforme pour votre sécurité</p>
                    </div>

                    <!-- Item-->
                    <div class="swiper-slide text-center text-sm-start">
                        <div class="text-primary mb-3 mb-sm-4">
                            <i class="ai-grid fs-1"></i>
                        </div>
                        <h3 class="h5 mb-2 mb-sm-3">Annonces variées</h3>
                        <p class="fs-sm mb-0">Découvrez une grande variété d'annonces publiées par nos vendeurs partenaires</p>
                    </div>

                    <!-- Item -->
                    <div class="swiper-slide text-center text-sm-start">
                        <div class="text-primary mb-3 mb-sm-4">
                            <i class="ai-search fs-1"></i>
                        </div>
                        <h3 class="h5 mb-2 mb-sm-3">Recherche facile</h3>
                        <p class="fs-sm mb-0">Trouvez rapidement ce que vous cherchez grâce à nos filtres par catégorie et marché</p>
                    </div>

                    <!-- Item -->
                    <div class="swiper-slide text-center text-sm-start">
                        <div class="text-primary mb-3 mb-sm-4">
                            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <path d="M35.1422 8.0989L20.1085 0.0881401C19.8855 -0.0308936 19.6182 -0.0292231 19.3968 0.0923166L4.77905 8.10308C4.53931 8.23464 4.39062 8.48607 4.39062 8.75964V19.2237C4.3994 27.8255 9.49571 35.6074 17.377 39.0535L19.406 39.9377C19.5956 40.0204 19.8115 40.0208 20.0016 39.9385L22.2879 38.9512C30.3153 35.5798 35.5378 27.7228 35.5386 19.0162V8.75964C35.5386 8.48315 35.3862 8.22879 35.1422 8.0989ZM34.0417 19.0162C34.04 27.1226 29.1764 34.4371 21.7019 37.5742L21.6969 37.5767L19.7059 38.4362L17.9759 37.6815C10.6397 34.4738 5.89546 27.2307 5.88711 19.2237V9.20278L19.7614 1.59882L34.0417 9.20821V19.0162Z" fill="currentColor"></path>
                  <path d="M14.2398 18.7389C13.9713 18.4244 13.4989 18.3873 13.1844 18.6558C12.8699 18.924 12.8327 19.3967 13.1013 19.7108L17.0549 24.3406C17.3188 24.6497 17.7812 24.6919 18.0961 24.4354L27.3039 16.9442C27.6247 16.6836 27.6731 16.2121 27.4121 15.8913C27.1514 15.571 26.6799 15.5221 26.3591 15.7831L17.7185 22.8124L14.2398 18.7389Z" fill="currentColor"></path>
                </svg>
                        </div>
                        <h3 class="h5 mb-2 mb-sm-3">Plateforme sécurisée</h3>
                        <p class="fs-sm mb-0">Asmad garantit une expérience sécurisée pour tous les utilisateurs de la marketplace</p>
                    </div>
                </div>

                <!-- Pagination (Bullets) -->
                <div class="swiper-pagination position-relative bottom-0 pt-1 mt-4 d-lg-none"></div>
            </div>
        </section>






   
</template>
<script>
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import axios from 'axios';
import { addToCart as addToCartApi } from '../../utils/cart';
import { toast } from '../../utils/toast';
import AsmadLogo from '../../components/AsmadLogo.vue';

const API_BASE = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';

export default {
    name: "HomeUser",
    components: { AsmadLogo },
    data() {
        return {
            apiBase: API_BASE,
            products: [],
            categories: [],
            loading: true,
            loadError: null,
            swiperInstance: null,
        };
    },
    computed: {
        featuredProducts() {
            const list = Array.isArray(this.products) ? [...this.products] : [];
            return list.slice(0, 8);
        },
        promoProducts() {
            const list = Array.isArray(this.products) ? this.products : [];
            return list
                .filter((p) => this.normalizePrice(p.discount) > 0)
                .slice(0, 4);
        },
        categoriesPreview() {
            const list = Array.isArray(this.categories) ? this.categories : [];
            return list.slice(0, 6);
        },
    },
    async mounted() {
        await this.loadHomeData();
        this.$nextTick(() => this.initFeatureSwiper());
    },
    beforeUnmount() {
        if (this.swiperInstance && typeof this.swiperInstance.destroy === 'function') {
            this.swiperInstance.destroy(true, true);
            this.swiperInstance = null;
        }
    },
    methods: {
        async loadHomeData() {
            this.loading = true;
            this.loadError = null;
            try {
                const [catRes, prodRes] = await Promise.all([
                    axios.get(`${this.apiBase}/categories`),
                    axios.get(`${this.apiBase}/products`),
                ]);
                this.categories = Array.isArray(catRes.data)
                    ? catRes.data
                    : catRes.data?.data || [];
                const raw = Array.isArray(prodRes.data)
                    ? prodRes.data
                    : prodRes.data?.data || prodRes.data?.products || [];
                this.products = raw.map((product) => ({
                    ...product,
                    price: this.normalizePrice(product.price),
                }));
            } catch (e) {
                console.error(e);
                this.loadError = 'Impossible de charger les annonces. Vérifiez que le serveur est disponible.';
                this.products = [];
                this.categories = [];
            } finally {
                this.loading = false;
            }
        },

        initFeatureSwiper() {
            if (this.swiperInstance && typeof this.swiperInstance.destroy === 'function') {
                this.swiperInstance.destroy(true, true);
                this.swiperInstance = null;
            }
            const el = this.$el?.querySelector?.('.home-features-swiper');
            if (!el) return;
            const paginationEl = el.querySelector('.swiper-pagination');
            const options = {
                slidesPerView: 1,
                spaceBetween: 24,
                loop: true,
                breakpoints: {
                    500: { slidesPerView: 2 },
                    860: { slidesPerView: 3 },
                    1200: { slidesPerView: 4 },
                },
            };
            if (paginationEl) {
                options.pagination = { el: paginationEl, clickable: true };
            }
            this.swiperInstance = new Swiper(el, options);
        },

        categoryIconFor(label) {
            const s = String(label || '').toLowerCase();
            if (/animaux|animal|chien|chat/.test(s)) return 'ai-heart';
            if (/beaut|santé|cosm|soin/.test(s)) return 'ai-award';
            if (/bébé|bebe|enfant|puériculture/.test(s)) return 'ai-heart';
            if (/électron|electron|tech|informat|téléphone|telephone|mobile|ordi/.test(s)) return 'ai-chip';
            if (/emploi|travail|job|carri/.test(s)) return 'ai-briefcase';
            if (/maison|jardin|meuble|déco|deco/.test(s)) return 'ai-home';
            if (/mode|vêtement|vetement|chaussure|accessoire/.test(s)) return 'ai-cart';
            if (/sport|fitness/.test(s)) return 'ai-activity';
            if (/auto|voiture|moto|véhicul|vehicul/.test(s)) return 'ai-car';
            if (/livre/.test(s)) return 'ai-book';
            if (/autre/.test(s)) return 'ai-box';
            return 'ai-grid';
        },

        normalizePrice(price) {
            if (price === null || price === undefined || price === '') {
                return 0;
            }
            const n = typeof price === 'string' ? parseFloat(price) : Number(price);
            return Number.isNaN(n) ? 0 : n;
        },

        formatPrice(price) {
            const n = this.normalizePrice(price);
            return (
                new Intl.NumberFormat('fr-FR', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(n) + ' DT'
            );
        },

        effectivePrice(product) {
            const p = this.normalizePrice(product?.price);
            const d = this.normalizePrice(product?.discount);
            if (d <= 0) return p;
            if (d < p) {
                return Math.max(0, p - d);
            }
            if (d <= 100) {
                return Math.max(0, p * (1 - d / 100));
            }
            return p;
        },

        hasDiscount(product) {
            return this.normalizePrice(product?.discount) > 0;
        },

        getMainImage(product) {
            if (product.images && Array.isArray(product.images) && product.images.length > 0) {
                const firstImage = product.images[0];
                if (typeof firstImage === 'object' && firstImage !== null && firstImage.url) {
                    return firstImage.url;
                }
                if (typeof firstImage === 'string') {
                    return firstImage;
                }
            }
            if (product.image) {
                return product.image;
            }
            return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BdWN1bmUgaW1hZ2U8L3RleHQ+PC9zdmc+';
        },

        truncateText(text, maxLength) {
            if (!text) return '';
            const s = String(text);
            if (s.length <= maxLength) return s;
            return s.substring(0, maxLength) + '…';
        },

        handleImageError(event) {
            if (event.target.dataset.errorHandled) {
                return;
            }
            event.target.dataset.errorHandled = 'true';
            event.target.src =
                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BdWN1bmUgaW1hZ2U8L3RleHQ+PC9zdmc+';
        },

        async addProductToCart(product) {
            const snapshot = {
                name: product.name,
                price: this.normalizePrice(product.price),
                image: this.getMainImage(product),
                images: product.images,
            };
            try {
                await addToCartApi(axios, product.id, 1, snapshot);
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('cart-updated'));
                }
                toast.cart(`« ${product.name} » ajouté au panier`);
            } catch (err) {
                toast.error("Impossible d'ajouter au panier. Connectez-vous ou réessayez.");
            }
        },
    },
};
</script>

<style scoped>
/* Hero — crème #F8F4F0, terracotta #D9774B, texte #212121 (maquette ASMAD) */
.hero-asmad-band {
    --hero-bg: #f8f4f0;
    --hero-ink: #212121;
    --hero-accent: #d9774b;
    position: relative;
    overflow: hidden;
    background: var(--hero-bg);
    border-bottom: 1px solid rgba(33, 33, 33, 0.06);
    min-height: min(88vh, 640px);
    display: flex;
    align-items: center;
}

.hero-asmad-band > .container {
    flex: 1;
}

.hero-asmad-texture {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.45;
    background-image: radial-gradient(rgba(33, 33, 33, 0.045) 1px, transparent 1px);
    background-size: 18px 18px;
}

.hero-asmad-pattern {
    position: absolute;
    pointer-events: none;
    z-index: 0;
    opacity: 0.22;
    color: var(--hero-accent);
}

.hero-asmad-pattern--left {
    left: -8%;
    top: 5%;
    width: min(55vw, 420px);
    height: min(55vw, 420px);
    background:
        repeating-linear-gradient(
            0deg,
            transparent,
            transparent 11px,
            currentColor 11px,
            currentColor 12px
        ),
        repeating-linear-gradient(
            90deg,
            transparent,
            transparent 11px,
            currentColor 11px,
            currentColor 12px
        );
    mask-image: radial-gradient(ellipse 70% 70% at 40% 50%, black 25%, transparent 75%);
    -webkit-mask-image: radial-gradient(ellipse 70% 70% at 40% 50%, black 25%, transparent 75%);
}

.hero-asmad-pattern--bottom {
    right: 18%;
    bottom: -12%;
    width: min(70vw, 520px);
    height: min(40vw, 280px);
    background:
        linear-gradient(135deg, transparent 46%, currentColor 46%, currentColor 48%, transparent 48%),
        linear-gradient(45deg, transparent 46%, currentColor 46%, currentColor 48%, transparent 48%);
    background-size: 24px 24px;
    mask-image: linear-gradient(to top, black 35%, transparent 95%);
    -webkit-mask-image: linear-gradient(to top, black 35%, transparent 95%);
}

.hero-asmad-text-inner {
    position: relative;
    z-index: 1;
    max-width: 28rem;
}

@media (min-width: 992px) {
    .hero-asmad-text-inner {
        margin-right: auto;
        margin-left: 0;
    }
}

.hero-asmad-logo-panel {
    position: relative;
    z-index: 1;
    min-height: 200px;
}

@media (min-width: 992px) {
    .hero-asmad-logo-panel {
        min-height: 300px;
    }
}

.hero-asmad-logo-wrap :deep(.asmad-logo-wrapper) {
    width: 100% !important;
    max-width: min(100%, 380px) !important;
    margin-left: auto;
    margin-right: auto;
}

.hero-asmad-logo-wrap :deep(.asmad-logo-img) {
    width: 100% !important;
    max-width: 100% !important;
    height: auto !important;
    object-fit: contain;
    filter: drop-shadow(0 12px 32px rgba(33, 33, 33, 0.08));
}

.hero-asmad-title {
    font-family: 'Playfair Display', 'Cormorant Garamond', Georgia, serif;
    font-weight: 600;
    font-size: clamp(1.85rem, 4.2vw, 2.75rem);
    line-height: 1.2;
    letter-spacing: 0.01em;
    color: var(--hero-ink);
}

.hero-asmad-stat {
    font-family: 'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif;
    font-size: clamp(1rem, 2vw, 1.125rem);
    font-weight: 700;
    line-height: 1.45;
    color: var(--hero-ink);
}

.hero-asmad-lead {
    font-family: 'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif;
    font-size: clamp(0.95rem, 1.85vw, 1.05rem);
    font-weight: 400;
    line-height: 1.55;
    color: var(--hero-ink);
    max-width: 26rem;
}

@media (min-width: 992px) {
    .hero-asmad-lead {
        margin-left: 0;
        margin-right: auto;
    }
}

.hero-btn-explore {
    font-family: 'Montserrat', system-ui, sans-serif;
    font-weight: 600;
    letter-spacing: 0.03em;
    padding: 0.95rem 2.5rem;
    border-radius: 999px;
    border: none;
    color: #fff !important;
    background: var(--hero-ink);
    box-shadow: 0 8px 24px rgba(33, 33, 33, 0.18);
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.hero-btn-explore:hover {
    color: #fff !important;
    background: #2c2c2c;
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(33, 33, 33, 0.22);
}

/* Modern 3D Effects and Animations */
.promo-3d-card,
.promo-card-3d {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.promo-3d-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
}

.promo-card-3d:hover {
    transform: translateY(-8px) scale(1.05);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25) !important;
}

.promo-image-3d:hover {
    transform: perspective(1000px) rotateY(-5deg) scale(1.05);
}

.product-card-3d:hover {
    transform: translateY(-10px) rotateY(0deg) rotateX(0deg) scale(1.1) !important;
    z-index: 10 !important;
}

.hero-cta {
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.hero-cta::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
}

.hero-cta:hover::before {
    width: 300px;
    height: 300px;
}

.hero-cta:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(255, 255, 255, 0.3) !important;
}

.hero-cta-secondary {
    transition: all 0.3s ease;
}

.hero-cta-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-3px);
    border-color: rgba(255, 255, 255, 0.8) !important;
}

.hero-badge {
    animation: fadeInDown 0.6s ease-out;
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 3D Perspective for product showcase */
.product-3d-showcase {
    transform-style: preserve-3d;
    perspective: 1200px;
}

/* Gradient animations */
.promo-3d-card::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transform: rotate(45deg);
    animation: shine 3s infinite;
}

@keyframes shine {
    0% {
        transform: translateX(-100%) translateY(-100%) rotate(45deg);
    }
    100% {
        transform: translateX(100%) translateY(100%) rotate(45deg);
    }
}

/* Smooth scrolling enhancement */
@media (prefers-reduced-motion: no-preference) {
    .promo-card-3d,
    .product-card-3d {
        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
}

/* Responsive adjustments */
@media (max-width: 991px) {
    .product-3d-showcase {
        transform: none !important;
    }
    
    .product-card-3d {
        position: relative !important;
        transform: none !important;
        margin-bottom: 2rem;
    }
    
    .promo-3d-card {
        min-height: auto !important;
    }
}

/* Section catégories — fond clair, halos pastel floutés, cartes vitrées */
.categories-hero-section {
    background: linear-gradient(180deg, #fafbfc 0%, #ffffff 45%, #f7f8fa 100%);
    margin: 2.5rem 0;
    border-radius: 0;
}

.categories-section-inner {
    padding-top: 3.25rem;
    padding-bottom: 3.75rem;
}

@media (min-width: 992px) {
    .categories-section-inner {
        padding-top: 4rem;
        padding-bottom: 4.5rem;
    }
}

.categories-blobs {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
}

.categories-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(72px);
    opacity: 0.44;
    animation: categoriesBlobFloat 22s ease-in-out infinite;
}

.categories-blob--lavender {
    width: min(380px, 72vw);
    height: min(380px, 72vw);
    background: #c4b5fd;
    left: -14%;
    top: 6%;
    animation-delay: 0s;
}

.categories-blob--rose {
    width: min(300px, 58vw);
    height: min(300px, 58vw);
    background: #fbcfe8;
    right: -8%;
    bottom: 2%;
    animation-delay: -7s;
}

.categories-blob--sky {
    width: min(260px, 52vw);
    height: min(260px, 52vw);
    background: #7dd3fc;
    right: 12%;
    top: 28%;
    opacity: 0.32;
    animation-delay: -14s;
}

@keyframes categoriesBlobFloat {
    0%,
    100% {
        transform: translate(0, 0) scale(1);
    }
    50% {
        transform: translate(14px, -16px) scale(1.04);
    }
}

@media (prefers-reduced-motion: reduce) {
    .categories-blob {
        animation: none;
    }
}

.categories-section-heading {
    font-family: 'Playfair Display', 'Cormorant Garamond', Georgia, serif;
    font-weight: 600;
    font-size: clamp(1.85rem, 4vw, 2.4rem);
    color: #2d2a28;
    letter-spacing: 0.01em;
    line-height: 1.25;
}

.categories-lead {
    font-family: 'Montserrat', system-ui, sans-serif;
    font-size: clamp(1rem, 2.1vw, 1.18rem);
    font-weight: 500;
    color: #3d3a38;
    line-height: 1.65;
    max-width: 36rem;
    margin-left: auto;
    margin-right: auto;
}

.categories-lead--muted {
    font-weight: 400;
    color: #5c5856;
}

.categories-cta-btn {
    box-shadow: 0 10px 28px rgba(198, 40, 40, 0.28);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    border: none;
}

.categories-cta-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 36px rgba(198, 40, 40, 0.35);
}

.categories-cta-btn__icon {
    transition: transform 0.25s ease;
    display: inline-block;
}

.categories-cta-btn:hover .categories-cta-btn__icon {
    transform: translateX(4px);
}

.home-category-card {
    background: rgba(255, 255, 255, 0.9);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.95);
    border-radius: 1.25rem;
    padding: 1.15rem 0.85rem 1.25rem;
    text-align: center;
    color: #2d2a28;
    box-shadow:
        0 1px 0 rgba(255, 255, 255, 0.85) inset,
        0 8px 24px rgba(15, 23, 42, 0.06);
    transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
}

.home-category-card:hover {
    transform: translateY(-6px);
    border-color: rgba(198, 40, 40, 0.18);
    box-shadow:
        0 1px 0 rgba(255, 255, 255, 0.95) inset,
        0 16px 38px rgba(15, 23, 42, 0.1);
}

.home-category-card__icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.35rem;
    height: 3.35rem;
    border-radius: 50%;
    margin-bottom: 0.75rem;
    font-size: 1.38rem;
    transition: transform 0.28s ease;
}

.home-category-card:hover .home-category-card__icon-wrap {
    transform: scale(1.07);
}

.home-category-card__icon {
    display: block;
    line-height: 1;
}

.home-category-card__label {
    font-family: 'Montserrat', system-ui, sans-serif;
    font-size: 0.84rem;
    font-weight: 600;
    line-height: 1.35;
    display: block;
    margin-bottom: 0.35rem;
}

.home-category-card__meta {
    font-size: 0.72rem;
    color: #6c757d;
    font-weight: 500;
}

.home-category-card--accent-0 .home-category-card__icon-wrap {
    background: linear-gradient(145deg, #ede9fe, #ddd6fe);
    color: #6d28d9;
}

.home-category-card--accent-1 .home-category-card__icon-wrap {
    background: linear-gradient(145deg, #fce7f3, #fbcfe8);
    color: #db2777;
}

.home-category-card--accent-2 .home-category-card__icon-wrap {
    background: linear-gradient(145deg, #e0f2fe, #bae6fd);
    color: #0284c7;
}

.home-category-card--accent-3 .home-category-card__icon-wrap {
    background: linear-gradient(145deg, #ffedd5, #fed7aa);
    color: #c2410c;
}

.home-category-card--accent-4 .home-category-card__icon-wrap {
    background: linear-gradient(145deg, #d1fae5, #a7f3d0);
    color: #047857;
}

.home-category-card--accent-5 .home-category-card__icon-wrap {
    background: linear-gradient(145deg, #f1f5f9, #e2e8f0);
    color: #475569;
}

[data-bs-theme='dark'] .categories-hero-section,
.dark-mode .categories-hero-section,
body.dark-mode .categories-hero-section {
    background: linear-gradient(180deg, #141820 0%, #0f1317 50%, #121820 100%);
}

[data-bs-theme='dark'] .categories-section-heading,
.dark-mode .categories-section-heading,
body.dark-mode .categories-section-heading {
    color: #f1f5f9;
}

[data-bs-theme='dark'] .categories-lead,
.dark-mode .categories-lead,
body.dark-mode .categories-lead {
    color: #cbd5e1;
}

[data-bs-theme='dark'] .categories-lead--muted,
.dark-mode .categories-lead--muted,
body.dark-mode .categories-lead--muted {
    color: #94a3b8;
}

[data-bs-theme='dark'] .categories-blob,
.dark-mode .categories-blob,
body.dark-mode .categories-blob {
    opacity: 0.18;
}

[data-bs-theme='dark'] .home-category-card,
.dark-mode .home-category-card,
body.dark-mode .home-category-card {
    background: rgba(30, 41, 59, 0.75);
    border-color: rgba(148, 163, 184, 0.15);
    color: #e2e8f0;
}

[data-bs-theme='dark'] .home-category-card__meta,
.dark-mode .home-category-card__meta,
body.dark-mode .home-category-card__meta {
    color: #94a3b8;
}

/* Hero Section Background Animations */
.hero-section-with-animation {
    position: relative;
    overflow: hidden;
}

.hero-bg-animation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    pointer-events: none;
}

.hero-particle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    animation: heroParticleFloat 15s infinite ease-in-out;
}

.hero-particle.particle-1 {
    width: 4px;
    height: 4px;
    top: 20%;
    left: 10%;
    animation-delay: 0s;
}

.hero-particle.particle-2 {
    width: 6px;
    height: 6px;
    top: 40%;
    left: 20%;
    animation-delay: 2s;
}

.hero-particle.particle-3 {
    width: 5px;
    height: 5px;
    top: 60%;
    left: 30%;
    animation-delay: 4s;
}

.hero-particle.particle-4 {
    width: 7px;
    height: 7px;
    top: 30%;
    right: 15%;
    animation-delay: 1s;
}

.hero-particle.particle-5 {
    width: 4px;
    height: 4px;
    top: 50%;
    right: 25%;
    animation-delay: 3s;
}

.hero-particle.particle-6 {
    width: 6px;
    height: 6px;
    top: 70%;
    right: 35%;
    animation-delay: 5s;
}

.hero-floating-shape {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    animation: heroShapeFloat 20s infinite ease-in-out;
}

.hero-shape-1 {
    width: 200px;
    height: 200px;
    top: -50px;
    left: -50px;
    animation-delay: 0s;
    background: radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%);
}

.hero-shape-2 {
    width: 150px;
    height: 150px;
    bottom: -30px;
    right: 10%;
    animation-delay: 7s;
    background: radial-gradient(circle, rgba(118, 75, 162, 0.2) 0%, transparent 70%);
}

.hero-shape-3 {
    width: 180px;
    height: 180px;
    top: 50%;
    right: -40px;
    animation-delay: 14s;
    background: radial-gradient(circle, rgba(240, 147, 251, 0.15) 0%, transparent 70%);
}

@keyframes heroParticleFloat {
    0%, 100% {
        transform: translate(0, 0) scale(1);
        opacity: 0.1;
    }
    25% {
        transform: translate(20px, -30px) scale(1.2);
        opacity: 0.3;
    }
    50% {
        transform: translate(-15px, -50px) scale(0.8);
        opacity: 0.2;
    }
    75% {
        transform: translate(30px, -20px) scale(1.1);
        opacity: 0.25;
    }
}

@keyframes heroShapeFloat {
    0%, 100% {
        transform: translate(0, 0) rotate(0deg) scale(1);
        opacity: 0.3;
    }
    33% {
        transform: translate(50px, -50px) rotate(120deg) scale(1.1);
        opacity: 0.4;
    }
    66% {
        transform: translate(-30px, 30px) rotate(240deg) scale(0.9);
        opacity: 0.35;
    }
}

.min-vh-50 {
    min-height: 50vh;
}

@media (max-width: 768px) {
    .categories-hero-section {
        margin: 1.5rem 0;
    }

    .categories-section-inner {
        padding-top: 2.5rem;
        padding-bottom: 2.75rem;
    }
}

.home-product-card {
    transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.home-product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 0.75rem 2rem rgba(0, 0, 0, 0.1) !important;
}

.home-badge-tn {
    letter-spacing: 0.02em;
}

.home-badge-tn-product {
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    background: rgba(198, 40, 40, 0.92) !important;
    color: #fff;
}

</style>
