'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Tag, MapPin, Plus, Edit, Trash2 } from 'lucide-react'
import { Button, Card, CardContent } from '@/components/ui'
import { Area, CategoryTag } from '@/lib/types'

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'category-tags' | 'areas'>('category-tags')
  const [areas, setAreas] = useState<Area[]>([])
  const [categoryTags, setCategoryTags] = useState<CategoryTag[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchAreas()
    fetchCategoryTags()
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
    }
  }

  const fetchCategoryTags = async () => {
    try {
      const response = await fetch('/api/admin/category-tags')
      if (response.ok) {
        const data = await response.json()
        setCategoryTags(data.data.category_tags || [])
      }
    } catch (error) {
      console.error('Error fetching category tags:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategoryTag = async (tagId: number) => {
    if (!confirm('このカテゴリタグを削除しますか？')) return

    try {
      const response = await fetch(`/api/admin/category-tags/${tagId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setCategoryTags(categoryTags.filter(tag => tag.id !== tagId))
      } else {
        const error = await response.json()
        alert(`削除に失敗しました: ${error.error?.message}`)
      }
    } catch (error) {
      console.error('Error deleting category tag:', error)
      alert('削除に失敗しました')
    }
  }

  const handleDeleteArea = async (areaId: number) => {
    if (!confirm('このエリアを削除しますか？')) return

    try {
      const response = await fetch(`/api/admin/areas/${areaId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setAreas(areas.filter(area => area.id !== areaId))
      } else {
        const error = await response.json()
        alert(`削除に失敗しました: ${error.error?.message}`)
      }
    } catch (error) {
      console.error('Error deleting area:', error)
      alert('削除に失敗しました')
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
            {/* アクションボタン */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">カテゴリタグ管理</h2>
              <Button
                onClick={() => router.push('/admin/settings/category-tags/new')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                新規登録
              </Button>
            </div>

            {/* カテゴリタグ一覧 */}
            <div className="bg-white shadow rounded-lg">
              {categoryTags.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">登録されたカテゴリタグがありません</p>
                  <Button
                    onClick={() => router.push('/admin/settings/category-tags/new')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    最初のカテゴリタグを作成
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          表示名
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          識別子
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ステータス
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          登録日
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {categoryTags.map((tag) => (
                        <tr key={tag.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {tag.display_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {tag.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              tag.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {tag.is_active ? 'アクティブ' : '非アクティブ'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(tag.created_at).toLocaleDateString('ja-JP')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/admin/settings/category-tags/${tag.id}/edit`)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteCategoryTag(tag.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 統計情報 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                      <span className="text-green-600 font-semibold">総</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">総カテゴリタグ数</p>
                    <p className="text-2xl font-semibold text-gray-900">{categoryTags.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">活</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">アクティブ</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {categoryTags.filter(tag => tag.is_active).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'areas' && (
          <div className="space-y-6">
            {/* アクションボタン */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">エリア管理</h2>
              <Button
                onClick={() => router.push('/admin/settings/areas/new')}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                新規登録
              </Button>
            </div>

            {/* エリア一覧 */}
            <div className="bg-white shadow rounded-lg">
              {areas.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">登録されたエリアがありません</p>
                  <Button
                    onClick={() => router.push('/admin/settings/areas/new')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    最初のエリアを作成
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          エリア名
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          都道府県
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          並び順
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ステータス
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          登録日
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {areas.map((area) => (
                        <tr key={area.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {area.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {area.prefecture}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {area.sort_order}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              area.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {area.is_active ? 'アクティブ' : '非アクティブ'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(area.created_at).toLocaleDateString('ja-JP')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/admin/settings/areas/${area.id}/edit`)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteArea(area.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 統計情報 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                      <span className="text-green-600 font-semibold">総</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">総エリア数</p>
                    <p className="text-2xl font-semibold text-gray-900">{areas.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">活</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">アクティブ</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {areas.filter(area => area.is_active).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}