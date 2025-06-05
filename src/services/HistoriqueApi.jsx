import axios from "axios";

export const getHistorique = async()=>{

    try {
        const response = await axios.get("https://serveurspring-hxd7d3gkc5ewcrfm.southafricanorth-01.azurewebsites.net/historique/");
        return response.data;
      } catch (error) {
        console.error("Error fetching data: ", error);
        throw error;
      }

}
export const getHistoriqueRecherche = async(form)=>{

    try {
        const response = await axios.post("https://serveurspring-hxd7d3gkc5ewcrfm.southafricanorth-01.azurewebsites.net/historique/recherche" , form);
        return response.data;
      } catch (error) {
        console.error("Error fetching data: ", error);
        throw error;
      }

}

