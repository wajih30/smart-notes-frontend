import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer } from './components/ui/Toast';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { VerifyOTPPage } from './pages/VerifyOTPPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { NotesPage } from './pages/NotesPage';
import { NoteDetailPage } from './pages/NoteDetailPage';
import { CreateNotePage } from './pages/CreateNotePage';
import { CreateQASessionPage } from './pages/CreateQASessionPage';
import { QAChatPage } from './pages/QAChatPage';
import { SearchPage } from './pages/SearchPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <SidebarProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/verify-otp" element={<VerifyOTPPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Navigate to="/notes" replace />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Notes routes */}
              <Route
                path="/notes"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <NotesPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notes/new"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <CreateNotePage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notes/:id"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <NoteDetailPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Settings route */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <SettingsPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />            {/* Q&A routes */}
              <Route
                path="/qa/new"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <CreateQASessionPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/qa/:id"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <QAChatPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/qa"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <QAChatPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Search route */}
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <SearchPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Admin routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AppLayout>
                      <AdminDashboard />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requireAdmin>
                    <AppLayout>
                      <AdminUsersPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <ToastContainer />
          </SidebarProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
