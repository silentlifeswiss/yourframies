import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, Phone, ArrowRight, ShieldCheck, KeyRound, RefreshCw, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export const LoginPage: React.FC = () => {
  const [loginMode, setLoginMode] = useState<'otp' | 'password'>('otp')
  
  // Mobile OTP State
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpStep, setOtpStep] = useState<'phone' | 'code'>('phone')
  const [resendTimer, setResendTimer] = useState(0)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  // Password Login State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [infoMsg, setInfoMsg] = useState('')

  const { login, sendOtp, verifyOtpAndLogin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    let interval: any
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  // Handle Mobile OTP Dispatch
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError('')
    setInfoMsg('')

    const cleanPhone = phone.replace(/\D/g, '').slice(-10)
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number.')
      return
    }

    setIsSendingOtp(true)
    try {
      const res = await sendOtp(cleanPhone, 'login')
      if (res.success) {
        setOtpStep('code')
        setResendTimer(30)
        setInfoMsg(res.message || 'OTP sent successfully.')
      } else {
        setError(res.message || 'Unable to send OTP. Please try again.')
      }
    } catch {
      setError('Connection error while sending OTP. Please try again.')
    } finally {
      setIsSendingOtp(false)
    }
  }

  // Handle Mobile OTP Verification & Sign In
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const cleanOtp = otp.trim()
    if (cleanOtp.length !== 6) {
      setError('Please enter the 6-digit verification code.')
      return
    }

    setIsVerifying(true)
    try {
      const res = await verifyOtpAndLogin(phone, cleanOtp)
      if (res.success) {
        if (phone.replace(/\D/g, '').slice(-10) === '9999999999') {
          navigate('/admin')
        } else {
          navigate('/account')
        }
      } else {
        setError(res.message || 'Verification failed. Please check the OTP.')
      }
    } catch {
      setError('Verification service unavailable. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  // Handle Classic Password Login
  const handlePasswordSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="bg-neutral-50 min-h-screen py-16 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
          <div className="text-center">
            <span className="font-serif text-2xl tracking-widest uppercase text-neutral-900">
              Your Framies
            </span>
            <h1 className="text-lg font-semibold text-neutral-800 mt-2">Sign In</h1>
            <p className="text-xs text-neutral-500 mt-1">
              Access your saved addresses, custom photo frames, and active shipments.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-neutral-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setLoginMode('otp')
                setError('')
              }}
              className={`flex-1 py-2.5 text-center transition-all border-b-2 flex items-center justify-center gap-1.5 ${
                loginMode === 'otp'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Mobile OTP (Instant)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode('password')
                setError('')
              }}
              className={`flex-1 py-2.5 text-center transition-all border-b-2 flex items-center justify-center gap-1.5 ${
                loginMode === 'password'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Password / Director</span>
            </button>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">{error}</div>}
          {infoMsg && <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded border border-emerald-200">{infoMsg}</div>}

          {/* 1. Mobile OTP Authentication Flow */}
          {loginMode === 'otp' && (
            <div className="space-y-4">
              {otpStep === 'phone' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      10-Digit Mobile Number
                    </label>
                    <div className="relative flex">
                      <span className="inline-flex items-center px-3 text-xs font-medium text-neutral-600 bg-neutral-100 border border-r-0 border-neutral-300 rounded-l">
                        +91 🇮🇳
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="w-full px-3 py-2.5 border border-neutral-300 rounded-r text-xs focus:ring-1 focus:ring-black outline-none font-mono"
                      />
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      We'll dispatch a 6-digit one-time verification password via SMS.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={phone.length < 10 || isSendingOtp}
                    className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-300 text-white text-xs uppercase tracking-widest font-semibold rounded shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>{isSendingOtp ? 'Sending Code...' : 'Send OTP'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-neutral-700">
                        Enter 6-Digit OTP
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpStep('phone')
                          setOtp('')
                        }}
                        className="text-[11px] text-neutral-500 hover:text-black underline"
                      >
                        Change (+91 {phone})
                      </button>
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••••"
                        className="w-full pl-9 pr-3 py-2.5 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-black outline-none tracking-widest font-mono text-center text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    {resendTimer > 0 ? (
                      <span>Resend OTP in {resendTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSendOtp()}
                        className="text-neutral-900 font-medium hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={otp.length !== 6 || isVerifying}
                    className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-300 text-white text-xs uppercase tracking-widest font-semibold rounded shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>{isVerifying ? 'Verifying...' : 'Verify & Sign In'}</span>
                    <ShieldCheck className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* 2. Password Authentication Flow */}
          {loginMode === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
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
                    placeholder="admin@yourframies.com"
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
          )}

          <div className="text-center pt-2">
            <p className="text-xs text-neutral-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-neutral-900 underline">
                Create one with Mobile OTP
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
