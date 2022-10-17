


const { Schema, model } = require("mongoose");

const EmployeeSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["se", "marketer", "HR", "admin"]
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = model("employee", EmployeeSchema);
