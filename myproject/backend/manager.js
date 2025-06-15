const express = require('express');
const router = express.Router();

const complaints = [
  { id: 'COMP-1234', category: 'Plumbing', description: 'Leaky pipe', status: 'Submitted', assignedTo: null },
  { id: 'COMP-5678', category: 'Electrical', description: 'Light not working', status: 'Submitted', assignedTo: null },
];

router.get('/api/complaints', (req, res) => {
  res.json(complaints);
});

router.post('/api/assign', (req, res) => {
  const { complaintId, workerName } = req.body;

  if (!complaintId || !workerName) {
    return res.status(400).json({ message: 'Please provide complaintId and workerName' });
  }

  const complaint = complaints.find(c => c.id === complaintId);
  if (!complaint) {
    return res.status(404).json({ message: 'Complaint not found' });
  }

  complaint.assignedTo = workerName;
  complaint.status = 'Assigned';

  res.json({ message: 'Complaint assigned', complaint });
});

module.exports = router;
