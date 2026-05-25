import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ItemsPage from './pages/ItemsPage';
import ItemDetailPage from './pages/ItemDetailPage';
import MyItemsPage from './pages/MyItemsPage';
import ReportItemPage from './pages/ReportItemPage';
import EditItemPage from './pages/EditItemPage';
import ProfilePage from './pages/ProfilePage';
import AdminClaimsPage from './pages/AdminClaimsPage';
import StatsPage from './pages/StatsPage';
import MyClaimsPage from './pages/MyClaimsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />
          <main>
            <Routes>
              {/* Public */}
              <Route path="/" element={<ItemsPage />} />
              <Route path="/items/:id" element={<ItemDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected — any logged-in user */}
              <Route path="/report" element={<ProtectedRoute><ReportItemPage /></ProtectedRoute>} />
              <Route path="/edit/:id" element={<ProtectedRoute><EditItemPage /></ProtectedRoute>} />
              <Route path="/my-items" element={<ProtectedRoute><MyItemsPage /></ProtectedRoute>} />
              <Route path="/my-claims" element={<ProtectedRoute><MyClaimsPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

              {/* Admin only */}
              <Route path="/admin/claims" element={<ProtectedRoute adminOnly><AdminClaimsPage /></ProtectedRoute>} />
              <Route path="/admin/stats" element={<ProtectedRoute adminOnly><StatsPage /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
