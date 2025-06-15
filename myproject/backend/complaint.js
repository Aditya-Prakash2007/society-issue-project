const express = require('express');
const router = express.Router();
const Complaint = require('./models/complaint');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const fs = require('fs');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer setup for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Middleware to parse JWT token and check role(s)
function authMiddleware(allowedRoles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Unauthorized: No token' });

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient role' });
      }
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  };
}

// Safer complaint ID generator (using timestamp + random)
function generateComplaintId() {
  return 'COMP-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
}

// Map category to priority
function getPriorityByCategory(cat) {
  const map = {
    electrical: 'High',
    plumbing: 'Medium',
    carpentry: 'Low',
    other: 'Low',
  };
  return map[cat.toLowerCase()] || 'Low';
}

// ====================== ROUTES ======================

// Resident submits complaint (role: resident)
router.post('/submit', authMiddleware(['resident']), upload.single('photo'), async (req, res) => {
  try {
    const { category, description } = req.body;
    if (!category || !description) {
      return res.status(400).json({ message: 'Category and description are required' });
    }

    const complaintId = generateComplaintId();
    const priority = getPriorityByCategory(category);

    const complaint = new Complaint({
      complaintId,
      category,
      description,
      photo: req.file ? req.file.filename : '',
      priority,
      residentId: req.user.id,
      qrCodeText: complaintId,
      status: 'Submitted',
      createdAt: new Date(),
    });

    // Generate QR code data URL for the complaint ID
    const qrCodeDataUrl = await QRCode.toDataURL(complaintId);

    await complaint.save();

    res.json({ message: 'Complaint submitted successfully', complaintId, qrCode: qrCodeDataUrl });
  } catch (error) {
    console.error('Submit complaint error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Resident fetches their complaints (role: resident)
router.get('/my-complaints', authMiddleware(['resident']), async (req, res) => {
  try {
    const complaints = await Complaint.find({ residentId: req.user.id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    console.error('Get my complaints error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Manager or admin assigns complaint to a worker (roles: manager, admin)
router.post('/assign', authMiddleware(['manager', 'admin']), async (req, res) => {
  try {
    const { complaintId, workerName } = req.body;
    if (!complaintId || !workerName) {
      return res.status(400).json({ message: 'complaintId and workerName are required' });
    }

    const complaint = await Complaint.findOne({ complaintId });
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.assignedTo = workerName;
    complaint.status = 'Assigned';

    await complaint.save();

    res.json({ message: 'Complaint assigned successfully', complaint });
  } catch (error) {
    console.error('Assign complaint error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// (Optional) Get all complaints (role: manager, admin)
router.get('/all', authMiddleware(['manager', 'admin']), async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    console.error('Get all complaints error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
