<template>
    <section class="container pb-5 mb-lg-3 mb-xl-4 mb-xxl-5">
      <div class="row">
        <p class="fs-1 fw-bold">Your Following Market List</p>
      </div>
      <div class="row pb-sm-1 pb-md-4">
        <div class="col-md-6 gallery mb-3 mb-md-0">
          <section>
            <!-- User Profile -->
            <div class="user-info d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center">
                <div class="profile-picture me-3">
                  <img src="../assets/img/landing/web-studio/skills/figma.svg" width="72" alt="Figma" />
                </div>
                <div class="profile-details">
                  <h2 class="h5 mb-1">Figma</h2>
                  <p class="text-muted mb-2">⭐ 4.80</p>
                </div>
              </div>
              <a class="d-inline-block ms-4" href="#">
                <i class="ai-chevron-right fs-xl me-2 ms-n1"></i>
              </a>
              <button class="btn btn-outline-primary follow-btn ms-4 mt-0" aria-label="Follow">+ Follow</button>
            </div>
          </section>
        </div>
      </div>
      <div class="border-bottom pb-4 mb-2"></div>
  
      <!-- Button Group -->
      <div class="btn-group d-flex justify-content-center" role="group" aria-label="Outline button group">
        <button type="button" class="btn btn-outline-primary" @click="activeSection = 'products'">Products</button>
        <button type="button" class="btn btn-outline-primary" @click="activeSection = 'discount'">Discount</button>
        <button type="button" class="btn btn-outline-primary" @click="activeSection = 'comment'">Comment</button>
      </div>
  
      <!-- Content Sections -->
      <div v-if="activeSection === 'products'" id="products" class="content-section">
        <h2>Products</h2>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          <!-- Product 1 -->
          <div class="col pb-2 pb-sm-3" v-for="product in products" :key="product.id">
            <div class="card-hover position-relative bg-secondary rounded-1 p-3 mb-4">
              <button class="btn btn-icon btn-sm btn-light bg-light border-0 rounded-circle position-absolute top-0 end-0 mt-3 me-3 z-5 opacity-0" type="button" aria-label="Add to Favorites">
                <i class="ai-heart fs-xl text-nav"></i>
              </button>
              <div class="swiper swiper-nav-onhover" :data-swiper-options="swiperOptions">
                <a class="swiper-wrapper" href="shop-single.html">
                  <div class="swiper-slide p-2 p-xl-4">
                    <img class="d-block mx-auto" :src="product.image" width="226" alt="Product" />
                  </div>
                </a>
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
                <a href="shop-single.html">{{ product.name }}</a>
              </h3>
              <div class="d-flex ps-2 mt-n1 ms-auto">
                <div class="ms-1" v-for="(color, index) in product.colors" :key="index">
                  <input class="btn-check" type="radio" :name="product.id" :value="color.name" :id="'color' + product.id + index" />
                  <label class="btn btn-icon btn-xs btn-outline-secondary rounded-circle" :for="'color' + product.id + index">
                    <span class="d-block rounded-circle" :style="{ backgroundColor: color.hex }"></span>
                  </label>
                </div>
              </div>
            </div>
            <div class="d-flex align-items-center">
              <span class="me-2">${{ product.price }}</span>
              <del class="fs-sm text-body-secondary">${{ product.originalPrice }}</del>
              <div class="nav ms-auto" data-bs-toggle="tooltip" data-bs-template='<div class="tooltip fs-xs" role="tooltip"><div class="tooltip-inner bg-light text-body-secondary p-0"></div></div>' data-bs-placement="left" title="Add to cart">
                <a class="nav-link fs-lg py-2 px-1" href="#" aria-label="Add to Cart">
                  <i class="ai-cart"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div v-if="activeSection === 'discount'" id="discount" class="content-section">
        <h2>Discount Products</h2>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          <!-- Discount Product 1 -->
          <div class="col pb-2 pb-sm-3" v-for="discountProduct in discountProducts" :key="discountProduct.id">
            <div class="card-hover position-relative bg-secondary rounded-1 p-3 mb-4">
              <button class="btn btn-icon btn-sm btn-light bg-light border-0 rounded-circle position-absolute top-0 end-0 mt-3 me-3 z-5 opacity-0" type="button" aria-label="Add to Favorites">
                <i class="ai-heart fs-xl text-nav"></i>
              </button>
              <div class="swiper swiper-nav-onhover" :data-swiper-options="swiperOptions">
                <a class="swiper-wrapper" href="shop-single.html">
                  <div class="swiper-slide p-2 p-xl-4">
                    <img class="d-block mx-auto" :src="discountProduct.image" width="226" alt="Discounted Product" />
                  </div>
                </a>
              </div>
            </div>
            <div class="d-flex mb-1">
              <h3 class="h6 mb-0">
                <a href="shop-single.html">{{ discountProduct.name }}</a>
              </h3>
              <span class="badge bg-danger ms-2">-{{ discountProduct.discount }}%</span>
            </div>
            <div class="d-flex align-items-center">
              <span class="me-2">${{ discountProduct.price }}</span>
              <del class="fs-sm text-body-secondary">${{ discountProduct.originalPrice }}</del>
              <div class="nav ms-auto" data-bs-toggle="tooltip" data-bs-template='<div class="tooltip fs-xs" role="tooltip"><div class="tooltip-inner bg-light text-body-secondary p-0"></div></div>' data-bs-placement="left" title="Add to cart">
                <a class="nav-link fs-lg py-2 px-1" href="#" aria-label="Add to Cart">
                  <i class="ai-cart"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div v-if="activeSection === 'comment'" id="comment" class="content-section">
        <h2>Comments</h2>
        <div class="row position-relative overflow-hidden gx-2 z-1">
          <div class="table-responsive mt-3">
            <!-- Comment Item -->
            <div class="card border-0 mb-4" v-for="comment in comments" :key="comment.id">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <img class="rounded-circle" :src="comment.avatar" width="60" alt="User Avatar" />
                  <div class="ps-3 d-flex justify-content-between w-100">
                    <div>
                      <div class="h6 mb-1">{{ comment.name }}</div>
                      <div class="fs-sm text-body-secondary">{{ comment.role }}</div>
                    </div>
                    <i class="ai-trash fs-5 opacity-60" @click="deleteComment(comment.id)"></i>
                  </div>
                </div>
                <p class="card-text">{{ comment.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
export default {
  name: "MarketPage",
  data() {
    return {
      activeSection: 'products',  
      products: [
        {
          id: 1,
          name: 'Loft style lamp',
          image: '../assets/img/shop/single/gallery/01.png', 
          price: 40.99,
          originalPrice: 60.99,
          colors: [
            { name: 'Red', hex: '#FF0000' },
            { name: 'Green', hex: '#00FF00' },
            { name: 'Blue', hex: '#0000FF' }
          ]
        },
        {
          id: 2,
          name: 'Modern Sofa',
          image: '/assets/img/landing/web-studio/skills/figma.svg', 
          price: 150.99,
          originalPrice: 200.99,
          colors: [
            { name: 'Black', hex: '#000000' },
            { name: 'White', hex: '#FFFFFF' },
            { name: 'Gray', hex: '#808080' }
          ]
        }
      ],
      discountProducts: [
        {
          id: 1,
          name: 'Stylish Shoes',
          image: '/assets/img/landing/web-studio/skills/figma.svg',
          price: 29.99,
          originalPrice: 50.99,
          discount: 40
        },
        {
          id: 2,
          name: 'Wireless Headphones',
          image: '/assets/img/landing/web-studio/skills/figma.svg', 
          price: 69.99,
          originalPrice: 120.99,
          discount: 45
        }
      ],
      comments: [
        {
          id: 1,
          name: 'John Doe',
          role: 'Customer',
          avatar: '/assets/img/landing/web-studio/skills/figma.svg', 
          text: 'Great products!'
        },
        {
          id: 2,
          name: 'Jane Doe',
          role: 'Customer',
          avatar: '/assets/img/landing/web-studio/skills/figma.svg', 
          text: 'Amazing service!'
        }
      ],
      swiperOptions: {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true
      }
    };
  }
};
</script>
