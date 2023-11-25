import { jwtDecode } from "jwt-decode";
import http from "./httpService";

const apiEndpoint = "/auth/jwt";
const access = "access";
const refresh = "refresh";

export async function login(username, password) {
    logout();
    const { data: jwt } = await http.post(apiEndpoint + "/create", {
        username,
        password,
    });
    localStorage.setItem(access, jwt.access);
    localStorage.setItem(refresh, jwt.refresh);
}

export async function setRefreshToken() {
    try {
        const token = localStorage.getItem(refresh);
        const { data: jwt } = await http.post(apiEndpoint + "/refresh", {
            refresh: token,
        });

        localStorage.setItem(access, jwt.access);
        http.setJwt(jwt.access);
    } catch (error) {
        logout();
        window.location.replace(window.location.origin);
    }
}

export function loginWithJwt(accessToken, refreshToken) {
    logout();
    localStorage.setItem(access, accessToken);
    localStorage.setItem(refresh, refreshToken);
}

export function logout() {
    localStorage.removeItem(access);
    localStorage.removeItem(refresh);
}

export function getCurrentUser() {
    try {
        const jwt = localStorage.getItem(access);
        return jwtDecode(jwt);
    } catch (ex) {
        return null;
    }
}

export function getaccessJwt() {
    return localStorage.getItem(access);
}

export function getrefreshJwt() {
    return localStorage.getItem(refresh);
}

const functions = {
    loginWithJwt,
    login,
    logout,
    getCurrentUser,
    getaccessJwt,
    getrefreshJwt,
    setRefreshToken,
};

export default functions;
