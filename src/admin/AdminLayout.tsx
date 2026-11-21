import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Layers,
  Package,
  FolderTree,
  Image,
  ShoppingBag,
  Users,
  Tag,
  Truck,
  CreditCard,
  BarChart3,
  Settings,
  ShieldCheck,
  History,
  LogOut,
  ExternalLink,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  Search,
} from 'lucide-react'
import { useAdminAuth } from '../context/AdminAuthContext'
import { useSiteContent } from '../context/SiteContentContext'
import { useMedia } from '../context/MediaContext'
import { ADMIN_CONFIG } from '../config/adminConfig'

// Views
import { DashboardView } from './views/DashboardView'
import { HomepageEditorView } from './views/HomepageEditorView'
import { ProductsView } from './views/ProductsView'
import { CategoriesView } from './views/CategoriesView'
import { MediaLibraryView } from './views/MediaLibraryView'
import { OrdersView } from './views/OrdersView'
import { CustomersView } from './views/CustomersView'
import { DiscountsView } from './views/DiscountsView'
import { ShippingView } from './views/ShippingView'
import { PaymentsView } from './views/PaymentsView'
import { AnalyticsView } from './views/AnalyticsView'
import { WebsiteSettingsView } from './views/WebsiteSettingsView'
import { AdminUsersView } from './views/AdminUsersView'
import { ActivityLogsView } from './views/ActivityLogsView'

export type AdminViewType =
  | 'dashboard'
  | 'homepage'
  | 'products'
  | 'categories'
  | 'media'
  | 'orders'
  | 'customers'
  | 'coupons'
  | 'shipping'
  | 'payments'
  | 'analytics'
  | 'settings'
  | 'admins'
  | 'logs'

export const AdminLayout: React.FC = () => {
  const { adminUser, isAuthenticated, logout } = useAdminAuth()
  const { hasUnpublishedChanges, publishChanges, discardDraft } = useSiteContent()
  const { isMediaPickerOpen, closeMediaPicker, media, selectMediaCallback } = useMedia()
  const [currentView, setCurrentView] = useState<AdminViewType>('dashboard')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [publishSuccessMsg, setPublishSuccessMsg] = useState(false)
  const navigate = useNavigate()

  // Protect Admin Portal
  if (!isAuthenticated || !adminUser) {
    const loginTarget = window.location.pathname.startsWith('/admin') ? '/admin/login' : `${ADMIN_CONFIG.basePath}/login`
    navigate(loginTarget)
    return null
  }

  const handlePublish = () => {
    publishChanges()
    setPublishSuccessMsg(true)
    setTimeout(() => setPublishSuccessMsg(false), 4000)
  }

  const navItems: { id: AdminViewType; label: string; icon: any; count?: number }[] = [
    { id: 'dashboard', label: '1. Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'homepage', label: '2. Homepage Editor', icon: <Layers className="w-4 h-4" /> },
    { id: 'products', label: '3. Products', icon: <Package className="w-4 h-4" /> },
    { id: 'categories', label: '4. Categories', icon: <FolderTree className="w-4 h-4" /> },
    { id: 'media', label: '5. Media Library', icon: <Image className="w-4 h-4" /> },
    { id: 'orders', label: '6. Orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'customers', label: '7. Customers', icon: <Users className="w-4 h-4" /> },
    { id: 'coupons', label: '8. Discounts & Coupons', icon: <Tag className="w-4 h-4" /> },
    { id: 'shipping', label: '9. Shipping & Couriers', icon: <Truck className="w-4 h-4" /> },
    { id: 'payments', label: '10. Payments & Gateways', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'analytics', label: '11. Analytics & Profit', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: '12. Website Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'admins', label: '13. Admin Users', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'logs', label: '14. Activity Logs', icon: <History className="w-4 h-4" /> },
  ]

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView onNavigate={(view) => setCurrentView(view)} />
      case 'homepage':
        return <HomepageEditorView />
      case 'products':
        return <ProductsView />
      case 'categories':
        return <CategoriesView />
      case 'media':
        return <MediaLibraryView />
      case 'orders':
        return <OrdersView />
      case 'customers':
        return <CustomersView />
      case 'coupons':
        return <DiscountsView />
      case 'shipping':
        return <ShippingView />
      case 'payments':
        return <PaymentsView />
      case 'analytics':
        return <AnalyticsView />
      case 'settings':
        return <WebsiteSettingsView />
      case 'admins':
        return <AdminUsersView />
      case 'logs':
        return <ActivityLogsView />
      default:
        return <DashboardView onNavigate={(view) => setCurrentView(view)} />
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="h-16 bg-neutral-950 border-b border-neutral-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-1.5 text-neutral-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg tracking-widest uppercase font-light text-white">
              Your Framies
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] uppercase font-bold tracking-wider">
              Control Panel
            </span>
          </div>
        </div>

        {/* Right Status Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Live Publish Status */}
          {publishSuccessMsg && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Published to Live Website!</span>
            </div>
          )}

          {hasUnpublishedChanges ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <button
                type="button"
                onClick={handlePublish}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-md shadow-md flex items-center gap-1.5 transition-colors"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Publish Draft</span>
              </button>
              <button
                type="button"
                onClick={discardDraft}
                className="hidden lg:block text-xs text-neutral-400 hover:text-white underline"
              >
                Discard
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-neutral-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>All changes live</span>
            </div>
          )}

          {/* View Live Store */}
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 transition-colors"
          >
            <span>Preview Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Admin Profile & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
            <div className="hidden md:block text-right text-xs">
              <p className="font-semibold text-white leading-none">{adminUser.name}</p>
              <p className="text-[10px] text-amber-400 font-mono mt-0.5">{adminUser.role}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Sign Out"
              className="p-2 text-neutral-400 hover:text-red-400 transition-colors rounded-md hover:bg-neutral-800"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-16 left-0 w-64 bg-neutral-950 border-r border-neutral-800/80 p-4 space-y-1 z-20 flex flex-col justify-between overflow-y-auto transition-transform duration-200 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-widest text-neutral-500">
              Navigation Menu
            </div>
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCurrentView(item.id)
                  setMobileSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  currentView === item.id
                    ? 'bg-amber-500 text-neutral-950 shadow-md font-bold'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-neutral-800 text-[11px] text-neutral-500 px-2 space-y-1">
            <p>Admin Session: Active</p>
            <p className="text-[10px] font-mono text-neutral-600">Route: {ADMIN_CONFIG.basePath}</p>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-10 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Content Workspace */}
        <main className="flex-1 bg-neutral-900 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">{renderActiveView()}</div>
        </main>
      </div>

      {/* Global Media Picker Modal Overlay */}
      {isMediaPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-3xl w-full max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Select from Media Library
              </h3>
              <button
                type="button"
                onClick={closeMediaPicker}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {media.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (selectMediaCallback) selectMediaCallback(item.url)
                    closeMediaPicker()
                  }}
                  className="group relative aspect-square rounded-lg overflow-hidden border border-neutral-700 hover:border-amber-400 transition-colors focus:ring-2 focus:ring-amber-400"
                >
                  <img src={item.url} alt={item.altText} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold text-white">
                    Select
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
