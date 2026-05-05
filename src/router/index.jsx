import { createBrowserRouter, Navigate } from 'react-router-dom'

// Layouts
import UserLayout from '@/components/layout/UserLayout'
import AdminLayout from '@/components/layout/AdminLayout'
import AuthLayout from '@/components/layout/AuthLayout'

// Guards
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import AdminRoute from '@/components/shared/AdminRoute'

// Auth pages
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'

// User pages
import HomePage from '@/pages/user/HomePage'
import CatalogPage from '@/pages/user/CatalogPage'
import BookDetailPage from '@/pages/user/BookDetailPage'
import MyBorrowingsPage from '@/pages/user/MyBorrowingsPage'
import ProfilePage from '@/pages/user/ProfilePage'

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminBooksPage from '@/pages/admin/AdminBooksPage'
import AdminBorrowingsPage from '@/pages/admin/AdminBorrowingsPage'
import AdminUsersPage from '@/pages/admin/AdminUsersPage'

export const router = createBrowserRouter([
  // ── Auth Routes ──────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: '/login',    element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },

  // ── User Routes (harus login) ─────────────────────
  {
    element: <ProtectedRoute><UserLayout /></ProtectedRoute>,
    children: [
      { path: '/',               element: <HomePage /> },
      { path: '/catalog',        element: <CatalogPage /> },
      { path: '/books/:id',      element: <BookDetailPage /> },
      { path: '/my-borrowings',  element: <MyBorrowingsPage /> },
      { path: '/profile',        element: <ProfilePage /> },
    ],
  },

  // ── Admin Routes (harus login + role admin) ───────
  {
    path: '/admin',
    element: <AdminRoute><AdminLayout /></AdminRoute>,
    children: [
      { index: true,              element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard',        element: <AdminDashboard /> },
      { path: 'books',            element: <AdminBooksPage /> },
      { path: 'borrowings',       element: <AdminBorrowingsPage /> },
      { path: 'users',            element: <AdminUsersPage /> },
    ],
  },

  // ── Fallback ──────────────────────────────────────
  { path: '*', element: <Navigate to="/" replace /> },
])
