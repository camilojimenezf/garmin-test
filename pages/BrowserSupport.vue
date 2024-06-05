<template>
  <div class="flex" data-cy="modal-alert-geolocation">
    <div class="bg-white p-4 rounded-lg text-center">
      <h3 class="text-xl font-bold">Is valid browser: {{ isValidBrowser }}</h3>
      <p class="text-sm text-blue-700">Connection Supported: {{ connectionSupported }}</p>
      <p class="text-sm text-blue-700">ServiceWorker Supported: {{ serviceWorkerSupported }}</p>
      <p class="text-sm text-blue-700">Geolocation Supported: {{ geolocationSupported }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const connectionSupported = 'connection' in navigator;
const serviceWorkerSupported = 'serviceWorker' in navigator;
const geolocationSupported = 'geolocation' in navigator;

const isValidBrowser = computed(() => {
  const connectionSupported = 'connection' in navigator;
  const serviceWorkerSupported = 'serviceWorker' in navigator;
  const geolocationSupported = 'geolocation' in navigator;

  console.log('Connection supported:', connectionSupported);
  console.log('ServiceWorker supported:', serviceWorkerSupported);
  console.log('Geolocation supported:', geolocationSupported);

  return connectionSupported && serviceWorkerSupported && geolocationSupported;
});

</script>

<style scoped></style>
