<template>
  <div :class="cardColor" :style="cardStyle" class="pulse max-w-sm m-2 rounded overflow-hidden shadow-lg p-4 text-white">
    <p>Status: {{ accuracy.status }}</p>
    <p>Median Accuracy: {{ accuracy.medianAccuracy }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  position: {
    type: Object,
    default: () => ({
      top: '30px',
      right: '10px',
      bottom: null,
      left: null,
    })
  },
  width: { type: String, default: 'max-w-sm' },
  height: { type: String, default: 'auto' }
});

const accuracy = useAccuracy();

const cardColor = computed(() => {
  switch (accuracy.status.value) {
    case 'good':
      return 'bg-green-500';
    case 'bad':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
});

const cardStyle = computed(() => ({
  position: 'fixed',
  top: props.position.top,
  right: props.position.right,
  bottom: props.position.bottom,
  left: props.position.left,
  width: props.width === 'max-w-sm' ? null : props.width,
  height: props.height
}));
</script>

<style scoped>
@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: .8;
  }
}

.pulse {
  animation: pulse 1s infinite;
}
</style>