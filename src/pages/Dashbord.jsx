import { useEffect, useState } from "react";
import {
  FaBell,
  FaUserFriends,
  FaFileInvoiceDollar,
  FaCheckCircle,
} from "react-icons/fa";
import { getDecryptedCookie } from "../utils/Crypt";
import Sidebar from "../components/SideBar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { countUtilisateur } from "../services/Api";
import { getChartData, getNombreTests, getNotification, setEcritureReaded } from "../services/TestEcritureApi";
import { getNombreLignes } from "../services/JournalApi";


const Dashboard = () => {
  const [role, setRole] = useState("");
  const [sideOpen, setSideOpen] = useState(false);
  const [stats, setStats] = useState(
    {
      testComp: 0,
      utilisateurs: 0,
      lignes: 0
    }
  )
  useEffect(() => {
    document.title = "Accueil";
    const fetchRole = async () => {
      const userRole = await getDecryptedCookie("role");
      setRole(userRole || "Invité");
    };

    const getData = async () => {
      setStats({
        testComp: await getNombreTests(),
        utilisateurs: await countUtilisateur(),
        lignes: await getNombreLignes()
      })
    }

    const getNotifications = async () => {
      const d = await getNotification();
      const formatted = d.map((test) => ({
        id: test.id,
        text: `Le test pour contrat ${test.contrat} est ${test.statut}`,
        read: false,
        code: test.contrat
      }));
      setNotifications(formatted);
      setCount(formatted.length)
    };
    const getCharts = async () => {
     
      const data = await getChartData(annee);
      setChartData(data);
    }
       getCharts();
       fetchRole();
    getData();
    getNotifications();

   
  }, [])

  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const [chartData, setChartData] = useState([]);
  const quickStats = [
    { title: "Tests Complétés", value: stats.testComp, icon: <FaCheckCircle className="text-green-500" /> },
    { title: "Utilisateurs", value: stats.utilisateurs, icon: <FaUserFriends className="text-blue-500" /> },
    { title: "Journaux", value: stats.lignes, icon: <FaFileInvoiceDollar className="text-purple-500" /> },
  ];

  const lesAnnees = [2025, 2026, 2027, 2028, 2029, 2030];
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const chnageAnnee = async (e) => {
    setAnnee(parseInt(e.target.value))
    const data = await getChartData(e.target.value);
    setChartData(data);

  }
  const onNotification = async (notif) => {
    setEcritureReaded(notif.id)
    notif.read = true;
    window.open(
      "../test/résultat?code-contrat=" + notif.code,
      "_blank",
      `width=full,height=full`);
    setCount(count - 1)
  }

  return (
    <div className="flex h-screen bg-gray-50">

      <Sidebar />


      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800">
                Accueil
              </h1>
            </div>
            {role != "Collaborateur" ?
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
                    onClick={() => setSideOpen(!sideOpen)}
                  >
                    <FaBell className="text-gray-600 h-10 w-5" />
                    {count > 0 && (
                      <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {count}
                      </div>
                    )}
                  </button>
                  {sideOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-200">
                      <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-700">Notifications</h3>

                      </div>

                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center text-gray-500">
                            Aucune notification
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`px-4 py-3 border-b border-gray-100 flex justify-between hover:bg-gray-50 ${!notif.read ? 'bg-blue-50' : ''}`}
                              onClick={() => {
                                onNotification(notif)
                              }}
                            >
                              <div>
                                <p className="text-sm font-medium text-gray-800">{notif.text}</p>

                              </div>

                            </div>
                          ))
                        )}
                      </div>


                    </div>
                  )}
                </div>


              </div> : <></>}
          </div>


        </header>


        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {quickStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between border border-gray-100"
              >
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Distribution des Tests</h2>
              <select
                value={annee}
                onChange={(e) => {
                  chnageAnnee(e)
                }}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {lesAnnees.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="concluant" name="Concluant" fill="#10B981" />
                  <Bar dataKey="nonConcluant" name="Non Concluant" fill="#FF0000" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>





        </main>
      </div>
    </div>
  );
};

export default Dashboard;