'use client'
import { useState } from 'react';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', flatNo: '', role: '', contact: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    console.log(data);

    if (res.ok) {
      alert("Registration successful!");
    } else {
      alert(data.error || "Something went wrong");
    }
  };

  return (
    <div className="container">
      <h1>Register Page</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" placeholder="Password" onChange={handleChange} />
        <input name="flatNo" placeholder="Flat No" onChange={handleChange} />
        <select name="role" onChange={handleChange}>
          <option value="">Select Role</option>
          <option value="resident">Resident</option>
          <option value="manager">Manager</option>
          <option value="worker">Worker</option>
        </select>
        <input name="contact" placeholder="Contact" onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
