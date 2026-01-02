'use client';

import { useAuth } from '@/context/AuthContext';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import UserDashboard from '@/components/dashboard/UserDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  // Check if user is Admin
  const isAdmin = user?.roles?.includes('Admin');

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
}
