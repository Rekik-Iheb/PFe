
import axios from "axios";
import { showConfirmationAlert, showErrorAlert, showSuccessAlert } from "../utils/Notification";
import Swal from "sweetalert2";

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post("https://serveurspring-hxd7d3gkc5ewcrfm.southafricanorth-01.azurewebsites.net/ligne/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const get = async (data) => {
  try {
    const response = await axios.post("https://serveurspring-hxd7d3gkc5ewcrfm.southafricanorth-01.azurewebsites.net/ligne/", data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};

export const getContract = async (code, email, categ, test) => {
  try {
    const response = await axios.post(`https://serveurspring-hxd7d3gkc5ewcrfm.southafricanorth-01.azurewebsites.net/ligne/${code}/${email}/${categ}/${test}`);
    if (response.data == "Le code catégorie de produit  est incorrect" && test == false) {
      Swal.fire({
        title: "Attention",
        icon: "warning",
        text: "Le produit sélectionné est incorrect. Voulez-vous continuer ?",
        confirmButtonText: "Continuer",
        cancelButtonText: "Annuler",
        showCancelButton: true,
        focusConfirm: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          getContract(code, email, categ, true)
        }
      });
    } else {
      window.open(
        `../test/résultat?code-contrat=${code}`,
        "_blank",
        `width=full,height=full`
      );
    }
  } catch (error) {
    showErrorAlert(error.response.data);
    console.error("Error fetching data: ", error);
    throw error;
  }
};
export const getNombreLignes = async () => {
  try {
    const response = await axios.get(`https://serveurspring-hxd7d3gkc5ewcrfm.southafricanorth-01.azurewebsites.net/ligne/count`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};