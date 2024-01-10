<template>
  <div v-if="placesStore.isUserLocationReady" class="card-container rounded shadow-lg p-4">
    <div class="px-6 py-4">
      <div class="font-bold text-xl mb-2">Map Coordinates</div>
      <p class="text-gray-700 text-base">
        Longitude: {{ placesStore.userLocation[0] }}
      </p>
      <p class="text-gray-700 text-base">
        Latitude: {{ placesStore.userLocation[1] }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { usePlacesStore } from '../store/usePlacesStore';

const placesStore = usePlacesStore();
</script>

<style scoped>
.card-container {
  position: fixed;
  top: 70px;
  left: 10px;
  background-color: white;
}
</style>