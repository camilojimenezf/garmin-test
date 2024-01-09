import { ref } from "vue";
import { defineStore } from "pinia";
import { searchApi } from "../../apis"; // Update this path to your API module

export const usePlacesStore = defineStore("places", () => {
  const isLoading = ref(true);
  const userLocation = ref(undefined);
  const isLoadingPlaces = ref(false);
  const places = ref([]);

  onMounted(() => {
    getInitialLocation();
  });

  // Getters
  const isUserLocationReady = computed(() => !!userLocation.value);

  // Actions
  function setLngLat(coords) {
    console.log("setLngLat", coords);
    userLocation.value = [coords.lng, coords.lat];
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
      ({ coords }) =>
        setLngLat({ lng: coords.longitude, lat: coords.latitude }),
      (err) => {
        console.error(err);
        throw new Error("No geolocation :(");
      }
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

  return {
    isLoading,
    userLocation,
    isLoadingPlaces,
    places,

    isUserLocationReady,

    getInitialLocation,
    searchPlacesByTerm,
  };
});
