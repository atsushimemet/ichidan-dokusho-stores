import { cookies } from 'next/headers'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export interface AdminUser {
  id: string
  name: string
  role: 'admin'
}

export async function authenticateAdmin(password: string): Promise<AdminUser | null> {
  if (password === ADMIN_PASSWORD) {
    return {
      id: 'admin-1',
      name: '管理者',
      role: 'admin'
    }
  }
  return null
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const cookieStore = await cookies()
  const adminSession = cookieStore.get('admin-session')
  
  if (!adminSession) {
    return null
  }
  
  try {
    const sessionData = JSON.parse(adminSession.value)
    return sessionData
  } catch {
    return null
  }
}

export async function setAdminSession(admin: AdminUser) {
  const cookieStore = await cookies()
  cookieStore.set('admin-session', JSON.stringify(admin), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7日間
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete('admin-session')
}
