// models/Audience.js
const mongoose = require('mongoose');

const audienceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastVisit: {
    type: Date,
    required: true,
  },
  spending: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Audience', audienceSchema);
