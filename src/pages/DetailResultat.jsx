import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getResultat } from "../services/TestEcritureApi";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { FaTimes } from "react-icons/fa";
import { getDecryptedCookie } from "../utils/Crypt";
import { X } from "lucide-react";

const DetailResultat = () => {
  const [urlParams] = useSearchParams();
  const [test, setTest] = useState();
  const [codeContrat, setCodeContrat] = useState();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState("");

  useEffect(() => {
    
    const contrat = urlParams.get("code-contrat");
    setCodeContrat(contrat);
    document.title ="Résultat du test " + contrat
    const fetchTest = async () => {
      setIsLoading(true);

      try {
        const result = await getResultat(contrat);
        setTest(result);

        if (result.error && result.error !== "") {
          setMessage(result.error);
        } else {
          setMessage("Tous les lignes identifiées sont correctes");
        }
      } catch (err) {
        setMessage("Erreur lors du chargement des données. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };
    const responsable = async () => {
      const rep = await getDecryptedCookie("role");
      setRole(rep)
    }
    responsable();
    fetchTest();
  }, []);

  const isResponsable = role.includes("Resp") || role.includes("Dir")

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-600";
    if (status == "TestConcluant") {
      return "bg-green-100 text-green-800";
    } else {
      return "bg-red-100 text-red-800";

    }

  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="flex justify-between items-center bg-indigo-600 text-white p-6">
            <h1 className="text-2xl font-bold">Détails du Résultat du test</h1>
            <button
              onClick={() => window.close()}
              className="px-4 py-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"

            >
                 <X size={24} />
            </button>
          </div>

         
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 bg-blue-500"></div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-50 p-5 rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold  mb-4">Informations du test</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Code contrat:</span>
                      <span className="font-bold text-gray-800">{codeContrat || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Utilisateur:</span>
                      <span className="font-bold text-gray-800">{test?.user?.nomPrenom || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Date:</span>
                      <span className="font-bold text-gray-800">{formatDate(test?.dateDeTest)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Statut:</span>
                      <span className={`px-3 py-1 rounded-full font-medium ${getStatusColor(test?.statut)}`}>
                        {test?.statut || "-"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Résumé</h2>
                  <div>
                    <div className="mb-2 text-gray-600">
                      {message === "Tous les lignes identifiées sont correctes" ? (
                        <div className="flex items-center text-green-600">
                          <IoCheckmarkCircle className="h-5 w-5 mr-2" />
                          <span>Test réussi sans erreurs</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <IoCloseCircle className="h-5 w-5 mr-2" />
                          <span>Des erreurs ont été détectées</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>


              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-700">Détails complets</h2>
                </div>
                <div className="p-4">
                  <textarea
                    className={`w-full p-4 border rounded-lg resize-none overflow-x-auto h-96 focus:ring-2 focus:ring-indigo-400 focus:outline-none ${test.error == "" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                      }`}
                    readOnly
                    value={message}
                  />
                </div>
              </div>
              {isResponsable && (
              <div className="flex">
               <button
                  onClick={() => {
                    window.open(
                      `./résultat/tableau?code-contrat=${codeContrat}`,
                      "_blank",
                      "width=full,height=full"
                    );
                  }}
                  className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition mx-auto block"
                >
                  Afficher les lignes testées
                </button>
                 <button
                  onClick={() => {
                    window.open(
                      `../résultat/validation?code-contrat=${codeContrat}`,
                      "_blank",
                      "width=full,height=full"
                    );
                  }}
                  className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition mx-auto block"
                >
                  Valider Test
                </button></div>
                
              )}


            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default DetailResultat;