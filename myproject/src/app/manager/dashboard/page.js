'use client'
import { useEffect, useState } from 'react';

export default function ManagerDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [workerName, setWorkerName] = useState('');
  const [selectedComplaintId, setSelectedComplaintId] = useState('');

  // Fetch all complaints when component loads
  useEffect(() => {
    fetch('http://localhost:5000/api/manager/complaints')
      .then(res => res.json())
      .then(data => setComplaints(data))
      .catch(err => console.log(err));
  }, []);

  // Function to assign complaint
  const assignComplaint = () => {
    if (!selectedComplaintId || !workerName) {
      alert('Select a complaint and enter worker name');
      return;
    }

    fetch('http://localhost:5000/api/manager/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ complaintId: selectedComplaintId, workerName }),
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        // Refresh complaints after assignment
        return fetch('http://localhost:5000/api/manager/complaints');
      })
      .then(res => res.json())
      .then(data => setComplaints(data))
      .catch(err => console.log(err));
  };

  return (
    <div>
      <h1>Manager Dashboard</h1>

      <h2>All Complaints</h2>
      <ul>
        {complaints.map(c => (
          <li key={c.id}>
            <b>ID:</b> {c.id} | <b>Category:</b> {c.category} | <b>Status:</b> {c.status} | <b>Assigned To:</b> {c.assignedTo || 'None'}
          </li>
        ))}
      </ul>

      <h2>Assign Complaint</h2>
      <select onChange={e => setSelectedComplaintId(e.target.value)} value={selectedComplaintId}>
        <option value="">Select Complaint</option>
        {complaints.map(c => (
          <option key={c.id} value={c.id}>
            {c.id} - {c.category}
          </option>
        ))}
      </select>
      <br />
      <input
        type="text"
        placeholder="Worker name"
        value={workerName}
        onChange={e => setWorkerName(e.target.value)}
      />
      <br />
      <button onClick={assignComplaint}>Assign</button>
    </div>
  );
}
