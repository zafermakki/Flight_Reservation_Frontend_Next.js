'use client';

import React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Register = () => {

  const router = useRouter()

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setErrorMessage('Passwords don not match!');
      return
    }
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/client/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username: name, email, password}),
      })

      if (res.ok) {
        localStorage.setItem('email', email)
        router.push('/verify')
      } else {
        const data = await res.json();
        console.log('Response:', data);
        setErrorMessage(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error', error)
      setErrorMessage('Something went wrong.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-500">
    <div className="max-w-md w-full bg-white p-8 shadow-2xl rounded-2xl">
      <h2 className="text-center text-4xl font-extrabold text-teal-500 mb-6">
        Create Account
      </h2>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-lg text-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-lg text-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-lg text-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {errorMessage && (
          <div className='mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded'>
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg bg-teal-500 text-white font-semibold hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-teal-500 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  </div>
  )
}

export default Register