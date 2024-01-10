
<template>
  <div v-if="placesStore.isUserLocationReady && placesStore.historicUserLocations.length > 0"
    class="card-container rounded shadow-lg p-1">
    <div class="px-2 py-2">
      <div class="font-bold text-md mb-2">Historic Positions ({{ placesStore.historicUserLocations.length }})</div>
      <div v-for="location in placesStore.historicUserLocations" :key="location.id"
        class="mb-2 p-2 border border-gray-200 rounded-lg shadow-sm">
        <p class="text-gray-700 text-sm">
          Longitude: {{ location[0] }}
        </p>
        <p class="text-gray-700 text-sm">
          Latitude: {{ location[1] }}
        </p>
        <p class="text-gray-700 text-sm">
          Accuracy: {{ location[2] }}
        </p>
      </div>
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
  top: 40px;
  right: 10px;
  background-color: white;
  max-height: 250px;
  overflow-y: scroll;
}
</style>