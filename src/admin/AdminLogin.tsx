import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, ShieldAlert, KeyRound, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useAdminAuth } from '../context/AdminAuthContext'
import { ADMIN_CONFIG } from '../config/adminConfig'

export const AdminLogin: React.FC = () => {
  const { login, isLockedOut, lockoutRemainingSeconds } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setIsLoading(true)

    const res = await login(email, password, twoFactorCode)
    setIsLoading(false)

    if (res.success) {
      const target = window.location.pathname.startsWith('/admin') ? '/admin' : ADMIN_CONFIG.basePath
      navigate(target)
    } else {
      setErrorMsg(res.message || 'Authentication failed.')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-4 selection:bg-amber-500 selection:text-black">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-amber-600/30 to-neutral-700/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-md w-full">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 sm:p-10 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-3">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <span className="text-[10px] tracking-widest uppercase font-bold text-amber-500">
              Restricted Operations Gateway
            </span>
            <h1 className="font-serif text-2xl font-light tracking-wide text-white">
              Your Framies Admin
            </h1>
            <p className="text-xs text-neutral-400">
              Sign in with your administrator email and password.
            </p>
          </div>

          {/* Lockout Banner */}
          {isLockedOut && (
            <div className="p-4 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-lg flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <p className="font-bold">Security Lockout Active</p>
                <p className="text-[11px] text-red-300 mt-0.5">
                  Too many failed attempts. Login is frozen for {lockoutRemainingSeconds}s.
                </p>
              </div>
            </div>
          )}

          {errorMsg && !isLockedOut && (
            <div className="p-3 bg-red-900/40 border border-red-700 text-red-200 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  required
                  disabled={isLockedOut}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-amber-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Master Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={isLockedOut}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-amber-500 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-neutral-500 hover:text-neutral-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Two-Factor Code (Optional)
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  maxLength={6}
                  disabled={isLockedOut}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="6-digit authenticator code if enabled"
                  className="w-full pl-9 pr-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-amber-500 focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLockedOut || isLoading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold uppercase tracking-widest text-xs rounded-lg shadow-lg shadow-amber-500/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying Session...' : 'Authenticate & Enter'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[11px] text-neutral-500">
          Your Framies Operations • Secure Administrator Access
        </p>
      </div>
    </div>
  )
}
