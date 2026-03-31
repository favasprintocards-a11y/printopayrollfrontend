
// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://printopayrollbackend.onrender.com/api",
//   timeout: 30000,
// });

// export default api;

import axios from "axios";

const isDevelopment = import.meta.env.MODE === 'development';

const api = axios.create({
  baseURL: isDevelopment ? "http://localhost:5000/api" : "https://printopayrollbackend.onrender.com/api",
  timeout: 30000,
});

export default api;
