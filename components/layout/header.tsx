import Link from 'next/link'
import { Button } from '@/components/ui'

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              一冊読書
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              ホーム
            </Link>
            <Link 
              href="/stores" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              書店一覧
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/admin/login">
              <Button variant="outline" size="sm">
                管理者ログイン
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
