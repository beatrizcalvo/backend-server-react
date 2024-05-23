const mongoose = require("mongoose");

const ContactPointSchema = new mongoose.Schema(
  {},
  { timestamps: true }
);

// Set database and collection name 
const appdb = mongoose.connection.useDb("reactApp");
const contactPointsModel = appdb.model("ContactPoint", ContactPointSchema);

module.exports = contactPointsModel;
