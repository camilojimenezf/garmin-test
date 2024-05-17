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
