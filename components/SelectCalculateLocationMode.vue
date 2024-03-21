<template>
  <div class="calculate-location-mode-container">
    <select v-model="selectedMode" @change="updateCalculationMode">
      <option value="normal">Normal</option>
      <option value="kalman">Kalman</option>
    </select>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useMapConfigStore } from '~/store/useMapConfigStore';

const mapConfigStore = useMapConfigStore();
const { setCalculationMode } = mapConfigStore;
const { calculateLocationMode } = storeToRefs(mapConfigStore);

// A ref to hold the currently selected mode, initialized to the current calculationMode from the store
const selectedMode = ref(calculateLocationMode.value);

// Function to update the calculationMode in the store based on the selected option
const updateCalculationMode = () => {
  setCalculationMode(selectedMode.value);
};
</script>

<style scoped>
.calculate-location-mode-container {
  position: absolute;
  top: 10rem;
  left: 10px;
  z-index: 1;
  background-color: white;
  padding: 5px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  font-size: 1.2em;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s;
}
</style>