const mongoose = require("mongoose");

const parkScheme = new mongoose.Schema({
  vehicleType: { type: String, required: true },
  vehicle: { type: String, required: true },
  parkTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model("park", parkScheme);
