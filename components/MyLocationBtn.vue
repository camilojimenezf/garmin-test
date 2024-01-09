<template>
  <button v-if="isBtnReady" @click="onMyLocationClicked"
    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    Ir a mi ubicación
  </button>
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
</script>

<style scoped>
button {
  position: fixed;
  top: 30px;
  right: 30px;
}
</style>