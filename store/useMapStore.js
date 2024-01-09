import { ref, computed } from "vue";
import { defineStore } from "pinia";
import mapboxgl from "mapbox-gl";

export const useMapStore = defineStore("map", () => {
  // State
  const map = ref(undefined);
  const markers = ref([]);
  const distance = ref(undefined);
  const duration = ref(undefined);

  // Getters
  const isMapReady = computed(() => !!map.value);

  // Actions
  async function getRouteBetweenPoints(start, end) {
    const resp = await directionsApi.get(`${start.join(",")};${end.join(",")}`);

    const routeDistance = resp.data.routes[0].distance;
    const routeDuration = resp.data.routes[0].duration;

    let kms = routeDistance / 1000;
    kms = Math.round(kms * 100) / 100;

    distance.value = kms;
    duration.value = Math.floor(routeDuration / 60);

    const coords = resp.data.routes[0].geometry.coordinates;

    const bounds = new mapboxgl.LngLatBounds([coords[0], coords[0]]);
    for (const coord of coords) {
      bounds.extend(coord);
    }

    map.value?.fitBounds(bounds, { padding: 300 });

    const sourceData = {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: coords,
            },
          },
        ],
      },
    };

    if (map.value?.getLayer("RouteString")) {
      map.value.removeLayer("RouteString");
      map.value.removeSource("RouteString");
    }

    map.value?.addLayer({
      id: "RouteString",
      type: "line",
      source: sourceData,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#000",
        "line-width": 3,
      },
    });
  }

  function setMap(newMap) {
    map.value = newMap;
  }

  function setPlaceMarkers(places) {
    if (!map.value) return;

    markers.value.forEach((marker) => marker.remove());
    markers.value = [];

    for (const place of places) {
      const [lng, lat] = place.center;

      const popup = new mapboxgl.Popup()
        .setLngLat([lng, lat])
        .setHTML(`<h4>${place.text}</h4><p>${place.place_name}</p>`);

      const marker = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.value);

      markers.value.push(marker);
    }

    if (map.value.getLayer("RouteString")) {
      map.value.removeLayer("RouteString");
      map.value.removeSource("RouteString");
      distance.value = undefined;
      duration.value = undefined;
    }
  }

  function setUserPlaceMarker({ lng, lat }) {
    console.log("setUserPlaceMarker", lng, lat);
    if (!map.value) return;

    markers.value.forEach((marker) => marker.remove());
    markers.value = [];

    const popup = new mapboxgl.Popup()
      .setLngLat([lng, lat])
      .setHTML(`<h3>User Location</h3><p>Ando por aquí!</p>`);

    const marker = new mapboxgl.Marker({
      color: "#000000",
    })
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map.value);

    markers.value.push(marker);

    if (map.value.getLayer("RouteString")) {
      map.value.removeLayer("RouteString");
      map.value.removeSource("RouteString");
      distance.value = undefined;
      duration.value = undefined;
    }

    console.log("flyTo", lng, lat);
    map.value.flyTo({
      center: [lng, lat],
      zoom: 14,
    });
  }

  return {
    map,
    markers,
    distance,
    duration,

    isMapReady,

    getRouteBetweenPoints,
    setMap,
    setPlaceMarkers,
    setUserPlaceMarker,
  };
});
