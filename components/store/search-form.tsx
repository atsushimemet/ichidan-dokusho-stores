'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui'
import { Area } from '@/lib/types'

interface SearchFormProps {
  initialPrefecture?: string
}

export function SearchForm({ 
  initialPrefecture = '' 
}: SearchFormProps) {
  const [prefecture, setPrefecture] = useState(initialPrefecture)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    
    console.log('Selected prefecture:', prefecture)
    console.log('All areas:', areas)
    
    if (prefecture) {
      // 都道府県が選択された場合、その都道府県のエリアIDを取得して検索
      const prefectureAreas = areas.filter(area => area.prefecture === prefecture)
      console.log('Prefecture areas:', prefectureAreas)
      
      if (prefectureAreas.length > 0) {
        const areaIds = prefectureAreas.map(area => area.id).join(',')
        console.log('Area IDs:', areaIds)
        params.set('area_ids', areaIds)
      }
    }
    
    console.log('Final params:', params.toString())
    router.push(`/stores?${params.toString()}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // 都道府県の一覧を取得（重複を除去）
  const prefectures = Array.from(new Set(areas.map(area => area.prefecture))).sort()
  console.log('Available prefectures:', prefectures)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <label htmlFor="prefecture" className="block text-sm font-medium text-gray-700 mb-1">
            都道府県
          </label>
          <select
            id="prefecture"
            value={prefecture}
            onChange={(e) => setPrefecture(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">都道府県を選択</option>
            {prefectures.map(pref => (
              <option key={pref} value={pref}>
                {pref}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-center">
        <Button type="submit" className="flex items-center">
          <Search className="w-4 h-4 mr-2" />
          検索
        </Button>
      </div>
    </form>
  )
}
