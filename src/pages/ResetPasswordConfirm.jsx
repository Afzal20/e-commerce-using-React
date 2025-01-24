import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://your-backend-api.com',
});

apiClient.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        // Decode the token to check expiration
        const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
        const isTokenExpired = Date.now() >= tokenPayload.exp * 1000;

        if (isTokenExpired && refreshToken) {
            const newAccessToken = await refreshAccessToken(refreshToken);
            if (newAccessToken) {
                config.headers['Authorization'] = `Bearer ${newAccessToken}`;
            }
        } else if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;
