<template>
  <div class="backdrop-blur-xl bg-white/20 border border-white/30 p-8 rounded-2xl shadow-2xl w-[420px] text-center relative">
    <h2 class="text-2xl font-bold mb-4 text-white">Locker Grid</h2>
    <p class="text-white/60 text-sm mb-4">Unit: {{ unitId }}</p>

    <div class="flex justify-center gap-6 mb-6 text-sm">
      <div class="flex items-center gap-2 text-white">
        <span class="w-4 h-4 rounded bg-gradient-to-b from-green-400 to-green-600 shadow"></span>
        Avail
      </div>
      <div class="flex items-center gap-2 text-gray-300">
        <span class="w-4 h-4 rounded bg-red-500 shadow"></span>
        Locked
      </div>
      <div class="flex items-center gap-2 text-yellow-300">
        <span class="w-4 h-4 rounded bg-yellow-500 shadow"></span>
        Busy
      </div>
    </div>

    <div v-if="loading" class="text-white animate-pulse">Loading lockers...</div>

    <div v-else class="grid grid-cols-2 gap-4">
      <button
        v-for="locker in lockers"
        :key="locker.id"
        @click="handleLockerClick(locker)"
        class="relative h-24 rounded-xl font-bold text-lg transition transform flex flex-col items-center justify-center border-2 border-transparent"
        :class="getLockerClass(locker.status)"
      >
        <span>Locker {{ locker.id }}</span>
        
        <span v-if="locker.status === 'available'" class="text-xs font-normal opacity-80 uppercase">Tap to Reserve</span>
        <span v-else-if="locker.status === 'occupied'" class="text-xs font-normal opacity-80 uppercase text-red-100">Tap to Unlock</span>
        <span v-else-if="locker.status === 'reserved'" class="text-xs font-normal opacity-80 uppercase text-yellow-900">Tap to Fix</span>
        <span v-else class="text-xs font-normal opacity-80 uppercase">{{ locker.status }}</span>
      </button>
    </div>

    <div v-if="showUnlockModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div class="bg-gray-900 border border-white/20 p-6 rounded-2xl shadow-2xl w-full max-w-xs text-center">
            <h3 class="text-xl font-bold text-white mb-2">🔐 Unlock Locker {{ targetLocker?.id }}</h3>
            <p class="text-gray-400 text-sm mb-4">Enter the 6-digit code from your QR key.</p>
            
            <input 
                v-model="inputCode" 
                type="text" 
                maxlength="6"
                placeholder="123456"
                class="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white text-center text-2xl tracking-widest font-mono mb-4 focus:outline-none focus:border-purple-500 transition"
            />

            <div class="grid grid-cols-2 gap-3">
                <button @click="closeModals" class="py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition">Cancel</button>
                <button @click="submitUnlock" class="py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-bold transition">Unlock</button>
            </div>
        </div>
    </div>

    <div v-if="showFixModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div class="bg-gray-900 border border-white/20 p-6 rounded-2xl shadow-2xl w-full max-w-xs text-center">
            <h3 class="text-xl font-bold text-yellow-400 mb-2">⚠️ Locker {{ targetLocker?.id }} Issue</h3>
            <p class="text-gray-300 text-sm mb-6">
                This locker is marked "Reserved" but seems inactive.
            </p>

            <div class="space-y-3">
                <button @click="confirmResume" class="w-full py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 font-bold transition flex items-center justify-center gap-2">
                    <span>➡️ Continue Session</span>
                </button>

                <button @click="confirmReset" class="w-full py-3 rounded-lg bg-red-600/20 border border-red-500/50 text-red-200 hover:bg-red-600 hover:text-white transition flex items-center justify-center gap-2">
                    <span>🔄 Reset to Available</span>
                </button>
                
                <button @click="closeModals" class="text-gray-500 text-sm hover:text-white mt-2">Close</button>
            </div>
        </div>
    </div>

  </div>
</template>

<script>
import { ref, onValue, update } from "firebase/database";
import { db } from "../firebase";
import { toast } from 'vue3-toastify';

export default {
  data() {
    return {
      lockers: [],
      loading: true,
      
      // Modal State
      showUnlockModal: false,
      showFixModal: false,
      targetLocker: null,
      inputCode: ''
    };
  },
  computed: {
    unitId() { return this.$route.query.unit || 'unit_001'; }
  },
  mounted() {
    const lockersRef = ref(db, `units/${this.unitId}/lockers`); 
    onValue(lockersRef, (snapshot) => {
      const data = snapshot.val();
      this.lockers = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      this.loading = false;
    });
  },
  methods: {
    getLockerClass(status) {
      switch (status) {
        case 'available': return 'bg-gradient-to-b from-green-400 to-green-600 text-white shadow-lg hover:-translate-y-1 hover:shadow-2xl hover:border-white/50 cursor-pointer';
        case 'occupied': return 'bg-gradient-to-b from-red-500 to-red-700 text-white shadow-md hover:bg-red-600 cursor-pointer';
        case 'reserved': return 'bg-gradient-to-b from-yellow-400 to-yellow-600 text-black shadow-md hover:bg-yellow-500 cursor-pointer';
        default: return 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-70';
      }
    },

    // --- MAIN CLICK HANDLER ---
    handleLockerClick(locker) {
      this.targetLocker = locker;
      this.inputCode = ''; // Clear previous inputs

      if (locker.status === 'available') {
        this.reserveLocker(locker);
      } else if (locker.status === 'occupied') {
        this.showUnlockModal = true; // Open Custom Modal
      } else if (locker.status === 'reserved') {
        this.showFixModal = true; // Open Custom Modal
      }
    },

    closeModals() {
      this.showUnlockModal = false;
      this.showFixModal = false;
      this.targetLocker = null;
    },

    // --- LOGIC 1: RESERVE ---
    reserveLocker(locker) {
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      this.updateLockerStatus(locker.id, 'reserved', newCode, true).then(() => {
        this.$router.push({
          path: '/open',
          query: { locker: locker.id, code: newCode, unit: this.unitId }
        });
      });
    },

    // --- LOGIC 2: UNLOCK ---
    submitUnlock() {
      if (!this.inputCode) return;
      
      if (this.inputCode === this.targetLocker.active_code) {
        this.updateLockerStatus(this.targetLocker.id, 'available', '', true, false).then(() => {
          toast.success(`🔓 Locker ${this.targetLocker.id} Unlocked!`);
          this.closeModals();
        });
      } else {
        toast.error("❌ Invalid Code!");
        this.inputCode = ''; // Clear input on error
      }
    },

    // --- LOGIC 3: FIX ---
    confirmReset() {
      this.updateLockerStatus(this.targetLocker.id, 'available', '', false, false).then(() => {
        toast.info("Locker reset to Available.");
        this.closeModals();
      });
    },
    
    confirmResume() {
      const code = this.targetLocker.active_code || '000000';
      this.$router.push({
        path: '/open',
        query: { locker: this.targetLocker.id, code: code, unit: this.unitId }
      });
    },

    // --- HELPER ---
    updateLockerStatus(lockerId, status, code, doorOpen, weightDetected) {
      const updates = {};
      const basePath = `/units/${this.unitId}/lockers/${lockerId}`;
      
      if (status !== undefined) updates[`${basePath}/status`] = status;
      if (code !== undefined) updates[`${basePath}/active_code`] = code;
      if (doorOpen !== undefined) updates[`${basePath}/door_open_request`] = doorOpen;
      if (weightDetected !== undefined) updates[`${basePath}/weight_detected`] = weightDetected;

      return update(ref(db), updates).catch(err => toast.error(err.message));
    }
  }
};
</script>