// import { useUserDataStore } from "@/stores/userDataStore";
// import { Menu, Sliders } from "lucide-react";

// export const Header = ({ setIsMobileMenuOpen }) => {
//   const { hardwareData } = useUserDataStore();
//   return (
//     <header className="bg-white border-b border-gray-200 px-6 py-3.5  sticky top-0 z-30">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => setIsMobileMenuOpen(true)}
//             className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
//           >
//             <Menu size={20} className="text-gray-600" />
//           </button>
//           <div>
//             <h2 className="text-lg font-bold text-gray-900">Dashboard</h2>
//           </div>
//         </div>

//         <div className="flex items-center gap-3">
//           <div
//             className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${hardwareData.armed ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}
//           >
//             <div
//               className={`w-2 h-2 rounded-full animate-pulse ${hardwareData.armed ? "bg-emerald-500" : "bg-gray-400"}`}
//             />
//             {hardwareData.armed ? "Armed" : "Disarmed"}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

import { Menu } from "lucide-react";

export const Header = ({ setIsMobileMenuOpen }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3.5 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Soil Monitor</h2>
          </div>
        </div>

        {/* Right side - empty or you can add other controls here */}
        <div />
      </div>
    </header>
  );
};

export default Header;
