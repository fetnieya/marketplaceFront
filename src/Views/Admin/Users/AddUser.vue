<template>
  <!-- Full-page container -->
  <div class="d-flex align-items-center justify-content-center min-vh-100 bg-light">
    <!-- Form container -->
    <div class="col-lg-6 col-md-8 col-sm-10 bg-white shadow p-4 rounded">
      <h1 class="h2 mb-4 text-center">Add User</h1>
      <form @submit.prevent="addUser">
        <div class="container">
          <!-- Text input -->
          <div class="mb-3">
            <label for="first-name-input" class="form-label">First Name</label>
            <input
              v-model="newUser.firstName"
              class="form-control"
              type="text"
              id="first-name-input"
              placeholder="John"
              required
            />
          </div>

          <div class="mb-3">
            <label for="last-name-input" class="form-label">Last Name</label>
            <input
              v-model="newUser.lastName"
              class="form-control"
              type="text"
              id="last-name-input"
              placeholder="Doe"
              required
            />
          </div>

          <!-- Email input -->
          <div class="mb-3">
            <label for="email-input" class="form-label">Email</label>
            <input
              v-model="newUser.email"
              class="form-control"
              type="email"
              id="email-input"
              placeholder="email@example.com"
              required
              :class="{'is-invalid': emailError}"
            />
            <div v-if="emailError" class="invalid-feedback">
              Please enter a valid email.
            </div>
          </div>

          <!-- Phone Input -->
          <div class="mb-3">
            <label for="tel-input" class="form-label">Phone</label>
            <input
              v-model="newUser.phone"
              class="form-control"
              type="tel"
              id="tel-input"
              placeholder="1-(770)-334-2518"
              required
              
            />
           
          </div>

          <!-- Button Container -->
          <div class="d-flex justify-content-center mt-3">
            <!-- Primary solid button -->
            <button type="submit" class="btn btn-primary mx-2">Add</button>
            <!-- Secondary solid button -->
            <router-link to="/users">
              <button type="button" class="btn btn-secondary mx-2">Cancel</button>
            </router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AddUser',
  data() {
    return {
      newUser: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      },
      emailError: false, // Flag for email validation error
    };
  },
  methods: {
    validateEmail() {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      this.emailError = !emailRegex.test(this.newUser.email);
    },
    async addUser() {
      // Validate email before submitting
      this.validateEmail();
      if (this.emailError) {
        return;
      }
      try {
        const response = await axios.post('http://localhost:3000/users', {...this.newUser,password:this.newUser.email});
        console.log('User added successfully:', response.data);
        this.newUser = { firstName: '', lastName: '', email: '', phone: '' };
        console.log('Reset newUser:', this.newUser);
        this.$router.push('/users')
      } catch (error) {
        console.error('Error adding user:', error);
        alert('Failed to add user. Please try again.');
      }
    },
  },
};
</script>


<style scoped>
/* Ensuring the parent container takes full height */
.min-vh-100 {
  min-height: 100vh;
}
.bg-light {
  background-color: #f8f9fa !important;
}
.is-invalid {
  border-color: #dc3545 !important;
}
.invalid-feedback {
  color: #dc3545;
}
</style>
