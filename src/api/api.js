import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // adjust if your backend uses different URL
  timeout: 15000,
});

export default api;
