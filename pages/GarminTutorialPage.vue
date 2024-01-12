<template>
  <GarminTutorialAndroid v-if="isAndroid" />
  <GarminTutorialIphone v-if="isIOS" />
</template>

<script setup>
const deviceType = ref("");

onMounted(() => {
  const { userAgent } = navigator;
  console.log(userAgent)
  if (userAgent.match(/Android|Windows/i)) {
    deviceType.value = "Android";
  } else if (userAgent.match(/iPhone|iPad|iPod|Mac/i)) {
    deviceType.value = "iPhone";
  } else {
    deviceType.value = "Unknown";
  }
});

const isIOS = computed(() => deviceType.value === "iPhone");
const isAndroid = computed(() => deviceType.value === "Android");
</script>

<style scoped></style>