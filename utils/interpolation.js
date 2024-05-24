export function getStepsInterpolation(speed) {
  if (speed < 0.5) return 5;
  if (speed < 1) return 5;
  if (speed < 3) return 6;
  if (speed < 5) return 7;
  return 9;
}

export function interpolateCoordinates({
  lastPosition,
  newPosition,
  steps,
  callbackFn,
}) {
  for (let i = 1; i <= steps; i++) {
    let fraction = i / steps;
    let lat =
      lastPosition.lat + (newPosition.lat - lastPosition.lat) * fraction;
    let lng =
      lastPosition.lng + (newPosition.lng - lastPosition.lng) * fraction;
    let accuracy =
      lastPosition.accuracy +
      (newPosition.accuracy - lastPosition.accuracy) * fraction;
    let timestamp =
      lastPosition.timestamp +
      (newPosition.timestamp - lastPosition.timestamp) * fraction;
    callbackFn({ lat, lng, accuracy, timestamp });
  }
}
