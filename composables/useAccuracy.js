function median(numbers) {
  const mid = Math.floor(numbers.length / 2);
  const sortedNumbers = numbers.sort((a, b) => a - b);

  if (numbers.length % 2 === 0) {
    return (sortedNumbers[mid - 1] + sortedNumbers[mid]) / 2;
  } else {
    return sortedNumbers[mid];
  }
}

const STATES = {
  UNKNOWN: "unknown",
  GOOD: "good",
  BAD: "bad",
};

const ACCURACY_THRESHOLD = 6;
const MEDIAN_SAMPLE_SIZE = 5;

export const useAccuracy = () => {
  const watchPositionId = ref(undefined);
  const positions = ref([]);
  const status = ref(STATES.UNKNOWN);
  const medianAccuracy = ref(undefined);

  // function startTracking() {
  //   watchPositionId.value = navigator.geolocation.watchPosition(
  //     ({ coords }) => {
  //       const newCoords = {
  //         lng: coords.longitude,
  //         lat: coords.latitude,
  //         accuracy: coords.accuracy,
  //       };
  //       const updatedPositions = positions.value.slice(-MEDIAN_SAMPLE_SIZE);
  //       updatedPositions.push(newCoords);
  //       positions.value = updatedPositions;
  //     },
  //     (err) => {
  //       console.error(err);
  //       throw new Error("No geolocation :(");
  //     },
  //     { enableHighAccuracy: true }
  //   );
  // }

  function startTracking() {
    watchPositionId.value = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const newCoords = {
            lng: coords.longitude,
            lat: coords.latitude,
            accuracy: coords.accuracy,
          };
          console.log("newCoords", newCoords);
          const updatedPositions = positions.value.slice(-MEDIAN_SAMPLE_SIZE);
          updatedPositions.push(newCoords);
          positions.value = updatedPositions;
        },
        (err) => {
          console.error(err);
          throw new Error("No geolocation :(");
        },
        { enableHighAccuracy: true }
      );
    }, 1000);
  }

  onMounted(() => {
    startTracking();
  });

  onUnmounted(() => {
    console.log("onUnmounted clear Interval");
    // navigator.geolocation.clearWatch(watchPositionId.value);
    clearInterval(watchPositionId.value);
  });

  watch(positions, (newPositions) => {
    if (newPositions && newPositions.length > 1) {
      // calculate new status
      const lastFivePositions = newPositions.slice(-MEDIAN_SAMPLE_SIZE);
      const lastFiveAccuracies = lastFivePositions.map((position) =>
        Math.round(position.accuracy)
      );
      const newMedianAccuracy = median(lastFiveAccuracies);
      const isGood = newMedianAccuracy <= ACCURACY_THRESHOLD;

      status.value = isGood ? STATES.GOOD : STATES.BAD;
      medianAccuracy.value = newMedianAccuracy;
    }
  });

  return {
    status,
    medianAccuracy,
    positions,

    hasPositions: computed(() => positions.value.length > 0),
  };
};
