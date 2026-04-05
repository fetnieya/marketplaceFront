<template>
  <div class="asmad-chat-root">
    <button
      type="button"
      class="asmad-chat-fab btn btn-primary"
      aria-label="Ouvrir l’assistant shopping"
      @click="toggleOpen"
    >
      <svg class="asmad-chat-fab-icon" width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm0 14H6l-2 2V4h16v12z"
        />
      </svg>
    </button>

    <transition name="asmad-chat-slide">
      <div
        v-if="open"
        class="asmad-chat-panel card shadow-lg border-0"
        role="dialog"
        aria-labelledby="asmad-chat-title"
      >
        <div class="card-header d-flex align-items-center justify-content-between py-3">
          <div>
            <h2 id="asmad-chat-title" class="h6 mb-0">{{ panelTitle }}</h2>
            <small class="text-body-secondary">{{ panelSubtitle }}</small>
          </div>
          <button type="button" class="btn btn-sm btn-outline-secondary" @click="open = false">
            Fermer
          </button>
        </div>
        <div class="card-body d-flex flex-column p-0">
          <div v-if="!authTokenPresent" class="alert alert-light border-bottom rounded-0 mb-0 py-3 px-3">
            <router-link :to="{ path: '/sign-in', query: { redirect: $route.fullPath } }" class="fw-semibold">
              Connectez-vous
            </router-link>
            pour discuter avec l’assistant (requis par le serveur).
          </div>

          <div ref="threadEl" class="asmad-chat-thread flex-grow-1 px-3 py-3">
            <p v-if="messages.length === 0" class="text-body-secondary small mb-0">
              {{ emptyThreadHint }}
            </p>
            <div
              v-for="m in messages"
              :key="m.id"
              class="mb-3"
              :class="{ 'text-end': m.sender === 'user' }"
            >
              <div class="small text-body-secondary mb-1">
                {{ m.sender === 'user' ? 'Vous' : 'Assistant' }}
              </div>
              <div
                class="d-inline-block px-3 py-2 rounded-3 text-start"
                :class="m.sender === 'user' ? 'bg-primary text-white' : 'bg-light text-body'"
                style="max-width: 100%; white-space: pre-wrap; word-break: break-word;"
              >
                {{ m.text }}
              </div>
            </div>
            <div v-if="loading" class="d-flex align-items-center gap-2 text-body-secondary small">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              L’assistant réfléchit…
            </div>
          </div>

          <div v-if="lastRecommended.length" class="border-top px-3 py-2 bg-light">
            <div class="small fw-semibold mb-2">Produits suggérés</div>
            <div class="d-flex flex-column gap-2">
              <router-link
                v-for="p in lastRecommended"
                :key="p.id"
                :to="`/shop-single/${p.id}`"
                class="d-flex align-items-center gap-2 text-decoration-none text-body rounded-2 p-2 asmad-rec-card"
                @click="open = false"
              >
                <div class="asmad-rec-thumb flex-shrink-0 rounded-2 overflow-hidden bg-white">
                  <img :src="recImage(p)" :alt="p.name" class="w-100 h-100 object-fit-contain" />
                </div>
                <div class="min-w-0">
                  <div class="fw-semibold text-truncate">{{ p.name }}</div>
                  <div class="text-primary small">{{ formatPrice(p.price) }}</div>
                </div>
              </router-link>
            </div>
          </div>

          <div v-if="error" class="alert alert-danger py-2 mx-3 mb-2 small">{{ error }}</div>

          <form class="border-top p-3 d-flex gap-2 align-items-end" @submit.prevent="send">
            <input
              ref="inputRef"
              v-model="input"
              type="text"
              class="form-control"
              placeholder="Votre message…"
              :disabled="loading || !authTokenPresent"
              autocomplete="off"
            />
            <button
              type="submit"
              class="btn btn-primary flex-shrink-0"
              :disabled="loading || !authTokenPresent || !input.trim()"
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';

const STORAGE_KEYS = {
  shop: 'asmad_rag_chat_v1',
  admin: 'asmad_rag_chat_admin_v1',
  seller: 'asmad_rag_chat_seller_v1',
};

export default {
  name: 'AsmadChatWidget',
  props: {
    /** shop = catalogue client ; admin / seller = prévisions + même API */
    variant: {
      type: String,
      default: 'shop',
      validator: (v) => ['shop', 'admin', 'seller'].includes(v),
    },
  },
  data() {
    return {
      apiBase: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000',
      open: false,
      input: '',
      messages: [],
      loading: false,
      error: '',
      lastRecommended: [],
      authTokenPresent: false,
    };
  },
  computed: {
    panelTitle() {
      if (this.variant === 'admin') return 'Assistant Asm@d — Admin';
      if (this.variant === 'seller') return 'Assistant Asm@d — Vendeur';
      return 'Assistant Asm@d';
    },
    panelSubtitle() {
      if (this.variant === 'admin') {
        return 'Prévision CA (proxy profit) sur 5 mois, ou questions catalogue';
      }
      if (this.variant === 'seller') {
        return 'Prévision des ventes (unités) sur 5 mois, ou catalogue';
      }
      return 'Conseils et produits du catalogue';
    },
    emptyThreadHint() {
      if (this.variant === 'admin') {
        return 'Ex. : « Prévision du profit sur les 5 prochains mois » — le serveur estime le CA mensuel plateforme (sans charges) par tendance sur 12 mois.';
      }
      if (this.variant === 'seller') {
        return 'Ex. : « Prévision des articles vendus sur 5 mois » — estimation des quantités vendues sur vos lignes, à partir de l’historique récent.';
      }
      return 'Indiquez des mots présents dans les annonces (marque, modèle, catégorie). Seuls les produits dont la fiche contient au moins un de ces mots apparaissent en suggestion.';
    },
    storageKey() {
      return STORAGE_KEYS[this.variant] || STORAGE_KEYS.shop;
    },
  },
  watch: {
    open(val) {
      if (val) {
        this.refreshAuth();
        this.$nextTick(() => {
          this.focusInput();
          this.scrollThread();
        });
      }
    },
    messages: {
      deep: true,
      handler() {
        this.$nextTick(() => this.scrollThread());
      },
    },
  },
  mounted() {
    this.refreshAuth();
    this.loadState();
    this.onOpenChatbot = () => {
      this.refreshAuth();
      this.open = true;
      this.$nextTick(() => this.focusInput());
    };
    window.addEventListener('open-chatbot', this.onOpenChatbot);
  },
  beforeUnmount() {
    window.removeEventListener('open-chatbot', this.onOpenChatbot);
  },
  methods: {
    refreshAuth() {
      this.authTokenPresent = !!localStorage.getItem('authToken');
    },
    toggleOpen() {
      this.refreshAuth();
      this.open = !this.open;
      if (this.open) {
        this.$nextTick(() => this.focusInput());
      }
    },
    focusInput() {
      const el = this.$refs.inputRef;
      if (el && typeof el.focus === 'function') el.focus();
    },
    scrollThread() {
      const el = this.$refs.threadEl;
      if (el) el.scrollTop = el.scrollHeight;
    },
    loadState() {
      try {
        const raw = localStorage.getItem(this.storageKey);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.messages)) {
          this.messages = parsed.messages;
        }
      } catch (_) {
        /* ignore */
      }
    },
    saveState() {
      try {
        localStorage.setItem(
          this.storageKey,
          JSON.stringify({ messages: this.messages }),
        );
      } catch (_) {
        /* ignore */
      }
    },
    buildHistoryForApi() {
      return this.messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));
    },
    async send() {
      const text = this.input.trim();
      if (!text || this.loading || !this.authTokenPresent) return;

      const userMsg = { id: Date.now(), sender: 'user', text };
      this.messages.push(userMsg);
      this.input = '';
      this.error = '';
      this.loading = true;
      this.lastRecommended = [];
      this.saveState();

      const history = this.buildHistoryForApi().slice(0, -1);

      try {
        const token = localStorage.getItem('authToken');
        const { data } = await axios.post(
          `${this.apiBase}/chat`,
          { message: text, history },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        const reply = data?.reply || '';
        this.messages.push({
          id: Date.now() + 1,
          sender: 'assistant',
          text: reply || 'Réponse vide.',
        });
        this.lastRecommended = Array.isArray(data?.recommended) ? data.recommended : [];
        this.saveState();
      } catch (err) {
        console.error(err);
        this.error = this.formatChatError(err);
        this.messages.pop();
      } finally {
        this.loading = false;
      }
    },
    recImage(p) {
      if (p?.image && typeof p.image === 'string') return p.image;
      return this.placeholderImg();
    },
    placeholderImg() {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+';
    },
    formatPrice(price) {
      if (price == null || price === '') return '—';
      const num = typeof price === 'string' ? parseFloat(price) : Number(price);
      if (Number.isNaN(num)) return '—';
      return (
        new Intl.NumberFormat('fr-FR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(num) + ' DT'
      );
    },
    formatChatError(err) {
      if (!err.response) {
        return (
          'Connexion au serveur impossible. Vérifiez que l’API NestJS tourne (souvent le port 3000), que VUE_APP_API_BASE_URL dans .env du front pointe vers cette URL, et que le navigateur n’a pas bloqué la requête (CORS).'
        );
      }
      const status = err.response.status;
      const d = err.response.data;
      let msg = d?.message;
      if (Array.isArray(msg)) {
        msg = msg.filter(Boolean).join(' ');
      }
      if (typeof msg !== 'string' || !msg.trim()) {
        msg = err.message || 'Erreur inconnue.';
      }
      if (status === 401) {
        return 'Session expirée. Reconnectez-vous.';
      }
      if (status === 503) {
        return (
          msg +
          ' — Vérifiez OPENAI_API_KEY et OPENAI_CHAT_MODEL dans le fichier .env du serveur.'
        );
      }
      return msg;
    },
  },
};
</script>

<style scoped>
.asmad-chat-root {
  position: relative;
}

.asmad-chat-fab {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1080;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
}

.asmad-chat-fab-icon {
  display: block;
}

.asmad-chat-panel {
  position: fixed;
  right: 20px;
  bottom: 92px;
  width: min(400px, calc(100vw - 32px));
  max-height: min(560px, calc(100vh - 120px));
  z-index: 1079;
  display: flex;
  flex-direction: column;
}

.asmad-chat-thread {
  overflow-y: auto;
  min-height: 200px;
  max-height: 320px;
}

.asmad-rec-thumb {
  width: 52px;
  height: 52px;
}

.asmad-rec-card:hover {
  background: rgba(0, 0, 0, 0.04);
}

.asmad-chat-slide-enter-active,
.asmad-chat-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.asmad-chat-slide-enter-from,
.asmad-chat-slide-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
