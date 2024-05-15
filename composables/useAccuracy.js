import KalmanFilter from "kalmanjs";
import { useMapConfigStore } from "~/store/useMapConfigStore";

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
const GET_POSITION_INTERVAL = 500;
const MINIMUM_MOVE_DISTANCE = 10;

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

const calculateDistanceKMs = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // KM
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in KMs
};

export const useAccuracy = () => {
  const watchPositionId = ref(undefined);
  const positions = ref([]);
  const status = ref(STATES.UNKNOWN);
  const medianAccuracy = ref(undefined);
  const currentLocation = ref(undefined);

  const mapConfigStore = useMapConfigStore();
  const { setUserSpeed } = mapConfigStore;
  const { calculateLocationMode, kalmanQ, kalmanR, medianSampleSize } =
    storeToRefs(mapConfigStore);

  function calculateUserSpeed(lat1, lon1, lat2, lon2, lastTime) {
    const distance = calculateDistanceKMs(lat1, lon1, lat2, lon2);
    const time = (new Date().getTime() - lastTime) / 3600000; // Convert ms to hours
    return distance / time;
  }

  function determineSmoothingFactor(speed) {
    if (speed < 10) {
      // Low speed
      return {
        kalmanR: 0.01,
        kalmanQ: 0.001,
        avgFactor: 0.1, // Less influence from the new position in the average
      };
    } else if (speed < 50) {
      // Medium speed
      return {
        kalmanR: 0.1,
        kalmanQ: 0.01,
        avgFactor: 0.5,
      };
    } else {
      // High speed
      return {
        kalmanR: 1,
        kalmanQ: 0.1,
        avgFactor: 1, // Full influence, less smoothing
      };
    }
  }

  function calculateSmoothedLocationKalman(speed) {
    const smoothingParams = determineSmoothingFactor(speed);
    console.log("Kalman filter smoothingParams", smoothingParams);
    const kfLat = new KalmanFilter({
      R: smoothingParams.kalmanR,
      Q: smoothingParams.kalmanQ,
    });
    const kfLng = new KalmanFilter({
      R: smoothingParams.kalmanR,
      Q: smoothingParams.kalmanQ,
    });
    const recentPositions = positions.value.slice(-medianSampleSize.value);

    if (recentPositions.length < 2) return;

    let smoothedLats = recentPositions.map((pos) => kfLat.filter(pos.lat));
    let smoothedLngs = recentPositions.map((pos) => kfLng.filter(pos.lng));

    return {
      lat: smoothedLats[smoothedLats.length - 1],
      lng: smoothedLngs[smoothedLngs.length - 1],
    };
  }

  function calculateSmoothedLocationSimpleAVG(speed) {
    const smoothingParams = determineSmoothingFactor(speed);
    console.log("Simple AVG smoothingParams", smoothingParams);
    const recentPositions = positions.value.slice(-medianSampleSize.value);
    if (recentPositions.length < medianSampleSize.value) return;

    let sumLat = 0;
    let sumLng = 0;
    recentPositions.forEach((pos, index) => {
      const weight = smoothingParams.avgFactor;
      sumLat += pos.lat * weight;
      sumLng += pos.lng * weight;
    });

    const avgLat =
      sumLat / (recentPositions.length * smoothingParams.avgFactor);
    const avgLng =
      sumLng / (recentPositions.length * smoothingParams.avgFactor);

    return { lat: avgLat, lng: avgLng };
  }

  function calculateLocation() {
    const recentPositions = positions.value;
    const positionCount = recentPositions.length;
    if (positionCount < 2) return;

    const speed = calculateUserSpeed(
      recentPositions[positionCount - 2].lat,
      recentPositions[positionCount - 2].lng,
      recentPositions[positionCount - 1].lat,
      recentPositions[positionCount - 1].lng,
      recentPositions[positionCount - 2].timestamp
    );

    setUserSpeed(speed);
    console.log("Calculated speed (km/h):", speed);

    if (calculateLocationMode.value === "kalman") {
      return calculateSmoothedLocationKalman(speed);
    } else {
      return calculateSmoothedLocationSimpleAVG(speed);
    }
  }

  function getPosition() {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const newCoords = {
          lng: coords.longitude,
          lat: coords.latitude,
          accuracy: coords.accuracy,
          timestamp: new Date().getTime(),
        };
        console.log(newCoords);
        const updatedPositions = positions.value.slice(-medianSampleSize.value);
        updatedPositions.push(newCoords);
        positions.value = updatedPositions;

        // if we doesn't have a current location, set it to the new coords
        if (!currentLocation.value) {
          currentLocation.value = newCoords;
        }

        const smoothedLocation = calculateLocation();
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
      const lastFivePositions = newPositions.slice(-medianSampleSize.value);
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
