import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || "/api/v1";

console.log("API BASE URL:", API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
