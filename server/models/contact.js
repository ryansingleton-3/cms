const mongoose = require('mongoose');


const contactSchema = mongoose.Schema({
  id: { type: String },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  imageUrl: { type: String },
  group: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }]
});

module.exports = mongoose.model('Contact', contactSchema, 'contacts');