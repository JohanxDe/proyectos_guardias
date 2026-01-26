export const API_BASE_URL = import.meta.env.ViTE_API_URL || "http://localhost:5000"

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/api/auth/login`,
        REGISTER: `${API_BASE_URL}/api/auth/register`,
        PERFIL: `${API_BASE_URL}/api/auth/perfil`,
    },
    TRABAJOS: `${API_BASE_URL}/api/trabajos`,
    NOTICIAS: `${API_BASE_URL}/api/noticias`,
}