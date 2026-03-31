// import {
//   ChevronRight,
//   AlertTriangle,
//   CheckCircle2,
//   Zap,
//   Clock,
// } from "lucide-react";
// import Card from "@/components/ui/Card";
// import { useUserDataStore } from "@/stores/userDataStore";
// import { useMemo } from "react";

// const HistoryContent = () => {
//   const { historyData } = useUserDataStore();

//   // Transform the API data to match the component's expected format
//   const transformedHistoryData = useMemo(() => {
//     // If no data from API, return empty array
//     if (
//       !historyData ||
//       !Array.isArray(historyData) ||
//       historyData.length === 0
//     ) {
//       return [];
//     }

//     return historyData.map((item) => {
//       // Format the timestamp
//       const date = new Date(item.timestamp);
//       const today = new Date();
//       const yesterday = new Date(today);
//       yesterday.setDate(yesterday.getDate() - 1);

//       let dateLabel;
//       if (date.toDateString() === today.toDateString()) {
//         dateLabel = "Today";
//       } else if (date.toDateString() === yesterday.toDateString()) {
//         dateLabel = "Yesterday";
//       } else {
//         dateLabel = date.toLocaleDateString();
//       }

//       const time = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;

//       // Determine icon based on title or use default
//       let Icon = AlertTriangle; // Default icon
//       if (item.title && item.title.toLowerCase().includes("power")) {
//         Icon = Zap;
//       } else if (item.title && item.title.toLowerCase().includes("resolved")) {
//         Icon = CheckCircle2;
//       }

//       // Determine type based on title or use default
//       let type = "warning"; // Default type
//       if (item.title && item.title.toLowerCase().includes("resolved")) {
//         type = "success";
//       } else if (item.title && item.title.toLowerCase().includes("critical")) {
//         type = "error";
//       }

//       return {
//         id: item._id,
//         time,
//         date: dateLabel,
//         event: item.title || "Unknown Event",
//         details: item.description || "No details available",
//         type,
//         icon: Icon,
//       };
//     });
//   }, [historyData]);

//   return (
//     <div className="space-y-6 max-w-5xl mx-auto">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Event History</h2>
//           <p className="text-sm text-gray-500 mt-1">
//             Track all power tap activities
//           </p>
//         </div>
//       </div>

//       {/* History List */}
//       <Card className="overflow-hidden">
//         <div className="p-4 border-b border-gray-100 flex items-center justify-between">
//           <h3 className="font-semibold text-gray-900">Recent Events</h3>
//         </div>

//         {transformedHistoryData.length > 0 ? (
//           <div className="divide-y divide-gray-100">
//             {transformedHistoryData.map((item) => {
//               const Icon = item.icon;

//               // Determine color based on type
//               let iconColorClass = "text-amber-600 bg-amber-50";
//               if (item.type === "success") {
//                 iconColorClass = "text-green-600 bg-green-50";
//               } else if (item.type === "error") {
//                 iconColorClass = "text-red-600 bg-red-50";
//               }

//               return (
//                 <div
//                   key={item.id}
//                   className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-4"
//                 >
//                   <div
//                     className={`p-2.5 rounded-xl shrink-0 ${iconColorClass}`}
//                   >
//                     <Icon size={18} />
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-start justify-between gap-4">
//                       <div>
//                         <p className="font-semibold text-gray-900 text-sm">
//                           {item.event}
//                         </p>
//                         <p className="text-sm text-gray-500 mt-0.5">
//                           {item.details}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
//                       <span className="flex items-center gap-1">
//                         <Clock size={12} />
//                         {item.time}
//                       </span>
//                       <span>{item.date}</span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="p-8 text-center text-gray-500">
//             <AlertTriangle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
//             <h3 className="text-lg font-medium text-gray-900 mb-1">
//               No history data
//             </h3>
//             <p className="text-sm text-gray-500">
//               No events have been recorded yet.
//             </p>
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// };

// export default HistoryContent;

import {
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Sprout,
  Droplets,
  Clock,
  Thermometer,
  FlaskConical,
} from "lucide-react";
import Card from "@/components/ui/Card";
import { useUserDataStore } from "@/stores/userDataStore";
import { useMemo } from "react";

const HistoryContent = () => {
  const { historyData } = useUserDataStore();

  const transformedHistoryData = useMemo(() => {
    if (
      !historyData ||
      !Array.isArray(historyData) ||
      historyData.length === 0
    ) {
      return [];
    }

    return historyData.map((item) => {
      const date = new Date(item.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let dateLabel;
      if (date.toDateString() === today.toDateString()) {
        dateLabel = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateLabel = "Yesterday";
      } else {
        dateLabel = date.toLocaleDateString();
      }

      const time = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;

      // Agriculture-themed icons based on event type
      let Icon = Sprout; // Default icon
      if (item.title && item.title.toLowerCase().includes("moisture")) {
        Icon = Droplets;
      } else if (
        item.title &&
        item.title.toLowerCase().includes("temperature")
      ) {
        Icon = Thermometer;
      } else if (
        (item.title && item.title.toLowerCase().includes("ph")) ||
        item.title.toLowerCase().includes("nutrient")
      ) {
        Icon = FlaskConical;
      } else if (item.title && item.title.toLowerCase().includes("resolved")) {
        Icon = CheckCircle2;
      } else if (item.title && item.title.toLowerCase().includes("alert")) {
        Icon = AlertTriangle;
      }

      // Determine type based on title
      let type = "info"; // Default type
      if (item.title && item.title.toLowerCase().includes("resolved")) {
        type = "success";
      } else if (item.title && item.title.toLowerCase().includes("critical")) {
        type = "error";
      } else if (item.title && item.title.toLowerCase().includes("warning")) {
        type = "warning";
      }

      return {
        id: item._id,
        time,
        date: dateLabel,
        event: item.title || "Unknown Event",
        details: item.description || "No details available",
        type,
        icon: Icon,
      };
    });
  }, [historyData]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sensor History</h2>
          <p className="text-sm text-gray-500 mt-1">
            Track all soil monitoring activities and environmental changes
          </p>
        </div>
      </div>

      {/* History List */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Recent Events</h3>
        </div>

        {transformedHistoryData.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {transformedHistoryData.map((item) => {
              const Icon = item.icon;

              // Agriculture-themed colors
              let iconColorClass = "text-[#17cf97] bg-green-50";
              if (item.type === "success") {
                iconColorClass = "text-green-600 bg-green-50";
              } else if (item.type === "error") {
                iconColorClass = "text-red-600 bg-red-50";
              } else if (item.type === "warning") {
                iconColorClass = "text-amber-600 bg-amber-50";
              }

              return (
                <div
                  key={item.id}
                  className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-4"
                >
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${iconColorClass}`}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {item.event}
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {item.details}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {item.time}
                      </span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Sprout className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No history data
            </h3>
            <p className="text-sm text-gray-500">
              No sensor events have been recorded yet.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default HistoryContent;
