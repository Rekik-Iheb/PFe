import React, { useEffect, useState } from 'react';
import UtilisateurForm from '../components/Form';

const CreationUtilisateur = () => {
  const formData={
    email: '',
    password: '',
    nomPrenom: '',
    telephone: '',
    role: '',
  };


 
  return (
    <div className='bg-gradient-to-br min-h-screen from-blue-50 via-indigo-50 to-purple-50'>
       <UtilisateurForm params={formData} type={"add"} titel = {"Creation un compte"} ></UtilisateurForm>
    </div>
   
  );
};

export default CreationUtilisateur;
