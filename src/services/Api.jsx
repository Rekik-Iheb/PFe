import axios from "axios";
import { showConfirmationAlert, showErrorAlert, showSuccessAlert } from "../utils/Notification";
import { getDecryptedCookie } from "../utils/Crypt";





export const loginService = async (email, password) => {
  try {
    const response = await axios.post(
      `https://serveurspring-hxd7d3gkc5ewcrfm.southafricanorth-01.azurewebsites.net/utilisateur/login`,
      { email, password }
    );

    return response;


  } catch (error) {

    if (error.response) {
      console.error("Login error:", error.response.status, error.response.data);
      throw error.response.data;
    }

  }
};





export const getRoles = async () => {
  try {
    const response = await axios.get(`https://serveurspring-hxd7d3gkc5ewcrfm.southafricanorth-01.azurewebsites.net/utilisateur/role`);
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }

};
export const saveUtilisateur = async (form) => {
  try {
    const response = await axios.post(`https://serveurspring-hxd7d3gkc5ewcrfm.southafricanorth-01.azurewebsites.net/utilisateur/`, form);
    showSuccessAlert(response.data)
  } catch (error) {
    console.log(error.response ? error.response.data : "Erreur réseau")
  }
};
export const getAll = async () => {
  try {
    const response = await axios.get(`https://serveurspring-hxd7d3gkc5ewcrfm.southafricanorth-01.azurewebsites.net/utilisateur/`);

    if (response.status == 200) {
      return response.data;

    } else {
      showErrorAlert("Error de fetching data")
    }

  } catch (error) {
    console.error('Error fetching utilisateur:', error);
    throw error;
  }
}

export const getUser = async (data) => {

  try {
    const response = await axios.post("https://serveurspring-hxd7d3gkc5ewcrfm.southafricanorth-01.azurewebsites.net/utilisateur/find", data);
    return response.data;
  } catch (error) {
    showErrorAlert("Error fetching data: ", error);
    throw error;
  }
};

export const verifEmail = async (email) => {
  try {
    const response = await axios.get(`https://serveurspring-hxd7d3gkc5ewcrfm.southafricanorth-01.azurewebsites.net/utilisateur/${email}`);

    if (response.status == 200) {
      return true;
    } else {
      return false;
    }

  } catch (error) {
    return false;
  }
}

export const getByEmail = async (email) => {

  try {

    const response = await axios.get(`https://serveurspring-hxd7d3gkc5ewcrfm.southafricanorth-01.azurewebsites.net/utilisateur/${email}`);

    if (response.status == 200) {
      return response.data;

    } else {
      showErrorAlert("Error de fetching data")
    }

  } catch (error) {
    console.error('Error fetching utilisateur:', error);
    throw error;
  }
}
export const UpdateUtilisateur = async (form) => {
  const update = async () => {
    try {
      const response = await axios.put(`https://serveurspring-hxd7d3gkc5ewcrfm.southafricanorth-01.azurewebsites.net/utilisateur/update`, form);
      showSuccessAlert(response.data)
    } catch (error) {
      showErrorAlert(error.response ? error.response.data : "Erreur réseau");
      console.log(error.response.data)
    }
  };
  showConfirmationAlert(
    "Êtes-vous sûr de vouloir mettre à jour les informations de cet utilisateur ?",
    "Confirmation de mise à jour",
    "Oui",
    "Annuler",
    update
  );

};
export const DeleteUtilisateur = async (email) => {
  const suppression = async () => {
    const emailUtiliser = await getDecryptedCookie("email")
    if (emailUtiliser == email) {
      showErrorAlert("c'est le compte utiliser")
    } else {
      try {
         await axios.put(`https://serveurspring-hxd7d3gkc5ewcrfm.southafricanorth-01.azurewebsites.net/utilisateur/delet/${email}`);
        window.location.reload()
      } catch (error) {
        showErrorAlert(error.response ? error.response.data : "Erreur réseau");
        console.log(error.response.data)
      }
    }
  };
  showConfirmationAlert(
    "Êtes-vous sûr de vouloir supprimer cet utilisateur ?",
    "Confirmation de suppression",
    "Oui",
    "Annuler",
    suppression
  );


};
export const countUtilisateur = async () => {
  try {
    const response = await axios.get(`https://serveurspring-hxd7d3gkc5ewcrfm.southafricanorth-01.azurewebsites.net/utilisateur/count`);

    if (response.status == 200) {
      return response.data;

    } else {
      showErrorAlert("Error de fetching data")
      return 0;
    }

  } catch (error) {
    console.error('Error fetching utilisateur:', error);
    throw error;
  }
};

export const getUtilisateurRecherche = async (form) => {
  try {
   const rep =  await axios.post(`https://serveurspring-hxd7d3gkc5ewcrfm.southafricanorth-01.azurewebsites.net/utilisateur/recherche`,form);
    return rep.data;  
  } catch (error) {
    console.error("Error fetching data: ", error.response?.data);
    throw error;
  }
};