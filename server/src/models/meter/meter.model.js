const mongoose = require("mongoose");

const chartDataSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now },

    // Nutrients
    nitrogen: { type: Number, default: 0 },
    phosphorus: { type: Number, default: 0 },
    potassium: { type: Number, default: 0 },

    // Environment
    moisture: { type: Number, default: 0 },
    temperature: { type: Number, default: 0 },
    ph: { type: Number, default: 7.0 },
  },
  { _id: false },
);

const historySchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now },
    title: { type: String },
    description: { type: String },
    aiPrediction: { type: Number },
  },
  { _id: false },
);

const soilSchema = new mongoose.Schema(
  {
    // User & Device
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hardwareId: {
      type: String,
      required: true,
      unique: true,
    },

    // Latest Sensor Values (REAL-TIME)
    nitrogen: { type: Number, default: 0 },
    phosphorus: { type: Number, default: 0 },
    potassium: { type: Number, default: 0 },

    moisture: { type: Number, default: 0 },
    temperature: { type: Number, default: 0 },
    ph: { type: Number, default: 7.0 },

    // Time-series data for charts
    chartData: [chartDataSchema],

    // Logs / events
    history: [historySchema],
  },
  {
    timestamps: true, // createdAt, updatedAt
  },
);

const Soil = mongoose.model("Soil", soilSchema);

module.exports = Soil;
