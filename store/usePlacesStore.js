import { ref } from "vue";
import { defineStore } from "pinia";
import { searchApi } from "../../apis"; // Update this path to your API module
import { saveRoute } from "~/apis/apiService";
import { useMapStore } from "./useMapStore";

export const usePlacesStore = defineStore("places", () => {
  const mapStore = useMapStore();

  const isLoading = ref(true);
  const userLocation = ref(undefined);
  const historicUserLocations = ref([]);
  const isLoadingPlaces = ref(false);
  const places = ref([]);
  const watchPositionId = ref(undefined);
  const isInRoute = ref(false);
  const isUsingGarminGlo = ref(false);
  const routeInfo = ref({
    points: [],
    startedAt: undefined,
  });

  onMounted(() => {
    getInitialLocation();
  });

  // Getters
  const isUserLocationReady = computed(() => !!userLocation.value);

  // Actions
  function setLngLat(coords) {
    userLocation.value = [coords.lng, coords.lat, coords.accuracy];
    historicUserLocations.value = [
      ...(historicUserLocations.value || []),
      userLocation.value,
    ];
    isLoading.value = false;
  }

  function setIsLoadingPlaces(isLoading) {
    isLoadingPlaces.value = isLoading;
  }

  function setPlaces(newPlaces) {
    places.value = newPlaces;
    isLoadingPlaces.value = false;
  }

  function getInitialLocation() {
    navigator.geolocation.getCurrentPosition(
      (props) => {
        console.log("Current Position Geolocation Info", props);
        const coords = props.coords;
        setLngLat({
          lng: coords.longitude,
          lat: coords.latitude,
          accuracy: coords.accuracy,
        });
      },
      (err) => {
        console.error(err);
        throw new Error("No geolocation :(");
      },
      { enableHighAccuracy: true }
    );
  }

  function updateUserLocation() {
    navigator.geolocation.getCurrentPosition(
      (props) => {
        console.log("Current Position Geolocation Info", props);
        const coords = props.coords;
        setLngLat({
          lng: coords.longitude,
          lat: coords.latitude,
          accuracy: coords.accuracy,
        });
        mapStore.setUserPlaceMarker({
          lng: coords.longitude,
          lat: coords.latitude,
        });
      },
      (err) => {
        console.error(err);
        throw new Error("No geolocation :(");
      },
      { enableHighAccuracy: true }
    );
  }

  function startRoute() {
    console.log("startRoute");
    removeAllPlaces();
    isInRoute.value = true;
    routeInfo.value.startedAt = new Date();

    watchPositionId.value = navigator.geolocation.watchPosition(
      (props) => {
        const coords = props.coords;
        setLngLat({
          lng: coords.longitude,
          lat: coords.latitude,
          accuracy: coords.accuracy,
        });
        mapStore.setUserPlaceMarker({
          lng: coords.longitude,
          lat: coords.latitude,
        });
      },
      (err) => {
        console.error(err);
        throw new Error("No geolocation :(");
      },
      { enableHighAccuracy: true }
    );
  }

  function endRoute() {
    console.log("endRoute");
    console.log(routeInfo);
    createRoute();
    removeAllPlaces();
    isInRoute.value = false;
    routeInfo.value.startedAt = undefined;
    routeInfo.value.points = [];
    navigator.geolocation.clearWatch(watchPositionId.value);
  }

  function createRoute() {
    const route = {
      userAgent: navigator.userAgent || navigator.vendor,
      points: routeInfo.value.points.map((point) => ({
        lng: point.lng,
        lat: point.lat,
        accuracy: point.accuracy,
      })),
      finishedAt: new Date(),
      duration: Math.abs(
        (new Date().getTime() - routeInfo.value.startedAt.getTime()) / 1000
      ),
      isUsingGarminGlo: isUsingGarminGlo.value,
    };
    console.log("route to save", route);
    // Send to API.
    saveRoute(route);
  }

  async function searchPlacesByTerm(term) {
    if (term.length === 0) {
      setPlaces([]);
      return [];
    }

    if (!userLocation.value) {
      throw new Error("No user location");
    }

    setIsLoadingPlaces(true);

    const resp = await searchApi.get(`/${term}.json`, {
      params: {
        proximity: userLocation.value.join(","),
      },
    });

    setPlaces(resp.data.features);

    return resp.data.features;
  }

  function removeAllPlaces() {
    places.value = [];
    historicUserLocations.value = [];
    mapStore.removeAllLocations();
  }

  function toggleIsUsingGarminGlo() {
    isUsingGarminGlo.value = !isUsingGarminGlo.value;
  }

  watch(historicUserLocations, (newLocations) => {
    if (isInRoute.value && newLocations && newLocations.length > 1) {
      const lastLocation = Array.from(newLocations[newLocations.length - 1]);
      console.log("lastLocation", lastLocation);
      routeInfo.value.points.push({
        lng: lastLocation[0],
        lat: lastLocation[1],
        accuracy: lastLocation[2],
      });
      mapStore.drawRoute(newLocations);
    }
  });

  return {
    isLoading,
    userLocation,
    historicUserLocations,
    isLoadingPlaces,
    places,
    isInRoute,
    routeInfo,
    isUsingGarminGlo,

    isUserLocationReady,

    getInitialLocation,
    searchPlacesByTerm,
    updateUserLocation,
    removeAllPlaces,
    startRoute,
    endRoute,
    toggleIsUsingGarminGlo,
  };
});
