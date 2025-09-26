import { SearchForm } from '@/components/store/search-form'
import { Card, CardContent } from '@/components/ui'
import { BookOpen, Heart, MapPin } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* ヒーローセクション */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              次に行く本屋を探しませんか？
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              独立系書店の魅力を発見し、あなただけの特別な本屋を見つけましょう。
            </p>
          </div>
        </div>
      </section>

      {/* 検索セクション */}
      <section className="py-6 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-4 md:p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  書店を検索
                </h2>
                <p className="text-gray-600">
                  エリアやカテゴリから、お気に入りの書店を見つけましょう
                </p>
              </div>
              <SearchForm />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              一段読書の特徴
            </h2>
            <p className="text-lg text-gray-600">
              独立系書店の魅力を最大限に引き出します
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                豊富な書店情報
              </h3>
              <p className="text-gray-600">
                全国各地の独立系書店の詳細情報を提供。書店の特徴や魅力を詳しく紹介します。
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                エリア別検索
              </h3>
              <p className="text-gray-600">
                エリアやカテゴリから簡単に書店を検索。あなたの地域の隠れた名店を発見できます。
              </p>
            </div>

            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                書店を応援
              </h3>
              <p className="text-gray-600">
                独立系書店の魅力をSNSで発信し、多くの人に知ってもらうきっかけを作ります。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            あなたの特別な書店を見つけよう
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            独立系書店の世界に足を踏み入れてみませんか？
          </p>
          <a
            href="/stores"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors"
          >
            書店一覧を見る
          </a>
        </div>
      </section>
    </div>
  )
}
