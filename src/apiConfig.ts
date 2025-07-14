// Este archivo determina la URL base para las llamadas a la API.
// import.meta.env.DEV es una variable especial de Vite que es 'true' en desarrollo.

const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:3001' // URL para desarrollo local
  : ''; // URL relativa para producción (Vercel)

export default API_BASE_URL;