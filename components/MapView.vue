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
const UPDATE_COORDINATES_INTERVAL = 100;

import mapboxgl from "mapbox-gl";
import { storeToRefs } from "pinia";
import { usePlacesStore } from '~/store/usePlacesStore';
import { useMapStore } from '~/store/useMapStore';
import { useAccuracy } from '~/composables/useAccuracy';
import { useMapConfigStore } from "~/store/useMapConfigStore";

const placesStore = usePlacesStore();
const mapStore = useMapStore();
const mapConfigStore = useMapConfigStore();
const { lastUserPosition } = storeToRefs(mapConfigStore);
const { removeUserPosition } = mapConfigStore;

const mapElement = ref();

// Implement our own geolocation to use location of our store.
const customGeolocation = {
  watchIdCounter: 0,
  watches: {},
  getCurrentPosition(successCallback, errorCallback, options) { },
  watchPosition(successCallback, errorCallback, options) {
    const id = ++this.watchIdCounter;

    const invokeSuccess = () => {
      // move last position to store.
      const lastPosition = removeUserPosition();
      console.log('Consumer lastPosition', lastPosition);
      if (!lastPosition && lastUserPosition.value?.lat && lastUserPosition.value?.lng) {
        successCallback({
          coords: {
            latitude: lastUserPosition.value.lat,
            longitude: lastUserPosition.value.lng,
            accuracy: lastUserPosition.value.accuracy || 150,
          },
          timestamp: lastUserPosition.value.timestamp || Date.now(),
        });
        return;
      }

      console.log('lastPosition mapView', lastPosition);
      successCallback({
        coords: {
          latitude: lastPosition.lat,
          longitude: lastPosition.lng,
          accuracy: lastPosition.accuracy || 150,
        },
        timestamp: lastPosition.timestamp || Date.now(),
      });
    };

    invokeSuccess();

    this.watches[id] = setInterval(() => {
      invokeSuccess();
    }, UPDATE_COORDINATES_INTERVAL);

    return id;
  },

  clearWatch(watchId) {
    if (this.watches[watchId]) {
      clearInterval(this.watches[watchId]);
      delete this.watches[watchId];
    }
  },
};

const initMap = () => {
  if (!mapElement.value) throw new Error("Map element not found");
  if (!placesStore.userLocation) throw new Error("User location not found");

  const map = new mapboxgl.Map({
    container: mapElement.value, // container ID
    style: "mapbox://styles/mapbox/light-v11", // style URL
    center: placesStore.userLocation, // starting position [lng, lat]
    zoom: 15, // starting zoom
    maxZoom: 20,
  });

  map.addControl(new mapboxgl.FullscreenControl());
  map.addControl(new mapboxgl.GeolocateControl({
    trackUserLocation: true,
    showAccuracyCircle: true,
    showUserHeading: true,
    geolocation: customGeolocation,
  }))
  map.addControl(new mapboxgl.NavigationControl());

  // mapStore.setMap(map, [myLocationMarker]);
};

onMounted(() => {
  if (placesStore.isUserLocationReady.value) {
    nextTick(() => initMap());
  }
});

watch(() => placesStore.isUserLocationReady, (newValue) => {
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
</style>useAccuracy,