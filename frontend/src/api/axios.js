import axios from 'axios';

// Skapa en anpassad axios-instans med din bas-URL och tillåt cookies
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true // 🔴 KRÄVS för att HttpOnly cookies ska skickas med automatiskt!
});

// Variabler för att hantera parallella refresh-anrop (kölapp)
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

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

        // Om svaret är 401 och det inte gällde själva refresh-anropet
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            // 🔒 OM ETT REFRESH-ANROP REDAN PÅGÅR: Lägg detta anrop i kön och vänta!
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((newToken) => {
                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

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

                // Släpp fram alla anrop som stod i kön och väntade
                processQueue(null, newAccessToken);

                // Uppdatera Authorization-headern för det ursprungliga anropet och kör om det
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                // Om refresh har misslyckats (t.ex. 30 dagar har gått): Skicka fel till kön & logga ut
                processQueue(refreshError, null);

                localStorage.removeItem('currentUser');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false; // Lås upp igen när allt är klart
            }
        }

        return Promise.reject(error);
    }
);

export default api;