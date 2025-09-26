'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, X } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { Store, CategoryTag, Area } from '@/lib/types'

interface EditStorePageProps {
  params: {
    id: string
  }
}

export default function EditStorePage({ params }: EditStorePageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [store, setStore] = useState<Store | null>(null)
  const [categoryTags, setCategoryTags] = useState<CategoryTag[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [formData, setFormData] = useState({
    name: '',
    area_id: '',
    category_tag_ids: [] as number[],
    x_link: '',
    instagram_link: '',
    website_link: '',
    x_post_url: '',
    google_map_link: '',
    description: '',
    is_active: true
  })

  useEffect(() => {
    fetchStore()
    fetchCategoryTags()
    fetchAreas()
  }, [params.id])

  const fetchStore = async () => {
    try {
      const response = await fetch(`/api/admin/stores/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        const storeData = data.data.store
        console.log('Store data:', storeData)
        console.log('Category tags:', storeData.category_tags)
        setStore(storeData)
        setFormData({
          name: storeData.name || '',
          area_id: storeData.area_id?.toString() || '',
          category_tag_ids: storeData.category_tags?.map((tag: any) => tag.category_tag.id) || [],
          x_link: storeData.x_link || '',
          instagram_link: storeData.instagram_link || '',
          website_link: storeData.website_link || '',
          x_post_url: storeData.x_post_url || '',
          google_map_link: storeData.google_map_link || '',
          description: storeData.description || '',
          is_active: storeData.is_active
        })
      } else {
        alert('書店の取得に失敗しました')
        router.push('/admin/dashboard')
      }
    } catch (error) {
      console.error('Error fetching store:', error)
      alert('書店の取得に失敗しました')
      router.push('/admin/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategoryTags = async () => {
    try {
      const response = await fetch('/api/category-tags')
      if (response.ok) {
        const data = await response.json()
        setCategoryTags(data.data.category_tags || [])
      }
    } catch (error) {
      console.error('Error fetching category tags:', error)
    }
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/stores/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          category_tag_ids: formData.category_tag_ids
        })
      })

      if (response.ok) {
        alert('書店を更新しました')
        router.push('/admin/dashboard')
      } else {
        const error = await response.json()
        console.error('Store update error:', error)
        if (error.error && typeof error.error === 'object') {
          alert(`更新に失敗しました: ${error.error.message || '不明なエラー'}`)
        } else {
          alert(`更新に失敗しました: ${error.error || '不明なエラー'}`)
        }
      }
    } catch (error) {
      console.error('Error updating store:', error)
      alert('更新に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <h1 className="text-3xl font-bold text-gray-900">書店編集</h1>
          </div>
        </div>

        {/* フォーム */}
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* 基本情報 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  書店名 <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="書店名を入力"
                />
              </div>

              <div>
                <label htmlFor="area_id" className="block text-sm font-medium text-gray-700 mb-1">
                  エリア <span className="text-red-500">*</span>
                </label>
                <select
                  id="area_id"
                  name="area_id"
                  value={formData.area_id}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">エリアを選択</option>
                  {areas.map(area => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  カテゴリタグ
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {categoryTags.map(tag => (
                    <label key={tag.id} className="flex items-center">
                      <input
                        type="checkbox"
                        value={tag.id}
                        checked={formData.category_tag_ids.includes(tag.id)}
                        onChange={(e) => {
                          const tagId = tag.id
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              category_tag_ids: [...prev.category_tag_ids, tagId]
                            }))
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              category_tag_ids: prev.category_tag_ids.filter(id => id !== tagId)
                            }))
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-900">{tag.display_name}</span>
                    </label>
                  ))}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  複数のカテゴリタグを選択できます
                </p>
              </div>

              <div>
                <label htmlFor="website_link" className="block text-sm font-medium text-gray-700 mb-1">
                  ウェブサイト
                </label>
                <Input
                  id="website_link"
                  name="website_link"
                  type="url"
                  value={formData.website_link}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            {/* SNS情報 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="x_link" className="block text-sm font-medium text-gray-700 mb-1">
                  X (Twitter) リンク
                </label>
                <Input
                  id="x_link"
                  name="x_link"
                  type="url"
                  value={formData.x_link}
                  onChange={handleChange}
                  placeholder="https://x.com/username"
                />
              </div>

              <div>
                <label htmlFor="instagram_link" className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram リンク
                </label>
                <Input
                  id="instagram_link"
                  name="instagram_link"
                  type="url"
                  value={formData.instagram_link}
                  onChange={handleChange}
                  placeholder="https://instagram.com/username"
                />
              </div>

              <div>
                <label htmlFor="x_post_url" className="block text-sm font-medium text-gray-700 mb-1">
                  X投稿URL
                </label>
                <Input
                  id="x_post_url"
                  name="x_post_url"
                  type="url"
                  value={formData.x_post_url}
                  onChange={handleChange}
                  placeholder="https://x.com/username/status/1234567890"
                />
              </div>

              <div>
                <label htmlFor="google_map_link" className="block text-sm font-medium text-gray-700 mb-1">
                  Google Map リンク
                </label>
                <Input
                  id="google_map_link"
                  name="google_map_link"
                  type="url"
                  value={formData.google_map_link}
                  onChange={handleChange}
                  placeholder="https://maps.google.com/?q=店舗名"
                />
              </div>
            </div>

            {/* 説明 */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                説明
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="書店の説明を入力"
              />
            </div>

            {/* ステータス */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">アクティブ</span>
              </label>
            </div>

            {/* ボタン */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/dashboard')}
                className="px-3"
                title="キャンセル"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 px-3"
                title={saving ? '更新中...' : '更新'}
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
