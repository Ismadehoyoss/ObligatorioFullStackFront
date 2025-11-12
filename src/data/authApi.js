import axios from 'axios';

const authApi = axios.create({
    baseURL: 'https://obligatorio-full-stack-rho.vercel.app',
});
authApi.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default authApi;
