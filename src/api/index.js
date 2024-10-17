import axios from "axios";

const isLocalhost = window.location.hostname === "localhost";

export const BASE_URL = isLocalhost
  ? "http://localhost:5000"
  : import.meta.env.VITE_API_BASE_URL;
// export const BASE_URL = import.meta.env.VITE_API_BASE_URL  ;
// export const BASE_URL = "http://localhost:5000";
const api = axios.create({
  baseURL: BASE_URL,
});

export const UI_url =
  "http://localhost:5173" || import.meta.env.VITE_UI_BASE_URL;

console.log("Base URL is", BASE_URL);

export default api;
