'use client'

import { Button, Card, Input } from '@/components/ui'
import { Area, CategoryTag } from '@/lib/types'
import { ArrowLeft, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function NewStorePage() {
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
  const [categoryTags, setCategoryTags] = useState<CategoryTag[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchCategoryTagsAndAreas()
  }, [])

  const fetchCategoryTagsAndAreas = async () => {
    try {
      const [categoryTagsRes, areasRes] = await Promise.all([
        fetch('/api/category-tags'),
        fetch('/api/areas')
      ])
      
      const categoryTagsData = await categoryTagsRes.json()
      const areasData = await areasRes.json()
      
      setCategoryTags(categoryTagsData.data.category_tags || [])
      setAreas(areasData.data.areas || [])
    } catch (error) {
      console.error('Failed to fetch category tags and areas:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          category_tag_ids: formData.category_tag_ids
        }),
      })

      if (response.ok) {
        router.push('/admin/stores')
      } else {
        const data = await response.json()
        console.error('Store creation error:', data)
        
        // エラーメッセージの安全な取得
        let errorMessage = '書店の登録に失敗しました'
        
        if (data.error) {
          if (typeof data.error === 'string') {
            errorMessage = data.error
          } else if (typeof data.error === 'object' && data.error.message) {
            errorMessage = data.error.message
          } else if (typeof data.error === 'object' && data.error.code) {
            errorMessage = `エラー: ${data.error.code}`
          }
        } else if (data.message) {
          errorMessage = data.message
        }
        
        setError(errorMessage)
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Button>
            <h1 className="text-xl font-bold text-gray-900">新しい書店を追加</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本情報 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">基本情報</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    書店名 *
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
                    エリア *
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

                <div className="flex items-center">
                  <input
                    id="is_active"
                    name="is_active"
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                    アクティブ
                  </label>
                </div>
              </div>
            </div>

            {/* リンク情報 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">リンク情報</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="website_link" className="block text-sm font-medium text-gray-700 mb-1">
                    公式ウェブサイト
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

                <div>
                  <label htmlFor="x_link" className="block text-sm font-medium text-gray-700 mb-1">
                    X（Twitter）リンク
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
                    Instagramリンク
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
                    XポストURL
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
                    Google Mapリンク
                  </label>
                  <Input
                    id="google_map_link"
                    name="google_map_link"
                    type="url"
                    value={formData.google_map_link}
                    onChange={handleChange}
                    placeholder="https://maps.google.com/?q=書店名"
                  />
                </div>
              </div>
            </div>

            {/* 説明 */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                書店の説明
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="書店の特徴や魅力を入力してください"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/dashboard')}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? '保存中...' : '書店を登録'}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  )
}
