const mongoose = require("mongoose");

const lot = new mongoose.Schema({
  status: { type: String },
  vehicleId: { type: Object },
  vehicleType: { type: String },
  carName: { type: String },
  lotType: { type: String },
});

const entryScheme = new mongoose.Schema({
  smallParkingLot: { type: Array, default: [lot] },
  mediumParkingLot: { type: Array, default: [lot] },
  largeParkingLot: { type: Array, default: [lot] },
});

module.exports = mongoose.model("entry", entryScheme);
