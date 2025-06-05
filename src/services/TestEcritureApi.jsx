import axios from "axios";
export const getTests = async () => {
  try {
    const response = await axios.get(`https://serveurspring-hxd7d3gkc5ewcrfm.southafricanorth-01.azurewebsites.net/testecrutire/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};
export const getResultat = async (code) => {
  try {
    const response = await axios.get(`https://serveurspring-hxd7d3gkc5ewcrfm.southafricanorth-01.azurewebsites.net/testecrutire/${code}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};
export const getNombreTests = async () => {
  try {
    const response = await axios.get(`https://serveurspring-hxd7d3gkc5ewcrfm.southafricanorth-01.azurewebsites.net/testecrutire/count`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};
export const getNotification = async () => {
  try {
    const response = await axios.get(`https://serveurspring-hxd7d3gkc5ewcrfm.southafricanorth-01.azurewebsites.net/testecrutire/notification`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};
export const getChartData = async (annee) => {
  try {
    const response = await axios.get(`https://serveurspring-hxd7d3gkc5ewcrfm.southafricanorth-01.azurewebsites.net/testecrutire/data/${annee}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};

export const setEcritureReaded = async (id) => {
  try {
    const response = await axios.put(`https://serveurspring-hxd7d3gkc5ewcrfm.southafricanorth-01.azurewebsites.net/testecrutire/${id}`);
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};
export const getTestsNonValider = async () => {
  try {
    const response = await axios.get("https://serveurspring-hxd7d3gkc5ewcrfm.southafricanorth-01.azurewebsites.net/testecrutire/validation", {
      params: { statut: "NON_VALIDE" }
    });
    return response.data
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};

export const getStatutsTest = async () => {
  try {
    const response = await axios.get("https://serveurspring-hxd7d3gkc5ewcrfm.southafricanorth-01.azurewebsites.net/testecrutire/stauts");
    return response.data
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};

export const valideTest = async (id, statut) => {
  try {
   const rep =  await axios.put(`https://serveurspring-hxd7d3gkc5ewcrfm.southafricanorth-01.azurewebsites.net/testecrutire/validation/${id}?statut=${statut}`    );
    return rep.data;  
  } catch (error) {
    console.error("Error fetching data: ", error.response?.data);
    throw error;
  }
};
export const getTestRecherche = async (form) => {
  try {
   const rep =  await axios.post(`https://serveurspring-hxd7d3gkc5ewcrfm.southafricanorth-01.azurewebsites.net/testecrutire/recherche`,form    );
    return rep.data;  
  } catch (error) {
    console.error("Error fetching data: ", error.response?.data);
    throw error;
  }
};
export const getLignes = async (contrat) => {
  try {
   const rep =  await axios.get(`https://serveurspring-hxd7d3gkc5ewcrfm.southafricanorth-01.azurewebsites.net/testecrutire/lignes/${contrat}`);
    return rep.data;  
  } catch (error) {
    console.error("Error fetching data: ", error.response?.data);
    throw error;
  }
};