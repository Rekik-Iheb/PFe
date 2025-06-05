
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaFilter, FaSearch, FaStepBackward, FaStepForward, FaTimes } from "react-icons/fa";
import { getTestRecherche, getTests, getTestsNonValider } from "../services/TestEcritureApi";
import { Cross } from "lucide-react";
import { RxUpdate } from "react-icons/rx";
import { FaFileCircleCheck } from "react-icons/fa6";

const ValiderTest = () => {
  const [data, setData] = useState([]);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [rech, setRech] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState({
    utilisateur: "",
    codeContrat: "",
    dateDebut: "",
    dateFin: "",
    statutValidation: "NON_VALIDE",
    statutTest: "",
  });


  useEffect(() => {
    document.title = "Liste des tests à valider";
    const getData = async () => {
      try {
        const d = await getTestsNonValider();
        setData(d);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false)
      }
    };
    getData();
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);




  const rowsPerPage = Math.floor((windowHeight - 200) / 40);
  const [currentPage, setCurrentPage] = useState(1);



  const totalPages = Math.ceil(data.length / rowsPerPage);
  const currentData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSearchClick = () => {
    setRech(!rech);
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const result = await getTestsNonValider();
      setData(result);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      utilisateur: "",
      codeContrat: "",
      dateDebut: "",
      dateFin: "",
      statutValidation: "",
      statutTest: "",
    });
  };
  const recherche = async () => {

    setIsLoading(true);
    try {
      const result = await getTestRecherche(filters);
      setData(result);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  }



  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <FaFileCircleCheck className="text-blue-600 text-2xl" />
          <h2 className="text-2xl font-bold text-gray-800">Les Résultats de Test Non Valider</h2>
        </div>


      </div>
      <div className="bg-white shadow-md p-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSearchClick}
            className={`flex items-center gap-2 px-4 py-2 ${rech ? "bg-gray-600" : "bg-blue-600"} text-white rounded-lg hover:bg-opacity-90 transition-colors duration-200 shadow-md`}
            title={rech ? "Masquer la recherche" : "Afficher la recherche"}
          >
            <FaSearch className="text-lg" />
            <span>Recherche</span>

          </button>

          <button
            onClick={refreshData}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md"
            title="Rafraîchir les données"
          >
            <RxUpdate className="text-lg" />
            <span>Rafraîchir</span>
          </button>


        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">
            {data.length > 0 ?
              `Affichage ${(currentPage - 1) * rowsPerPage + 1} - ${Math.min(currentPage * rowsPerPage, data.length)} sur ${data.length}` :
              "Aucune donnée disponible"}
          </div>
          <div className="flex items-center">
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-l-lg border border-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => goToPage(1)} disabled={currentPage === 1 || data.length === 0} title="Première page">
              <FaStepBackward />
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 border-t border-b border-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1 || data.length === 0} title="Page précédente">
              <FaChevronLeft />
            </button>
            <span className="px-4 py-1 bg-white border-t border-b border-gray-300 text-sm font-medium">
              {currentPage} / {totalPages || 1}
            </span>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 border-t border-b border-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages || data.length === 0} title="Page suivante">
              <FaChevronRight />
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-r-lg border border-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages || data.length === 0} title="Dernière page">
              <FaStepForward />
            </button>
          </div>
        </div>
      </div>
      {rech && (

        <div className="bg-white shadow-md p-6 mt-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <FaFilter className="text-blue-600" />
              <h3 className="text-lg font-medium text-gray-800">Filtres de recherche</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearFilters}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-200 flex items-center gap-1"

              >
                <FaTimes className="text-sm" />
                <span>Effacer les filtres</span>
              </button>
              <button
                onClick={(e) => recherche(e)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-300 transition-colors duration-200 flex items-center gap-1"

              >
                <FaSearch className="text-sm " />
                <span>Recherche</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Nom d'utilisateur</label>
              <input
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                type="text"
                placeholder="Rechercher par utilisateur"
                value={filters.utilisateur}
                onChange={(e) => setFilters(prev => ({ ...prev, utilisateur: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Code contrat</label>
              <input
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                type="text"
                placeholder="Entrez le code du contrat"
                value={filters.codeContrat}
                onChange={(e) => setFilters({ ...filters, codeContrat: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Statut du test</label>
              <select
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={filters.statutTest}
                onChange={(e) => setFilters({ ...filters, statutTest: e.target.value })}
              >
                <option value="">Tous les statuts</option>
                <option value="TestConcluant">Test Concluant</option>
                <option value="TestNonConcluant">Test Non Concluant</option>
              </select>
            </div>

            <div className="flex flex-col gap-6 md:col-span-2 lg:col-span-1">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Période de test</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Du</label>
                    <input
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      type="date"
                      value={filters.dateDebut}
                      onChange={(e) => setFilters({ ...filters, dateDebut: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Au</label>
                    <input
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      type="date"
                      value={filters.dateFin}
                      onChange={(e) => setFilters({ ...filters, dateFin: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>

      )}



      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">

          <table className="min-w-full table-auto">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium uppercase tracking-wider">
                  Nom d'utilisateur
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium uppercase tracking-wider">
                  Code contrat
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium uppercase tracking-wider">
                  Date de test
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium uppercase tracking-wider">
                  Staut Test
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium uppercase tracking-wider">
                  Détails
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={100} className="py-10 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>) : currentData.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-gray-600">Aucun résultat trouvé</p>
                  </div>
                ) : currentData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 text-sm text-gray-700">{row.user.nomPrenom}</td>
                    <td className="px-6 py-4 text-sm font-medium">{row.contrat}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(row.dateDeTest).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium 
                        ${row.statut == "TestNonConcluant" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                        {row.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <button
                        title="Afficher Détails"
                        onClick={() => {
                          window.open(
                            `../test/résultat?code-contrat=${row.contrat}`,
                            "_blank",
                            "width=full,height=full"
                          );
                        }}
                        className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition mx-auto block"
                      >
                        <Cross size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

        </div>

      </div>
    </div>
  );
};

export default ValiderTest;