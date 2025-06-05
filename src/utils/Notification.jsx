import { useState } from "react";
import Swal from "sweetalert2";

export const showSuccessAlert = (message,  confirmButtonText = "OK", cancelButtonText = "Cancel" , action) => {
  Swal.fire({
    title: "Succès",
    icon: "success",
    text: message,                         
  });
};
export const showErrorAlert = (message) => {
  Swal.fire({
    title: "Erreur",
    icon: "error",
    text: message ,
  });
};

export const showWarningAlert = (message) => {
  Swal.fire({
    title: "Attention",
    icon: "warning",
    text: message ,
  });
};


export const showConfirmationAlert =  (message, title , confirmButtonText , cancelButtonText , actionOnConfirm) => {
  Swal.fire({
    title: title,                          
    icon: "warning",                       
    text: message,                         
    confirmButtonText: confirmButtonText,   // Customizable confirm button text
    cancelButtonText: cancelButtonText,     // Customizable cancel button text
    showCancelButton: true,                 // Show the cancel button
    focusConfirm: true,                     // Focus on the confirm button for better UX
  }).then(async(result) => {
    if (result.isConfirmed) {

      if (actionOnConfirm){
         await actionOnConfirm()
        }
    } else {
      console.log("L'utilisateur a décidé de rester sur la page");
    }
  });
};
