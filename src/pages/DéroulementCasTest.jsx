import { useEffect, useState } from "react";
import { getProd } from "../services/produit";
import { getContract } from "../services/JournalApi";
import { getDecryptedCookie } from "../utils/Crypt";
import { showErrorAlert } from "../utils/Notification";
import { getGroupe } from "../services/GroupeProduit";
import { FaSpinner, FaTimes } from "react-icons/fa";
import { AlertCircle, CheckCircle, FileText, Loader2, Package, Settings, Users, X } from "lucide-react";

const Config = () => {
  const [code, setCode] = useState("");
  const [dataProduitGroup, setDataProduitGroup] = useState([]);
  const [produit, setProduit] = useState("");
  const [groupProduit, setGroupProduit] = useState("");
  const [produitData, setProduitData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = " Déroulement du cas de test";
    const fetchGroups = async () => {
      setIsLoading(true);
      try {
        const result = await getGroupe();
        if (result.length > 0) {
          setDataProduitGroup(result);
        } else {
          setDataProduitGroup([]);
        }
      } catch (err) {
        showErrorAlert("Échec du chargement des groupes de produits");
      } finally {
        setIsLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const handChangeGroupProduit = async (e) => {
    const value = e.target.value;
    setGroupProduit(value);

    if (value) {
      setIsLoading(true);
      try {
        const result = await getProd(value);
        if (result.length > 0) {
          setProduitData(result);
        } else {
          setProduitData([]);
        }
      } catch (err) {
        showErrorAlert("Échec du chargement des produits");
      } finally {
        setIsLoading(false);
      }
      setProduit("");
    } else {
      setGroupProduit("");
      setProduitData([]);
    }
  };

  const handChangeProduit = (e) => {
    setProduit(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code.trim()) {
      showErrorAlert("Veuillez saisir le code du contrat");
      return;
    }

    if (!groupProduit) {
      showErrorAlert("Veuillez sélectionner un groupe de produit");
      return;
    }

    if (!produit) {
      showErrorAlert("Veuillez sélectionner un produit");
      return;
    }

    setIsLoading(true);
    try {
      const email = await getDecryptedCookie("email");
      await getContract(code, email, produit, false);
    } catch (error) {
      showErrorAlert(error.response?.data || error || "Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-3xl">



        <div className="bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-white/20">


          <div className="relative mb-10">
            <button
              onClick={() => window.close()}
              className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
                <Settings className="text-white" size={32} />
              </div>
              <h2 className="text-4xl font-bold  mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Déroulement du cas de test
              </h2>
           
            </div>
          </div>

          <div className="space-y-8">


            <div className="space-y-3">
              <label className="flex items-center text-lg font-semibold text-gray-700 mb-2">
                <FileText className="mr-2 text-blue-600" size={20} />
                Code du contrat
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Entrez le code du contrat (ex: AA23144LQQK8)"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 shadow-sm group-hover:border-gray-300 bg-gray-50/50 text-lg"
                  required
                />
              </div>
            </div>


            <div className="space-y-3">
              <label className="flex items-center text-lg font-semibold text-gray-700 mb-2">
                <Users className="mr-2 text-blue-600" size={20} />
                Groupe Produit
              </label>
              <div className="relative">
                <select
                  value={groupProduit}
                  onChange={handChangeGroupProduit}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 shadow-sm appearance-none bg-gray-50/50 text-lg"
                  required
                >
                  <option value="">Sélectionner un groupe de produit</option>
                  {dataProduitGroup.map((prodGroup) => (
                    <option key={prodGroup.id} value={prodGroup.id}>
                      {prodGroup.nom}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>


            <div className="space-y-3">
              <label className="flex items-center text-lg font-semibold text-gray-700 mb-2">
                <Package className="mr-2 text-blue-600" size={20} />
                Produit
              </label>
              <div className="relative">
                <select
                  value={produit}
                  onChange={handChangeProduit}
                  className={`w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 shadow-sm appearance-none bg-gray-50/50 text-lg ${!groupProduit ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  disabled={!groupProduit}
                  required
                >
                  <option value="">
                    {groupProduit
                      ? "Sélectionner un produit"
                      : "Sélectionnez d'abord un groupe"}
                  </option>
                  {produitData.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.nom}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
           
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={isLoading || !code || !groupProduit || !produit}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center text-lg shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-3" size={24} />
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-3" size={20} />
                    Valider le cas de test
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Config;