import request from "./requestService.js";

async function getData(url, id) {
    try {
        const response = await request.getObjects(url, id);
        // console.log(response);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export default getData;
