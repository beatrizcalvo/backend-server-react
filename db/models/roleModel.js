const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    name: {
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

// roles is collection name
const db = mongoose.connection.useDb("reactApp");
const rolesModel = db.model(('roles', RoleSchema);

module.exports =  rolesModel;
