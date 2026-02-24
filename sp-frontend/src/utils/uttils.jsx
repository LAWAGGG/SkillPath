// export const BASE_URL = "http://localhost:8080/api" //docker
// export const BASE_URL = "http://localhost:8000/api" //local
// export const BASE_URL = "http://192.168.100.147:8080/api" //rumah
// export const BASE_URL = "http://10.10.18.169:8080/api" //kelas
// export const BASE_URL = "http://192.168.1.129:8080/api" //pawang aws
export const BASE_URL = "http://10.10.18.105:8080/api" //cybercode
// export const BASE_URL = "http://10.0.2.2:8080/api" //localhost for mobile

export function setToken(token){
    localStorage.setItem("token", token)
}

export function getToken(){
    return localStorage.getItem("token")
}

export function removeToken(){
    localStorage.removeItem("token")
}

export function getRole(){
    return localStorage.getItem("role")
}

export function setRole(role){
    localStorage.setItem("role", role)
}