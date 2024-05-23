const mongoose = require("mongoose");

const LogsUserSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      lowercase: true, 
      required: [true, "Please provide a user email!"]
    },
    operationType: {
      type: String,
      required: [true, "Please provide a operation type!"]
    },
    codeTableOperation: {
      type: String,
      required: [true, "Please provide a code for table operation!"]
    },
    dataPrevious: {
      type: String,
      required: [true, "Please provide the data previous operation!"]
    },
    dataNext: {
      type: String,
      required: [true, "Please provide the data after operation!"]
    },
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
