'use client'

import { Button, Card } from '@/components/ui'
import { Area, Category } from '@/lib/types'
import { ArrowLeft, Edit, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'categories' | 'areas'>('categories')
  const [categories, setCategories] = useState<Category[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [categoriesRes, areasRes] = await Promise.all([
        fetch('/api/admin/categories'),
        fetch('/api/admin/areas')
      ])
      
      const categoriesData = await categoriesRes.json()
      const areasData = await areasRes.json()
      
      setCategories(categoriesData)
      setAreas(areasData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setError('データの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('このカテゴリを削除しますか？')) return

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setCategories(prev => prev.filter(cat => cat.id !== id))
      } else {
        const data = await response.json()
        alert(data.error || '削除に失敗しました')
      }
    } catch (error) {
      alert('ネットワークエラーが発生しました')
    }
  }

  const handleDeleteArea = async (id: number) => {
    if (!confirm('このエリアを削除しますか？')) return

    try {
      const response = await fetch(`/api/admin/areas/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setAreas(prev => prev.filter(area => area.id !== id))
      } else {
        const data = await response.json()
        alert(data.error || '削除に失敗しました')
      }
    } catch (error) {
      alert('ネットワークエラーが発生しました')
    }
  }

  const toggleCategoryStatus = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !isActive })
      })

      if (response.ok) {
        setCategories(prev => prev.map(cat => 
          cat.id === id ? { ...cat, is_active: !isActive } : cat
        ))
      } else {
        const data = await response.json()
        alert(data.error || '更新に失敗しました')
      }
    } catch (error) {
      alert('ネットワークエラーが発生しました')
    }
  }

  const toggleAreaStatus = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/areas/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !isActive })
      })

      if (response.ok) {
        setAreas(prev => prev.map(area => 
          area.id === id ? { ...area, is_active: !isActive } : area
        ))
      } else {
        const data = await response.json()
        alert(data.error || '更新に失敗しました')
      }
    } catch (error) {
      alert('ネットワークエラーが発生しました')
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Button>
            <h1 className="text-xl font-bold text-gray-900">設定</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'categories'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              カテゴリ管理
            </button>
            <button
              onClick={() => setActiveTab('areas')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'areas'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              エリア管理
            </button>
          </nav>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">カテゴリ管理</h2>
              <Button onClick={() => router.push('/admin/settings/categories/new')}>
                <Plus className="h-4 w-4 mr-2" />
                カテゴリを追加
              </Button>
            </div>

            <Card className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        カテゴリ名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        表示名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        説明
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        並び順
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ステータス
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr key={category.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {category.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {category.display_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {category.description || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {category.sort_order}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            category.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {category.is_active ? 'アクティブ' : '非アクティブ'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/admin/settings/categories/${category.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleCategoryStatus(category.id, category.is_active)}
                          >
                            {category.is_active ? '無効化' : '有効化'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Areas Tab */}
        {activeTab === 'areas' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">エリア管理</h2>
              <Button onClick={() => router.push('/admin/settings/areas/new')}>
                <Plus className="h-4 w-4 mr-2" />
                エリアを追加
              </Button>
            </div>

            <Card className="p-6">
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
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {areas.map((area) => (
                      <tr key={area.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {area.name}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
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
                            onClick={() => toggleAreaStatus(area.id, area.is_active)}
                          >
                            {area.is_active ? '無効化' : '有効化'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteArea(area.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
