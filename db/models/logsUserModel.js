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

// logs_users is collection name
const db = mongoose.connection.useDb("reactApp");
const logsUsersModel = db.model('logs_users', LogsUserSchema);

module.exports =  logsUsersModel;
