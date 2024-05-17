import { getCurrentPosition } from "~/services/geolocationService";
import { useMapConfigStore } from "~/store/useMapConfigStore";
import {
  calculateSmoothedLocationKalman,
  determineSmoothingFactor,
} from "~/utils/smooth-location";
import { calculateSpeedFromPositions } from "~/utils/user-speed";
import {
  getStepsInterpolation,
  interpolateCoordinates,
} from "~/utils/interpolation";

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

export const useAccuracy = () => {
  const watchPositionId = ref(undefined);
  const positions = ref([]);
  const status = ref(STATES.UNKNOWN);
  const medianAccuracy = ref(undefined);

  const mapConfigStore = useMapConfigStore();
  const { setUserSpeed, addUserPosition, setLastUserPosition } = mapConfigStore;
  const { medianSampleSize, positionInterval, lastUserPosition } =
    storeToRefs(mapConfigStore);

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

  function transformPosition(position) {
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
      const newCoords = transformPosition(newPosition);
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
