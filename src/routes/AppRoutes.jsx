import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDecryptedCookie } from "../utils/Crypt";
import Login from "../pages/Login";
import Dashbord from "../pages/Dashbord";
import TableJournal from "../pages/TableJournal";
import CreationUtilisateur from "../pages/CreateUtilisateur";
import UpdateUtilisateur from "../pages/updateUtilisateur";
import Unauthorized from "../pages/Unauthorized";
import DetailResultat from "../pages/DetailResultat";
import TableResultat from "../pages/TableResultat";
import Config from "../pages/DéroulementCasTest";
import LesRésultats from "../pages/LesRésultats";
import Historique from "../pages/Historique";
import ValiderTest from "../pages/ValiderTest";
import Validation from "../pages/Validation";
import UploadJournal from "../pages/UploadJournal";
import TableUtilisateur from "../pages/TableUtilisateur.jsx";
const AppRoutes = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const getRole = async () => {
      const userRole = await getDecryptedCookie("role");

      setRole(userRole);
    }
    getRole();
  }, []);

  if (role == null) {
    return <Login />;
  }

  return (
    <Routes>
      {role ? (
        <>
          <Route path="/" element={<Dashbord />} />
          <Route path="/journal/upload" element={<UploadJournal />} />
          <Route path="/journal" element={<TableJournal />} />
          <Route path="/test" element={<Config />} />
          <Route path="/test/résultat" element={<DetailResultat />} />
          <Route path="/résultat" element={role.includes("Dir") || role.includes("Res") ? <LesRésultats /> : <Unauthorized />}></Route>
          <Route path="/résultat/valider" element={role.includes("Dir") || role.includes("Res") ?<ValiderTest />: <Unauthorized />}></Route>
          <Route path="/résultat/validation" element={role.includes("Dir") || role.includes("Res") ?<Validation />: <Unauthorized />}></Route>
          <Route path="/test/résultat/tableau" element={role.includes("Dir") || role.includes("Res") ?<TableResultat />: <Unauthorized />} />
          <Route path="/utilisateur/add" element={role.includes("Dir") ? <CreationUtilisateur /> : <Unauthorized />} />
          <Route path="/utilisateur" element={role.includes("Dir") ? <TableUtilisateur/> : <Unauthorized />} />
          <Route path="/utilisateur/modifer" element={role.includes("Dir") ? <UpdateUtilisateur /> : <Unauthorized />} />
          <Route path="/historique" element={role.includes("Dir") ? <Historique /> : <Unauthorized />} />

        </>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
      
    </Routes>
  );
};

export default AppRoutes;
