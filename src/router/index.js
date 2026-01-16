import { createRouter, createWebHistory } from 'vue-router'

// Import your views
import EnterUnit from '../views/EnterUnit.vue'
import SelectLocker from '../views/SelectLocker.vue'
import OpenLocker from '../views/OpenLocker.vue'
import QRPage from '../views/QRPage.vue'
import Dashboard from '../views/Dashboard.vue'

// Define routes
const routes = [
  { path: '/', name: 'EnterUnit', component: EnterUnit },
  { path: '/lockers', name: 'SelectLocker', component: SelectLocker },
  { path: '/open', name: 'OpenLocker', component: OpenLocker },
  { path: '/qr', name: 'QRPage', component: QRPage },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
]

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
