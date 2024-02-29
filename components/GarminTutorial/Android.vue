<template>
  <div class="w-full p-4">
    <h1 class="text-xl font-semibold">Configure Garmin Glo in Android Device.</h1>
    <p class="text-base">Garmin Glo can improve stability and accuracy of our position.</p>
    <p class="text-base mb-4">To configure Garmin Glo in Android we need to make some additional steps.</p>
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
    title: "Enable Developer Mode",
    content: "You need to enable developer mode to be able to use Garmin Glo in Android.",
    substeps: [
      {
        title: "Go to Settings",
        content: "Scroll down and select 'About phone'",
        image: "/images/garmin/android/01-settings-menu.jpg"
      },
      {
        title: "In About phone select 'Software Information'",
        image: "/images/garmin/android/02-about-phone-settings.jpg"
      },
      {
        title: "Tap 5 times on Build Number",
        image: "/images/garmin/android/03-enabling-developer-mode.jpg"
      },
      {
        title: "Developer Mode Enabled",
        content: "You will see a message that developer mode is enabled.",
        image: "/images/garmin/android/04-developer-mode-turn-on.jpg"
      }
    ],
  },
  {
    title: "Download Bluetooth GPS App",
    content: "You need to download Bluetooth GPS app from Google Play Store.",
    substeps: [
      {
        title: "Open Google Play Store",
        content: "Open Google Play Store and search for 'Bluetooth GPS'",
        image: "/images/garmin/android/05-find-gps-mock-app.jpg"
      },
      {
        title: "Install Bluetooth GPS",
        content: "Install 'GPS Connector' app on your device.",
        image: "/images/garmin/android/06-install-gps-connector.jpg"
      }
    ]
  },
  {
    title: "Enable Mock App",
    content: "You need to enable Mock App in Settings -> Developer Options.",
    substeps: [
      {
        title: "Go to Developer Options",
        content: "Go to Developer Options in Settings and Search 'Select mock location app'.",
        image: "/images/garmin/android/07-find-mock-app.jpg"
      },
      {
        title: "Enable Mock App",
        content: "Select Bluetooth GPS app as mock app.",
        image: "/images/garmin/android/08-select-mock-app.jpg"
      }
    ]
  },
  {
    title: "Pair Garmin Glo",
    content: "You need to pair Garmin Glo with your Android device.",
    substeps: [
      {
        title: "Turn on Garmin Glo",
        content: "Turn on Garmin Glo by pressing and holding power button for 2-3 seconds. If you see blue light blinking it means that Garmin Glo is turned on and ready to pair.",
        image: "/images/garmin/android/09-turn-on-garmin.jpg"
      },
      {
        title: "Pair Garmin Glo",
        content: "Pair Garmin Glo with your Android device. Please be patient this step can take some time.",
        image: "/images/garmin/android/10-bluetooth-find-devices.jpg"
      }
    ]
  },
  {
    title: "Use Garmin Glo in Mock App",
    content: "You need to use Garmin Glo in Bluetooth GPS app.",
    substeps: [
      {
        title: "Open Bluetooth GPS app",
        content: "Open Bluetooth GPS app and select Garmin Glo as GPS device.",
        image: "/images/garmin/android/11-main-page-mock-app.jpg"
      },
      {
        title: "Select input source 'Bluetooth Classic' in settings",
        image: "/images/garmin/android/12-select-input-source.jpg"
      },
      {
        title: "No you can see your position in mock app, also each app that uses GPS will use Garmin Glo as GPS device.",
        image: "/images/garmin/android/13-gps-mock-aplication-ready.jpg"
      }
    ]
  }
])
</script>

<style scoped></style>