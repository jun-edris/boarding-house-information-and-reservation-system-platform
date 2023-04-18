const mongoose = require('mongoose');

const roomSchema = mongoose.Schema(
  {
    roomType: {
      type: String,
      required: [true, 'Please provide room type!'],
    },
    roomName: { type: String, required: [true, 'Please provide room name!'] },
    description: {
      type: String,
      required: [true, 'Please provide room type!'],
    },
    prize: {
      type: String,
      required: ['true', 'Please provide room prize!'],
    },
    allowedTenants: {
      type: Number,
      required: [true, 'Please provide how many tenants are allowed!'],
    },
    image: {
      type: String,
      default: '',
    },
    tenants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
      },
    ],
    available: {
      type: Boolean,
      default: true,
    },
    boardingHouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BoardingHouse',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);
