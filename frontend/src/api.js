import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

console.log("API Base URL:", api.defaults.baseURL);

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        // Don't attach token for auth endpoints to prevent 401 if token is invalid
        const isAuthEndpoint = config.url.includes('/auth/register/') || config.url.includes('/auth/login/');

        if (token && !isAuthEndpoint) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('access_token');
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
