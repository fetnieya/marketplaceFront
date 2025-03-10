<template>
  <div class="container py-5 mt-4 mt-lg-5 mb-lg-4 my-xl-5">
    <div class="row pt-sm-2 pt-lg-0">
      <!-- Sidebar -->
      <aside class="col-lg-3 pe-lg-4 pe-xl-5 mt-n3">
        <div class="position-lg-sticky top-0">
          <div class="d-none d-lg-block" style="padding-top: 105px;"></div>
          <div class="offcanvas-lg offcanvas-start" id="sidebarAccount">
            <button 
              class="btn-close position-absolute top-0 end-0 mt-3 me-3 d-lg-none" 
              type="button" 
              data-bs-dismiss="offcanvas" 
              data-bs-target="#sidebarAccount"
              aria-label="Close"
            ></button>
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
        </div>
      </aside>

      <!-- Main Content -->
      <div class="col-lg-9 pt-4 pb-2 pb-sm-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="h2 mb-0">User List</h1>
          <router-link to="/addUser">
            <button type="button" class="btn btn-primary">
              <i class="ai-user-plus me-2 ms-n1"></i>Add User
            </button>
          </router-link>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="alert alert-danger" role="alert">
          {{ error }}
          <button @click="fetchUsers" class="btn btn-link">Retry</button>
        </div>

        <!-- Content -->
        <div v-else class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">E-mail</th>
                <th scope="col">Phone</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in paginatedUsers" :key="user.id">
                <th scope="row">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</th>
                <td>{{ user.firstName }}</td>
                <td>{{ user.lastName }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.phone }}</td>
                <td>
                  <div class="btn-group">
                    <router-link 
                      :to="`/editUser/${user.id}`"
                      class="btn btn-link"
                      title="Edit"
                    >
                      <i class="ai-edit fs-5"></i>
                    </router-link>
                    <button
                      @click="confirmDelete(user)"
                      class="btn btn-link"
                      title="Delete"
                    >
                      <i class="ai-trash fs-5"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="paginatedUsers.length === 0">
                <td colspan="6" class="text-center py-4">No users found</td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <nav v-if="totalPages > 1" aria-label="Page navigation" class="mt-4">
            <div class="text-center">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a @click.prevent="prevPage" href="#" class="page-link">Previous</a>
                </li>
                <li 
                  v-for="page in displayedPages" 
                  :key="page"
                  class="page-item"
                  :class="{ active: currentPage === page }"
                >
                  <a 
                    @click.prevent="goToPage(page)" 
                    href="#" 
                    class="page-link"
                  >
                    {{ page }}
                  </a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <a @click.prevent="nextPage" href="#" class="page-link">Next</a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div 
      class="modal fade" 
      id="deleteModal" 
      tabindex="-1" 
      aria-labelledby="deleteModalLabel" 
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">Confirm Delete</h5>
            <button 
              type="button" 
              class="btn-close" 
              data-bs-dismiss="modal" 
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete {{ selectedUser?.firstName }} {{ selectedUser?.lastName }}?
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button 
              type="button" 
              class="btn btn-danger" 
              @click="deleteUser"
              :disabled="deleting"
            >
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Modal } from 'bootstrap';

export default {
  name: 'UsersListComponent',
  data() {
    return {
      users: [],
      currentPage: 1,
      totalPages: 1,
      itemsPerPage: 5,
      loading: true,
      error: null,
      selectedUser: null,
      deleting: false,
      deleteModal: null
    };
  },
  computed: {
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.users.slice(start, end);
    },
    displayedPages() {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];
      let l;

      range.push(1);

      for (let i = this.currentPage - delta; i <= this.currentPage + delta; i++) {
        if (i < this.totalPages && i > 1) {
          range.push(i);
        }
      }

      range.push(this.totalPages);

      for (let i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push('...');
          }
        }
        rangeWithDots.push(i);
        l = i;
      }

      return rangeWithDots;
    }
  },
  methods: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('http://localhost:3000/users');
        this.users = response.data;
        this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
      } catch (error) {
        this.error = 'Failed to fetch users. Please try again.';
        console.error('Error fetching users:', error);
      } finally {
        this.loading = false;
      }
    },
    confirmDelete(user) {
      this.selectedUser = user;
      this.deleteModal.show();
    },
    async deleteUser() {
      if (!this.selectedUser) return;
      
      this.deleting = true;
      try {
        await axios.delete(`http://localhost:3000/users/${this.selectedUser.id}`);
        const index = this.users.findIndex(u => u.id === this.selectedUser.id);
        if (index !== -1) {
          this.users.splice(index, 1);
          this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
          if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages || 1;
          }
        }
        this.$toast?.success('User deleted successfully');
        this.deleteModal.hide();
      } catch (error) {
        this.$toast?.error('Failed to delete user');
        console.error('Error deleting user:', error);
      } finally {
        this.deleting = false;
        this.selectedUser = null;
      }
    },
    goToPage(page) {
      if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  },
  mounted() {
    this.deleteModal = new Modal(document.getElementById('deleteModal'));
  },
  created() {
    this.fetchUsers();
  }
};
</script>

<style scoped>
.pagination {
  gap: 0.25rem;
}

.btn-link {
  color: inherit;
  text-decoration: none;
}

.btn-link:hover {
  color: var(--bs-primary);
}

.modal-header .btn-close {
  margin: -0.5rem -0.5rem -0.5rem auto;
}
</style>