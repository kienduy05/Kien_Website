import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/v1/api', // Backend base URL
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'TEST_API_KEY_123' // Fixed API Key from backend test
    }
});

// Request interceptor to attach access token and client id
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        const clientId = localStorage.getItem('clientId');
        
        if (token) {
            config.headers['authorization'] = token;
        }
        if (clientId) {
            config.headers['x-client-id'] = clientId;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors (like 401 Unauthorized) globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle token expiration/invalid token (e.g., redirect to login)
            localStorage.removeItem('accessToken');
            localStorage.removeItem('clientId');
            localStorage.removeItem('user');
            if(window.location.pathname !== '/admin/login') {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
