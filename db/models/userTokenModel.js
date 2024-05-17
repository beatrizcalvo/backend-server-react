const mongoose = require("mongoose");

const UserTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please provide a user id!"]
    },
    token: {
      type: String,
      required: [true, "Please provide a token!"]
    }
  },
  { timestamps: true }
);

// Set database and collection name 
const authdb = mongoose.connection.useDb("authDB");
const usersTokensModel = authdb.model("UserToken", UserTokenSchema);

module.exports = usersTokensModel;
