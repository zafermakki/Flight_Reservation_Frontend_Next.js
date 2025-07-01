'use client';

import React, { useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
};

const VerificationModal: React.FC<Props> = ({ open, onClose }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const email = typeof window !== 'undefined' ? localStorage.getItem('email') : '';

  const handleVerificationSubmit = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/make-reset/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed.');
      }

      setSuccessMessage(data.message);
      localStorage.removeItem('email');

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-teal-500 text-center mb-4">Verification</h2>

        {errorMessage && (
          <div className="mb-3 p-2 text-sm text-red-600 bg-red-100 border border-red-300 rounded">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-3 p-2 text-sm text-green-600 bg-green-100 border border-green-300 rounded">
            {successMessage}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg text-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleVerificationSubmit}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
