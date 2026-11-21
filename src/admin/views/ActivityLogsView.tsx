import React, { useState } from 'react'
import {
  History,
  Search,
  Filter,
  Download,
  Shield,
  FileText,
  Calendar,
  User,
} from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'

export const ActivityLogsView: React.FC = () => {
  const { auditLogs } = useAdminAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEntity, setSelectedEntity] = useState<string>('ALL')

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.adminEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesEntity = selectedEntity === 'ALL' || log.entityType === selectedEntity

    return matchesSearch && matchesEntity
  })

  const exportCSV = () => {
    const headers = ['Timestamp', 'Admin Name', 'Admin Email', 'Action', 'Entity Type', 'Entity ID', 'Details']
    const rows = filteredLogs.map((l) => [
      l.timestamp,
      `"${l.adminName}"`,
      `"${l.adminEmail}"`,
      `"${l.action}"`,
      `"${l.entityType}"`,
      `"${l.entityId || ''}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getActionBadge = (action: string) => {
    if (action.includes('LOGIN')) {
      return <span className="bg-blue-950 text-blue-300 border border-blue-800/60 px-2 py-0.5 rounded text-[10px] font-mono">{action}</span>
    }
    if (action.includes('DELETE') || action.includes('REVOKE')) {
      return <span className="bg-red-950 text-red-300 border border-red-800/60 px-2 py-0.5 rounded text-[10px] font-mono">{action}</span>
    }
    if (action.includes('CREATE') || action.includes('PUBLISH')) {
      return <span className="bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded text-[10px] font-mono">{action}</span>
    }
    return <span className="bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded text-[10px] font-mono">{action}</span>
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif tracking-tight text-white flex items-center gap-3">
            <History className="w-6 h-6 text-neutral-300" />
            Security & Administration Audit Trail
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Immutable log of all administrative actions, catalog changes, order updates, and permission grants.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Download className="w-3.5 h-3.5" />
          Export Audit Trail (CSV)
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by admin name, action, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:border-neutral-700 outline-none"
          />
        </div>

        <select
          value={selectedEntity}
          onChange={(e) => setSelectedEntity(e.target.value)}
          className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-300 focus:border-neutral-700 outline-none"
        >
          <option value="ALL">All Entity Types</option>
          <option value="SYSTEM">SYSTEM</option>
          <option value="AUTH">AUTH</option>
          <option value="PRODUCT">PRODUCT</option>
          <option value="HOMEPAGE">HOMEPAGE</option>
          <option value="ORDER">ORDER</option>
          <option value="SHIPPING">SHIPPING</option>
          <option value="SITE_SETTINGS">SITE_SETTINGS</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400 font-medium">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Administrator</th>
                <th className="p-3">Action</th>
                <th className="p-3">Entity</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-neutral-300">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-500">
                    No activity logs match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-900/40">
                    <td className="p-3 text-neutral-400 font-mono whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-white">{log.adminName}</div>
                      <div className="text-[11px] text-neutral-500 font-mono">{log.adminEmail}</div>
                    </td>
                    <td className="p-3">{getActionBadge(log.action)}</td>
                    <td className="p-3">
                      <span className="text-neutral-400 font-mono">{log.entityType}</span>
                      {log.entityId && (
                        <span className="text-[11px] text-neutral-500 block font-mono">{log.entityId}</span>
                      )}
                    </td>
                    <td className="p-3 text-neutral-300 max-w-md truncate" title={log.details}>
                      {log.details || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
