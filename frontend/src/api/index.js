import axios from "axios";

console.log("API BASE URL:", import.meta.env.VITE_SERVER_BASE_URL);

export const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
