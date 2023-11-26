import http from "./httpService";
import { toast } from "react-toastify";

var apiObject = null;

function changeUrl(url = null, id = null) {
    id = id ? id + "/" : "";
    const api = apiObject ? apiObject : "";
    return url ? `${url}/${id}` : `${api}/${id}`;
}

// export functions

export function setUrl(url) {
    apiObject = url;
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
