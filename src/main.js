import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import i18n from './i18n';
import './assets/css/theme.min.css';
import './assets/css/asmad-theme-overrides.css';
import './assets/icons/around-icons.min.css';

const app = createApp(App);
app.use(router);
app.use(i18n);
app.mount('#app');