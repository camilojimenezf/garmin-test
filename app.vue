<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY2FtaWxvamltZW5lemYiLCJhIjoiY2s0OTJ2dGlhMDE0ejNucWdpNXdobHk3MiJ9.ep4oBYYw3IE1dPTm7GuLEA";

if (navigator && !navigator.geolocation) {
  alert("Geolocation is not supported by your browser");
  throw new Error("Geolocation is not supported by your browser");
}

</script>

<style scoped></style>
