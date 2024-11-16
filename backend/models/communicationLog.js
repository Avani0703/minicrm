// models/CommunicationLog.js
const mongoose = require('mongoose');

const communicationLogSchema = new mongoose.Schema({
  audienceId: {
    type: mongoose.Types.ObjectId,
    ref: 'Audience',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  spending: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'SENT', 'FAILED'], // Add 'PENDING' to the enum
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CommunicationLog', communicationLogSchema);
