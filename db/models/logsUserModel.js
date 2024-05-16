const mongoose = require("mongoose");

const LogsUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true, 
      required: [true, "Please provide an email!"]
    },
    password: {
      type: String,
      required: [true, "Please provide a password!"]
    },
    active: {
      type: Boolean
    }
  },
  { timestamps: true }
);

// logs_users is collection name
const db = mongoose.connection.useDb("reactApp");
const logsUsersModel = db.model('logs_users', LogsUserSchema);

module.exports =  logsUsersModel;
