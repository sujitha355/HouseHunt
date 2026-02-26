const express = require('express');
const User = require('../models/User');
const { auth, isAdmin } = require('../middleware/auth');
const router = express.Router();

// Get pending owner approvals
router.get('/pending-owners', auth, isAdmin, async (req, res) => {
  try {
    const pendingOwners = await User.find({ type: 'owner', isApproved: false });
    res.json(pendingOwners);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve/reject owner
router.put('/approve-owner/:id', auth, isAdmin, async (req, res) => {
  try {
    const { isApproved } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user || user.type !== 'owner') {
      return res.status(404).json({ message: 'Owner not found' });
    }

    user.isApproved = isApproved;
    await user.save();
    res.json({ message: `Owner ${isApproved ? 'approved' : 'rejected'}`, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
