import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000",

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  console.log(
    `[API]: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
  );

  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(
      `[API]: ${response.status} ${response.config.url}`
    );

    return response;
  },
  (error) => {
    console.error(
      "[API]: Request failed:",
      error.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

export default api;