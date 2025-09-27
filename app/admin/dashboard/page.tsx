'use client'

import { Button, Card } from '@/components/ui'
import { Store } from '@/lib/types'
import { Plus, Settings, Store as StoreIcon, Users } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalStores: 0,
    activeStores: 0,
    totalCategories: 0,
    totalAreas: 0
  })
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchStats()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/me')
      if (!response.ok) {
        router.push('/admin/login')
        return
      }
      const data = await response.json()
      setAdmin(data.admin)
    } catch (error) {
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const [storesRes, categoryTagsRes, areasRes] = await Promise.all([
        fetch('/api/admin/stores'),
        fetch('/api/category-tags'),
        fetch('/api/areas')
      ])

      const storesData = await storesRes.json()
      const categoryTagsData = await categoryTagsRes.json()
      const areasData = await areasRes.json()

      setStats({
        totalStores: storesData.data?.pagination?.total || 0,
        activeStores: storesData.data?.stores?.filter((s: Store) => s.is_active).length || 0,
        totalCategories: categoryTagsData.data?.category_tags?.length || 0,
        totalAreas: areasData.data?.areas?.length || 0
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <StoreIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">総書店数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStores}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <StoreIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">アクティブ書店</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeStores}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">カテゴリタグ数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">エリア数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAreas}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="text-center">
              <Plus className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">書店を追加</h3>
              <p className="text-sm text-gray-600 mb-4">新しい書店を登録します</p>
              <Link href="/admin/stores/new">
                <Button className="w-full">書店を追加</Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-center">
              <StoreIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">書店一覧</h3>
              <p className="text-sm text-gray-600 mb-4">登録済み書店を管理します</p>
              <Link href="/admin/stores">
                <Button variant="outline" className="w-full">書店一覧</Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-center">
              <Settings className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">設定</h3>
              <p className="text-sm text-gray-600 mb-4">カテゴリ・エリアを管理します</p>
              <Link href="/admin/settings">
                <Button variant="outline" className="w-full">設定</Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
