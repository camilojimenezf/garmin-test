<template>
  <div class="card-container rounded shadow-lg p-1">
    <div class="font-bold text-md">{{ userSpeed }} KM/H</div>
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
  top: 60px;
  right: 55px;
  background-color: white;
}
</style>