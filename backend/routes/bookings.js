const express = require('express');
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const { auth, isOwner } = require('../middleware/auth');
const router = express.Router();

// Create booking (renter)
router.post('/', auth, async (req, res) => {
  try {
    const { propertyId, userContact, userMessage } = req.body;
    
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const booking = new Booking({
      propertyId,
      userId: req.user.userId,
      ownerId: property.userId,
      username: req.body.username,
      userContact,
      userMessage
    });
    
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId })
      .populate('propertyId')
      .populate('ownerId', 'name email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get owner's booking requests
router.get('/owner/requests', auth, isOwner, async (req, res) => {
  try {
    const bookings = await Booking.find({ ownerId: req.user.userId })
      .populate('propertyId')
      .populate('userId', 'name email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update booking status (owner)
router.put('/:id/status', auth, isOwner, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findOne({ _id: req.params.id, ownerId: req.user.userId });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
