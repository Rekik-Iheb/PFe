import  { useState } from "react";
import { uploadFile } from "../services/JournalApi";
import { showErrorAlert, showSuccessAlert, showWarningAlert } from "../utils/Notification";
import { FileText, Upload } from "lucide-react";

const UploadJournal = () => {
  document.title = "Importation du fichier"
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      return showWarningAlert("Veuillez sélectionner un fichier avant d'envoyer.");
    }

    setLoading(true);

    try {
      const response = await uploadFile(file);
      showSuccessAlert(response.data);
    } catch (error) {
      showErrorAlert(error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-white to-gray-100 shadow-xl rounded-xl max-w-lg mx-auto">
      <div className="p-10 bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20">
        
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
              <Upload className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-bold  mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Import Journal Mouvements
            </h2>
            <p className="text-gray-600">Glissez-déposez votre fichier ou cliquez pour sélectionner</p>
          </div>

       
          <div 
            className={`relative border-3 border-dashed rounded-2xl p-8 transition-all duration-300 cursor-pointer ${
              file == null  
                ? 'border-blue-500 bg-blue-50' 
                : file 
                  ? 'border-green-400 bg-green-50' 
                  : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
            }`}
          
          >
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".xlsx,.xls"
            />
            
            {!file ? (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <FileText className="text-blue-600" size={24} />
                </div>
                
                <p className="text-gray-500 text-sm">
                  Formats supportés:  Excel (.xlsx, .xls)
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mr-3">
                    <FileText className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 truncate max-w-xs">{file.name ? file.name : ""}</p>
                    <p className="text-sm text-gray-500">{file.size ? Math.round(file.size / 1024) +" KB" : ""}</p>
                  </div>
                </div>
             
              </div>
            )}
          </div>

      
          <div className="mt-8">
            <button
              onClick={()=> handleUpload()}
              disabled={loading || !file}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center text-lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Upload en cours...
                </>
              ) : (
                <>
                  <Upload className="mr-3" size={20} />
                  Uploader le fichier
                </>
              )}
            </button>
          </div>
    </div>
    </div>
  );
};

export default UploadJournal;
