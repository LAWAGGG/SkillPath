export const BASE_URL = "http://localhost:8000/api"

export function setToken(token){
    localStorage.setItem("token", token)
}

export function getToken(){
    return localStorage.getItem("token")
}

export function removeToken(){
    localStorage.removeItem("token")
}

