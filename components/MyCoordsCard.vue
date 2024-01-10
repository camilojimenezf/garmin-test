<template>
  <div v-if="placesStore.isUserLocationReady" class="card-container rounded shadow-lg p-1">
    <div class="px-2 py-2">
      <div class="font-bold text-md mb-2">Current Position</div>
      <p class="text-gray-700 text-sm">
        Longitude: {{ placesStore.userLocation[0] }}
      </p>
      <p class="text-gray-700 text-sm">
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