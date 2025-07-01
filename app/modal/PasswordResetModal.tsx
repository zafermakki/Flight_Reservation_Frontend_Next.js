'use client';

import React, { useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onVerificationOpen: () => void;
};

const PasswordResetModal: React.FC<Props> = ({ open, onClose, onVerificationOpen }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/password-reset/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, new_password: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      localStorage.setItem('email', email);
      setSuccessMessage(data.message);
      setError(null);
      onClose();
      onVerificationOpen();
    } catch (err: any) {
      setError(err.message);
      setSuccessMessage('');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-teal-500 text-center mb-4">Reset Password</h2>

        {error && (
          <div className="mb-3 p-2 text-sm text-red-600 bg-red-100 border border-red-300 rounded">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-3 p-2 text-sm text-green-600 bg-green-100 border border-green-300 rounded">
            {successMessage}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-lg text-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full px-4 py-2 border rounded-lg text-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2 text-sm text-teal-500 focus:outline-none"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded"
          >
            Submit
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

export default PasswordResetModal;
