import axios from "axios";

const searchApi = axios.create({
  baseURL: "https://api.mapbox.com/geocoding/v5/mapbox.places",
  params: {
    access_token:
      "pk.eyJ1IjoiY2FtaWxvamltZW5lemYiLCJhIjoiY2s0OTJ2dGlhMDE0ejNucWdpNXdobHk3MiJ9.ep4oBYYw3IE1dPTm7GuLEA",
    language: "es",
    limit: 5,
  },
});

export default searchApi;
