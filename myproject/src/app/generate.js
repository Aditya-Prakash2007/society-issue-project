'use client'
import { useState } from 'react';
import QRCode from 'qrcode.react';

export default function GenerateQR() {
  const [text, setText] = useState('');

  return (
    <div style={{ padding: 20 }}>
      <h2>Generate QR Code</h2>
      <input
        type="text"
        placeholder="Enter something"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div style={{ marginTop: 20 }}>
        {text && <QRCode value={text} />}
      </div>
    </div>
  );
}
