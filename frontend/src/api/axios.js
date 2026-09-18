import axios from 'axios';

// Skapa en anpassad axios-instans med din bas-URL och tillåt cookies
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true // 🔴 KRÄVS för att HttpOnly cookies ska skickas med automatiskt!
});

// 1. REQUEST INTERCEPTOR: Skicka med den kortlivade Access Token i Authorization-headern
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const token = user?.token; // Access token (15m)

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. RESPONSE INTERCEPTOR: Fånga 401-fel och förnya token automatiskt via HttpOnly Cookie
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Om svaret är 401 (Unauthorized) och vi inte redan har försökt förnya denna request
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // 🔴 Cookien med refreshToken skickas automatiskt med tack vare withCredentials: true
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/users/refresh`,
                    {}, // Tom body!
                    { withCredentials: true }
                );

                const { token: newAccessToken } = response.data;

                // Uppdatera enbart access token i localStorage
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                const updatedUser = { ...currentUser, token: newAccessToken };
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                
                window.dispatchEvent(new Event("userTokenRefreshed"));

                // Uppdatera Authorization-headern för det misslyckade anropet och kör om det
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                // Om refresh har misslyckats, spärrats eller återanvänts: Logga ut användaren
                localStorage.removeItem('currentUser');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;