const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      lowercase: true, 
      required: [true, "Please provide a name!"],
      unique: [true, "Name already exists!"]
    },
    description: { type: String },
    active: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: String,
      default: "system"
    },
    updatedBy: {
      type: String,
      default: "system"
    }
  },
  { timestamps: true }
);

// Set database and collection name 
const appdb = mongoose.connection.useDb("reactApp");
const rolesModel = appdb.model("Role", RoleSchema);

module.exports = rolesModel;
