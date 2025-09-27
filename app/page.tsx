import { SearchForm } from '@/components/store/search-form'
import { Card, CardContent } from '@/components/ui'
import { BookOpen, Heart, MapPin } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* ファーストビューコンテナ - iPhone SE最適化 */}
      <div className="h-[100vh] flex flex-col pb-4 sm:pb-6 md:pb-8">
        {/* ヒーローセクション - 上部に詰めて配置 */}
        <section className="pt-6 sm:pt-8 md:pt-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                次に行く本屋を探しませんか？
              </h1>
              <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-8">
                独立系書店の魅力を発見し、あなただけの特別な本屋を見つけましょう。
              </p>
            </div>
          </div>
        </section>

        {/* 装飾セクション - 余白を美しく埋める */}
        <section className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 min-h-0">
          <div className="text-center space-y-6 sm:space-y-8">
            {/* 本のアイコン装飾 */}
            <div className="flex justify-center space-x-4 sm:space-x-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center animate-pulse" style={{animationDelay: '0.5s'}}>
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-100 rounded-full flex items-center justify-center animate-pulse" style={{animationDelay: '1s'}}>
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600" />
              </div>
            </div>
            
            {/* キャッチフレーズ */}
            <div className="space-y-2 opacity-80">
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                📚 全国の独立系書店を発見
              </p>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                🗺️ エリア別で簡単検索
              </p>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                ❤️ あなただけの特別な本屋
              </p>
            </div>
          </div>
        </section>

        {/* 検索セクション - ファーストビューの下部に下揃えで配置 */}
        <section className="flex-shrink-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="shadow-lg">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="text-center mb-3 sm:mb-4">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1">
                    書店を検索
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600">
                    エリアやカテゴリから、お気に入りの書店を見つけましょう
                  </p>
                </div>
                <SearchForm />
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

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
