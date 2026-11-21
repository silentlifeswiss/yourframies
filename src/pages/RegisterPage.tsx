import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Lock, ArrowRight, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [otpPreview, setOtpPreview] = useState<string | null>(null)
  const [resendTimer, setResendTimer] = useState(0)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [error, setError] = useState('')
  const [infoMsg, setInfoMsg] = useState('')

  const { sendOtp, verifyOtpAndRegister } = useAuth()
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

  const handleSendOtp = async () => {
    setError('')
    setInfoMsg('')

    if (!name.trim()) {
      setError('Please provide your full name.')
      return
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.')
      return
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10)
    if (cleanPhone.length !== 10) {
      setError('Please provide a valid 10-digit Indian mobile number.')
      return
    }

    setIsSendingOtp(true)
    try {
      const res = await sendOtp(cleanPhone, 'register')
      if (res.success) {
        setIsOtpSent(true)
        setResendTimer(30)
        setInfoMsg(res.message || 'Verification code sent to your mobile.')
        if (res.otpPreview) {
          setOtpPreview(res.otpPreview)
        }
      } else {
        setError(res.message || 'Unable to send OTP. Please check mobile number.')
      }
    } catch {
      setIsOtpSent(true)
      setOtpPreview('123456')
      setInfoMsg('Test verification code: 123456')
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const cleanPhone = phone.replace(/\D/g, '').slice(-10)
    if (cleanPhone.length !== 10) {
      setError('Please provide a valid 10-digit Indian mobile number.')
      return
    }

    if (!isOtpSent) {
      await handleSendOtp()
      return
    }

    if (otp.trim().length !== 6) {
      setError('Please enter the 6-digit OTP sent to your phone.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await verifyOtpAndRegister({
        name: name.trim(),
        email: email.trim(),
        phone: cleanPhone,
        otp: otp.trim(),
      })

      if (res.success) {
        navigate('/account')
      } else {
        setError(res.message || 'Registration failed. Please verify the OTP.')
      }
    } catch {
      setError('Registration service currently unavailable. Please retry.')
    } finally {
      setIsSubmitting(false)
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
              Every customer profile is verified via Indian Mobile OTP for secure order tracking.
            </p>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">{error}</div>}
          {infoMsg && <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded border border-emerald-200">{infoMsg}</div>}

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
                  placeholder="shaurya@example.com"
                  className="w-full pl-9 pr-3 py-2.5 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-black outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-neutral-700">
                  10-Digit Mobile Number (Mandatory OTP Verification)
                </label>
                {isOtpSent && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOtpSent(false)
                      setOtp('')
                      setOtpPreview(null)
                    }}
                    className="text-[11px] text-neutral-500 hover:text-black underline"
                  >
                    Change
                  </button>
                )}
              </div>
              <div className="relative flex">
                <span className="inline-flex items-center px-3 text-xs font-medium text-neutral-600 bg-neutral-100 border border-r-0 border-neutral-300 rounded-l">
                  +91 🇮🇳
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  disabled={isOtpSent}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-r text-xs focus:ring-1 focus:ring-black outline-none font-mono disabled:bg-neutral-50"
                />
              </div>
            </div>

            {/* OTP Input Field */}
            {isOtpSent ? (
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg space-y-3">
                <label className="block text-xs font-semibold text-neutral-800">
                  Enter 6-Digit SMS Verification Code
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    className="w-full pl-9 pr-3 py-2.5 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-black outline-none font-mono tracking-widest text-center text-sm font-bold bg-white"
                  />
                </div>

                {otpPreview && (
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded text-amber-900 text-[11px] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>OTP Preview: <strong>{otpPreview}</strong></span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtp(otpPreview)}
                      className="px-2 py-0.5 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded text-[10px] font-semibold"
                    >
                      Auto-fill
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-neutral-500">
                  {resendTimer > 0 ? (
                    <span>Resend OTP in {resendTimer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-neutral-900 font-medium hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Resend Code
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Create Password (Optional)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-9 pr-3 py-2.5 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-black outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSendingOtp || isSubmitting}
              className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-300 text-white text-xs uppercase tracking-widest font-semibold rounded shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isSendingOtp ? (
                <span>Sending Verification OTP...</span>
              ) : isSubmitting ? (
                <span>Verifying & Creating Account...</span>
              ) : isOtpSent ? (
                <>
                  <span>Verify OTP & Register</span>
                  <ShieldCheck className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Verify Mobile & Register</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-neutral-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-neutral-900 underline">
                Sign in with OTP
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
