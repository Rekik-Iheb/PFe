import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { FaBars, FaChevronDown, FaChevronRight, FaRegUser, FaBook, FaUserAlt } from "react-icons/fa";
import Cookies from "js-cookie";
import { getDecryptedCookie } from "../utils/Crypt";


const Sidebar = () => {
    const [role, setRole] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [openMenus, setOpenMenus] = useState({
        main: false,
        Directeur: false,
        responsable: false,
        submenus: {
            journal: false,
            userManagement: false,
        }
    });

    useEffect(() => {
        const getRole = async () => {
            const userRole = await getDecryptedCookie("role");
            setRole(userRole);
        };
        getRole();
    }, []);

    const logOut = () => {
        Cookies.remove("email");
        Cookies.remove("role");
        window.location.reload();
    };

    const toggleMenu = (menuKey) => {
        if (!sidebarOpen) {
            setSidebarOpen(true);
        }

        if (menuKey == "main" || menuKey == "responsable" || menuKey == "Directeur") {
            setOpenMenus(prev => ({
                ...prev,
                [menuKey]: !prev[menuKey]
            }));
        } else {
            setOpenMenus(prev => ({
                ...prev,
                submenus: {
                    ...prev.submenus,
                    [menuKey]: !prev.submenus[menuKey]
                }
            }));
        }
    };

    const openWindow = (url, width = "800", height = "600") => {
        window.open(url, "_blank", `width=${width},height=${height}`);
    };

    const MenuItem = ({ icon, label, onClick, isOpen, hasSubmenu }) => (
        <a
            className="flex items-center justify-between p-2 text-gray-700 hover:bg-gray-100 rounded-lg hover:text-blue-600 cursor-pointer transition duration-300"
            onClick={onClick}
        >
            <div className="flex items-center">
                {icon}
                <span className={`ml-3 ${sidebarOpen ? "block" : "hidden"} transition-all duration-300 font-medium`}>
                    {label}
                </span>
            </div>
            {hasSubmenu && sidebarOpen && (
                isOpen ?
                    <FaChevronDown className="transition-transform duration-300" size={14} /> :
                    <FaChevronRight className="transition-transform duration-300" size={14} />
            )}
        </a>
    );

    const SubMenuItem = ({ label, onClick }) => (
        <a
            className="flex items-center pl-9 py-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600 rounded-lg cursor-pointer transition duration-300 text-sm"
            onClick={onClick}
        >
            {label}
        </a>
    );

    const isDirecteur = role.includes("Dir");
    const isResponsable = role.includes("Res") || role.includes("Dir");
    return (
        <div
            className={`bg-white shadow-lg h-full transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"
                } flex flex-col border-r`}
        >

            <div className="flex items-center justify-between p-4 border-b">

                <button
                    className={`p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition ${!sidebarOpen && "mx-auto"}`}
                    onClick={() => {
                        if (sidebarOpen) {
                            setOpenMenus({
                                main: false,
                                Directeur: false,
                                submenus: {
                                    journal: false,
                                    test: false,
                                    submenu3: false,
                                    userManagement: false,
                                    DirecteurTest: false,
                                    DirecteurSubmenu3: false
                                }
                            });
                        }
                        setSidebarOpen(!sidebarOpen);
                    }}
                >
                    <FaBars size={18} />
                </button>
            </div>


            <div className="flex-1 flex flex-col p-3 space-y-1 overflow-y-auto">

                <MenuItem
                    icon={<FaBook size={18} />}
                    label="Menu Principale"
                    onClick={() => toggleMenu('main')}
                    isOpen={openMenus.main}
                    hasSubmenu={true}
                />

                {openMenus.main && (
                    <div className="ml-2 border-l-2 border-gray-200 pl-2 mt-1 space-y-1">
                        <MenuItem
                            label="Journal Comptable"
                            onClick={() => toggleMenu('journal')}
                            isOpen={openMenus.submenus.journal}
                            hasSubmenu={true}

                        />

                        {openMenus.submenus.journal && (
                            <div className="space-y-1">
                                <SubMenuItem
                                    label="Consulter"
                                    onClick={() => openWindow("../journal", "full", "full")}
                                />
                                <SubMenuItem
                                    label="Import"
                                    onClick={() => openWindow("../journal/upload", "800", "600")}
                                />
                            </div>
                        )}

                        <MenuItem
                            label="Test Comptable"
                            onClick={() => openWindow("../test", "750", "750")}
                            isOpen={openMenus.submenus.test}
                            hasSubmenu={false}
                        />



                    </div>
                )}

                {isResponsable && (
                    <>
                        <MenuItem
                            icon={<FaUserAlt size={18} />}
                            label="Menu Responsable"
                            onClick={() => toggleMenu('responsable')}
                            isOpen={openMenus.responsable}
                            hasSubmenu={true}
                        />

                        {openMenus.responsable && (
                            <div className="ml-2 border-l-2 border-gray-200 pl-2 mt-1 space-y-1">

                                <MenuItem
                                    label="Consulter Les Résultats des Tests"
                                    onClick={() => openWindow("../résultat", "750", "750")}
                                />
                                <MenuItem
                                    label="Valider Test"
                                    onClick={() => openWindow("../résultat/valider", "750", "750")}
                                />




                            </div>
                        )}
                    </>
                )}

                {isDirecteur && (
                    <>
                        <MenuItem
                            icon={<FaRegUser size={18} />}
                            label="Menu Directeur"
                            onClick={() => toggleMenu('Directeur')}
                            isOpen={openMenus.Directeur}
                            hasSubmenu={true}
                        />

                        {openMenus.Directeur && (
                            <div className="ml-2 border-l-2 border-gray-200 pl-2 mt-1 space-y-1">
                                <MenuItem
                                    label="Gestion Utilisateur"
                                    onClick={() => toggleMenu('userManagement')}
                                    isOpen={openMenus.submenus.userManagement}
                                    hasSubmenu={true}
                                />

                                {openMenus.submenus.userManagement && (
                                    <div className="space-y-1">
                                        <SubMenuItem
                                            label="Creation de compte"
                                            onClick={() => openWindow("../utilisateur/add", "full", "full")}
                                        />
                                        <SubMenuItem
                                            label="Consultation des comptes"
                                            onClick={() => openWindow("../utilisateur", "800", "600")}
                                        />
                                    </div>
                                )}

                                <MenuItem
                                    label="Historiques"
                                    onClick={() => openWindow("../historique", "full", "full")}
                                />



                            </div>
                        )}
                    </>
                )}
            </div>



            <div className="p-3 border-t">
                <button
                    onClick={logOut}
                    className="flex items-center justify-center w-full p-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition duration-300"
                >
                    <LogOut size={18} />
                    {sidebarOpen && <span className="ml-3">Déconnexion</span>}
                </button>
            </div>

        </div>
    );
};

export default Sidebar;