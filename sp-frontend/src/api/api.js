import axios from "axios";
import { BASE_URL, getToken, removeToken } from "../utils/uttils";

let navigateFunction = null;

export const setNavigate = (nav) => {
    navigateFunction = nav;
};

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers: {
        "Accept": "application/json"
    }
})

api.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${getToken()}`
    return config
})

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401 && !error.config.url.includes("/auth/login")) {
            removeToken()
            if (navigateFunction) {
                navigateFunction('/');
            } else {
                window.location.href = '/'
            }
        }
        return Promise.reject(error)
    }
)

export default api