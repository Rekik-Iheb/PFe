import {  useState } from "react";
import { get } from "../services/JournalApi";
import { FaSearch, FaPlus, FaTrash, FaUndo, FaTimes, FaSpinner } from "react-icons/fa";
import TableJournal from "./TableJournal";

const RechercheJournal = (props) => {
    document.title ="Recherche"
    
    const [recherche, setRecherche] = useState(true);
    const [criteria, setCriteria] = useState(props.criteria || []);
    const [data, setData] = useState(props.data);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    const availableFields = [
        { name: "codeContrat", display: "Code Contrat", type: "text" },
        { name: "fileName", display: "Nom de fichier", type: "text" },
        { name: "bookingDate", display: "Date Booking", type: "date" },
        { name: "date", display: "System Date", type: "date" },
        { name: "ourReference", display: "Our Reference", type: "text" },
        { name: "transReference", display: "Transaction Ref", type: "text" },
        { name: "customerId", display: "Customer ID", type: "text" },
        { name: "accountNumber", display: "Account Number", type: "text" },
        { name: "accountOfficer", display: "Account Officer", type: "text" },
        { name: "currency", display: "Currency", type: "text" },
       
    ];

   
    const textOperators = [
        { value: "Equal", display: "Égal" },
        { value: "NotEqual", display: "Différent" },
        { value: "Contains", display: "Contient" },
        { value: "NotContains", display: "Ne contient pas" },
        { value: "Startwith", display: "Commence par" },
        { value: "NotStartwith", display: "Ne commence pas par" },
        { value: "Endwith", display: "Se termine par" },
        { value: "NotEndWith", display: "Ne se termine pas par" }
    ];

  
    const numberDateOperators = [
        { value: "Equal", display: "Égal" },
        { value: "<", display: "Inférieur à" },
        { value: "<=", display: "Inférieur ou égal à" },
        { value: ">", display: "Supérieur à" },
        { value: ">=", display: "Supérieur ou égal à" }
    ];

    const handleChange = (index, key, value) => {
        const newCriteria = [...criteria];
        newCriteria[index][key] = value;
        setCriteria(newCriteria);
    };

    const getOperatorsForField = (fieldName) => {
        const field = availableFields.find(f => f.name === fieldName);
        if (field) {
            return field.type === "text" ? textOperators : numberDateOperators;
        }
        return textOperators; 
    };

    const getFieldType = (fieldName) => {
        const field = availableFields.find(f => f.name === fieldName);
        return field ? field.type : "text"; 
    };

    const addCriteria = () => {
        const usedFields = criteria.map(c => c.name);
        const availableField = availableFields.find(f => !usedFields.includes(f.name));
        if (availableField) {
            const newCriterion = {
                id: criteria.length + 1,
                field: availableField.display,
                value: "",
                operator: "Equal",
                name: availableField.name,
                type : availableField.type
            };
            setCriteria([...criteria, newCriterion]);
        }
    };

    const removeCriteria = (id) => {
        if (criteria.length > 1) {
            setCriteria(criteria.filter(c => c.id !== id));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        try {
            const result = await get(criteria);
            setData(result);
            setRecherche(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError("Une erreur s'est produite lors de la recherche. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };
    const cancelSearch = () => {
            setRecherche(false);
            setData(data); 
    };

    return (
        recherche ? (
            <div className="flex justify-center bg-gray-50 min-h-screen p-4">
                <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg">
                    <div className="bg-blue-600 text-white py-4 px-6 rounded-t-lg flex justify-between items-center">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <FaSearch className="text-lg" />
                            Recherche des mouvements comptables
                        </h2>
                        <button 
                            onClick={cancelSearch}
                            className="text-white hover:text-red-200 focus:outline-none"
                            title="Fermer"
                        >
                            <FaTimes className="text-xl" />
                        </button>
                    </div>
                    
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 mx-6 mt-4">
                            <p className="font-semibold">Erreur</p>
                            <p>{error}</p>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="space-y-4 mb-6">
                            {criteria.map((critere, index) => {
                                const fieldType = getFieldType(critere.name);
                                const operators = getOperatorsForField(critere.name);
                                
                                return (
                                    <div key={critere.id} className="flex flex-wrap md:flex-nowrap items-center gap-3 pb-3 border-b border-gray-200">
                                        <div className="w-full md:w-1/3">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {critere.field}
                                            </label>
                                        </div>
                                        
                                        <div className="w-full md:w-1/4">
                                            <select
                                                value={critere.operator}
                                                onChange={(e) => handleChange(index, "operator", e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                aria-label={`Opérateur pour ${critere.field}`}
                                            >
                                                {operators.map(op => (
                                                    <option key={op.value} value={op.value}>{op.display}</option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div className="w-full md:w-1/3">
                                            {fieldType === "date" ? (
                                                <input
                                                    type="date"
                                                    value={critere.value || ""}
                                                    onChange={(e) => handleChange(index, "value", e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                    placeholder={`Entrer ${critere.field}`}
                                                />
                                            ) : fieldType === "number" ? (
                                                <input
                                                    type="number"
                                                    value={critere.value || ""}
                                                    onChange={(e) => handleChange(index, "value", e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                    placeholder={`Entrer ${critere.field}`}
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={critere.value || ""}
                                                    onChange={(e) => handleChange(index, "value", e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                    placeholder={`Entrer ${critere.field}`}
                                                />
                                            )}
                                        </div>
                                        
                                        <div className="w-auto">
                                            <button
                                                type="button"
                                                onClick={() => removeCriteria(critere.id)}
                                                disabled={criteria.length <= 1}
                                                className={`p-2 rounded-full focus:outline-none ${
                                                    criteria.length <= 1 
                                                        ? 'text-gray-300 cursor-not-allowed' 
                                                        : 'text-red-500 hover:bg-red-100'
                                                }`}
                                                title="Supprimer ce critère"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="flex flex-wrap justify-between items-center gap-3">
                            <div>
                                <button
                                    type="button"
                                    onClick={addCriteria}
                                    className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition-colors duration-200 text-sm"
                                    disabled={criteria.length >= availableFields.length}
                                >
                                    <FaPlus className="text-sm" />
                                    Ajouter un critère
                                </button>
                            </div>
                            
                            <div className="flex gap-3">
                             
                                <button
                                    type="submit"
                                    className="flex items-center gap-1 px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 transition-colors duration-200 text-sm"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <FaSpinner></FaSpinner> 
                                            Recherche en cours...
                                        </>
                                    ) : (
                                        <>
                                            <FaSearch className="text-sm" />
                                            Rechercher
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        ) : (
            <TableJournal crit={criteria} body={data}></TableJournal>
        ) );}
export default RechercheJournal;