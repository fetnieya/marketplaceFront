<template>
    <!-- Product gallery + Details + Options -->
    <section class="container py-5 mt-5 mb-sm-2 mb-lg-3 mb-xl-4 mb-xxl-5">
        <!-- Loading indicator -->
        <div class="text-center py-5" v-if="loading">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading product details...</p>
        </div>
        
        <!-- Error message -->
        <div class="text-center py-5" v-else-if="error">
            <div class="alert alert-danger">
                {{ error }}
            </div>
            <router-link to="/" class="btn btn-primary mt-3">
                Return to Catalog
            </router-link>
        </div>
        
        <!-- Product content -->
        <div v-else-if="product">
            <!-- Title + price shown on screens < 768px -->
            <h2 class="h1 d-md-none">{{product.name}}</h2>
            <div class="d-flex d-md-none align-items-center pb-3 mb-3">
                <div class="h3 mb-0 me-3">${{product.price}}</div>
                <del class="fs-5 fw-medium text-body-secondary me-3" v-if="product.oldPrice">${{ product.oldPrice }}</del>
                <span class="badge bg-danger bg-opacity-10 text-danger d-md-none" v-if="product.sale">Sale</span>
            </div>

            <div class="row pb-sm-1 pb-md-4">
                <!-- Media Column (Image/Video) -->
                <div class="col-md-6 mb-4 mb-md-0">
                    <!-- Product Image -->
                    <div class="product-image-container bg-secondary rounded-1 overflow-hidden mb-3">
                        <img class="img-fluid d-block mx-auto" 
                             :src="product.image" 
                             :alt="product.name">
                    </div>
                    
                    <!-- Product Video -->
                    <div class="product-video-container bg-secondary rounded-1 overflow-hidden">
                        <video class="w-100" controls>
                            <source :src="product.video" type="video/mp4">
                        </video>
                    </div>
                </div>

                <!-- Product details -->
                <div class="col-md-6 col-xl-5 offset-xl-1">
                    <div class="d-none d-md-block" style="margin-top: -90px;"></div>
                    <div class="position-md-sticky top-0 ps-md-4 ps-lg-5 ps-xl-0">
                        <div class="d-none d-md-block" style="padding-top: 90px;"></div>
                        
                        <!-- Show title and description on medium screens and up -->
                        <h2 class="h1 d-none d-md-block mb-3">{{product.name}}</h2>
                        <p class="fs-sm mb-4">{{ product.description }}</p>
                        
                        <div class="d-none d-md-flex align-items-center pb-3 mb-3">
                            <div class="h3 mb-0 me-3">${{product.price}}</div>
                            <del class="fs-5 fw-medium text-body-secondary" v-if="product.oldPrice">${{product.oldPrice}}</del>
                            <span class="badge bg-danger bg-opacity-10 text-danger ms-3" v-if="product.sale">Sale</span>
                        </div>

                        <!-- Action buttons -->
                        <div class="d-sm-flex d-md-block d-lg-flex py-4 py-md-5 my-3 my-md-0 mt-lg-0 mb-lg-4">
                            <div class="count-input bg-gray rounded-3 me-4 mb-3 mb-sm-0 mb-md-3 mb-lg-0">
                                <button class="btn btn-icon btn-lg fs-xl" type="button" @click="decrementQuantity">-</button>
                                <input class="form-control" type="number" v-model="quantity" readonly>
                                <button class="btn btn-icon btn-lg fs-xl" type="button" @click="incrementQuantity">+</button>
                            </div>
                            <div class="d-flex align-items-center">
                                <button class="btn btn-lg btn-primary w-100 w-lg-auto me-2" type="button" @click="addToCart">
                                    <i class="ai-cart me-2 ms-n1"></i>Add to cart
                                </button>
                                <div class="nav">
                                    <a class="nav-link fs-3 px-3" href="#" data-bs-toggle="tooltip" title="Add to Favorites" aria-label="Add to Favorites">
                                        <i class="ai-heart"></i>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <!-- Space between sections -->
                        <div class="my-3"></div>

                        <!-- Product Brand -->
                        <router-link to="/market-page" style="text-decoration: none; color: inherit;">
                            <div class="card mb-4 card-bordered">
                                <div class="header">
                                    <div class="profile-picture">
                                        <img src="@/assets/img/landing/web-studio/skills/figma.svg" width="72" alt="Figma">
                                    </div>
                                    <h2>Figma</h2>
                                </div>
                                <div class="content">
                                    <div class="buttons">
                                        <button type="button" class="btn btn-primary">+ Follow</button>
                                        <button type="button" class="btn btn-outline-primary">All articles</button>
                                    </div>
                                </div>
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="text-center py-5">
            <p>Product not found</p>
            <router-link to="/" class="btn btn-primary">
                Return to Catalog
            </router-link>
        </div>
    </section>

    <hr class="d-md-none mb-5">
</template>

<script>
import axios from 'axios';

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
            product: null,
            loading: false,
            error: null,
            quantity: 1
        }
    },
    methods: {
        async fetchProductById() {
            this.loading = true;
            this.error = null;
            try {
                const productId = this.id || this.$route.params.id;
                
                if (!productId) {
                    this.error = 'Product ID is missing';
                    return;
                }
                
                const response = await axios.get(`http://localhost:3000/products/${productId}`);
                this.product = response.data;
                
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
        
        addToCart() {
            const message = `Added ${this.quantity} ${this.product.name} to cart`;
            alert(message);
        }
    },
    created() {
        this.fetchProductById();
    }
}
</script>

<style scoped>
.card {
    border: 1px solid #e0e0e0;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 350px;
}

.header {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: center;
    margin-bottom: 15px;
}

.profile-picture img {
    border-radius: 50%;
}

.buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 10px;
}

.count-input {
    display: flex;
    align-items: center;
}

.count-input input {
    width: 50px;
    text-align: center;
    border: none;
    background: transparent;
}

.count-input button {
    background: transparent;
    border: none;
}

.product-image-container {
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.product-image-container img {
    max-height: 400px;
    max-width: 100%;
    object-fit: contain;
}

.product-video-container {
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.product-video-container video {
    max-height: 300px;
    width: 100%;
    background-color: #000;
}
</style>