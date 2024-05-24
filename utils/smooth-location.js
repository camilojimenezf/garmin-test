import KalmanFilter from "kalmanjs";

export function determineSmoothingFactor(speed) {
  const baseSettings = {
    low: { kalmanR: 0.3, kalmanQ: 0.004, avgFactor: 0.5 },
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

export function calculateSmoothedLocationKalman({
  positions,
  smoothingParams,
}) {
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
