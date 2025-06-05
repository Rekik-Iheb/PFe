
import Cookies from "js-cookie";
import CryptoJS from 'crypto-js';
import { getKey } from "../services/Key.jsx";


    export async function setEncryptedCookie   (name ,value)  {
            const secretKey = await getKey();   
        const encryptedValue = CryptoJS.AES.encrypt(value, secretKey).toString();  
        Cookies.set(name, encryptedValue, {
  secure: true,
  sameSite: 'Strict',
}); 
    };  
    
 
export async function getDecryptedCookie(name) {
  const encryptedValue = Cookies.get(name);
   
    if(encryptedValue != null){
    const secretKey = await getKey();
  try {
      const bytes = CryptoJS.AES.decrypt(encryptedValue, secretKey);
      const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedValue || null;
    } catch (error) {
      console.error("Error decrypting cookie:", error);
      return null;
    }
}else{
    return null;
}
}

