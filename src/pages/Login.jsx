import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/logo.png"
import { loginService } from "../services/Api";
import { setEncryptedCookie } from "../utils/Crypt";
import { useNavigate } from "react-router-dom";
import { showErrorAlert } from "../utils/Notification";
const Login = () => {
    document.title = "Connexion"
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const nav = useNavigate();


   

    async function handleSubmit(e) {
        setIsLoading(true);
            e.preventDefault();
           if(email.length > 0 && password.length > 0 ){
           
             if(password.length >= 8 && verifierEmail(email)){
                
            try {
                const userData = await loginService(email, password);
                if (userData.status === 200) {
                   
                    await setEncryptedCookie("role", userData.data)
                    await setEncryptedCookie("email", email)
                    nav(0);
                } else { showErrorAlert(userData.data); }
            } catch (error) {
                showErrorAlert(error)
            }
            setIsLoading(false);
             }else{
                showErrorAlert("Veuillez vérifier les données saisies")
             }
           }else{
            showErrorAlert("Voulez-vous Entrer l'email et le mot de pass")
           }
        }

    const verifierEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="flex flex-col items-center max-w-md w-full">

            
                <div className="w-52 h-52 mb-8 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-10 animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-blue-600 to-purple-700 w-40 h-40 rounded-full flex items-center justify-center shadow-2xl">
                        <span className="text-white text-4xl font-bold tracking-wider"><img src={logo} alt="" /></span>
                    </div>
                </div>

                
                <div className="p-8 bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl w-full border border-white/20">
                    <h2 className="text-3xl font-bold text-center mb-8  bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Connexion
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                     
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                className="border-2 border-gray-200 w-full p-4 rounded-xl transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 group-hover:border-gray-300 bg-gray-50/50"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="relative group">
                            <input
                                type={isPasswordVisible ? "text" : "password"}
                                placeholder="Mot de passe"
                                value={password}
                                className="border-2 border-gray-200 w-full p-4 pr-14 rounded-xl transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 group-hover:border-gray-300 bg-gray-50/50"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
                            >
                                {isPasswordVisible ? <EyeOff size={22} /> : <Eye size={22} />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white w-full p-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Connexion en cours...
                                </>
                            ) : (
                                "Se connecter"
                            )}
                        </button>
                    </form>
                </div>

                
                
            </div>
        </div>
    );
};

export default Login;