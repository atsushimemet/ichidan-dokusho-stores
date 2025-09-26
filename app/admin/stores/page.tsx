'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, ArrowLeft, Search } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { Store, Category, Area } from '@/lib/types'

export default function AdminStoresPage() {
  const router = useRouter()
  const [stores, setStores] = useState<Store[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredStores, setFilteredStores] = useState<Store[]>([])

  useEffect(() => {
    fetchStores()
    fetchCategories()
    fetchAreas()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = stores.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredStores(filtered)
    } else {
      setFilteredStores(stores)
    }
  }, [stores, searchTerm])

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/admin/stores')
      if (response.ok) {
        const data = await response.json()
        console.log('Stores API response:', data)
        setStores(data.data.stores || [])
      }
    } catch (error) {
      console.error('Error fetching stores:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        console.log('Categories API response:', data)
        setCategories(data.data.categories || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchAreas = async () => {
    try {
      const response = await fetch('/api/areas')
      if (response.ok) {
        const data = await response.json()
        console.log('Areas API response:', data)
        setAreas(data.data.areas || [])
      }
    } catch (error) {
      console.error('Error fetching areas:', error)
    }
  }

  const handleDelete = async (storeId: string) => {
    if (!confirm('この書店を削除しますか？')) return

    try {
      const response = await fetch(`/api/admin/stores/${storeId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setStores(stores.filter(store => store.id !== storeId))
        setFilteredStores(filteredStores.filter(store => store.id !== storeId))
      } else {
        const error = await response.json()
        alert(`削除に失敗しました: ${error.message}`)
      }
    } catch (error) {
      console.error('Error deleting store:', error)
      alert('削除に失敗しました')
    }
  }

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId)
    console.log('Getting category name for ID:', categoryId, 'Found:', category)
    return category?.display_name || '不明'
  }

  const getAreaName = (areaId: number) => {
    const area = areas.find(a => a.id === areaId)
    console.log('Getting area name for ID:', areaId, 'Found:', area)
    return area?.name || '不明'
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
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="outline"
                onClick={() => router.push('/admin/dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                戻る
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">書店管理</h1>
            </div>
            <Button
              onClick={() => router.push('/admin/stores/new')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              新規登録
            </Button>
          </div>
        </div>

        {/* 検索バー */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="書店名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* 書店一覧 */}
        <div className="bg-white shadow rounded-lg">
          {filteredStores.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchTerm ? '検索結果が見つかりません' : '登録された書店がありません'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      書店名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      エリア
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      カテゴリ
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
                  {filteredStores.map((store) => (
                    <tr key={store.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {store.name}
                        </div>
                        {store.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {store.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getAreaName(store.area_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getCategoryName(store.category_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          store.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {store.is_active ? 'アクティブ' : '非アクティブ'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(store.created_at).toLocaleDateString('ja-JP')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/admin/stores/${store.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(store.id)}
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
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">総</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">総書店数</p>
                <p className="text-2xl font-semibold text-gray-900">{stores.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <span className="text-green-600 font-semibold">活</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">アクティブ</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stores.filter(s => s.is_active).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                  <span className="text-red-600 font-semibold">非</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">非アクティブ</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stores.filter(s => !s.is_active).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
