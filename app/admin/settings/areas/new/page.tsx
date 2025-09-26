'use client'

import { Button, Card, Input } from '@/components/ui'
import { ArrowLeft, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function NewAreaPage() {
  const [formData, setFormData] = useState({
    name: '',
    prefecture: '',
    sort_order: 0,
    is_active: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/areas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin/settings')
      } else {
        const data = await response.json()
        setError(data.error || 'エリアの登録に失敗しました')
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? parseInt(value) || 0 : value
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
              onClick={() => router.back()}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Button>
            <h1 className="text-xl font-bold text-gray-900">新しいエリアを追加</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  エリア名 *
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="東京"
                />
              </div>

              <div>
                <label htmlFor="prefecture" className="block text-sm font-medium text-gray-700 mb-1">
                  都道府県 *
                </label>
                <Input
                  id="prefecture"
                  name="prefecture"
                  value={formData.prefecture}
                  onChange={handleChange}
                  required
                  placeholder="東京都"
                />
              </div>

              <div>
                <label htmlFor="sort_order" className="block text-sm font-medium text-gray-700 mb-1">
                  並び順
                </label>
                <Input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={handleChange}
                  placeholder="0"
                />
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

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? '保存中...' : 'エリアを登録'}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  )
}
