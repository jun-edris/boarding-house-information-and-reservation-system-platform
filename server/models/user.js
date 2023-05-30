const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please provide a first name'],
      trim: true,
      max: 20,
    },
    middleName: {
      type: String,
      required: [true, 'Please provide a middle name'],
      trim: true,
      max: 20,
    },
    lastName: {
      type: String,
      required: [true, 'Please provide a last name'],
      trim: true,
      max: 20,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    contact: {
      type: String,
      required: [true, 'Please provide a contact number'],
      trim: true,
      unique: true,
      min: 10,
      max: 10,
    },
    parent: {
      type: String,
    },
    region: {
      type: String,
      required: [true, 'Please provide an address'],
    },
    province: {
      type: String,
      required: [true, 'Please provide an address'],
    },
    city: {
      type: String,
      required: [true, 'Please provide an address'],
    },
    barangay: {
      type: String,
      required: [true, 'Please provide an address'],
    },
    region: {
      type: String,
      required: [true, 'Please provide an address'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      min: 8,
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: ['landlord', 'tenant', 'admin'],
      default: 'tenant',
    },
    active: {
      type: String,
      default: true,
    },
    image: {
      type: String,
      default: '',
    },
    noBH: {
      type: Boolean,
      default: true,
    },
    reviewed: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['new', 'requestedToReserve', 'requestedToLeave', 'living'],
      default: 'new',
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Users', userSchema);
