const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    boardingHouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BoardingHouse',
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
    rating: {
      type: Number,
    },
    description: {
      type: String,
      required: [true, 'Review should have content!'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reviews', reviewSchema);
