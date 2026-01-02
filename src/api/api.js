
import axios from "axios";

const api = axios.create({
  baseURL: "https://printopayrollbackend.onrender.com/api",
  timeout: 15000,
});

export default api;

