const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  propType: { type: String, required: true },
  propAdType: { type: String, enum: ['rent', 'sale'], default: 'rent' },
  isAvailable: { type: Boolean, default: true },
  propAddress: { type: String, required: true },
  ownerContact: { type: String, required: true },
  propAmt: { type: Number, required: true },
  propImages: [{ type: String }],
  addInfo: { type: String },
  bedrooms: { type: Number },
  amenities: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
