import axios from 'axios';

// Skapa en anpassad axios-instans med din bas-URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// 1. REQUEST INTERCEPTOR: Lägg alltid med den aktuella Access Token i Authorization-headern
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const token = user?.token;

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. RESPONSE INTERCEPTOR: Fånga 401-fel och förnya token automatiskt
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Om svaret är 401 (Unauthorized) och vi inte redan har försökt förnya denna request
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                const refreshToken = currentUser?.refreshToken;

                if (!refreshToken) {
                    throw new Error("Ingen refresh token tillgänglig");
                }

                // Anropa din nya refresh-endpoint på backend
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/users/refresh`,
                    { refreshToken }
                );

                const { token: newAccessToken } = response.data;

                // Uppdatera localStorage med den nya access token
                const updatedUser = { ...currentUser, token: newAccessToken };
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));

                // Uppdatera Authorization-headern för det misslyckade anropet och kör om det
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                // Om refresh token också har gått ut eller återkallats: Logga ut användaren
                localStorage.removeItem('currentUser');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;