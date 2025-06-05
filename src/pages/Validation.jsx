import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Clock, AlertTriangle, X } from 'lucide-react';
import { FaTimes } from 'react-icons/fa';
import { getResultat, getStatutsTest, valideTest } from '../services/TestEcritureApi';
import { useSearchParams } from 'react-router-dom';
import { HiChevronDown } from 'react-icons/hi';

const Validation = () => {

  const [urlParams] = useSearchParams();

  useEffect(() => {

    const contrat = urlParams.get("code-contrat");
    document.title = "Valider le test " + contrat
    const getTest = async () => {
      try {
        const rep = await getResultat(contrat);
        setSelectedTest(rep)
      } catch (error) {
        console.log(error);
      }
    }
    const getStatuts = async () => {
      try {
        const rep = await getStatutsTest();
        setStatus(rep)
      } catch (error) {
        console.log(error);
      }
    }
    getStatuts()
    getTest()
  }, [])
  const [selectedTest, setSelectedTest] = useState({
    id: 1,
    user: "",
    contrat: "",
    statut: "",
    dateDeTest: "",
    stautsResultat: "",
    statutValidation: ""
  });
  const [message, setMessage] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [status, setStatus] = useState([]);

  const changeStatus = async (id, statut) => {
    if (statut != "") {
      const rep = await valideTest(id, statut)
      setMessage(rep)
      setShowConfirmation(true);
    } else {
      setShowConfirmation(false);
    }



  };

  const getStatusColor = (status) => {
    switch (status) {
      case "VALIDE": return "text-green-600";
      case "REJETE": return "text-red-600";
      case "NON_VALIDE": return "text-blue-600";
      default: return "text-yellow-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "VALIDE": return <CheckCircle2 className="text-green-500" />;
      case "REJETE": return <XCircle className="text-red-500" />;
      case "NON_VALIDE": return <Clock className="text-blue-500" />;
      default: return <AlertTriangle className="text-yellow-500" />;
    }
  };

  return (
 <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-xl w-full">
        <div className="flex justify-between items-center bg-indigo-600 text-white p-5 rounded-xl mb-6 shadow-md">
          <h1 className="text-2xl font-bold">Validation de Test</h1>
          <button
            onClick={() => window.close()}
                         className="absolute  right-10 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"

          >
            <X size={24} />
          </button>
        </div>

        <div className="bg-gray-100 p-6 rounded-2xl shadow-sm mb-6">
          
          <div className="mb-2">
            <span className="font-medium">Nom d'utilisateur:</span>
            <p className="mt-1 text-gray-700">{selectedTest.user.nomPrenom || "-"}</p>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Code Contrat:</span>
            <span>{selectedTest.contrat}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Date:</span>
            <span>{selectedTest.dateDeTest}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Statut du test :</span>
            <span className={`ml-2 ${selectedTest.statut === "TestConcluant" ? "text-green-600" : "text-red-600"}`}>
              {selectedTest.statut}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Statut résultat du test :</span>
            <div className="flex items-center">
              {getStatusIcon(selectedTest.statutValidation)}
              <span className={`ml-2 ${getStatusColor(selectedTest.statutValidation)}`}>
                {selectedTest.statutValidation}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sélectionner un nouveau statut</label>
          <div className="relative">
            <select
              className="block w-full border border-gray-300 rounded-xl px-4 py-3 pr-10 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => selectedTest.statutValidation = e.target.value}
            >
              <option value="">Sélectionnez un Statut</option>
              {status.length > 0 ? (
                status.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))
              ) : (
                <option disabled>Chargement des statuts...</option>
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <HiChevronDown className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
            onClick={() => changeStatus(selectedTest.id, selectedTest.statutValidation)}
          >
            Valider le changement
          </button>
        </div>

        {showConfirmation && (
          <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-lg flex items-center shadow-sm">
            <CheckCircle2 className="mr-2" size={20} />
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
export default Validation;