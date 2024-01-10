<template>
  <div>
    <header>
      <ul class="flex flex-row bg-green-500 py-1 px-2">
        <li class="mr-4">
          <NuxtLink to="/garminconnection" class="text-white hover:text-green-200 font-semibold">Garmin Connection
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/mappage" class="text-white hover:text-green-200 font-semibold">Map View</NuxtLink>
        </li>
      </ul>
    </header>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
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
