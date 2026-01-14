import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import { ConversationsProvider } from './contexts/ConversationsContext';
import { ChatProvider } from './contexts/ChatContext';
import { AuthPage } from './components/auth/AuthPage';
import { MainLayout } from './components/layout/MainLayout';
import { Toaster } from 'react-hot-toast';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-void">
        <div className="text-center relative">
          <div className="absolute inset-0 bg-neon-blue rounded-full blur-xl opacity-20 animate-pulse-glow" />
          <div className="relative animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-blue mx-auto mb-4" />
          <p className="text-neon-blue font-display tracking-widest text-sm animate-pulse">INITIALIZING SYSTEM...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter basename="/Chat-Me/">
      <AuthProvider>
        <ConversationsProvider>
          <ChatProvider>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'rgba(5, 5, 17, 0.9)',
                  color: '#00f0ff',
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                  backdropFilter: 'blur(10px)',
                  fontFamily: '"Outfit", sans-serif',
                },
              }}
            />
          </ChatProvider>
        </ConversationsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

