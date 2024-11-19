<template>
  <!-- Page container -->
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
        <div class="d-sm-flex align-items-center mb-4">
          <h1 class="h2 mb-4 mb-sm-0 me-4">Dashboard</h1>
          <div class="d-flex ms-auto">
            <button class="btn btn-secondary me-3 me-sm-4" type="button">
              <i class="ai-download me-2 ms-n1"></i> Download
            </button>
            <select class="form-select">
              <option value="Last week">Last week</option>
              <option value="Last month">Last month</option>
              <option value="Last 3 months">Last 3 months</option>
              <option value="Last 6 months">Last 6 months</option>
              <option value="Last year">Last year</option>
            </select>
          </div>
        </div>

        <div class="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4">
          <div class="card-body">
            <!-- Stats -->
            <div class="row g-3 g-xl-4">
              <div class="col-md-4 col-sm-6">
                <div class="h-100 bg-secondary rounded-3 text-center p-4">
                  <h2 class="h6 pb-2 mb-1">Earnings (before taxes)</h2>
                  <div class="h2 text-primary mb-2">$842.00</div>
                  <p class="fs-sm text-body-secondary mb-0">Sales 8/1/2023 - 8/15/2023</p>
                </div>
              </div>
              <div class="col-md-4 col-sm-6">
                <div class="h-100 bg-secondary rounded-3 text-center p-4">
                  <h2 class="h6 pb-2 mb-1">Your balance</h2>
                  <div class="h2 text-primary mb-2">$735.00</div>
                  <p class="fs-sm text-body-secondary mb-0">To be paid on 8/15/2023</p>
                </div>
              </div>
              <div class="col-md-4 col-sm-12">
                <div class="h-100 bg-secondary rounded-3 text-center p-4">
                  <h2 class="h6 pb-2 mb-1">Lifetime earnings</h2>
                  <div class="h2 text-primary mb-2">$9,156.74</div>
                  <p class="fs-sm text-body-secondary mb-0">Based on list price</p>
                </div>
              </div>
            </div>

            <!-- Sales value line chart -->
            <div class="row g-4 py-4">
              <div class="col-md-8">
                <div class="h-100 border rounded-3 p-4">
                  <h2 class="h6 text-center text-sm-start mb-4">Sales value, USD</h2>
                  <canvas id="salesChart"></canvas>
                </div>
              </div>

              <!-- New Bar Chart for Sales by Category -->
              <div class="col-md-4">
                <div class="h-100 border rounded-3 p-4">
                  <h2 class="h6 text-center text-sm-start mb-4">Sales by Category</h2>
                  <canvas id="categoryChart"></canvas>
                </div>
              </div>
            </div>

            <!-- New Radar Chart for User Engagement -->
            <div class="row g-4">
              <div class="col-md-8 col-lg-12 col-xl-8 text-center text-sm-start">
                <div class="border rounded-3 p-4">
                  <h2 class="h6 mb-4">User Engagement by Platform</h2>
                  <canvas id="engagementChart"></canvas>
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
import { onMounted } from 'vue'
import Chart from 'chart.js/auto'

export default {
  name: "AdminDashboard",
  setup() {
    onMounted(() => {
      // Sales value line chart
      new Chart(document.getElementById('salesChart'), {
        type: 'line',
        data: {
          labels: ["22 Jul", "", "24 Jul", "", "26 Jul", "", "28 Jul", "", "30 Jul", "", "01 Aug", "", "03 Aug", "", "05 Aug"],
          datasets: [{
            label: "Sales, USD",
            fill: true,
            data: [0, 100, 200, 175, 100, 50, 75, 0, 0, 50, 50, 50, 0, 100, 0],
            backgroundColor: "rgba(68,140,116,.1)",
            borderWidth: 2,
            borderColor: "rgba(68,140,116,.6)",
            pointBackgroundColor: "#448c74",
            pointBorderWidth: 3,
            pointBorderColor: "#448c74",
            pointHoverBorderColor: "#448c74",
            pointHoverBorderWidth: 6
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              border: {
                color: "rgba(133,140,151,.18)"
              },
              grid: {
                color: "rgba(133,140,151,.18)"
              }
            },
            x: {
              border: {
                color: "rgba(133,140,151,.18)"
              },
              grid: {
                color: "rgba(133,140,151,.18)"
              }
            }
          }
        }
      })

      // Sales by Category Bar chart
      new Chart(document.getElementById('categoryChart'), {
        type: 'bar',
        data: {
          labels: ["Electronics", "Clothing", "Home", "Beauty", "Books"],
          datasets: [{
            label: "Sales, USD",
            data: [300, 150, 250, 200, 180],
            backgroundColor: "rgba(68,140,116,.6)",
            borderColor: "rgba(68,140,116,.9)",
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      })

      // User Engagement Radar chart
      new Chart(document.getElementById('engagementChart'), {
        type: 'radar',
        data: {
          labels: ['Web', 'Mobile', 'Social Media', 'Email', 'Direct'],
          datasets: [{
            label: 'Engagement Level',
            data: [80, 90, 70, 60, 50],
            backgroundColor: "rgba(68,140,116,.3)",
            borderColor: "rgba(68,140,116,.6)",
            borderWidth: 2
          }]
        },
        options: {
          responsive: true
        }
      })
    })

    return {}
  }
}
</script>
