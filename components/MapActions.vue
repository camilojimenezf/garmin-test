<template>
  <div class="flex flex-col btn-container" v-if="isBtnReady">
    <div class="mb-1">
      <input type="text" v-model="placesStore.routeName" placeholder="Route name..."
        class="shadow appearance-none border rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
    </div>
    <label class="inline-flex items-center mb-1">
      <input type="checkbox" class="form-checkbox h-5 w-5 text-blue-600" v-model="placesStore.isUsingGarminGlo"
        @change="toggleIsUsingGarminGlo"><span class="ml-2 text-gray-700">Use Garmin Glo</span>
    </label>
    <button v-if="!placesStore.isInRoute" @click="placesStore.startRoute"
      class="bg-blue-500 hover:bg-blue-700 text-white py-1 px-1 rounded">
      Init Route
    </button>
    <button v-if="placesStore.isInRoute" @click="placesStore.endRoute"
      class="bg-blue-500 hover:bg-blue-700 text-white py-1 px-1 rounded">
      End Route
    </button>
    <button @click="onMyLocationClicked" class="bg-blue-500 hover:bg-blue-700 text-white py-1 px-1 rounded">
      My Location
    </button>
    <button @click="updateMyLocation" class="bg-blue-500 hover:bg-blue-700 text-white py-1 px-1 rounded">
      Set Location
    </button>
    <button @click="removeLocations" class="bg-blue-500 hover:bg-blue-700 text-white py-1 px-1 rounded">
      Remove All
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
  bottom: 5px;
  right: 10px;
  max-width: 150px;
}

.btn-container button {
  margin-bottom: 5px;
}
</style>