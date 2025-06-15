// const mongoose = require('mongoose');

// const complaintSchema = new mongoose.Schema({
//   id: { type: String, unique: true },
//   category: String, // plumbing, electrical, etc.
//   description: String,
//   photo: String, // file path of uploaded photo
//   status: { type: String, default: 'Submitted' }, // Submitted, Assigned, In Progress, Completed, Resolved
//   priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Low' },
//   residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // worker ID
//   qrCodeText: String, // complaintId used as QR code text
//   resolutionTimestamp: Date,
// });

// module.exports = mongoose.model('Complaint', complaintSchema);
