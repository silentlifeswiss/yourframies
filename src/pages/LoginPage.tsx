import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const res = await login(email, password)
    if (res.success) {
      if (email.trim().toLowerCase() === 'admin@yourframies.com') {
        navigate('/admin')
      } else {
        navigate('/account')
      }
    } else {
      setError(res.message || 'Login failed. Please verify credentials.')
    }
  }

  const handleQuickDemo = (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      setEmail('admin@yourframies.com')
      setPassword('admin123')
    } else {
      setEmail('shaurya@example.com')
      setPassword('customer123')
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
            <h1 className="text-lg font-semibold text-neutral-800 mt-2">Welcome Back</h1>
            <p className="text-xs text-neutral-500 mt-1">
              Sign in to manage your saved addresses, custom artwork, and orders.
            </p>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-700 text-xs rounded">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-neutral-700">Password</label>
                <a href="#forgot" className="text-[11px] text-neutral-500 hover:text-black">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-black outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-semibold rounded shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials for Reviewers */}
          <div className="pt-4 border-t border-neutral-100 text-center">
            <span className="text-[10px] text-neutral-400 uppercase font-semibold">
              Instant Demo Fill
            </span>
            <div className="flex gap-2 justify-center mt-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('customer')}
                className="px-3 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded font-medium flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Customer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="px-3 py-1.5 text-xs bg-neutral-900 text-white rounded font-medium flex items-center gap-1.5 hover:bg-neutral-800"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Store Admin
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-neutral-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-neutral-900 underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
