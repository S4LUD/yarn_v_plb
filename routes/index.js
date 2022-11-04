const router = require("express").Router();
const park_Scheme = require("../model/parkScheme");
const entry_Scheme = require("../model/entryScheme");
const moment = require("moment");

router.delete("/unpark", async (req, res) => {
  entry_Scheme.updateOne(
    {
      smallParkingLot: {
        $elemMatch: { vehicleId: req.body._id },
      },
    },
    {
      $set: {
        "smallParkingLot.$.status": "vacant",
        "smallParkingLot.$.vehicleType": "",
        "smallParkingLot.$.vehicleId": "",
        "smallParkingLot.$.carName": "",
        "smallParkingLot.$.lotType": "",
      },
    },
    (err, data) => {
      if (data.acknowledged) {
        if (data.modifiedCount !== 0) {
          park_Scheme.deleteOne({ _id: req.body._id }, (err, data) => {
            if (err) return res.status(400).send(err);
            return res.status(200).send(data);
          });
        }
      }
    }
  );
  entry_Scheme.updateOne(
    {
      mediumParkingLot: {
        $elemMatch: { vehicleId: req.body._id },
      },
    },
    {
      $set: {
        "mediumParkingLot.$.status": "vacant",
        "mediumParkingLot.$.vehicleType": "",
        "mediumParkingLot.$.vehicleId": "",
        "mediumParkingLot.$.carName": "",
        "mediumParkingLot.$.lotType": "",
      },
    },
    (err, data) => {
      if (data.acknowledged) {
        if (data.modifiedCount !== 0) {
          park_Scheme.deleteOne({ _id: req.body._id }, (err, data) => {
            if (err) return res.status(400).send(err);
            return res.status(200).send(data);
          });
        }
      }
    }
  );
  entry_Scheme.updateOne(
    {
      largeParkingLot: {
        $elemMatch: { vehicleId: req.body._id },
      },
    },
    {
      $set: {
        "largeParkingLot.$.status": "vacant",
        "largeParkingLot.$.vehicleType": "",
        "largeParkingLot.$.vehicleId": "",
        "largeParkingLot.$.carName": "",
        "largeParkingLot.$.lotType": "",
      },
    },
    (err, data) => {
      if (data.acknowledged) {
        if (data.modifiedCount !== 0) {
          park_Scheme.deleteOne({ _id: req.body._id }, (err, data) => {
            if (err) return res.status(400).send(err);
            return res.status(200).send(data);
          });
        }
      }
    }
  );
});

router.post("/park", (req, res) => {
  if (req.body.vehicleType === "smallVehicle") {
    entry_Scheme.find(
      {
        "smallParkingLot.status": req.body.status,
        "mediumParkingLot.status": req.body.status,
        "largeParkingLot.status": req.body.status,
      },
      (err, entry_data) => {
        if (err) return res.status(400).send(err);
        if (entry_data.length === 0) {
          return res
            .status(400)
            .send({ message: "Parking space for small vehicles is filled" });
        }
      }
    );
  }
  if (req.body.vehicleType === "mediumVehicle") {
    entry_Scheme.find(
      {
        "mediumParkingLot.status": req.body.status,
        "largeParkingLot.status": req.body.status,
      },
      (err, entry_data) => {
        if (err) return res.status(400).send(err);
        if (entry_data.length === 0) {
          return res
            .status(400)
            .send({ message: "Parking space for medium vehicles is filled" });
        }
      }
    );
  }
  if (req.body.vehicleType === "largeVehicle") {
    entry_Scheme.find(
      {
        "largeParkingLot.status": req.body.status,
      },
      (err, entry_data) => {
        if (err) return res.status(400).send(err);
        if (entry_data.length === 0) {
          return res
            .status(400)
            .send({ message: "Parking space for large vehicles is filled" });
        }
      }
    );
  }

  const randomCar = Math.floor(Math.random() * 6);
  const Park = new park_Scheme({
    vehicleType: req.body.vehicleType,
    vehicle: randomCar,
  });

  Park.save((err, parkData) => {
    if (err) return res.status(400).send(err);
    entry_Scheme.find(async (err, data) => {
      if (err) return res.status(400).send(err);
      for (let index = 0; index < data.length; index++) {
        if (req.body.vehicleType === "smallVehicle") {
          const smallEntries = await entry_Scheme.updateOne(
            { _id: data[index]._id, "smallParkingLot.status": req.body.status },
            {
              $set: {
                "smallParkingLot.$.status": req.body.new_status,
                "smallParkingLot.$.vehicleType": req.body.vehicleType,
                "smallParkingLot.$.vehicleId": parkData._id.toString(),
                "smallParkingLot.$.carName": parkData.vehicle,
                "smallParkingLot.$.lotType": "SP",
              },
            }
          );
          if (smallEntries.acknowledged) {
            if (smallEntries.modifiedCount !== 0)
              return res.status(200).send({
                smallEntries: smallEntries,
              });
          }
          const mediumEntries = await entry_Scheme.updateOne(
            {
              _id: data[index]._id,
              "mediumParkingLot.status": req.body.status,
            },
            {
              $set: {
                "mediumParkingLot.$.status": req.body.new_status,
                "mediumParkingLot.$.vehicleType": req.body.vehicleType,
                "mediumParkingLot.$.vehicleId": parkData._id.toString(),
                "mediumParkingLot.$.carName": parkData.vehicle,
                "mediumParkingLot.$.lotType": "MP",
              },
            }
          );
          if (mediumEntries.acknowledged) {
            if (mediumEntries.modifiedCount !== 0)
              return res.status(200).send({
                mediumEntries: mediumEntries,
              });
          }
          const largeEntries = await entry_Scheme.updateOne(
            { _id: data[index]._id, "largeParkingLot.status": req.body.status },
            {
              $set: {
                "largeParkingLot.$.status": req.body.new_status,
                "largeParkingLot.$.vehicleType": req.body.vehicleType,
                "largeParkingLot.$.vehicleId": parkData._id.toString(),
                "largeParkingLot.$.carName": parkData.vehicle,
                "largeParkingLot.$.lotType": "LP",
              },
            }
          );
          if (largeEntries.acknowledged) {
            if (largeEntries.modifiedCount !== 0)
              return res.status(200).send({
                largeEntries: largeEntries,
              });
          }
        }
        if (req.body.vehicleType === "mediumVehicle") {
          const mediumEntries = await entry_Scheme.updateOne(
            {
              _id: data[index]._id,
              "mediumParkingLot.status": req.body.status,
            },
            {
              $set: {
                "mediumParkingLot.$.status": req.body.new_status,
                "mediumParkingLot.$.vehicleType": req.body.vehicleType,
                "mediumParkingLot.$.vehicleId": parkData._id.toString(),
                "mediumParkingLot.$.carName": parkData.vehicle,
                "mediumParkingLot.$.lotType": "MP",
              },
            }
          );
          if (mediumEntries.acknowledged) {
            if (mediumEntries.modifiedCount !== 0)
              return res.status(200).send({
                mediumEntries: mediumEntries,
              });
          }
          const largeEntries = await entry_Scheme.updateOne(
            { _id: data[index]._id, "largeParkingLot.status": req.body.status },
            {
              $set: {
                "largeParkingLot.$.status": req.body.new_status,
                "largeParkingLot.$.vehicleType": req.body.vehicleType,
                "largeParkingLot.$.vehicleId": parkData._id.toString(),
                "largeParkingLot.$.carName": parkData.vehicle,
                "largeParkingLot.$.lotType": "LP",
              },
            }
          );
          if (largeEntries.acknowledged) {
            if (largeEntries.modifiedCount !== 0)
              return res.status(200).send({
                largeEntries: largeEntries,
              });
          }
        }
        if (req.body.vehicleType === "largeVehicle") {
          const largeEntries = await entry_Scheme.updateOne(
            { _id: data[index]._id, "largeParkingLot.status": req.body.status },
            {
              $set: {
                "largeParkingLot.$.status": req.body.new_status,
                "largeParkingLot.$.vehicleType": req.body.vehicleType,
                "largeParkingLot.$.vehicleId": parkData._id.toString(),
                "largeParkingLot.$.carName": parkData.vehicle,
                "largeParkingLot.$.lotType": "LP",
              },
            }
          );
          if (largeEntries.acknowledged) {
            if (largeEntries.modifiedCount !== 0)
              return res.status(200).send({
                largeEntries: largeEntries,
              });
          }
        }
      }
    });
  });
});

router.post("/park/details", (req, res) => {
  park_Scheme.findOne({ _id: req.body.vehicleId }, (err, data) => {
    if (err) return res.status(400).send(err);

    const TimeOut = moment(Date.now());
    const TimeIn = moment(data.parkTime);
    const calDefRate = Math.round(TimeOut.diff(TimeIn, "hours", true));
    const calHourRate = Math.round(TimeOut.diff(TimeIn, "hours", true)) - 3;

    let defaultRate = 0;
    let hourlyRate = 0;
    let fullHoursRate = 0;

    if (calDefRate >= 24) {
      fullHoursRate = Math.round(calDefRate / 24) * 5000;
      defaultRate = 40;
      if (req.body.lotType === "SP")
        hourlyRate = (calHourRate - Math.round(24 / calDefRate) * 24) * 20;
      if (req.body.lotType === "MP")
        hourlyRate = (calHourRate - Math.round(24 / calDefRate) * 24) * 60;
      if (req.body.lotType === "LP")
        hourlyRate = (calHourRate - Math.round(24 / calDefRate) * 24) * 100;
    } else {
      if (calDefRate >= 3) defaultRate = 40;
      if (calHourRate > 0) {
        if (req.body.lotType === "SP") hourlyRate = calHourRate * 20;
        if (req.body.lotType === "MP") hourlyRate = calHourRate * 60;
        if (req.body.lotType === "LP") hourlyRate = calHourRate * 100;
      }
    }
    return res.status(200).send({
      TimeIn: new Date(data.parkTime),
      TimeOut: new Date(),
      totalHours: Math.round(TimeOut.diff(TimeIn, "hours", true)),
      fixedRate: defaultRate,
      hourlyRate: hourlyRate,
      fullHoursRate: fullHoursRate,
      totalFee: defaultRate + hourlyRate + fullHoursRate,
    });
  });
});

router.post("/entry", (req, res) => {
  const Entries = new entry_Scheme({
    smallParkingLot: [
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
    ],
    mediumParkingLot: [
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
    ],
    largeParkingLot: [
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
      {
        status: "vacant",
        vehicleId: "",
        vehicleType: "",
        carName: "",
        lotType: "",
      },
    ],
  });

  Entries.save((err, data) => {
    if (err) return res.status(400).send(err);
    return res.status(200).send(data);
  });
});

router.get("/entry", (req, res) => {
  entry_Scheme.find((err, data) => {
    if (err) return res.status(400).send(err);
    return res.status(200).send(data);
  });
});

module.exports = router;
