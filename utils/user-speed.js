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

export function calculateSpeedFromPositions(positions) {
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
