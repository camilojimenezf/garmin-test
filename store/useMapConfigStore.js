import { ref } from "vue";
import { defineStore } from "pinia";

export const useMapConfigStore = defineStore("mapConfig", () => {
  // State
  const calculateLocationMode = ref("kalman");
  const kalmanQ = ref(3);
  const kalmanR = ref(0.01);
  const medianSampleSize = ref(50);
  const userSpeed = ref(0);

  // Methods
  function setCalculationMode(mode) {
    calculateLocationMode.value = mode;
  }

  function setKalmanQ(value) {
    kalmanQ.value = value;
  }

  function setKalmanR(value) {
    kalmanR.value = value;
  }

  function setMedianSampleSize(value) {
    medianSampleSize.value = value;
  }

  function setUserSpeed(value) {
    userSpeed.value = value;
  }

  return {
    calculateLocationMode,
    kalmanQ,
    kalmanR,
    medianSampleSize,
    userSpeed,

    setCalculationMode,
    setKalmanQ,
    setKalmanR,
    setMedianSampleSize,
    setUserSpeed,
  };
});
