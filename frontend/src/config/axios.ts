import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
console.log("🔍 [AXIOS CONFIG] Initializing Axios with baseURL:", apiUrl);

// Instancia centralizada de Axios para la comunicación con el Backend
export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // 60 segundos — acomoda el 'cold start' del plan gratuito de Render
});

// Interceptor de Peticiones: Log de peticiones salientes
api.interceptors.request.use(
  (config) => {
    console.log(`📡 [AXIOS REQUEST] ${config.method?.toUpperCase()} -> ${config.baseURL}${config.url}`, config.data || "");
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ [AXIOS REQUEST ERROR]", error);
    return Promise.reject(error);
  },
);

// Interceptor de Respuestas: Log de respuestas y errores detallados
api.interceptors.response.use(
  (response) => {
    console.log(`✅ [AXIOS RESPONSE] ${response.status} <- ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error("❌ [AXIOS RESPONSE ERROR]", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
    });
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  },
);

export default api;
