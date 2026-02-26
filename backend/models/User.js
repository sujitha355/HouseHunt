const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['renter', 'owner', 'admin'], 
    default: 'renter' 
  },
  isApproved: { type: Boolean, default: true }
}, { timestamps: true });

// Owner accounts need admin approval
userSchema.pre('save', function(next) {
  if (this.type === 'owner' && this.isNew) {
    this.isApproved = false;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
