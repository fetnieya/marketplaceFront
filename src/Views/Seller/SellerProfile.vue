<template>
  <div class="seller-profile-content">
    <h1 class="h2 mb-4">Profil</h1>

    <section class="card border border-2 py-1 p-md-2 p-xl-3 p-xxl-4 mb-3">
      <div class="card-body">
        <div class="d-flex align-items-center">
          <div class="dropdown">
            <label
              class="d-flex flex-column justify-content-end position-relative overflow-hidden rounded-circle bg-size-cover bg-position-center flex-shrink-0"
              :style="avatarBackground"
              aria-label="Télécharger une photo"
            >
              <input class="d-none" type="file" accept="image/*" @change="onAvatarChange">
              <span class="d-block text-light text-center lh-1 pb-1" style="background-color: rgba(0,0,0,.45)">
                <i class="ai-camera"></i>
              </span>
            </label>
          </div>
          <div class="ps-3">
            <h3 class="h6 mb-1">Photo de profil</h3>
            <p class="fs-sm text-body-secondary mb-0">PNG ou JPG jusqu'à 5 MB. Toutes les tailles et résolutions acceptées.</p>
            <div v-if="avatarError" class="text-danger small mt-1">{{ avatarError }}</div>
          </div>
        </div>

        <div class="row g-3 g-sm-4 mt-0 mt-lg-2">
          <div class="col-sm-6">
            <label class="form-label" for="fn">Prénom</label>
            <input v-model.trim="profileForm.firstName" class="form-control" type="text" id="fn" autocomplete="given-name">
          </div>
          <div class="col-sm-6">
            <label class="form-label" for="ln">Nom</label>
            <input v-model.trim="profileForm.lastName" class="form-control" type="text" id="ln" autocomplete="family-name">
          </div>
          <div class="col-sm-6">
            <label class="form-label" for="email">Adresse e-mail</label>
            <input v-model.trim="profileForm.email" class="form-control" type="email" id="email" autocomplete="email">
          </div>
          <div class="col-sm-6">
            <label class="form-label" for="phone">Téléphone</label>
            <input v-model.trim="profileForm.phone" class="form-control" type="tel" id="phone" placeholder="12345678" autocomplete="tel">
          </div>
          <div class="col-12">
            <div v-if="profileError" class="alert alert-danger py-2">{{ profileError }}</div>
            <div v-if="profileSuccess" class="alert alert-success py-2">{{ profileSuccess }}</div>
          </div>
          <div class="col-12 d-flex justify-content-end pt-2">
            <button class="btn btn-secondary" type="button" @click="resetProfile" :disabled="profileLoading">Annuler</button>
            <button class="btn btn-primary ms-3" type="button" @click="saveProfile" :disabled="profileLoading">
              <span v-if="profileLoading" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="card border border-2 py-1 p-md-2 p-xl-3 p-xxl-4 mb-3">
      <div class="card-body">
        <div class="d-flex align-items-center pb-3 mt-sm-n1 mb-0 mb-lg-1 mb-xl-3">
          <i class="ai-lock-closed text-primary lead pe-1 me-2"></i>
          <h2 class="h4 mb-0">Modification du mot de passe</h2>
        </div>

        <div class="row align-items-center g-3 g-sm-4 pb-2">
          <div class="col-sm-6">
            <label class="form-label" for="current-pass">Mot de passe actuel</label>
            <div class="password-toggle">
              <input v-model="passwordForm.currentPassword" class="form-control" type="password" id="current-pass" autocomplete="current-password">
              <label class="password-toggle-btn" aria-label="Afficher/masquer le mot de passe">
                <input class="password-toggle-check" type="checkbox">
                <span class="password-toggle-indicator"></span>
              </label>
            </div>
          </div>
          <div class="col-sm-6"></div>
          <div class="col-sm-6">
            <label class="form-label" for="new-pass">Nouveau mot de passe</label>
            <div class="password-toggle">
              <input v-model="passwordForm.newPassword" class="form-control" type="password" id="new-pass" autocomplete="new-password">
              <label class="password-toggle-btn" aria-label="Afficher/masquer le mot de passe">
                <input class="password-toggle-check" type="checkbox">
                <span class="password-toggle-indicator"></span>
              </label>
            </div>
          </div>
          <div class="col-sm-6">
            <label class="form-label" for="confirm-pass">Confirmer le nouveau mot de passe</label>
            <div class="password-toggle">
              <input v-model="passwordForm.confirmPassword" class="form-control" type="password" id="confirm-pass" autocomplete="new-password">
              <label class="password-toggle-btn" aria-label="Afficher/masquer le mot de passe">
                <input class="password-toggle-check" type="checkbox">
                <span class="password-toggle-indicator"></span>
              </label>
            </div>
          </div>
        </div>

        <div class="alert alert-info d-flex my-3">
          <i class="ai-circle-info fs-xl me-2"></i>
          <p class="mb-0">Le mot de passe doit contenir au moins 8 caractères.</p>
        </div>
        <div v-if="passwordError" class="alert alert-danger py-2">{{ passwordError }}</div>
        <div v-if="passwordSuccess" class="alert alert-success py-2">{{ passwordSuccess }}</div>
        <div class="d-flex justify-content-end pt-2">
          <button class="btn btn-secondary" type="button" @click="resetPasswordForm" :disabled="passwordLoading">Annuler</button>
          <button class="btn btn-primary ms-3" type="button" @click="changePassword" :disabled="passwordLoading">
            <span v-if="passwordLoading" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SellerProfile',
  data() {
    return {
      apiBase: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000',
      currentUser: null,
      profileForm: {
        id: null,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        bio: '',
        avatar: null,
      },
      profileLoading: false,
      profileSuccess: '',
      profileError: '',
      avatarError: '',
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      passwordLoading: false,
      passwordSuccess: '',
      passwordError: '',
    };
  },
  computed: {
    avatarBackground() {
      if (this.profileForm.avatar) {
        return { width: '80px', height: '80px', backgroundImage: `url(${this.profileForm.avatar})` };
      }
      return {
        width: '80px',
        height: '80px',
        backgroundColor: '#e0e7ff',
        color: '#1f2937',
        fontWeight: '700',
        fontSize: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textTransform: 'uppercase',
      };
    },
  },
  mounted() {
    this.loadCurrentUser();
  },
  methods: {
    async loadCurrentUser() {
      try {
        const stored = localStorage.getItem('currentUser');
        const user = stored ? JSON.parse(stored) : null;
        this.currentUser = user;
        
        if (user && user.id) {
          try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${this.apiBase}/users/${user.id}`, {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
              withCredentials: true,
            });
            const userData = response.data;
            
            this.profileForm = {
              id: userData.id || user.id,
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              email: userData.email || '',
              phone: userData.phone || '',
              bio: userData.bio || '',
              avatar: userData.photo || userData.avatar || null,
            };
          } catch (apiError) {
            console.warn('Failed to load user from API, using stored data', apiError);
            this.profileForm = {
              id: user.id || user._id || user.userId || null,
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              email: user.email || '',
              phone: user.phone || '',
              bio: user.bio || '',
              avatar: user.avatar || user.photo || user.photoURL || null,
            };
          }
        } else if (user) {
          this.profileForm = {
            id: user.id || user._id || user.userId || null,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            bio: user.bio || '',
            avatar: user.avatar || user.photo || user.photoURL || null,
          };
        }
      } catch (err) {
        console.error('Failed to load user from storage', err);
      }
    },
    buildInitials() {
      const first = this.profileForm.firstName?.trim()?.[0] || '';
      const last = this.profileForm.lastName?.trim()?.[0] || '';
      return (first + last || 'U').slice(0, 2);
    },
    onAvatarChange(event) {
      const file = event.target.files?.[0];
      this.avatarError = '';
      if (!file) return;
      
      if (file.size > 5 * 1024 * 1024) {
        this.avatarError = 'Fichier trop volumineux. Veuillez choisir un fichier de moins de 5 MB.';
        return;
      }
      if (!file.type.startsWith('image/')) {
        this.avatarError = 'Veuillez sélectionner une image valide.';
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.compressImage(e.target?.result, file.type);
      };
      reader.onerror = () => {
        this.avatarError = 'Impossible de lire l\'image. Veuillez réessayer.';
      };
      reader.readAsDataURL(file);
    },
    compressImage(dataUrl, fileType, maxWidth = 800, maxHeight = 800, quality = 0.7) {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          } else {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        try {
          const compressedDataUrl = canvas.toDataURL(fileType || 'image/jpeg', quality);
          this.profileForm.avatar = compressedDataUrl;
        } catch (error) {
          console.error('Error compressing image:', error);
          this.profileForm.avatar = dataUrl;
        }
      };
      img.onerror = () => {
        this.avatarError = 'Erreur lors du chargement de l\'image.';
      };
      img.src = dataUrl;
    },
    resetProfile() {
      this.loadCurrentUser();
      this.profileError = '';
      this.profileSuccess = '';
      this.avatarError = '';
    },
    async saveProfile() {
      this.profileError = '';
      this.profileSuccess = '';
      this.profileLoading = true;

      try {
        const userId = this.profileForm.id;
        if (!userId) {
          this.profileError = 'Identifiant utilisateur manquant. Veuillez vous reconnecter.';
          this.profileLoading = false;
          return;
        }

        const token = localStorage.getItem('authToken');
        const payload = {
          firstName: this.profileForm.firstName,
          lastName: this.profileForm.lastName,
          email: this.profileForm.email,
          phone: this.profileForm.phone,
        };

        if (this.profileForm.avatar) {
          payload.photo = this.profileForm.avatar;
        }

        const config = {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          withCredentials: true,
        };

        const response = await axios.put(`${this.apiBase}/users/${userId}`, payload, config);
        const updatedUser = response.data;

        delete updatedUser.password;
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        // Dispatch custom event to notify other components (like AppHeader) of user update
        window.dispatchEvent(new CustomEvent('user-updated'));

        this.profileSuccess = 'Profil mis à jour avec succès.';
        this.loadCurrentUser();
        
        // Emit event to parent to reload user data
        this.$emit('profile-updated');
      } catch (error) {
        console.error('Error updating profile:', error);
        if (error.response) {
          this.profileError = error.response.data?.message || 'Erreur lors de la mise à jour du profil.';
        } else {
          this.profileError = 'Erreur de connexion. Veuillez réessayer.';
        }
      } finally {
        this.profileLoading = false;
      }
    },
    resetPasswordForm() {
      this.passwordForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      };
      this.passwordError = '';
      this.passwordSuccess = '';
    },
    async changePassword() {
      this.passwordError = '';
      this.passwordSuccess = '';
      const { currentPassword, newPassword, confirmPassword } = this.passwordForm;
      
      if (!currentPassword || !newPassword || !confirmPassword) {
        this.passwordError = 'Veuillez remplir tous les champs du mot de passe.';
        return;
      }

      if (newPassword.length < 8) {
        this.passwordError = 'Le nouveau mot de passe doit contenir au moins 8 caractères.';
        return;
      }

      if (newPassword !== confirmPassword) {
        this.passwordError = 'Les mots de passe ne correspondent pas.';
        return;
      }

      this.passwordLoading = true;

      try {
        const userId = this.profileForm.id;
        if (!userId) {
          this.passwordError = 'Identifiant utilisateur manquant. Veuillez vous reconnecter.';
          this.passwordLoading = false;
          return;
        }

        const token = localStorage.getItem('authToken');
        const payload = {
          currentPassword,
          password: newPassword,
        };

        const config = {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          withCredentials: true,
        };

        await axios.put(`${this.apiBase}/users/${userId}`, payload, config);

        this.passwordSuccess = 'Mot de passe modifié avec succès.';
        this.resetPasswordForm();
      } catch (error) {
        console.error('Error updating password', error);
        if (error.response) {
          this.passwordError = error.response.data?.message || 'Erreur lors de la modification du mot de passe.';
        } else {
          this.passwordError = 'Erreur de connexion. Veuillez réessayer.';
        }
      } finally {
        this.passwordLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.seller-profile-content {
  width: 100%;
}

label[aria-label="Télécharger une photo"] {
  cursor: pointer;
}
</style>
