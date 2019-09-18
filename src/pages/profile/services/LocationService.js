import axios from 'axios';

const url = 'http://192.168.11.54:8080/GH/api/';

//Obtener pefil por codigo
async function getListLocation(parentId) {
    return await axios.get(url + 'General/GetListLocationV2', { params: {parentId} })
        .then((response) => {
            return resolveRequestResult(response.data);
        });
}

const resolveRequestResult = (requestResult) => {
    if (requestResult.IsError) {
        console.log('[LocationService]', requestResult.ErrorMessage);
        return;
    }
    if (!requestResult.IsSuccessful) {
        console.log('[LocationService]', requestResult.Messages[0]);
        return;
    }
    return requestResult.Result;
}

export const LocationService = {
    getListLocation
}
