// const Soil = require("../../models/meter/meter.model");

// async function hardwareData(req, res) {
//   const { hardwareID, voltage, current, power, history } = req.body;

//   if (!hardwareID) {
//     return res.status(400).json({ message: "Hardware ID is required" });
//   }
//   if (typeof hardwareID !== "string" || hardwareID.trim() === "") {
//     return res.status(400).json({ message: "Invalid hardware ID" });
//   }

//   if (voltage === undefined || current === undefined || power === undefined) {
//     return res
//       .status(400)
//       .json({ message: "Voltage, current, and power are required" });
//   }

//   const newChartDataEntry = {
//     timestamp: new Date(),
//     voltage,
//     current,
//     power,
//   };

//   const updateQuery = {
//     $set: {
//       voltage: voltage,
//       current: current,
//       power: power,
//     },
//     $push: {
//       chartData: {
//         $each: [newChartDataEntry],
//         $slice: -25,
//         $sort: { timestamp: -1 },
//       },
//     },
//   };

//   if (history) {
//     const newHistoryEntry = {
//       timestamp: new Date(),
//       title: "Power Alert",
//       description: `Power exceeded threshold: ${power}W`,
//     };
//     updateQuery.$push.history = {
//       $each: [newHistoryEntry],
//       $slice: -100,
//       $sort: { timestamp: -1 },
//     };
//   }

//   try {
//     const updatedMeter = await Soil.findOneAndUpdate(
//       { hardwareID },
//       updateQuery,
//       { new: true, runValidators: true },
//     );

//     if (!updatedMeter) {
//       return res
//         .status(404)
//         .json({ message: "Meter not found for the given hardware ID." });
//     }

//     res.status(200).json({
//       message: "Meter data updated successfully",
//       updatedMeter: {
//         thresholdPower: updatedMeter.thresholdPower,
//         armed: updatedMeter.armed,
//         systemStatus: updatedMeter.systemStatus,
//       },
//     });
//   } catch (error) {
//     console.error("Error updating meter data:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }

// module.exports = {
//   hardwareData,
// };

const Soil = require("../../models/meter/meter.model");

async function hardwareData(req, res) {
  // 1. Destructure the soil-specific fields from the request body
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

  // 2. Validation: Hardware ID is essential
  if (
    !hardwareID ||
    typeof hardwareID !== "string" ||
    hardwareID.trim() === ""
  ) {
    return res.status(400).json({ message: "Valid Hardware ID is required" });
  }

  try {
    // 3. Prepare the real-time values for the top-level document
    const updateValues = {
      nitrogen: nitrogen ?? 0,
      phosphorus: phosphorus ?? 0,
      potassium: potassium ?? 0,
      moisture: moisture ?? 0,
      temperature: temperature ?? 0,
      ph: ph ?? 7.0,
    };

    // 4. Create the new chart entry for time-series tracking
    const newChartEntry = {
      timestamp: new Date(),
      ...updateValues,
    };

    // 5. Build the MongoDB update query
    const updateQuery = {
      $set: updateValues,
      $push: {
        chartData: {
          $each: [newChartEntry],
          $slice: -50, // Keep the last 50 readings for charts
          $sort: { timestamp: 1 }, // Keep chronological order
        },
      },
    };

    // 6. Optional: Add to history if an AI prediction or alert is sent
    if (aiPrediction !== undefined) {

      // Define the recommendation based on the prediction code
    const statusMap = {
      0: "Water",
      1: "Fertilizer",
      2: "Balanced (Normal)"
    };

  const recommendation = statusMap[aiPrediction] || "Unknown Status";

    const historyEntry = {
      timestamp: new Date(),
      title: "Soil Analysis Update",
      description: `New AI Prediction score: ${aiPrediction}. Plant needs: ${recommendation}.`,
      aiPrediction: aiPrediction,
    };
         
      // Initialize $push for history if it wasn't already set
      updateQuery.$push.history = {
        $each: [historyEntry],
        $slice: -100,
        $sort: { timestamp: -1 },
      };
    }

    // 7. Find and Update (using 'hardwareId' to match your schema)
    const updatedMeter = await Soil.findOneAndUpdate(
      { hardwareId: hardwareID },
      updateQuery,
      { new: true, runValidators: true },
    );

    if (!updatedMeter) {
      return res.status(404).json({ message: "Device not found." });
    }

    // 8. Success Response
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

module.exports = {
  hardwareData,
};
