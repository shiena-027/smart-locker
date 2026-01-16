<template>
  <div class="backdrop-blur-xl bg-white/20 border border-white/30 p-8 rounded-2xl shadow-2xl w-96 text-center text-white relative">
      <h2 class="text-2xl font-bold mb-3">Locker {{ locker }} Open</h2>
      
      <div v-if="!itemDetected" class="bg-yellow-500/50 p-4 rounded-lg mb-6 animate-pulse border border-yellow-200/50">
        <p class="font-bold">⚠️ Waiting for deposit...</p>
        <p class="text-xs mt-1">Place item inside to proceed</p>
      </div>
      
      <div v-else class="bg-green-500/50 p-4 rounded-lg mb-6 border border-green-200/50">
         <p class="font-bold">✅ Items Detected!</p>
         <p class="text-xs mt-1">Ready to lock</p>
      </div>

      <div class="space-y-3">
          <button 
            @click="confirmDeposit" 
            :disabled="!itemDetected"
            :class="!itemDetected ? 'opacity-50 cursor-not-allowed bg-gray-500' : 'bg-purple-600 hover:bg-purple-700'"
            class="transition px-4 py-3 rounded-lg font-bold w-full shadow-lg">
              {{ itemDetected ? 'Lock & Get Key' : 'Scanning Weight...' }}
          </button>

          <button 
            v-if="!itemDetected"
            @click="openForceModal" 
            class="text-xs text-yellow-300 hover:text-yellow-100 underline decoration-dotted transition w-full py-2">
              Sensor not detecting? Click here to Force Lock
          </button>

          <button 
            @click="manualCancel" 
            class="text-sm text-white/70 hover:text-white hover:bg-white/10 py-2 px-4 rounded-lg transition w-full">
              Cancel & Open Door
          </button>
      </div>

      <div v-if="showForceModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div class="bg-gray-900 border border-white/20 p-6 rounded-2xl shadow-2xl w-full max-w-xs text-center">
            <h3 class="text-xl font-bold text-yellow-400 mb-2">⚠️ Force Lock?</h3>
            <p class="text-gray-300 text-sm mb-6">
                The sensor does not detect any items. 
                <br><br>
                <strong>Are you sure your item is inside?</strong>
            </p>

            <div class="space-y-3">
                <button @click="submitForceLock" class="w-full py-3 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 font-bold transition">
                    Yes, Lock it Anyway
                </button>

                <button @click="closeModal" class="w-full py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition">
                    Cancel
                </button>
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
            itemDetected: false,
            isLocked: false,
            showForceModal: false // NEW: Controls the modal visibility
        }
    },
    computed: {
        locker() { return this.$route.query.locker },
        code() { return this.$route.query.code },
        unitId() { return this.$route.query.unit || 'unit_001' }
    },
    mounted() {
        const sensorRef = ref(db, `units/${this.unitId}/lockers/${this.locker}/weight_detected`);
        onValue(sensorRef, (snapshot) => {
            this.itemDetected = snapshot.val() === true;
        });
    },
    // Auto-Cancel Logic if user hits Back Button
    beforeRouteLeave(to, from, next) {
        if (to.path === '/qr' || this.isLocked) {
            next();
            return;
        }

        this.cleanupReservation().then(() => {
            toast.info("Reservation automatically cancelled");
            next(); 
        });
    },
    methods: {
        // --- MODAL CONTROLS ---
        openForceModal() {
            this.showForceModal = true;
        },
        closeModal() {
            this.showForceModal = false;
        },
        submitForceLock() {
            this.showForceModal = false;
            this.finalizeLock('force');
        },

        // --- LOCKING LOGIC ---
        finalizeLock(methodType) {
            this.isLocked = true; // Mark success

            const updates = {};
            const basePath = `units/${this.unitId}/lockers/${this.locker}`;
            
            updates[`${basePath}/status`] = 'occupied';
            updates[`${basePath}/door_open_request`] = false;

            update(ref(db), updates).then(() => {
                if(methodType === 'force') toast.warn("Locked manually (Sensor Bypassed)");
                
                this.$router.push({ 
                    path: '/qr', 
                    query: { locker: this.locker, code: this.code, unit: this.unitId } 
                });
            });
        },

        confirmDeposit() {
            if (!this.itemDetected) {
                toast.error("No items detected! Use 'Force Lock' if needed.");
                return;
            }
            this.finalizeLock('standard');
        },

        // --- CLEANUP LOGIC ---
        cleanupReservation() {
            const updates = {};
            const basePath = `units/${this.unitId}/lockers/${this.locker}`;
            
            updates[`${basePath}/status`] = 'available';
            updates[`${basePath}/active_code`] = '';
            updates[`${basePath}/door_open_request`] = false; 
            
            return update(ref(db), updates);
        },

        manualCancel() {
            this.cleanupReservation().then(() => {
                toast.info("Reservation cancelled");
                this.$router.go(-1);
            });
        }
    }
}
</script>