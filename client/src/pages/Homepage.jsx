import DashboardContent from "@/components/myComponent/DashboardContent";
import Header from "@/components/myComponent/Header";
import HistoryContent from "@/components/myComponent/History";
import MobileMenu from "@/components/myComponent/mobileMenu";
import Sidebar from "@/components/myComponent/Sidebar";
import UserSettings from "@/components/myComponent/UserSettings";
import api from "@/services/api";
import { useUserDataStore } from "@/stores/userDataStore";
import { useAuthStore } from "@/stores/userStore";
import { useEffect, useState } from "react";

const Homepage = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const { setUserData, setHistoryData, sethardwareData, setChartData } =
    useUserDataStore();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = !!accessToken;

  const user = useAuthStore((state) => state.user);

  if (isAuthenticated && user && !user.hardwareID) {
    return (window.location.href = "/hardware");
  }

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let intervalId;

    if (isAuthenticated) {
      intervalId = setInterval(async () => {
        try {
          const response = await api.get("/user/getData");
          const { user, myhistory, myData, chart } = response.data;
          setHistoryData(myhistory);
          sethardwareData(myData);
          setChartData(chart);
          setUserData(user);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAuthenticated]);

  return (
    <div className="w-screen h-screen flex items-start justify-start overflow-hidden">
      <div className="h-screen hidden lg:block shrink-0">
        <Sidebar setMenu={setActiveMenu} activeMenu={activeMenu} />
      </div>
      <div className="bg-gray-100 flex-1 h-full min-w-0 flex flex-col">
        {/* Mobile Menu Component */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          setIsOpen={setIsMobileMenuOpen}
          setMenu={setActiveMenu}
          activeMenu={activeMenu}
        />
        <Header setIsMobileMenuOpen={setIsMobileMenuOpen} />

        {/* Main Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activeMenu == "dashboard" && <DashboardContent />}
          {activeMenu == "history" && <HistoryContent />}
          {activeMenu == "settings" && <UserSettings />}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
