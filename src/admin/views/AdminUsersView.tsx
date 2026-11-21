import React, { useState } from 'react'
import {
  ShieldCheck,
  UserPlus,
  Trash2,
  KeyRound,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Shield,
} from 'lucide-react'
import { useAdminAuth, AdminRole, AdminUser } from '../../context/AdminAuthContext'

export const AdminUsersView: React.FC = () => {
  const { adminUser, adminUsersList, createAdminUser, deleteAdminUser, resetAdminPassword, logAuditAction } = useAdminAuth()

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isResetOpen, setIsResetOpen] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  // New admin form
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState<AdminRole>('MANAGER')
  const [newPassword, setNewPassword] = useState('')

  // Reset pass form
  const [resetPassValue, setResetPassValue] = useState('')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !newEmail || !newPassword) {
      setFeedback({ msg: 'All fields are required.', type: 'error' })
      return
    }

    const res = await createAdminUser(newName, newEmail, newRole, newPassword)
    if (res.success) {
      setFeedback({ msg: `Administrator "${newName}" created successfully.`, type: 'success' })
      setIsAddOpen(false)
      setNewName('')
      setNewEmail('')
      setNewPassword('')
    } else {
      setFeedback({ msg: res.message || 'Failed to create administrator.', type: 'error' })
    }
    setTimeout(() => setFeedback(null), 4000)
  }

  const handleDelete = (id: string, name: string) => {
    if (adminUsersList.length <= 1) {
      alert('Cannot delete the last remaining administrator.')
      return
    }
    if (id === adminUser?.id) {
      alert('You cannot delete your own active administrator account.')
      return
    }

    if (window.confirm(`Are you sure you want to revoke admin access for "${name}"?`)) {
      deleteAdminUser(id)
      setFeedback({ msg: `Admin user "${name}" access revoked.`, type: 'success' })
      setTimeout(() => setFeedback(null), 4000)
    }
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isResetOpen || !resetPassValue) return

    resetAdminPassword(isResetOpen, resetPassValue)
    setFeedback({ msg: 'Password updated successfully.', type: 'success' })
    setIsResetOpen(null)
    setResetPassValue('')
    setTimeout(() => setFeedback(null), 4000)
  }

  const getRoleBadge = (role: AdminRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <span className="bg-purple-950 text-purple-300 border border-purple-800/60 px-2 py-0.5 rounded text-xs font-mono">SUPER_ADMIN</span>
      case 'MANAGER':
        return <span className="bg-blue-950 text-blue-300 border border-blue-800/60 px-2 py-0.5 rounded text-xs font-mono">MANAGER</span>
      case 'SUPPORT':
        return <span className="bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded text-xs font-mono">SUPPORT</span>
    }
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif tracking-tight text-white flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
            Privileged Administrators & Role Permissions
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Manage authenticated team members with access to Your Framies private control portal.
          </p>
        </div>

        {adminUser?.role === 'SUPER_ADMIN' && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-white hover:bg-neutral-200 text-neutral-950 text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <UserPlus className="w-4 h-4" />
            Invite Administrator
          </button>
        )}
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-lg text-xs flex items-center gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/60 border border-red-500/40 text-red-300'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Role Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="text-purple-400 font-mono text-xs font-bold mb-1">SUPER_ADMIN</div>
          <p className="text-xs text-neutral-400">
            Unrestricted access: catalog, orders, shipping, payment secrets, admin team management, and audit logs.
          </p>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="text-blue-400 font-mono text-xs font-bold mb-1">STORE_MANAGER</div>
          <p className="text-xs text-neutral-400">
            Product catalog management, visual homepage editor, coupons, media uploads, and order dispatching.
          </p>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
          <div className="text-emerald-400 font-mono text-xs font-bold mb-1">SUPPORT_AGENT</div>
          <p className="text-xs text-neutral-400">
            View orders, check courier tracking and customer inquiries with read-only security permissions.
          </p>
        </div>
      </div>

      {/* Admin Users Table */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-900 border-b border-neutral-800 text-xs text-neutral-400">
            <tr>
              <th className="p-4">Administrator</th>
              <th className="p-4">Assigned Role</th>
              <th className="p-4">2FA Protection</th>
              <th className="p-4">Last Login</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800 text-neutral-300">
            {adminUsersList.map((user) => (
              <tr key={user.id} className="hover:bg-neutral-900/40">
                <td className="p-4">
                  <div className="font-medium text-white flex items-center gap-2">
                    {user.name}
                    {user.id === adminUser?.id && (
                      <span className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded">You</span>
                    )}
                  </div>
                  <div className="text-xs text-neutral-400 font-mono">{user.email}</div>
                </td>
                <td className="p-4">{getRoleBadge(user.role)}</td>
                <td className="p-4">
                  {user.twoFactorEnabled ? (
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Enabled
                    </span>
                  ) : (
                    <span className="text-xs text-neutral-500">Disabled</span>
                  )}
                </td>
                <td className="p-4 text-xs text-neutral-400">
                  {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('en-IN') : 'Never'}
                </td>
                <td className="p-4 text-right space-x-2">
                  {adminUser?.role === 'SUPER_ADMIN' && (
                    <>
                      <button
                        onClick={() => setIsResetOpen(user.id)}
                        title="Reset Password"
                        className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition"
                      >
                        <KeyRound className="w-4 h-4" />
                      </button>
                      {user.id !== adminUser?.id && (
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          title="Revoke Administrator"
                          className="p-1.5 text-neutral-400 hover:text-red-400 rounded hover:bg-neutral-800 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Admin Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-medium text-white">Invite New Administrator</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-white"
                  placeholder="e.g. Priya Sharma"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-white"
                  placeholder="priya@yourframies.com"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Role Permissions</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as AdminRole)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-white"
                >
                  <option value="MANAGER">MANAGER (Catalog, Content & Orders)</option>
                  <option value="SUPPORT">SUPPORT (Orders & Courier Tracking)</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Full Store Permissions)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Initial Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-white"
                  placeholder="Minimum 8 characters"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-white hover:bg-neutral-200 text-neutral-950 font-medium px-4 py-2 rounded text-xs transition"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {isResetOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-base font-medium text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400" />
              Reset Administrator Password
            </h3>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={resetPassValue}
                  onChange={(e) => setResetPassValue(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-white"
                  placeholder="Enter strong password"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetOpen(null)}
                  className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-white hover:bg-neutral-200 text-neutral-950 font-medium px-4 py-2 rounded text-xs transition"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
