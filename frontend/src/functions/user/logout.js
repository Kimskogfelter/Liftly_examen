import api from '../../api/axios'; // Importera din anpassade axios-instans med withCredentials

export const logout = async (setCurrentUser, navigate) => {
    try {
        // 1. Säg åt backend att rensa cookien och ta bort token från MongoDB
        await api.post('/users/logout');
    } catch (error) {
        console.error("Fel vid utloggning på servern:", error);
    } finally {
        // 2. Rensa lokalt i React oavsett vad backend svarade
        localStorage.removeItem("currentUser");
        setCurrentUser(null);
        navigate("/login");
    }
};