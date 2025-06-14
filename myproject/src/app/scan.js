'use client'
import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import QRReader (works better with Next.js)
const QrReader = dynamic(
  () => import('@blackbox-vision/react-qr-reader').then((mod) => mod.QrReader),
  { ssr: false }
);

export default function ScanQR() {
  const [result, setResult] = useState('');

  return (
    <div style={{ padding: 20 }}>
      <h2>Scan QR Code</h2>
      <QrReader
        constraints={{ facingMode: 'environment' }}
        onResult={(res, err) => {
          if (res?.text) {
            setResult(res.text);
          }
        }}
        containerStyle={{ width: '300px' }}
      />
      <p style={{ marginTop: 20 }}>Scanned Data: <b>{result}</b></p>
    </div>
  );
}
