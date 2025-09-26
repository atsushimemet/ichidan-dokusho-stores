'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui'

export function Header() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAdminStatus()
  }, [])

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/admin/me')
      setIsAdmin(response.ok)
    } catch (error) {
      console.error('Error checking admin status:', error)
      setIsAdmin(false)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      setIsAdmin(false)
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              一段読書
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              ホーム
            </Link>
            <Link 
              href="/stores" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              書店一覧
            </Link>
            {isAdmin && (
              <Link 
                href="/admin/dashboard" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                管理画面
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : isAdmin ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">管理者</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                >
                  ログアウト
                </Button>
              </div>
            ) : (
              <Link href="/admin/login">
                <Button variant="outline" size="sm">
                  管理者ログイン
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
