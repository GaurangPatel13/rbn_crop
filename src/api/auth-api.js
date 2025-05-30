import { Axios } from "../constants/mainContent";

const apiUrl = "/admin";

export async function loginWithEmailAdmin(payload) {
  try {
    const response = await Axios.post(`${apiUrl}/login`, payload);
    return response?.data;
    
  } catch (error) {
    return error?.response?.data
  }
}

export async function createDistributor(payload) {
  try {
    const response = await Axios.post(`/franchise/register`, payload);
    return response?.data;
    
  } catch (error) {
    return error?.response?.data
  }
}


// *********************************************************************