'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SearchForm } from '@/components/store/search-form'
import { StoreCard } from '@/components/store/store-card'
import { Button } from '@/components/ui'
import { Store, Area } from '@/lib/types'

function StoresPageContent() {
  const [stores, setStores] = useState<Store[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

  const searchParams = useSearchParams()
  const area = searchParams.get('area') || ''
  const area_ids = searchParams.get('area_ids') || ''
  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''

  useEffect(() => {
    fetchStores()
    fetchAreas()
  }, [area, area_ids, category, search])

  const fetchStores = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (area) params.set('area', area)
      if (area_ids) params.set('area_ids', area_ids)
      if (category) params.set('category', category)
      if (search) params.set('search', search)
      params.set('page', '1')
      params.set('limit', '20')

      console.log('Fetching stores with params:', params.toString())
      const response = await fetch(`/api/stores?${params.toString()}`)
      const data = await response.json()
      console.log('Stores API response:', data)

      if (data.success) {
        setStores(data.data.stores)
        setPagination(data.data.pagination)
      } else {
        setError(data.error?.message || '書店の取得に失敗しました')
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const fetchAreas = async () => {
    try {
      const response = await fetch('/api/areas')
      const data = await response.json()
      if (data.success) {
        setAreas(data.data.areas || [])
      }
    } catch (error) {
      console.error('Error fetching areas:', error)
    }
  }

  const getAreaName = (areaId: number) => {
    const area = areas.find(a => a.id === areaId)
    return area?.name || '不明'
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchStores}>
            再試行
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            書店一覧
          </h1>
          <SearchForm 
            initialArea={area}
            initialCategory={category}
            initialSearch={search}
          />
        </div>

        {stores.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              条件に合う書店が見つかりませんでした。
            </p>
            <p className="text-gray-500 mt-2">
              検索条件を変更してお試しください。
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                {pagination.total}件の書店が見つかりました
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((store) => (
                <StoreCard 
                  key={store.id} 
                  store={store} 
                  areaName={getAreaName(store.area_id)}
                />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    disabled={pagination.page === 1}
                    onClick={() => {
                      // ページネーション実装
                    }}
                  >
                    前へ
                  </Button>
                  <span className="flex items-center px-4 py-2 text-gray-700">
                    {pagination.page} / {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => {
                      // ページネーション実装
                    }}
                  >
                    次へ
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function StoresPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    }>
      <StoresPageContent />
    </Suspense>
  )
}
