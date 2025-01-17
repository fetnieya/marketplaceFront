<template>
  <div class="d-flex align-items-center justify-content-center min-vh-100 bg-light">
    <div class="col-lg-6 col-md-8 col-sm-10 bg-white shadow p-4 rounded">
      <h1 class="h2 mb-4 text-center">Edit User</h1>
      <form @submit.prevent="handleSubmit">
        <div class="container">
          <div class="mb-3">
            <label for="first-name-input" class="form-label">First Name</label>
            <input
              v-model="user.firstName"
              class="form-control"
              type="text"
              id="first-name-input"
              placeholder="First Name"
            />
          </div>

          <div class="mb-3">
            <label for="last-name-input" class="form-label">Last Name</label>
            <input
              v-model="user.lastName"
              class="form-control"
              type="text"
              id="last-name-input"
              placeholder="Last Name"
            />
          </div>

          <div class="mb-3">
            <label for="email-input" class="form-label">Email</label>
            <input
              v-model="user.email"
              class="form-control"
              type="email"
              id="email-input"
              placeholder="email@example.com"
            />
          </div>

          <div class="mb-3">
            <label for="tel-input" class="form-label">Phone</label>
            <input
              v-model="user.phone"
              class="form-control"
              type="tel"
              id="tel-input"
              placeholder="1-(770)-334-2518"
            />
          </div>

          <div class="d-flex justify-content-center mt-3">
            <button type="submit" class="btn btn-primary mx-2">Save</button>
            <router-link to="/users" class="btn btn-secondary mx-2">Cancel</router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EditUser',
  data() {
    return {
      user: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      },
    };
  },
  methods: {
    async fetchUserDetails() {
  const userId = this.$route.params.id;
  console.log( userId);
  try {
    const response = await axios.get(`http://localhost:3000/users/${userId}`);
    this.user = response.data;
  } catch (error) {
    console.error('Error fetching user details:', error.response || error.message);
  }
},
    async handleSubmit() {
      const userId = this.$route.params.id; 
      console.log(this.$route.params.id);
      try {
        await axios.put(`http://localhost:3000/users/${userId}`, this.user);
        this.$router.push('/users');
      } catch (error) {
        console.error('Error updating user:', error);
      }
    },
  },
  mounted() {
    this.fetchUserDetails();
  },
};
</script>
