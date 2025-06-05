import { useState, useEffect } from 'react';
import { getRoles, saveUtilisateur, UpdateUtilisateur, verifEmail } from '../services/Api';
import { Eye, EyeOff, AlertCircle, Check, Loader2, Shield, Phone, UserRound, Mail } from 'lucide-react';

const UtilisateurForm = (props) => {
  const [formData, setFormData] = useState(props.params);
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    nomPrenom: '',
    telephone: '',
    role: '',
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState('');

  useEffect(() => {
    document.title = props.titel ? props.titel : "Modifer compte";
    getRoles()
      .then((data) => setRoles(data))
      .catch((error) => {
        console.error('Error fetching roles:', error);
        setRoles([]);
      });
    setFormData(props.params);
  }, [props.params]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));

    if (name === 'email') {
      setEmailStatus('');
    }
  };

  const verifierEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const validateForm = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    setIsLoading(true);

    if (!verifierEmail(formData.email)) {
      validationErrors.email = "Veuillez entrer une adresse e-mail valide.";
    } else if (props.type === "add") {
      try {
        const isEmailValid = await verifEmail(formData.email);
        if (isEmailValid) {
          validationErrors.email = "Adresse e-mail déjà utilisée.";
          setEmailStatus('error');
        } else {
          setEmailStatus('success');
        }
      } catch (error) {
        console.error("Error occurred:", error);
        setEmailStatus('error');
      }
    }

    if (!formData.password || formData.password.length < 8) {
      validationErrors.password = "Le mot de passe doit contenir au moins 8 caractères.";
    }

    if (!formData.nomPrenom || !formData.nomPrenom.trim() || formData.nomPrenom.trim().length < 4) {
      validationErrors.nomPrenom = "Veuillez entrer votre nom et prénom.";
    }

    const phonePattern = /^[2459][0-9]{7}$/;
    if (!formData.telephone || !phonePattern.test(formData.telephone)) {
      if (formData.telephone.length != 8) {
        validationErrors.telephone = "Le numéro de téléphone doit comporter 8 chiffres.";
      } else {
        validationErrors.telephone = "Le numéro de téléphone ne correspond à aucun opérateur tunisien connu.";
      }
    }

    if (!formData.role) {
      validationErrors.role = "Veuillez sélectionner un rôle.";
    }

    setIsLoading(false);
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = await validateForm(e);

    if (Object.values(validationErrors).some((error) => error !== '')) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (props.type === "add") {
        await saveUtilisateur(formData);
      } else {
        await UpdateUtilisateur(formData);
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-3xl">
        <div className="bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-white/20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
              <UserRound className="text-white" size={32} />
            </div>
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {props.titel}
            </h2>
            <p className="text-gray-600 text-lg">Gestion des utilisateurs</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="flex items-center text-lg font-semibold text-gray-700 mb-2">
                <Mail className="mr-2 text-blue-600" size={20} />
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  readOnly={props.type === "update"}
                  required
                  className={`w-full px-5 py-4 border-2 rounded-xl bg-gray-50/50 text-lg focus:ring-4 transition-all duration-300 shadow-sm ${errors.email ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-blue-100 focus:border-blue-500"}`}
                />
                {emailStatus === "error" && <AlertCircle className="absolute right-4 top-4 text-red-500" size={20} />}
                {emailStatus === "success" && <Check className="absolute right-4 top-4 text-green-500" size={20} />}
              </div>
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            <div className="space-y-3">
              <label className="flex items-center text-lg font-semibold text-gray-700 mb-2">
                <Shield className="mr-2 text-blue-600" size={20} />
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`w-full px-5 py-4 border-2 rounded-xl bg-gray-50/50 text-lg pr-12 focus:ring-4 transition-all duration-300 shadow-sm ${errors.password ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-blue-100 focus:border-blue-500"}`}
                />
                <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
                  {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
            <div className="space-y-3">
              <label className="flex items-center text-lg font-semibold text-gray-700 mb-2">
                <UserRound className="mr-2 text-blue-600" size={20} />
                Nom et Prénom
              </label>
              <input
                type="text"
                name="nomPrenom"
                value={formData.nomPrenom}
                onChange={handleChange}
                required
                className={`w-full px-5 py-4 border-2 rounded-xl bg-gray-50/50 text-lg focus:ring-4 transition-all duration-300 shadow-sm ${errors.nomPrenom ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-blue-100 focus:border-blue-500"}`}
              />
              {errors.nomPrenom && <p className="text-sm text-red-500">{errors.nomPrenom}</p>}
            </div>
            <div className="space-y-3">
              <label className="flex items-center text-lg font-semibold text-gray-700 mb-2">
                <Phone className="mr-2 text-blue-600" size={20} />
                Téléphone
              </label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                pattern="[2459][0-9]{7}{8}"
                required
                className={`w-full px-5 py-4 border-2 rounded-xl bg-gray-50/50 text-lg focus:ring-4 transition-all duration-300 shadow-sm ${errors.telephone ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-blue-100 focus:border-blue-500"}`}
              />
              {errors.telephone && <p className="text-sm text-red-500">{errors.telephone}</p>}
            </div>
            <div className="space-y-3">
              <label className="flex items-center text-lg font-semibold text-gray-700 mb-2">
                <Shield className="mr-2 text-blue-600" size={20} />
                Rôle
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className={`w-full px-5 py-4 border-2 rounded-xl bg-gray-50/50 text-lg appearance-none focus:ring-4 transition-all duration-300 shadow-sm ${errors.role ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-blue-100 focus:border-blue-500"}`}
                >
                  <option value="">Sélectionnez un rôle</option>
                  {roles.length ? roles.map((r) => <option key={r} value={r}>{r}</option>) : <option>Chargement...</option>}
                </select>
                <svg className="absolute inset-y-0 right-4 my-auto w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
              {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <><Loader2 className="animate-spin mr-3" size={24} />Traitement...</> : "Soumettre"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UtilisateurForm;