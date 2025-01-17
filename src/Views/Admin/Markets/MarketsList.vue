<template>
    <div class="container py-5 mt-4 mt-lg-5 mb-lg-4 my-xl-5">
      <div class="row pt-sm-2 pt-lg-0">
        <!-- Sidebar (offcanvas on screens < 992px) -->
        <aside class="col-lg-3 pe-lg-4 pe-xl-5 mt-n3">
          <div class="d-none d-lg-block" style="padding-top: 105px;"></div>
          <div class="offcanvas-lg offcanvas-start" id="sidebarAccount">
            <button class="btn-close position-absolute top-0 end-0 mt-3 me-3 d-lg-none" type="button" data-bs-dismiss="offcanvas" data-bs-target="#sidebarAccount" aria-label="Close"></button>
            <div class="offcanvas-body">
              <nav class="nav flex-column pb-2 pb-lg-4 mb-3">
                <h4 class="fs-xs fw-medium text-body-secondary text-uppercase pb-1 mb-2">Menu</h4>
                <router-link class="nav-link fw-semibold py-2 px-0" to="/admin">
                  <i class="ai-dashboard fs-5 opacity-60 me-2"></i> Dashboard
                </router-link>
                <router-link class="nav-link fw-semibold py-2 px-0" to="/users">
                  <i class="ai-user-group fs-5 opacity-60 me-2"></i> Users
                </router-link>
                <router-link class="nav-link fw-semibold py-2 px-0" to="/markets">
                  <i class="ai-shopping-bag fs-5 opacity-60 me-2"></i> Markets
                </router-link>
                <router-link class="nav-link fw-semibold py-2 px-0" to="/category">
                  <i class="ai-grid fs-5 opacity-60 me-2"></i> Categories
                </router-link>
              </nav>
            </div>
          </div>
        </aside>
        
        <!-- Page content -->
        <div class="col-lg-9 pt-4 pb-2 pb-sm-4">
          <h1 class="h2 mb-4">Markets list</h1>
          <router-link to="/addMarket">
            <button type="button" class="btn btn-primary btn-sm ms-auto d-block">
              <i class="ai-circle-plus me-2 ms-n1"></i>Add market
            </button>
          </router-link>
  
          <div class="row position-relative overflow-hidden gx-2 z-1">
            <div class="table-responsive mt-3">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Market logo </th>
                    <th scope="col">Market name</th>
                    <th scope="col">Number of followers </th>
                    <th scope="col">Number of Product</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Dynamically generate table rows from market data -->
                  <tr v-for="(market, index) in markets" :key="market.id">
                    <th scope="row">{{ index + 1 }}</th> <!-- Row index -->
                    <td><img :src="market.logo" width="50" height="50"></td>
                    <td>{{ market.name }}</td>
                    <td>{{ market.followers }}</td>
                    <td>{{ market.products }}</td>
                    <td class="d-flex align-items-center">
                      <!-- Edit Button -->
                      <router-link
  :to="`/editMarket/${market.id}`"
  class="btn btn-link fw-semibold py-2 px-0"
  title="Edit"
>
  <i class="ai-edit fs-5 me-2"></i>
</router-link>

                        <!-- Delete Button -->
    <button
                                            @click="deleteMarket(market.id, index)"
                                            class="btn btn-link fw-semibold py-2 px-0"
                                            title="Delete"
                                        >
                                            <i class="ai-trash fs-5"></i>
                                        </button>
                    </td>
                  </tr>
                </tbody>
              </table>
  
              <!-- Pagination (optional) -->
              <nav aria-label="Page navigation example">
                <div class="text-center">
                  <ul class="pagination justify-content-center">
                    <li class="page-item"><a href="#" class="page-link">Prev</a></li>
                    <li class="page-item active"><span class="page-link">2 <span class="visually-hidden">(current)</span></span></li>
                    <li class="page-item"><a href="#" class="page-link">Next</a></li>
                  </ul>
                </div>
              </nav>
            </div>
          </div>
  
          <!-- Divider for dark mode only -->
          <hr class="d-none d-dark-mode-block">
  
          <!-- Sidebar toggle button -->
          <button class="d-lg-none btn btn-sm fs-sm btn-primary w-100 rounded-0 fixed-bottom" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarAccount">
            <i class="ai-menu me-2"></i> Account menu
          </button>
        </div>
      </div>
    </div>
  </template>

<script>
import axios from 'axios';

export default {
  name: 'MarketsList',
  data() {
    return {
      markets: [], // Holds the list of markets
    };
  },
  methods: {
    async fetchMarkets() {
      try {
        
        const response = await axios.get('http://localhost:3000/markets'); 
        this.markets = response.data;
      } catch (error) {
        console.error('Error fetching markets:', error);
        alert('Failed to fetch markets. Please try again later.');
      }
    },

    async deleteMarket(marketId, index) {
  try {
    console.log({marketId}); 
   await axios.delete(`http://localhost:3000/markets/${marketId}`);
    this.markets.splice(index, 1);
    alert('Market deleted successfully!');
  } catch (error) {
    console.error('Error deleting market:', error);
    alert('Failed to delete market. Please try again.');
  }
},
  },

  created() {
    this.fetchMarkets(); 
  },
};
</script>

  