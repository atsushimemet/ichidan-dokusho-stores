'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Tag, MapPin } from 'lucide-react'
import { Button, Card, CardContent } from '@/components/ui'
import { Area } from '@/lib/types'

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'category-tags' | 'areas'>('category-tags')
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchAreas()
  }, [])

  const fetchAreas = async () => {
    try {
      const response = await fetch('/api/areas')
      if (response.ok) {
        const data = await response.json()
        setAreas(data.data.areas || [])
      }
    } catch (error) {
      console.error('Error fetching areas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">読み込み中...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">設定</h1>
          </div>
          <p className="mt-2 text-gray-600">カテゴリタグ・エリアを管理します</p>
        </div>

        {/* タブナビゲーション */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('category-tags')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'category-tags'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Tag className="w-4 h-4 inline mr-2" />
              カテゴリタグ管理
            </button>
            <button
              onClick={() => setActiveTab('areas')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'areas'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MapPin className="w-4 h-4 inline mr-2" />
              エリア管理
            </button>
          </nav>
        </div>

        {/* タブコンテンツ */}
        {activeTab === 'category-tags' && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Tag className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    カテゴリタグ管理
                  </h3>
                  <p className="text-gray-600 mb-6">
                    書店に付与するカテゴリタグを管理します。複数のタグを書店に設定できます。
                  </p>
                  <div className="space-y-4">
                    <Button
                      onClick={() => router.push('/admin/settings/category-tags')}
                      className="w-full"
                    >
                      カテゴリタグ一覧
                    </Button>
                    <Button
                      onClick={() => router.push('/admin/settings/category-tags/new')}
                      variant="outline"
                      className="w-full"
                    >
                      新規カテゴリタグ登録
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'areas' && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    エリア管理
                  </h3>
                  <p className="text-gray-600 mb-6">
                    書店の所在地となるエリアを管理します。
                  </p>
                  <div className="space-y-4">
                    <Button
                      onClick={() => router.push('/admin/settings/areas')}
                      className="w-full"
                    >
                      エリア一覧
                    </Button>
                    <Button
                      onClick={() => router.push('/admin/settings/areas/new')}
                      variant="outline"
                      className="w-full"
                    >
                      新規エリア登録
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}