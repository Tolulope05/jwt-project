const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, default: null },
    description: { type: String, default: null },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

projectModel = mongoose.model("project", projectSchema);

module.exports = projectModel;
