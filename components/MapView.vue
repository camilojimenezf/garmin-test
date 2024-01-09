<template>
  <div v-if="!placesStore.isUserLocationReady" class="loading-map d-flex justify-content-center align-items-center">
    <div class="text-center">
      <h3>Espere por favor</h3>
      <span>Localizando....</span>
    </div>
  </div>

  <div v-show="placesStore.isUserLocationReady" class="map-container" ref="mapElement" />
</template>

<script setup>
import mapboxgl from "mapbox-gl";

import { usePlacesStore } from '~/store/usePlacesStore';
import { useMapStore } from '~/store/useMapStore';

const placesStore = usePlacesStore();
const mapStore = useMapStore();
const mapElement = ref();

const initMap = () => {
  console.log('isUserLocationReady', placesStore.isUserLocationReady);
  console.log('userLocation', placesStore.userLocation);
  if (!mapElement.value) throw new Error("Map element not found");
  if (!placesStore.userLocation) throw new Error("User location not found");

  const map = new mapboxgl.Map({
    container: mapElement.value, // container ID
    style: "mapbox://styles/mapbox/light-v11", // style URL
    center: placesStore.userLocation, // starting position [lng, lat]
    zoom: 15, // starting zoom
  });

  const myLocationPopup = new mapboxgl.Popup()
    .setLngLat(placesStore.userLocation)
    .setHTML(`<h4>Aquí estoy</h4><p>Actualmente en Chile</p>`);

  const myLocationMarker = new mapboxgl.Marker()
    .setLngLat(placesStore.userLocation)
    .setPopup(myLocationPopup)
    .addTo(map);

  console.log(map);
  mapStore.setMap(map);
};

onMounted(() => {
  if (placesStore.isUserLocationReady.value) {
    nextTick(() => initMap());
  }
});

watch(() => placesStore.isUserLocationReady, (newValue) => {
  console.log('isUserLocationReady', newValue);
  console.log('userLocation', placesStore.isUserLocationReady.value);
  if (newValue) {
    nextTick(() => initMap());
  }
}, { immediate: true });
</script>

<style scoped>
.loading-map {
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  height: 100vh;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 9999;
}

.map-container {
  position: fixed;
  height: 100vh;
  width: 100vw;
}
</style>