<template>
  <div class="flex flex-col btn-container" v-if="isBtnReady">
    <button @click="onMyLocationClicked" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Go to my location
    </button>
    <button @click="updateMyLocation" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Update my location
    </button>
  </div>
</template>

<script setup>
import { usePlacesStore } from '../store/usePlacesStore';
import { useMapStore } from '../store/useMapStore';

import { computed } from 'vue';

const placesStore = usePlacesStore();
const mapStore = useMapStore()

const isBtnReady = computed(() => placesStore.isUserLocationReady && mapStore.isMapReady);

const onMyLocationClicked = () => {
  mapStore.map.flyTo({
    center: placesStore.userLocation,
    zoom: 14,
  })
};

const updateMyLocation = () => {
  placesStore.updateUserLocation();
};
</script>

<style scoped>
.btn-container {
  position: fixed;
  bottom: 70px;
  right: 10px;
}

.btn-container button {
  margin-bottom: 10px;
}
</style>