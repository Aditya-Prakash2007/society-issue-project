'use client'
import { useState } from 'react';

export default function NewComplaint() {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('category', category);
    formData.append('description', description);
    formData.append('photo', photo);

    const response = await fetch('http://localhost:5000/api/complaints', {
      method: 'POST',
      headers: {
        userid: 'user123'
      },
      body: formData
    });

    const data = await response.json();
    if (data.complaint?.photo) {
      setImageUrl(`http://localhost:5000/uploads/${data.complaint.photo}`);
    }
  }

  return (
    <div className="container">
      <h2>File a Complaint</h2>
      <form onSubmit={handleSubmit}>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Electrical">Electrical</option>
        </select>
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        ></textarea>
        <input type="file" onChange={e => setPhoto(e.target.files[0])} />
        <button type="submit">Submit</button>
      </form>

      {imageUrl && (
        <div>
          <h4>Uploaded Photo:</h4>
          <img src={imageUrl} alt="Complaint Photo" width="300" />
        </div>
      )}
    </div>
  );
}
