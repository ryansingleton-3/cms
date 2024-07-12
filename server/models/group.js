// models/group.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String }
});

module.exports = mongoose.model('Group', groupSchema);