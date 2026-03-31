import { LogOut, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Home, History, Settings, Sliders, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserDataStore } from "@/stores/userDataStore";
import { useAuthStore } from "@/stores/userStore";
import api from "@/services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const navigationItems = [
  {
    name: "Dashboard",
    value: "dashboard",
    icon: Home,
  },
  {
    name: "History",
    value: "history",
    icon: History,
  },
];

const MobileMenu = ({ isOpen, setIsOpen, setMenu, activeMenu }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { userData } = useUserDataStore();
  const logout = useAuthStore((state) => state.logout);

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".mobile-menu-container")) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Restore body scroll
      document.body.style.overflow = "unset";
    };
  }, [isOpen, setIsOpen]);

  // Handle menu item click
  const handleMenuItemClick = (menuValue) => {
    setMenu(menuValue);
    setIsOpen(false);
  };

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await api.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`);
      localStorage.removeItem("accessToken");
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("An error occurred during logout.");
    } finally {
      logout(); // Call the store action
      navigate("/login"); // Navigate
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {/* <div
        className="fixed inset-0 z-40 bg-black bg-opacity-50/90 transition-opacity lg:hidden"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      /> */}

      <div
        className="fixed inset-0 z-40 bg-white/30 backdrop-blur-sm transition-opacity lg:hidden"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu Panel */}
      <div className="mobile-menu-container fixed inset-y-0 left-0 z-50 w-64 max-w-xs bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden">
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav
          className="flex-1 overflow-y-auto bg-white"
          aria-label="Main navigation"
        >
          <div className="px-3 py-4 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.value}
                  onClick={() => handleMenuItemClick(item.value)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
                    activeMenu === item.value
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100",
                  )}
                  aria-current={activeMenu === item.value ? "page" : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="truncate">{item.name}</span>
                  {activeMenu === item.value && (
                    <ChevronRight className="w-4 h-4 ml-auto shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 text-sm font-medium mt-2 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>

        <div className="relative">
          <button className="w-full p-3 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-3 group">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
              {"U".toUpperCase()}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-gray-900 gro)up-hover:text-blue-600 transition-colors">
                {userData ? userData.username : "Guest"}
              </p>
              <p className="text-xs text-gray-500">
                {userData ? userData.email : "please login to see email"}
              </p>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
