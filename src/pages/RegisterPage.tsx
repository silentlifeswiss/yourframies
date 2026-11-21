import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.length < 10) {
      setError('Please provide a valid 10-digit Indian mobile number.')
      return
    }

    const res = await register(name, email, phone, password)
    if (res.success) {
      navigate('/account')
    } else {
      setError(res.message || 'Registration failed.')
    }
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-16 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
          <div className="text-center">
            <span className="font-serif text-2xl tracking-widest uppercase text-neutral-900">
              Your Framies
            </span>
            <h1 className="text-lg font-semibold text-neutral-800 mt-2">Create an Account</h1>
            <p className="text-xs text-neutral-500 mt-1">
              Save your custom frames, store addresses, and track real-time orders.
            </p>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-700 text-xs rounded">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Shaurya Prakash"
                  className="w-full pl-9 pr-3 py-2.5 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-black outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-9 pr-3 py-2.5 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-black outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                10-Digit Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full pl-9 pr-3 py-2.5 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-black outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-9 pr-3 py-2.5 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-black outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-semibold rounded shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Register</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-neutral-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-neutral-900 underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
