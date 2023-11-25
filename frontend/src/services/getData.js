import request from "./requestService.js";

async function getData(url, id) {
    try {
        const response = await request.getObjects(url, id);
        if (response.status === 200) {
            return response.data;
        }
        return false;
    } catch (error) {
        console.log(error);
    }
}

export default getData;
