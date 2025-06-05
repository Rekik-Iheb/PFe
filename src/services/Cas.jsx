

import axios from "axios";

export const getCas = async()=>{

    try {
        const response = await axios.get(`http://localhost:9999/utilisateur/getKey`);
        return response.data;
      } catch (error) {
        console.error("Error fetching data: ", error);
        throw error;
      }

}