const Soil = require("../../models/meter/meter.model");
const User = require("../../models/user/user.model");

async function createMeterData(req, res) {
  const userId = req.user.userId;
  const { hardwareID } = req.body;

  if (
    !hardwareID ||
    typeof hardwareID !== "string" ||
    hardwareID.trim() === ""
  ) {
    return res.status(400).json({ message: "A valid hardware ID is required" });
  }

  try {
    // 1. Check if the user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Check if THIS USER already has a meter assigned
    const userAlreadyHasMeter = await Soil.findOne({ userId: userId });
    if (userAlreadyHasMeter) {
      return res.status(400).json({
        message:
          "You have already registered a meter. You cannot create more than one.",
      });
    }

    // 3. Check if this specific hardwareID is already registered to SOMEONE ELSE
    const hardwareTaken = await Soil.findOne({ hardwareId: hardwareID });
    if (hardwareTaken) {
      return res.status(400).json({
        message: "This hardware ID is already in use by another account.",
      });
    }

    // 4. Create the new meter
    const newMeter = new Soil({
      userId: userId,
      hardwareId: hardwareID,
      moisture: 0,
      temperature: 0,
      ph: 7.0,
      nitrogen: 0,
      phosphorus: 0,
      potassium: 0,
    });

    await newMeter.save();

    // 5. Update the user profile
    existingUser.hardwareID = hardwareID;
    await existingUser.save();

    const myUserDataInfo = {
      username: existingUser.username,
      email: existingUser.email,
      hardwareID: existingUser.hardwareID || null,
    };

    return res.status(201).json({
      message: "Meter data created successfully",
      meter: newMeter,
      user: myUserDataInfo,
    });
  } catch (error) {
    console.error("Error creating meter data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { createMeterData };
