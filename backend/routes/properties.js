const express = require('express');
const Property = require('../models/Property');
const { auth, isOwner } = require('../middleware/auth');
const router = express.Router();

// Get all available properties
router.get('/', async (req, res) => {
  try {
    const { propType, minAmt, maxAmt, bedrooms } = req.query;
    const filter = { isAvailable: true };
    
    if (propType) filter.propType = propType;
    if (minAmt || maxAmt) {
      filter.propAmt = {};
      if (minAmt) filter.propAmt.$gte = Number(minAmt);
      if (maxAmt) filter.propAmt.$lte = Number(maxAmt);
    }
    if (bedrooms) filter.bedrooms = Number(bedrooms);

    const properties = await Property.find(filter).populate('userId', 'name email');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('userId', 'name email');
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get owner's properties
router.get('/owner/my-properties', auth, isOwner, async (req, res) => {
  try {
    const properties = await Property.find({ userId: req.user.userId });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add property (owner only)
router.post('/', auth, isOwner, async (req, res) => {
  try {
    const property = new Property({ ...req.body, userId: req.user.userId });
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update property
router.put('/:id', auth, isOwner, async (req, res) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    Object.assign(property, req.body);
    await property.save();
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete property
router.delete('/:id', auth, isOwner, async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
