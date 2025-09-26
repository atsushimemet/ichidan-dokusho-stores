import Link from 'next/link'
import { MapPin, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui'
import { Store } from '@/lib/types'

interface StoreCardProps {
  store: Store
}

export function StoreCard({ store }: StoreCardProps) {
  return (
    <Link href={`/stores/${store.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {store.name}
          </h3>
          
          <div className="flex items-center text-sm text-gray-600 mb-3">
            {store.google_map_link ? (
              <a
                href={store.google_map_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center hover:text-red-600 transition-colors"
                title="Google Mapで開く"
              >
                <MapPin className="w-4 h-4 mr-1" />
                {store.area}
              </a>
            ) : (
              <>
                <MapPin className="w-4 h-4 mr-1" />
                {store.area}
              </>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {store.category_tags && store.category_tags.length > 0 ? (
              <>
                {store.category_tags.map((tag: any) => (
                  <span
                    key={tag.category_tag.id}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {tag.category_tag.display_name}
                  </span>
                ))}
              </>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                タグなし
              </span>
            )}
          </div>
          
          {store.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {store.description}
            </p>
          )}
          
          <div className="flex space-x-3">
            {store.x_link && (
              <a
                href={store.x_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                X
              </a>
            )}
            {store.instagram_link && (
              <a
                href={store.instagram_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center text-sm text-gray-600 hover:text-pink-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Instagram
              </a>
            )}
            {store.website_link && (
              <a
                href={store.website_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                公式サイト
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
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
