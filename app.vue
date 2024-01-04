<template>
  <div class="flex flex-col justify-center items-center h-screen bg-gray-200">
    <h1 class="text-4xl block font-bold text-blue-600">Welcome to Vue 3 with Tailwind!</h1>
    <h2 class="text-2xl block font-bold text-blue-500">Is Connected: {{ isConnected }}</h2>
    <h2 class="text-2xl font-bold text-blue-500 mb-5">Is Requesting: {{ isRequesting }}</h2>
    <h2 class="text-2xl font-bold text-blue-500 mb-5">Has Bluetooth Availability: {{ hasBluetoothAvailability }}</h2>
    <button class="bg-blue-500 mb-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      @click="getAvailableDevices()">
      Get Available Bluetooth Devices
    </button>
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="getDevices()">
      Get Current Devices
    </button>
  </div>
</template>

<script setup>
const {
  isConnected,
  isRequesting,
  hasBluetoothAvailability,
  getAvailableDevices,
  getDevices,
} = useGarmin2();

</script>

<style scoped></style>
