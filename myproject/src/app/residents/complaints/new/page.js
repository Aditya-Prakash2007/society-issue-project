'use client';

import { useState } from 'react';
import ReactQRCode from 'react-qr-code';

export default function NewComplaint() {
  const [category, setCategory] = useState('plumbing');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const [complaintId, setComplaintId] = useState(null);
  const [qrCode, setQrCode] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setComplaintId(null);
    setQrCode(null);

    if (!description.trim()) {
      setMessage('Description is required');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please login first');
      return;
    }

    const formData = new FormData();
    formData.append('category', category);
    formData.append('description', description);
    if (photo) formData.append('photo', photo);

    try {
      const res = await fetch('http://localhost:5000/api/complaints/submit', {
        method: 'POST',
       headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || 'Submission failed');
        return;
      }

      setMessage('Complaint submitted successfully!');
      setComplaintId(data.complaintId);
      setQrCode(data.qrCode);

      setDescription('');
      setPhoto(null);
    } catch (error) {
      setMessage('Server error');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      <h2>New Complaint</h2>
      <form onSubmit={handleSubmit}>
        <label>Category:</label><br />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        >
          <option value="plumbing">Plumbing</option>
          <option value="electrical">Electrical</option>
        </select>

        <label>Description:</label><br />
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
          placeholder="Describe your issue"
        />

        <label>Photo (optional):</label><br />
        <input
          type="file"
          accept="image/*"
          onChange={e => setPhoto(e.target.files[0])}
          style={{ marginBottom: 20 }}
        />

        <button type="submit" style={{ padding: '10px 20px' }}>Submit</button>
      </form>

      {message && <p style={{ marginTop: 20, color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}

      {complaintId && (
        <div style={{ marginTop: 30, textAlign: 'center' }}>
          <h4>Complaint ID: {complaintId}</h4>
          {qrCode && <ReactQRCode value={qrCode} />}
        </div>
      )}
    </div>
  );
}
