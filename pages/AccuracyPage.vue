<template>
  <div>
    <AccuracyStatusCard />
    <h1>Accuracy Page</h1>
    <p>Accuracy: {{ accuracy.status }}</p>

    <ul v-if="accuracy.hasPositions">
      <li v-for="(position, index) in accuracy.positions.value" :key="`${position.lat},${position.lng},${index}`">
        {{ position.lat }}, {{ position.lng }}, {{ index }}
      </li>
    </ul>
  </div>
</template>

<script setup>

const accuracy = useAccuracy();

console.log('Accuracy', accuracy)

</script>

<style scoped></style>