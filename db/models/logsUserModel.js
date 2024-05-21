const mongoose = require("mongoose");

const LogsUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true, 
      required: [true, "Please provide an email!"]
    },
    operationType: {
      type: String,
      required: [true, "Please provide a operation type!"]
    },
    active: { type: Boolean },
    firstName: { type: String },
    lastName: { type: String },
    secondLastName: { type: String },
    gender: { type: String },
    birthDate: { type: Date },
    role: { type: String },
    createdAt: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: String,
      default: "system"
    }
  }
);

// Set database and collection name 
const appdb = mongoose.connection.useDb("reactApp");
const logsUsersModel = appdb.model("LogsUser", LogsUserSchema);

module.exports = logsUsersModel;
