import axios from "axios";
const baseAPI = process.env.VUE_APP_API_URL;

export function get(url, params = null) {
    return axios({ method: "GET", url: baseAPI + url, params })
        .then((res) => {
            return res;
        })
        .catch((error) => {
            return error.toJSON();
        });
}

export function post(url, data = null) {
    return axios({ method: "POST", url: baseAPI + url, data })
        .then((res) => {
            return res;
        })
        .catch((error) => {
            return error.toJSON();
        });
}

export function path(url, data = null) {
    return axios({ method: "PATCH", url: baseAPI + url, data })
        .then((res) => {
            return res;
        })
        .catch((error) => {
            return error.toJSON();
        });
}

export function deleteAd(url) {
    return axios({ method: "DELETE", url: baseAPI + url })
        .then((res) => {
            return res;
        })
        .catch((error) => {
            return error.toJSON();
        });
}

export function getCEP(url) {
    return axios({ method: "GET", url: baseAPI + url })
        .then((res) => {
            return res;
        })
        .catch((error) => {
            return error.toJSON();
        });
}