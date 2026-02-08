export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/auth/login`,
        REGISTER: `${API_BASE_URL}/auth/register`,
        PERFIL: `${API_BASE_URL}/auth/perfil`,
        REGISTRO_ADMIN: `${API_BASE_URL}/auth/registro-admin`,
    },
    TRABAJOS: `${API_BASE_URL}/trabajos`,
    NOTICIAS: `${API_BASE_URL}/noticias`,
}