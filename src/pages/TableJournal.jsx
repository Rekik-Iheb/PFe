import { useEffect, useState } from "react";
import RechercheJournal from "./RechercheJournal";
import { FaSearch, FaColumns, FaChevronLeft, FaChevronRight, FaStepBackward, FaStepForward } from "react-icons/fa";
import { RxUpdate } from "react-icons/rx";
import { get } from "../services/JournalApi";

const TableJournal = (props) => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [data, setData] = useState([]);
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [rech, setRech] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

 const [crit, setCrit] = useState([
  { id: 1, field: "Code Contrat", value: "", operator: "Equal", name: "codeContrat", type: "text" },
  { id: 2, field: "Nom de fichier", value: "", operator: "Equal", name: "fileName", type: "text" },
  { id: 3, field: "Date Booking", value: "", operator: "Equal", name: "bookingDate", type: "date" },
  { id: 4, field: "System Date", value: "", operator: "Equal", name: "date", type: "date" },
]);


  const columns = [
    "tab", "recId", "transReference", "codeContrat", "customerId", "accountNumber",
    "accountOfficer", "productCateg", "transactionCode", "narrative", "narrative6",
    "exchangeRate", "amountFcy", "amountLcy", "currency", "bookingDate", "valueDate",
    "dealerDesk", "systemId", "date", "toChar", "consolKey"
  ];
  

 const columnDisplayNames = {
  tab: "Tab",
  recId: "Record ID",
  transReference: "Transaction Reference",
  codeContrat: "Code Contrat",
  customerId: "Customer ID",
  accountNumber: "Account Number",
  accountOfficer: "Account Officer",
  productCateg: "Product Category",
  transactionCode: "Transaction Code",
  narrative: "Narrative",
  narrative6: "Narrative 6",
  exchangeRate: "Exchange Rate",
  amountFcy: "Amount FCY",
  amountLcy: "Amount LCY",
  currency: "Currency",
  bookingDate: "Booking Date",
  valueDate: "Value Date",
  dealerDesk: "Dealer Desk",
  systemId: "System ID",
  date: "Date",
  toChar: "To Char",
  consolKey: "Consol Key"
};

  const [columnVisibility, setColumnVisibility] = useState(
    columns.reduce((acc, column) => {
      if( column == "codeContrat" ||column == "tab" || column == "amountLcy" || column =="valueDate" || column =="consolKey" ||column == "transactionCode"){
      acc[column] = true;
      }
      return acc;
    }, {})
  );

  const toggleColumn = (column) => {
    setColumnVisibility(prevState => ({
      ...prevState,
      [column]: !prevState[column]
    }));
  };

  const resetColumns = () => {
    setColumnVisibility(
      columns.reduce((acc, column) => {
        acc[column] = true;
        return acc;
      }, {})
    );
  };

  const hideAllColumns = () => {
    setColumnVisibility(
      columns.reduce((acc, column) => {
        acc[column] = false;
        return acc;
      }, {})
    );
  };


  useEffect(() => {
    document.title = "Les Journaux des Mouvements";
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await get(crit);
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (props.body) {
      setCrit(props.crit);
      setData(props.body);
      setIsLoading(false);
    } else {
      fetchData();
    }

    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [props.body, props.crit]);

  // Dynamic calculation of rows per page based on window height
  const rowsPerPage = Math.floor((windowHeight - 200) / 40);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Sort the data


  const currentData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSearchClick = () => {
    setRech(true);
  };



  const refreshData = async () => {
    setIsLoading(true);
    try {
        const result = await get(crit);
        setData(result);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return !rech ? (
    <div className="flex flex-col h-screen">
      <div className="bg-white shadow-md p-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSearchClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
            title="Recherche avancée"
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
          
          <button
            onClick={() => setShowColumnManager(!showColumnManager)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-md"
            title="Gérer les colonnes"
          >
            <FaColumns className="text-lg" />
            <span>Colonnes</span>
          </button>
          
      
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">
            {data.length > 0 ? 
              `Affichage ${(currentPage - 1) * rowsPerPage + 1} - ${Math.min(currentPage * rowsPerPage, data.length)} sur ${data.length}` : 
              "Aucune donnée disponible"}
          </div>
          <div className="flex items-center">
            <button
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-l-lg border border-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1 || data.length === 0}
              title="Première page"
            >
              <FaStepBackward />
            </button>
            <button
              className="px-3 py-1 bg-gray-100 text-gray-700 border-t border-b border-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1 || data.length === 0}
              title="Page précédente"
            >
              <FaChevronLeft />
            </button>
            <span className="px-4 py-1 bg-white border-t border-b border-gray-300 text-sm font-medium">
              {currentPage} / {totalPages || 1}
            </span>
            <button
              className="px-3 py-1 bg-gray-100 text-gray-700 border-t border-b border-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || data.length === 0}
              title="Page suivante"
            >
              <FaChevronRight />
            </button>
            <button
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-r-lg border border-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages || data.length === 0}
              title="Dernière page"
            >
              <FaStepForward />
            </button>
          </div>
        </div>
      </div>

      {showColumnManager && (
        <div className="bg-white border-t border-b border-gray-200 p-4 shadow-inner">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-gray-700">Gestion des colonnes</h3>
            <div className="space-x-2">
              <button
                onClick={resetColumns}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Tout afficher
              </button>
              <button
                onClick={hideAllColumns}
                className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
              >
                Tout masquer
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
            {columns.map(column => (
              <div key={column} className="flex items-center">
                <input
                  type="checkbox"
                  id={`column-${column}`}
                  checked={columnVisibility[column]}
                  onChange={() => toggleColumn(column)}
                  className="mr-2"
                />
                <label htmlFor={`column-${column}`} className="text-sm text-gray-700 cursor-pointer">
                  {columnDisplayNames[column] || column}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex-grow overflow-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-xl font-semibold">Aucune donnée disponible</p>
              <p className="text-sm mt-2">Veuillez effectuer une recherche ou rafraîchir les données</p>
            </div>
          </div>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 bg-blue-600 text-white shadow-md z-10">
              <tr>
                {columns.map((column) => (
                  columnVisibility[column] && (
                    <th 
                      key={column} 
                      className="px-4 py-3 text-left font-semibold cursor-pointer hover:bg-blue-700"
                    >
                      <div className="flex items-center space-x-1">
                        <span>{columnDisplayNames[column]}</span>
                      </div>
                    </th>
                  )
                ))}
              </tr>
            </thead>

            <tbody>
              {currentData.map((row, index) => (
                <tr
                  key={index}
                  className={`${
                    
                    index % 2 === 0 ? "bg-white hover:bg-gray-100" : "bg-gray-50 hover:bg-gray-100"
                  } border-b transition-colors duration-150`}
                >
                  {columns.map((column) => (
                    columnVisibility[column] && (
                      <td key={column} className="px-4 py-3 whitespace-nowrap">
                        {row[column] != null && row[column] != undefined && row[column]!= 0 ? row[column] : '-'}
                      </td>
                    )
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  ) : (
    <RechercheJournal criteria={crit} head={columns} data={data} />
  );
};

export default TableJournal;