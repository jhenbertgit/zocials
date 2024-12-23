'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { User } from '../payload-types'
import SearchOverlay from './SearchOverlay'

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/users/me')
        if (response.ok) {
          const user = await response.json()
          setCurrentUser(user)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/users/logout', { method: 'POST' })
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <>
      <nav className="bg-gray-900 border-b border-gray-800 fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left section */}
            <div className="flex items-center gap-4">
              <Link href="/home" className="text-2xl font-bold text-orange-500">
                zocials
              </Link>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-300 hover:text-orange-500 hover:bg-white/5 rounded-full transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Center section - Navigation links */}
            <div className="flex items-center space-x-1">
              <Link
                href="/home"
                className={`px-6 py-2 rounded-lg ${
                  pathname === '/home'
                    ? 'bg-gray-800 text-orange-500'
                    : 'hover:bg-white/5 text-gray-300'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </Link>

              {currentUser && (
                <Link
                  href={`/profile/${currentUser.username}`}
                  className={`px-6 py-2 rounded-lg ${
                    pathname.startsWith('/profile')
                      ? 'bg-gray-800 text-orange-500'
                      : 'hover:bg-white/5 text-gray-300'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </Link>
              )}

              <Link
                href="/upload"
                className={`px-6 py-2 rounded-lg ${
                  pathname === '/upload'
                    ? 'bg-gray-800 text-orange-500'
                    : 'bg-purple-500/20 backdrop-blur-sm text-white hover:bg-purple-600/30 border border-purple-500/30'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </Link>
            </div>

            {/* Right section - Logout */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
