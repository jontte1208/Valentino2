import { cookies } from 'next/headers'
import { decode } from 'next-auth/jwt'
import { redirect } from 'next/navigation'
import AdminDashboard from './AdminDashboard'

export const dynamic = 'force-dynamic'

/**
 * Defense-in-depth: even though the middleware already guards /admin,
 * this server component also verifies the JWT directly. If middleware
 * is ever misconfigured, this check still prevents rendering the
 * dashboard to an unauthenticated user.
 */
export default async function AdminPage() {
  const useSecureCookies = process.env.NODE_ENV === 'production'
  const cookieName = useSecureCookies
    ? '__Secure-next-auth.session-token'
    : 'next-auth.session-token'

  const token = cookies().get(cookieName)?.value
  if (!token) redirect('/admin/login')

  try {
    const decoded = await decode({
      token,
      secret: process.env.NEXTAUTH_SECRET ?? '',
    })
    if (!decoded) redirect('/admin/login')
  } catch {
    redirect('/admin/login')
  }

  return <AdminDashboard />
}
