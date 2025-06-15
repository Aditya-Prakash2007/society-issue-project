const express = require('express');
const router = express.Router();
const Complaint = require('../models/complaint');
const User = require('../models/user');
const authMiddleware = require('../middleware/authmiddleware');
const jwt = require('jsonwebtoken');


// Get assigned complaints for logged-in worker
router.get('/my-complaints', authMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find({ assignedTo: req.user.id })
      .populate('residentId', 'name flatNo')
      .sort({ priority: -1, status: 1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update complaint status ("In Progress" or "Completed")
router.put('/update-status/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    if (complaint.assignedTo.toString() !== req.user.id) return res.status(403).json({ message: 'Not allowed' });

    complaint.status = status;
    await complaint.save();

    res.json({ message: 'Status updated', complaint });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/verify-resolution/:id', authMiddleware, async (req, res) => {
  try {
    const { scannedQrText } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    if (complaint.assignedTo.toString() !== req.user.id) return res.status(403).json({ message: 'Not allowed' });

    if (scannedQrText !== complaint.qrCodeText) {
      return res.status(400).json({ message: 'QR code mismatch' });
    }

    complaint.status = 'Resolved';
    complaint.resolutionTimestamp = new Date();

    // Reward tokens based on priority
    const user = await User.findById(req.user.id);
    let tokensToAdd = 0;
    if (complaint.priority === 'High') tokensToAdd = 5;
    else if (complaint.priority === 'Medium') tokensToAdd = 3;
    else tokensToAdd = 1;

    user.tokens += tokensToAdd;
    await user.save();
    await complaint.save();

    res.json({ message: 'Complaint verified and resolved', tokensEarned: tokensToAdd });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Worker token balance endpoint
router.get('/tokens', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ tokens: user.tokens });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
