const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, default: null },
  description: { type: String, default: null },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

projectModel = mongoose.model("project", projectSchema);

module.exports = projectModel;
