const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema(
  {
    dateToLive: {
      type: Date,
      required: [true, 'Please provide a date when you will stay!'],
    },
    dateToLeave: {
      type: Date,
      required: [true, 'Please provide a date when you will leave!'],
    },
    modeOfLiving: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'monthly',
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
    },
    boardingHouseOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
    status: {
      type: String,
      required: true,
      enum: [
        'pendingToAccept',
        'reserved',
        'expired',
        'pendingToLeave',
        'canceled',
        'declined',
      ],
      default: 'pendingToAccept',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reservation', reservationSchema);
