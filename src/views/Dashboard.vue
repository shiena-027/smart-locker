<template>
  <div class="dashboard-root">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h2 class="sidebar-title">Dashboard</h2>

      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="sidebar-btn"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </aside>

    <!-- Main Content -->
    <main class="content">
      <section class="glass-card" :class="activeTab">

        <!-- Lockers -->
        <center>
          <template v-if="activeTab === 'lockers'">
          <SelectLocker />
          </template>
        </center>

        <!-- Map -->
        <center>
          <template v-if="activeTab === 'map'">
          <h2>Locker Map</h2>
          <ul>
            <li>Unit 001 – Ground Floor</li>
            <li>Unit 002 – Food Court</li>
            <li>Unit 003 – Parking Area</li>
          </ul>
          </template>
        </center>

        <!-- Contact / Help -->
         <center>
         <template v-if="activeTab === 'contact'">
          <h2>Contact / Help</h2>
          <form @submit.prevent="submitHelp">
            <input v-model="contact.name" placeholder="Your Name" required />
            <input v-model="contact.email" type="email" placeholder="Your Email" required />
            <textarea v-model="contact.message" placeholder="Your Message" required />
            <button type="submit">Send</button>
          </form>
         </template>
        </center>

        <!-- FAQ -->
          <template v-if="activeTab === 'faq'">
          <h2><center>FAQ</center></h2>
          <div v-for="(faq, i) in faqs" :key="i" class="faq-item">
            <strong>{{ faq.question }}</strong>
            <p>{{ faq.answer }}</p>
          </div>
          </template>
      </section>
    </main>
  </div>
</template>

<script>
import SelectLocker from '@/views/SelectLocker.vue'

export default {
  name: 'Dashboard',
  components: { SelectLocker },
  data() {
    return {
      unitID: '', // Store entered unit ID
      activeTab: 'lockers',
      tabs: [
        { key: 'lockers', label: 'Lockers' },
        { key: 'map', label: 'Locker Map' },
        { key: 'contact', label: 'Contact / Help' },
        { key: 'faq', label: 'FAQ' }
      ],
      contact: { name: '', email: '', message: '' },
      faqs: [
        { question: 'How do I reserve a locker?', answer: 'Select an available locker from the lockers panel.' },
        { question: 'What if the locker does not open?', answer: 'Use the contact form to reach support.' },
        { question: "What if I lose my QR code?", answer: "If you lose your QR code, contact support immediately. They will issue a new code after verifying your reservation."},
        { question: "Can I reserve multiple lockers?", answer: "Yes, but each locker requires a separate reservation and deposit."},
        { question: "Are there different locker sizes?", answer: "Yes, lockers come in Small, Medium, and Large sizes. The size is displayed on the dashboard."},
        { question: "What should I do if the locker sensor doesn't detect my items?",  answer: "You can use the 'Force Lock' option to manually lock your locker, ensuring your items are secured."}

      ]
    }
  },
  mounted() {
    // Get unit ID from query parameter
    this.unitID = this.$route.query.unit || ''
    if (!this.unitID) {
      // Redirect back if no unit ID
      this.$router.push('/')
    }
  },
  methods: {
    submitHelp() {
      alert('Message sent!')
      this.contact = { name: '', email: '', message: '' }
    }
  }
}
</script>

<style scoped>
/* Root — full-screen, transparent */
.dashboard-root {
  width: 100vw;
  height: 100vh;
  display: flex;
  background: transparent !important;
}

/* Sidebar */
.sidebar {
  width: 260px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(15, 23, 42, 0.95);
  color: white;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.sidebar-title {
  font-size: 1.6rem;
  margin-bottom: 24px;
}

.sidebar-btn {
  background: transparent;
  border: none;
  color: white;
  padding: 14px;
  margin-bottom: 10px;
  text-align: left;
  border-radius: 8px;
  cursor: pointer;
}

.sidebar-btn.active,
.sidebar-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Content */
.content {
  margin-left: 260px;
  width: calc(100vw - 260px);
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent !important;
}

/* Glass card */
.glass-card {
  width: 100%;
  max-width: 900px;
  max-height: 85vh;
  padding: 32px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: #0f172a;
  overflow-y: auto;
}

/* White text for Map, FAQ, Contact */
.glass-card.map,
.glass-card.faq,
.glass-card.contact {
  color: #ffffff;
}

.glass-card.map p,
.glass-card.map li,
.glass-card.faq p,
.glass-card.faq strong,
.glass-card.contact p,
.glass-card.contact label {
  color: #ffffff;
}

.glass-card.faq p {
  color: rgba(255, 255, 255, 0.85);
}

.glass-card.contact input,
.glass-card.contact textarea {
  background: rgba(255, 255, 255, 0.9);
  color: #0f172a;
}

/* Typography */
h2 {
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.subtitle {
  margin-bottom: 20px;
  color: #334155;
}

p,
li,
label {
  color: #1e293b;
}

/* Forms */
input,
textarea {
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

button {
  padding: 12px 20px;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  border: none;
}

.faq-item {
  margin-bottom: 14px;
}

.unit-display {
  margin-bottom: 16px;
  font-size: 1.1rem;
}
</style>
