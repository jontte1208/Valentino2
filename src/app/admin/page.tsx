import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  return <AdminDashboard />
}
