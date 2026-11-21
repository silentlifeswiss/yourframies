import React, { createContext, useContext, useState, useEffect } from 'react'
import { Address, User } from '../types'

interface AuthContextType {
  user: User | null
  addresses: Address[]
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>
  register: (name: string, email: string, phone: string, password?: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  addAddress: (address: Address) => void
  deleteAddress: (id: string) => void
  setDefaultAddress: (id: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const USER_STORAGE_KEY = 'yourframies_user'
const ADDR_STORAGE_KEY = 'yourframies_addresses'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [addresses, setAddresses] = useState<Address[]>(() => {
    try {
      const stored = localStorage.getItem(ADDR_STORAGE_KEY)
      return stored
        ? JSON.parse(stored)
        : [
            {
              id: 'addr-default',
              fullName: 'Shaurya Prakash',
              phone: '9876543210',
              addressLine1: 'B-402, Skyline Residency, Outer Ring Road',
              addressLine2: 'Near Bellandur Flyover',
              landmark: 'Opposite Ecospace Tech Park',
              city: 'Bengaluru',
              state: 'Karnataka',
              pincode: '560103',
              isDefault: true,
            },
          ]
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
      } else {
        localStorage.removeItem(USER_STORAGE_KEY)
      }
    } catch {
      // Ignore
    }
  }, [user])

  useEffect(() => {
    try {
      localStorage.setItem(ADDR_STORAGE_KEY, JSON.stringify(addresses))
    } catch {
      // Ignore
    }
  }, [addresses])

  const login = async (email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase()

    // Test Admin Account
    if (cleanEmail === 'admin@yourframies.com' || cleanEmail === 'admin') {
      const adminUser: User = {
        id: 'usr-admin-01',
        name: 'Store Admin',
        email: 'admin@yourframies.com',
        phone: '9999999999',
        role: 'ADMIN',
        isPhoneVerified: true,
        createdAt: new Date().toISOString(),
      }
      setUser(adminUser)
      return { success: true }
    }

    // Standard Customer Account
    const customerUser: User = {
      id: `usr-${Date.now()}`,
      name: cleanEmail.split('@')[0].toUpperCase(),
      email: cleanEmail,
      phone: '9876543210',
      role: 'CUSTOMER',
      isPhoneVerified: true,
      createdAt: new Date().toISOString(),
    }
    setUser(customerUser)
    return { success: true }
  }

  const register = async (name: string, email: string, phone: string) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email: email.trim().toLowerCase(),
      phone,
      role: 'CUSTOMER',
      isPhoneVerified: true,
      createdAt: new Date().toISOString(),
    }
    setUser(newUser)
    return { success: true }
  }

  const logout = () => {
    setUser(null)
  }

  const addAddress = (address: Address) => {
    const newAddr: Address = {
      ...address,
      id: `addr-${Date.now()}`,
      isDefault: addresses.length === 0,
    }
    setAddresses((prev) => [...prev, newAddr])
  }

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id))
  }

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        addresses,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        login,
        register,
        logout,
        addAddress,
        deleteAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
