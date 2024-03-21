import KalmanFilter from "kalmanjs";

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
const MIN_ACCURACY_TO_UPDATE_POSITION = 20;
const MEDIAN_SAMPLE_SIZE = 50;
const GET_POSITION_INTERVAL = 200;
const MINIMUM_MOVE_DISTANCE = 10;

export const useAccuracy = () => {
  const watchPositionId = ref(undefined);
  const positions = ref([]);
  const status = ref(STATES.UNKNOWN);
  const medianAccuracy = ref(undefined);
  const currentLocation = ref(undefined);

  function calculateSmoothedLocationKalman() {
    console.log("calculateSmoothedLocationKalman");
    const kfLat = new KalmanFilter({ R: 0.01, Q: 3 }); // Example parameters
    const kfLng = new KalmanFilter({ R: 0.01, Q: 3 }); // Example parameters
    const recentPositions = positions.value.slice(-MEDIAN_SAMPLE_SIZE);

    if (recentPositions.length < 2) return; // Need at least 2 to predict

    let smoothedLats = recentPositions.map((pos) => kfLat.filter(pos.lat));
    let smoothedLngs = recentPositions.map((pos) => kfLng.filter(pos.lng));

    const lastLat = smoothedLats[smoothedLats.length - 1];
    const lastLng = smoothedLngs[smoothedLngs.length - 1];

    return { lat: lastLat, lng: lastLng };
  }

  function calculateSmoothedLocation() {
    const recentPositions = positions.value.slice(-MEDIAN_SAMPLE_SIZE);
    if (recentPositions.length < MEDIAN_SAMPLE_SIZE) return;

    let avgLat = 0;
    let avgLng = 0;
    recentPositions.forEach((pos) => {
      avgLat += pos.lat;
      avgLng += pos.lng;
    });

    avgLat /= recentPositions.length;
    avgLng /= recentPositions.length;

    return { lat: avgLat, lng: avgLng };
  }

  function getPosition() {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const newCoords = {
          lng: coords.longitude,
          lat: coords.latitude,
          accuracy: coords.accuracy,
        };
        console.log(newCoords);
        const updatedPositions = positions.value.slice(-MEDIAN_SAMPLE_SIZE);
        updatedPositions.push(newCoords);
        positions.value = updatedPositions;

        // if (coords.accuracy > MIN_ACCURACY_TO_UPDATE_POSITION) {
        //   console.log("Ignored due to low accuracy", coords.accuracy);
        //   return;
        // }

        // if we doesn't have a current location, set it to the new coords
        if (!currentLocation.value) {
          currentLocation.value = newCoords;
        }

        const smoothedLocation = calculateSmoothedLocationKalman();
        console.log("smoothedLocation", smoothedLocation);

        // If smoothed location is the same that current location not update
        if (
          smoothedLocation &&
          currentLocation.value?.lat === smoothedLocation.lat &&
          currentLocation.value?.lng === smoothedLocation.lng
        ) {
          return;
        }

        if (smoothedLocation) {
          currentLocation.value = smoothedLocation;
        }

        // If coordinates are the same, don't update current location.
        // if (
        //   currentLocation.value?.lat === newCoords.lat &&
        //   currentLocation.value?.lng === newCoords.lng
        // ) {
        //   return;
        // }
        // currentLocation.value = newCoords;
      },
      (err) => {
        console.error(err);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }

  function startTracking() {
    getPosition();

    watchPositionId.value = setInterval(() => {
      getPosition();
    }, GET_POSITION_INTERVAL);
  }

  onMounted(() => {
    startTracking();
  });

  onUnmounted(() => {
    console.log("onUnmounted clear Interval");
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
    currentLocation,

    hasPositions: computed(() => positions.value.length > 0),
  };
};
