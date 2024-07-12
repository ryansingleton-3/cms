const mongoose = require("mongoose");

const documentSchema = mongoose.Schema({
  id: { type: String },
  name: { type: String, required: true },
  description: { type: String },
  url: { type: String },
  children: { type: Array },
});

module.exports = mongoose.model("Document", documentSchema, "documents");
