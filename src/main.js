import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 1. IMPORT TOASTIFY
import Vue3Toastify, { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const app = createApp(App)

app.use(router)

// 2. REGISTER IT (Optional settings included)
app.use(Vue3Toastify, {
  autoClose: 3000, // Disappear after 3 seconds
  position: 'top-center', // Show at the top center
  theme: 'dark', // Fits your dark purple theme better
});

app.mount('#app')