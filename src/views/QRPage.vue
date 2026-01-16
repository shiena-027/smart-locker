<template>
  <div class="backdrop-blur-xl bg-white/20 border border-white/30 p-8 rounded-2xl shadow-2xl w-96 text-center text-white">
      <h2 class="text-2xl font-bold mb-2">Locker Locked!</h2>
      <p class="text-sm opacity-80 mb-6">Take a screenshot of this key.</p>
      
      <div class="bg-white p-4 rounded-xl inline-block mb-4">
          <qrcode-vue :value="code" :size="200" level="H" render-as="svg" />
      </div>
      
      <div class="bg-black/30 rounded-lg p-3 mb-6">
        <p class="text-xs uppercase tracking-widest opacity-70 mb-1">Manual Unlock Code</p>
        <p class="text-3xl font-mono font-bold tracking-widest text-yellow-400 select-all">{{ code }}</p>
      </div>

      <p class="mb-6 text-sm">
        Scan this QR at the locker <br>
        <span class="opacity-70">OR type the code on this website to unlock.</span>
      </p>

      <button @click="finish" class="bg-white/10 hover:bg-white/20 transition px-4 py-3 rounded-lg w-full font-semibold border border-white/20">
          Done / Return to Home
      </button>
  </div>
</template>
  
<script>
import QrcodeVue from 'qrcode.vue' // <--- IMPORT THE LIBRARY

export default {
    components: {
      QrcodeVue // <--- REGISTER IT
    },
    computed: {
        locker() { return this.$route.query.locker },
        code() { return this.$route.query.code || 'ERROR' },
        unitId() { return this.$route.query.unit || 'unit_001' }
        // We removed the 'qr()' computed property because we don't need the URL anymore
    },
    methods: {
        finish() {
            this.$router.push('/');
        }
    }
}
</script>