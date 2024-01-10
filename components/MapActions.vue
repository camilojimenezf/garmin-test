<template>
  <div class="flex flex-col btn-container" v-if="isBtnReady">
    <label class="inline-flex items-center mb-2">
      <input type="checkbox" class="form-checkbox h-5 w-5 text-blue-600" v-model="placesStore.isUsingGarminGlo"
        @change="toggleIsUsingGarminGlo"><span class="ml-2 text-gray-700">Use Garmin Glo</span>
    </label>
    <button v-if="!placesStore.isInRoute" @click="placesStore.startRoute"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Init route
    </button>
    <button v-if="placesStore.isInRoute" @click="placesStore.endRoute"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      End route
    </button>
    <button @click="onMyLocationClicked" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Go to my location
    </button>
    <button @click="updateMyLocation" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Update my location
    </button>
    <button @click="removeLocations" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Remove locations
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

const removeLocations = () => {
  placesStore.removeAllPlaces();
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