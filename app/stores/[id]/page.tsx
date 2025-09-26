'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { MapPin, ExternalLink, Twitter, Instagram, Globe } from 'lucide-react'
import { Card, CardContent } from '@/components/ui'
import { Store } from '@/lib/types'

export default function StoreDetailPage() {
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const storeId = params.id as string

  useEffect(() => {
    fetchStore()
  }, [storeId])

  const fetchStore = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/stores/${storeId}`)
      const data = await response.json()

      if (data.success) {
        setStore(data.data.store)
      } else {
        setError(data.error?.message || '書店情報の取得に失敗しました')
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">書店情報を読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {error || '書店が見つかりませんでした'}
          </p>
          <a
            href="/stores"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
          >
            書店一覧に戻る
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {store.name}
              </h1>
              
              <div className="flex items-center text-lg text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                {store.area}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {getCategoryDisplayName(store.category)}
                </span>
              </div>
            </div>

            {store.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  書店について
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {store.description}
                </p>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                リンク
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {store.x_link && (
                  <a
                    href={store.x_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Twitter className="w-5 h-5 text-blue-500 mr-3" />
                    <span className="font-medium">X (Twitter)</span>
                    <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
                  </a>
                )}

                {store.instagram_link && (
                  <a
                    href={store.instagram_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Instagram className="w-5 h-5 text-pink-500 mr-3" />
                    <span className="font-medium">Instagram</span>
                    <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
                  </a>
                )}

                {store.website_link && (
                  <a
                    href={store.website_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Globe className="w-5 h-5 text-green-500 mr-3" />
                    <span className="font-medium">公式サイト</span>
                    <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
                  </a>
                )}
              </div>
            </div>

            {store.x_post_url && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  書店の紹介
                </h2>
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">
                    Xポストの埋め込み表示は実装予定です
                  </p>
                  <a
                    href={store.x_post_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-2"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    紹介ポストを見る
                  </a>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <a
                href="/stores"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
              >
                他の書店を見る
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function getCategoryDisplayName(category: string): string {
  const categoryMap: Record<string, string> = {
    'book_cafe': 'ブックカフェ',
    'used_book': '古書',
    'children_book': '児童書',
    'general': '一般書店',
    'specialty': '専門書店'
  }
  
  return categoryMap[category] || category
}
