import { useNavigate } from "react-router-dom";

function Unauthorized() {
  document.title = "Unauthorized";
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Unauthorized Access</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
          Cette fonctionnalité n'est pas autorisée.
        </p>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <button
          onClick={() => {navigate(-1)}}
          className="inline-block px-6 py-3 hover:cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
        >
          Retour en arrière
        </button>
      </div>
    </div>
  );
}

export default Unauthorized;