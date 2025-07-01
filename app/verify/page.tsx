'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const VerifyPage = () => {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [email, setEmail] = useState(localStorage.getItem('email') || '')

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/resend-verifycodeview/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, email }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(data.message || 'Verification successful!')
        setTimeout(() => router.push('/login'), 2000)
      } else {
        setError(data.message || 'Invalid code.')
      }
    } catch (err) {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-teal-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-teal-500 mb-6 text-center">Verify Your Account</h1>

        <form onSubmit={handleVerify} className="space-y-4">
          <label htmlFor="code" className="block text-gray-700 font-medium">
            Enter Verification Code
          </label>
          <input
            id="code"
            name="code"
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-teal-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
        {success && <p className="mt-4 text-green-600 text-center">{success}</p>}
      </div>
    </div>
  )
}

export default VerifyPage
