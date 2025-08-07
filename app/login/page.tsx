'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PasswordResetModal from '../modal/PasswordResetModal';
import VerificationModal from '../modal/VerificationModal';

const  Login =() => {

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/client/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('email', email); // Save the email in localStorage
        router.push('/dashboard'); 
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-500">
      <div className="max-w-md w-full bg-white p-8 shadow-2xl rounded-2xl">
        <h2 className="text-center text-4xl font-extrabold text-teal-500 mb-6">
          Welcome Back!
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg text-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg text-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg bg-teal-500 text-white font-semibold hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsResetOpen(true)}
            className="text-sm text-teal-500 hover:underline cursor-pointer"
          >
            Forget Password?
          </button>
        </div>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-teal-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
      <PasswordResetModal
          open={isResetOpen}
          onClose={() => setIsResetOpen(false)}
          onVerificationOpen={() => {
            setIsResetOpen(false);
            setIsVerifyOpen(true);
          }}
      />
      <VerificationModal
          open={isVerifyOpen}
          onClose={() => setIsVerifyOpen(false)}
      />
    </div>
    
  );
}
export default Login