import { ref } from "vue";
import { defineStore } from "pinia";
import { searchApi } from "../../apis"; // Update this path to your API module
import { useMapStore } from "./useMapStore";

export const usePlacesStore = defineStore("places", () => {
  const mapStore = useMapStore();

  const isLoading = ref(true);
  const userLocation = ref(undefined);
  const historicUserLocations = ref([]);
  const isLoadingPlaces = ref(false);
  const places = ref([]);

  onMounted(() => {
    getInitialLocation();
  });

  // Getters
  const isUserLocationReady = computed(() => !!userLocation.value);

  // Actions
  function setLngLat(coords) {
    userLocation.value = [coords.lng, coords.lat];
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
        setLngLat({ lng: coords.longitude, lat: coords.latitude });
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
        setLngLat({ lng: coords.longitude, lat: coords.latitude });
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

  return {
    isLoading,
    userLocation,
    historicUserLocations,
    isLoadingPlaces,
    places,

    isUserLocationReady,

    getInitialLocation,
    searchPlacesByTerm,
    updateUserLocation,
    removeAllPlaces,
  };
});
