import  { useEffect, useState } from 'react';
import UtilisateurForm from '../components/Form';
import { getByEmail } from '../services/Api';

function UpdateUtilisateur() {
    const [data, setData] = useState({});
   
     
 
    useEffect(() => {
       
        const fetchData = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const email = params.get('email');
                
                if (email) {
                    const result = await getByEmail(email);
                    console.log("Fetched user data:", result); 
                    setData(result);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, []);
    
    
    return (
        <UtilisateurForm params={data} titel={"Modifier compte"} type={"update"} />
    );
};

export default UpdateUtilisateur;
