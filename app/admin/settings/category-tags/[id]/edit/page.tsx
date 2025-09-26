'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, X } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { CategoryTag } from '@/lib/types'

interface EditCategoryTagPageProps {
  params: {
    id: string
  }
}

export default function EditCategoryTagPage({ params }: EditCategoryTagPageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categoryTag, setCategoryTag] = useState<CategoryTag | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    is_active: true
  })

  useEffect(() => {
    fetchCategoryTag()
  }, [params.id])

  const fetchCategoryTag = async () => {
    try {
      const response = await fetch(`/api/admin/category-tags/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        const tagData = data.data.category_tag
        setCategoryTag(tagData)
        setFormData({
          name: tagData.name || '',
          display_name: tagData.display_name || '',
          is_active: tagData.is_active
        })
      } else {
        alert('カテゴリタグの取得に失敗しました')
        router.push('/admin/dashboard')
      }
    } catch (error) {
      console.error('Error fetching category tag:', error)
      alert('カテゴリタグの取得に失敗しました')
      router.push('/admin/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/category-tags/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert('カテゴリタグを更新しました')
        router.push('/admin/dashboard')
      } else {
        const error = await response.json()
        alert(`更新に失敗しました: ${error.error?.message || '不明なエラー'}`)
      }
    } catch (error) {
      console.error('Error updating category tag:', error)
      alert('更新に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            <h1 className="text-3xl font-bold text-gray-900">カテゴリタグ編集</h1>
          </div>
        </div>

        {/* フォーム */}
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                識別子 <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="例: coffee"
                className="font-mono"
              />
              <p className="mt-1 text-sm text-gray-500">
                英数字とアンダースコアのみ使用可能（例: coffee, wine, art）
              </p>
            </div>

            <div>
              <label htmlFor="display_name" className="block text-sm font-medium text-gray-700 mb-1">
                表示名 <span className="text-red-500">*</span>
              </label>
              <Input
                id="display_name"
                name="display_name"
                value={formData.display_name}
                onChange={handleChange}
                required
                placeholder="例: コーヒー"
              />
              <p className="mt-1 text-sm text-gray-500">
                書店ページで表示される名前
              </p>
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
