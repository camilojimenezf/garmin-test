<template>
  <div class="card-container rounded shadow-lg p-1">
    <div class="px-2 py-2">
      <div class="font-bold text-md mb-2">Speed</div>
      <p class="text-gray-700 text-sm">
        User Speed: {{ userSpeed }} KM/H
      </p>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useMapConfigStore } from '../store/useMapConfigStore';

const mapConfigStore = useMapConfigStore();
const { userSpeed } = storeToRefs(mapConfigStore);

</script>

<style scoped>
.card-container {
  position: fixed;
  top: 40px;
  left: 100px;
  background-color: white;
}
</style>