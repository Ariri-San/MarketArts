import http from "./httpService";
import { toast } from "react-toastify";
import config from "../config.json";

var apiObject = config.BaseUrl;

function changeUrl(url = null, id = null) {
    id = id ? "/" + id : "";
    return url ? (config.BaseUrl + url + id) : (apiObject + id);
}

// export functions

export function setUrl(url) {
    apiObject = config.BaseUrl + url;
    return apiObject;
}

export function getUrl(url) {
    return apiObject;
}

export function getObjects(url = null, id = null) {
    return http.get(changeUrl(url, id));
}

export function getOptions(url = null, id = null) {
    return http.options(changeUrl(url, id));
}

export function saveObject(object, url = null, id = null) {
    if (id) {
        return http.put(changeUrl(url, id), object);
    }

    return http.post(changeUrl(url), object);
}

export function deleteObject(id, url = null, data = null) {
    return http.custom({
        url: changeUrl(url, id),
        method: "delete",
        data: data,
    });
}

export function showError(error) {
    console.log(error);
    for (const iterator of error.response.data) {
        toast.error(iterator);
    }
}

const functions = {
    setUrl,
    getUrl,
    getObjects,
    getOptions,
    saveObject,
    deleteObject,
    showError,
};

export default functions;
