<template>
  <div class="w-full p-4">
    <h1 class="text-xl font-semibold">Configure Garmin Glo in Iphone Device.</h1>
    <p class="text-base mb-4">Garmin Glo can improve stability and accuracy of our position.</p>
    <div v-for="(step, index) in tutorialSteps" :key="index" class="step mb-6">
      <!-- Main Step -->
      <div class="mb-4">
        <span class="text-lg font-bold">Step {{ index + 1 }}:</span>
        <h2 class="text-lg font-semibold">{{ step.title }}</h2>
        <p v-if="step.content" class="text-base mb-2">{{ step.content }}</p>
        <img v-if="step.image" :src="step.image" alt="Step Image" class="max-w-xs rounded-lg shadow-md" />
      </div>

      <!-- Substeps -->
      <template v-if="step.substeps && step.substeps.length">
        <div v-for="(substep, subIndex) in step.substeps" :key="subIndex"
          class="substep pl-6 border-l-4 border-blue-500 ml-4">
          <div class="mb-2">
            <span class="text-md font-semibold">Substep {{ index + 1 }}.{{ subIndex + 1 }}:</span>
            <h3 class="text-lg font-semibold">{{ substep.title }}</h3>
          </div>
          <div class="content mb-4">
            <p v-if="substep.content" class="text-sm mb-2">{{ substep.content }}</p>
            <img v-if="substep.image" :src="substep.image" alt="Substep Image" class="max-w-xs rounded-lg shadow-md w-150"
              width="250" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
const tutorialSteps = ref([
  {
    title: "Pair Garmin Glo",
    content: "You need to pair Garmin Glo with your IOs device.",
    substeps: [
      {
        title: "Turn on Garmin Glo",
        content: "Turn on Garmin Glo by pressing and holding power button for 2-3 seconds. If you see blue light blinking it means that Garmin Glo is turned on.",
        image: "/images/garmin/android/09-turn-on-garmin.jpg"
      },
      {
        title: "Pair Garmin Glo",
        content: "Pair Garmin Glo with your IOs device.",
        image: "/images/garmin/ios/01-pair-garmin-glo.jpeg"
      },
      {
        title: "Now you can use Garmin Glo",
        content: "Each app that uses GPS will use Garmin Glo as GPS device.",
      }
    ]
  },
])
</script>

<style lang="scss" scoped></style>