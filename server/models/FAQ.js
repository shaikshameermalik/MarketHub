// models/FAQ.js
const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String }, // Optional
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FAQ', faqSchema);
