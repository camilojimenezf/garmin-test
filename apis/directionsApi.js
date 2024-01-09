import axios from "axios";

const directionsApi = axios.create({
  baseURL: "https://api.mapbox.com/directions/v5/mapbox/driving",
  params: {
    access_token:
      "pk.eyJ1IjoiY2FtaWxvamltZW5lemYiLCJhIjoiY2s0OTJ2dGlhMDE0ejNucWdpNXdobHk3MiJ9.ep4oBYYw3IE1dPTm7GuLEA",
    alternatives: false,
    geometries: "geojson",
    overview: "simplified",
    steps: false,
  },
});

export default directionsApi;
