import axios from "axios";
import { BASE_URL, getToken, removeToken } from "../utils/uttils";
import { useNavigate } from "react-router-dom";

// const navigate = useNavigate()

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

// api.interceptors.response.use(
//     response => response,
//     error => {
//         if (error.response.status === 401) {
//             localStorage.removeItem("token")
//             window.location.href = '/'
//         }
//         return Promise.reject(error)
//     }
// )

export default api