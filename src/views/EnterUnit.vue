<template>
  <div class="backdrop-blur-xl bg-white/20 border border-white/30 p-8 rounded-2xl shadow-2xl w-96 text-center">
      <h1 class="text-3xl font-bold mb-6 text-white">Smart Locker</h1>
      
      <input 
        v-model="unit" 
        placeholder="Enter Locker Unit ID" 
        class="bg-white/70 backdrop-blur-md border border-white/60 p-3 w-full mb-5 rounded-lg focus:outline-none placeholder-gray-500 text-black font-semibold"
        @keyup.enter="go"
      />

      <button @click="go" class="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-3 rounded-lg w-full font-semibold">
          Continue
      </button>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify'; // Import the toaster

export default {
    data() {
        return { unit: '' }
    },
    methods: {
        go() {
            if (!this.unit || this.unit.trim() === '') {
                toast.error("Please enter a Locker Unit ID!", {
                    theme: 'dark'
                });
                return; 
            }
            // Push to Dashboard instead of /lockers
            this.$router.push({ path: '/dashboard', query: { unit: this.unit } })
        }
    }
}
</script>
