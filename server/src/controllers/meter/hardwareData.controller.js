

 const Soil = require("../../models/meter/meter.model");

// async function hardwareData(req, res) {
//   // 1. Destructure the soil-specific fields from the request body
//   const {
//     hardwareID,
//     nitrogen,
//     phosphorus,
//     potassium,
//     moisture,
//     temperature,
//     ph,
//     aiPrediction,
//   } = req.body;

//   // 2. Validation: Hardware ID is essential
//   if (
//     !hardwareID ||
//     typeof hardwareID !== "string" ||
//     hardwareID.trim() === ""
//   ) {
//     return res.status(400).json({ message: "Valid Hardware ID is required" });
//   }

//   try {
//     // 3. Prepare the real-time values for the top-level document
//     const updateValues = {
//       nitrogen: nitrogen ?? 0,
//       phosphorus: phosphorus ?? 0,
//       potassium: potassium ?? 0,
//       moisture: moisture ?? 0,
//       temperature: temperature ?? 0,
//       ph: ph ?? 7.0,
//     };

//     // 4. Create the new chart entry for time-series tracking
//     const newChartEntry = {
//       timestamp: new Date(),
//       ...updateValues,
//     };

//     // 5. Build the MongoDB update query
//     const updateQuery = {
//       $set: updateValues,
//       $push: {
//         chartData: {
//           $each: [newChartEntry],
//           $slice: -50, // Keep the last 50 readings for charts
//           $sort: { timestamp: 1 }, // Keep chronological order
//         },
//       },
//     };

//     // 6. Optional: Add to history if an AI prediction or alert is sent
//     if (aiPrediction !== undefined) {

//       // Map only the intervention statuses
// const statusMap = {
//   0: "Water",
//   1: "Fertilizer"
// };

// // If the ID isn't 0 or 1, we assume the plant is "Balanced (Normal)"
// const recommendation = statusMap[aiPrediction] || "Balanced (Normal)";

// const historyEntry = {
//   timestamp: new Date(),
//   title: "Soil Analysis Update",
//   // If it's a 0 or 1, the description highlights the need; otherwise, it confirms stability
//   description: `New AI Prediction score: ${aiPrediction}. ${
//     statusMap[aiPrediction] 
//       ? `Plant needs: ${recommendation}` 
//       : "Soil status: Balanced"
//   }.`,
//   aiPrediction: aiPrediction,
// };
   
         
//       // Initialize $push for history if it wasn't already set
//       updateQuery.$push.history = {
//         $each: [historyEntry],
//         $slice: -100,
//         $sort: { timestamp: -1 },
//       };
//     }

//     // 7. Find and Update (using 'hardwareId' to match your schema)
//     const updatedMeter = await Soil.findOneAndUpdate(
//       { hardwareId: hardwareID },
//       updateQuery,
//       { new: true, runValidators: true },
//     );

//     if (!updatedMeter) {
//       return res.status(404).json({ message: "Device not found." });
//     }

//     // 8. Success Response
//     return res.status(200).json({
//       message: "Soil data updated successfully",
//       updatedFields: updateValues,
//       lastUpdated: updatedMeter.updatedAt,
//     });
//   } catch (error) {
//     console.error("Error updating soil hardware data:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// }

// module.exports = {
//   hardwareData,
// };





async function hardwareData(req, res) {
  const {
    hardwareID,
    nitrogen,
    phosphorus,
    potassium,
    moisture,
    temperature,
    ph,
    aiPrediction,
  } = req.body;

  if (!hardwareID || typeof hardwareID !== "string" || hardwareID.trim() === "") {
    return res.status(400).json({ message: "Valid Hardware ID is required" });
  }

  try {
    const updateValues = {
      nitrogen: nitrogen ?? 0,
      phosphorus: phosphorus ?? 0,
      potassium: potassium ?? 0,
      moisture: moisture ?? 0,
      temperature: temperature ?? 0,
      ph: ph ?? 7.0,
    };

    const newChartEntry = {
      timestamp: new Date(),
      ...updateValues,
    };

    const updateQuery = {
      $set: updateValues,
      $push: {
        chartData: {
          $each: [newChartEntry],
          $slice: -50,
          $sort: { timestamp: 1 },
        },
      },
    };

    if (aiPrediction !== undefined) {
      // --- UPDATED MAP TO MATCH YOUR ESP32 LOGIC ---
      // 0: Balanced/No Action
      // 1: Pour Water
      // 2: Pour Fertilizer
      const statusMap = {
        0: "Balanced (Normal)",
        1: "Water",
        2: "Fertilizer"
      };

      const recommendation = statusMap[aiPrediction] || "Unknown";

      // Logic to determine description based on prediction
      let logDescription = "";
      if (aiPrediction === 1) {
        logDescription = "Critical: Plant needs Water.";
      } else if (aiPrediction === 2) {
        logDescription = "Alert: Plant needs Fertilizer.";
      } else {
        logDescription = "Soil status: Balanced and healthy.";
      }

      const historyEntry = {
        timestamp: new Date(),
        title: "Soil Analysis Update",
        description: `AI Prediction: ${aiPrediction}. ${logDescription}`,
        aiPrediction: aiPrediction,
      };

      updateQuery.$push.history = {
        $each: [historyEntry],
        $slice: -100,
        $sort: { timestamp: -1 },
      };
    }

    const updatedMeter = await Soil.findOneAndUpdate(
      { hardwareId: hardwareID },
      updateQuery,
      { new: true, runValidators: true },
    );

    if (!updatedMeter) {
      return res.status(404).json({ message: "Device not found." });
    }

    return res.status(200).json({
      message: "Soil data updated successfully",
      updatedFields: updateValues,
      lastUpdated: updatedMeter.updatedAt,
    });
  } catch (error) {
    console.error("Error updating soil hardware data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
