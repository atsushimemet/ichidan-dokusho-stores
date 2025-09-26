'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Button, Input } from '@/components/ui'

interface SearchFormProps {
  initialArea?: string
  initialCategory?: string
}

export function SearchForm({ 
  initialArea = '', 
  initialCategory = '' 
}: SearchFormProps) {
  const [area, setArea] = useState(initialArea)
  const [category, setCategory] = useState(initialCategory)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    
    if (area) params.set('area', area)
    if (category) params.set('category', category)
    
    router.push(`/stores?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
            エリア
          </label>
          <select
            id="area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">すべてのエリア</option>
            <option value="東京">東京</option>
            <option value="大阪">大阪</option>
            <option value="京都">京都</option>
            <option value="横浜">横浜</option>
            <option value="名古屋">名古屋</option>
            <option value="福岡">福岡</option>
            <option value="札幌">札幌</option>
            <option value="仙台">仙台</option>
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            カテゴリ
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">すべてのカテゴリ</option>
            <option value="book_cafe">ブックカフェ</option>
            <option value="used_book">古書</option>
            <option value="children_book">児童書</option>
            <option value="general">一般書店</option>
            <option value="specialty">専門書店</option>
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
