const mongoose = require('mongoose');

const notifSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    made: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    description: {
      type: String,
    },
    reason: {
      type: String,
    },
    urlLink: {
      type: String,
    },
    new: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notifications', notifSchema);
