<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" v-if="showModal">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3 text-center">
        <div class="mx-auto flex items-center justify-between">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Settings</h3>
          <button class="bg-transparent border-0 text-black" @click="toggleModal">
            <span class="text-black opacity-50 h-6 w-6 text-2xl block outline-none focus:outline-none">
              &times;
            </span>
          </button>
        </div>
        <!-- General Settings Configuration -->
        <div class="px-7 py-3">
          <p class="text-sm text-gray-500">General Settings</p>
          <form @submit.prevent="updateGeneralSettings" class="mt-3">
            <div class="mb-4">
              <label for="medianSampleSize" class="block text-gray-700 text-sm font-bold mb-2">Median Sample
                Size:</label>
              <input type="number" id="medianSampleSize" v-model.number="medianSampleSize"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div class="mb-6">
              <label for="positionInterval" class="block text-gray-700 text-sm font-bold mb-2">Position
                Interval:</label>
              <input type="number" id="positionInterval" v-model.number="positionInterval"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <button type="submit"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Apply
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
  <button @click="toggleModal"
    class="button-modal mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    Adjust Settings
  </button>
</template>

<script setup>
import { ref } from 'vue';
import { useMapConfigStore } from '~/store/useMapConfigStore';

const mapConfigStore = useMapConfigStore();
const showModal = ref(false);

// General settings
const medianSampleSize = ref(mapConfigStore.medianSampleSize);
const positionInterval = ref(mapConfigStore.positionInterval);

function toggleModal() {
  showModal.value = !showModal.value;
}

function updateGeneralSettings() {
  mapConfigStore.setMedianSampleSize(medianSampleSize.value);
  mapConfigStore.setPositionInterval(positionInterval.value);
}
</script>


<style scoped>
.button-modal {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>