import axios from 'axios';

const url = 'http://192.168.11.54:8080/GH/api/';
// const url = 'https://localhost:44381/api/';

//Obtener pefil por codigo
async function getProfileById(id) {
  return await axios.get(url + 'Profile/GetMyProfile2', { params: { codeProfile: id } })
    .then((response) => {
      return resolveRequestResult(response.data);
    });
}

//Obtener los typedetails generales para el profile
async function getProfileTypeDetails() {
  return await axios.get(url + 'General/GetProfileTypeDetailsV2')
    .then((response) => {
      return resolveRequestResult(response.data);
    }).catch(err => {
      console.error(err);
    });
}

//Obtener los typedetails generales para el profile
async function updateProfile(profile) {
  return await axios.post(url + 'Profile/UpdateProfileV2', profile)
    .then((response) => {
      return resolveRequestResult(response.data);
    });
}

const resolveRequestResult = (requestResult) => {
  if (requestResult.IsError) {
    console.error('[ProfileService]', requestResult.ErrorMessage);
    return;
  }
  if (!requestResult.IsSuccessful) {
    console.error('[ProfileService]', requestResult.Messages[0]);
    return;
  }
  return requestResult.Result;
}

export const ProfileService = {
  getProfileById,
  getProfileTypeDetails,
  updateProfile,
}
