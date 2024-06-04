import axios from "axios";

const OwnerAxiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_APP_BASE_URL}`,
    withCredentials: true,
    withXSRFToken: true
})

OwnerAxiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('ACCESS_OWNER_TOKEN')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    config.headers.Accept = 'application/json'
    return config
})

OwnerAxiosClient.interceptors.response.use((config) => {
    return config
}, (error) => {
    if (error.response.status === 401 && error.response.config.url !== 'api/auth/login') {
        localStorage.clear()
        window.location.replace(`${import.meta.env.VITE_APP_URL}`);
    }
    return error.response.data

})

export default OwnerAxiosClient