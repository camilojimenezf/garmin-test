import KalmanFilter from "kalmanjs";
import { getCurrentPosition } from "~/services/geolocationService";
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

  const mapConfigStore = useMapConfigStore();
  const { setUserSpeed, addUserPosition, setLastUserPosition } = mapConfigStore;
  const { medianSampleSize, positionInterval, lastUserPosition } =
    storeToRefs(mapConfigStore);

  function calculateSpeedFromPositions(positions) {
    if (positions.length < 2) return 0;

    let speeds = [];
    for (let i = 1; i < positions.length; i++) {
      const distance = calculateDistanceKMs(
        positions[i - 1].lat,
        positions[i - 1].lng,
        positions[i].lat,
        positions[i].lng
      );
      const time =
        (positions[i].timestamp - positions[i - 1].timestamp) / 3600000; // Convert ms to hours
      speeds.push(distance / time);
    }

    // Compute average speed from collected speeds
    const averageSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
    return averageSpeed;
  }

  function determineSmoothingFactor(speed) {
    const baseSettings = {
      low: { kalmanR: 0.5, kalmanQ: 0.005, avgFactor: 0.2 },
      normal: { kalmanR: 0.2, kalmanQ: 0.003, avgFactor: 0.5 },
      high: { kalmanR: 0.1, kalmanQ: 0.002, avgFactor: 0.8 },
      superHigh: { kalmanR: 0.05, kalmanQ: 0.001, avgFactor: 1 },
      extreme: { kalmanR: 0.01, kalmanQ: 0.0001, avgFactor: 1 },
    };

    if (speed < 2) return baseSettings.low;
    else if (speed < 4) return baseSettings.normal;
    else if (speed < 6) return baseSettings.high;
    else if (speed < 20) return baseSettings.superHigh;
    else return baseSettings.extreme;
  }

  function calculateSmoothedLocationKalman({ positions, smoothingParams }) {
    console.log("Kalman filter smoothingParams", smoothingParams);

    const kfLat = new KalmanFilter({
      R: smoothingParams.kalmanR,
      Q: smoothingParams.kalmanQ,
    });
    const kfLng = new KalmanFilter({
      R: smoothingParams.kalmanR,
      Q: smoothingParams.kalmanQ,
    });
    const kfAccuracy = new KalmanFilter({
      R: smoothingParams.kalmanR,
      Q: smoothingParams.kalmanQ,
    });

    let smoothedLats = positions.map((pos) => kfLat.filter(pos.lat));
    let smoothedLngs = positions.map((pos) => kfLng.filter(pos.lng));
    let smoothedAccuracies = positions.map((pos) =>
      kfAccuracy.filter(pos.accuracy)
    );

    return {
      lat: smoothedLats[smoothedLats.length - 1],
      lng: smoothedLngs[smoothedLngs.length - 1],
      accuracy: smoothedAccuracies[smoothedAccuracies.length - 1],
      timestamp: positions[positions.length - 1].timestamp,
    };
  }

  function calculateSpeedAndLocation(positions) {
    console.log("positions", positions);
    if (positions.length < 2) {
      return {
        speed: 0,
        location: positions[0],
      };
    }
    const speed = calculateSpeedFromPositions(positions);
    const smoothingParams = determineSmoothingFactor(speed);
    const location = calculateSmoothedLocationKalman({
      positions,
      smoothingParams,
    });
    console.log("Calculated speed (km/h):", speed);

    return { speed, location };
  }

  function getStepsInterpolation(speed) {
    if (speed < 0.5) return 2;
    if (speed < 1) return 3;
    if (speed < 3) return 5;
    if (speed < 5) return 7;
    return 9;
  }

  function transormPosition(position) {
    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: new Date().getTime(),
    };
  }

  function emitCoordinates({ location, oldLocation, steps }) {
    if (!oldLocation) {
      addUserPosition(location);
      return;
    }

    if (location.lat === oldLocation.lat && location.lng === oldLocation.lng) {
      return;
    }

    interpolateCoordinates({
      lastPosition: { ...oldLocation },
      newPosition: location,
      steps,
      callbackFn: addUserPosition,
    });
  }

  async function runTrackingProcess() {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    try {
      // 1. Get current position and add it to the positions array
      const newPosition = await getCurrentPosition(options);
      const newCoords = transormPosition(newPosition);
      const updatedPositions = [...positions.value, newCoords];
      positions.value = updatedPositions.slice(-medianSampleSize.value);

      // 2. Calculate speed, smooth location and interpolate
      const { speed, location: smoothedLocation } = calculateSpeedAndLocation(
        positions.value
      );
      setUserSpeed(speed);
      const steps = getStepsInterpolation(speed);
      emitCoordinates({
        location: smoothedLocation,
        oldLocation: lastUserPosition.value,
        steps,
      });
      setLastUserPosition(smoothedLocation);
    } catch (err) {
      console.error(err);
    }
  }

  function startTracking() {
    runTrackingProcess();

    watchPositionId.value = setInterval(() => {
      runTrackingProcess();
    }, positionInterval.value);
  }

  onMounted(() => {
    startTracking();
  });

  onUnmounted(() => {
    console.log("onUnmounted clear Interval");
    clearInterval(watchPositionId.value);
  });

  watch(positionInterval, () => {
    clearInterval(watchPositionId.value);
    startTracking();
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

    hasPositions: computed(() => positions.value.length > 0),
  };
};
