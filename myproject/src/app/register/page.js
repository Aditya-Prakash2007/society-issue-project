'use client'
import { useState } from 'react';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', flatNo: '', role: '', contact: ''  });

  function handleChange(e) {
  const newValue = e.target.value;
  setForm({ name: newValue });
}


  return (
    <div className="container">
      <h1>Register Page</h1>
      <form>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" placeholder="Password" onChange={handleChange} />
        <input name="flatNo" placeholder="Flat No" onChange={handleChange} />
        <select name="role" onChange={handleChange}>
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
