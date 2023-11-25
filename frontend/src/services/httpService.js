import axios from "axios";
import { toast } from "react-toastify";
import auth from "./authService";

setJwt(auth.getaccessJwt());

axios.interceptors.response.use(null, (error) => {
    const expectedError =
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500;

    if (error.response.status === 401) {
        auth.setRefreshToken();
    }

    if (!expectedError) {
        console.log(error);
        toast.error("An unexpected error occurrred.");
    }

    return Promise.reject(error);
});

function setJwt(jwt) {
    if (jwt) axios.defaults.headers.common["Authorization"] = "JWT " + jwt;
}

const functions = {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
    options: axios.options,
    custom: axios,
    setJwt,
};

export default functions;
