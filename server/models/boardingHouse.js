const mongoose = require('mongoose');

const boardingHouseSchema = mongoose.Schema(
  {
    houseName: {
      type: String,
      required: [true, 'Please enter a house name!'],
      trim: true,
      unique: true,
      maxLength: [225, 'House name characters exceeds 20!'],
    },
    description: {
      type: String,
      required: [true, 'Please provide house description!'],
    },
    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
      },
    ],
    landmark: {
      type: String,
      required: [
        true,
        'Please provide a location in order to know where they will pay!',
      ],
    },
    approved: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reviews',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('BoardingHouse', boardingHouseSchema);
