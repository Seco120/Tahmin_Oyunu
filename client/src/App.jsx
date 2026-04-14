import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GamePage from './pages/GamePage';
import LeaderboardPage from './pages/LeaderboardPage'; 
import HowToPlayPage from './pages/HowToPlayPage';     
import ResetPasswordPage from './pages/ResetPasswordPage';

// 1. Güncellenmiş Bekçi: Token veya Misafir durumu varsa geçişe izin verir
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const isGuest = localStorage.getItem('isGuest') === 'true';

  // Eğer ne token ne de misafir bayrağı varsa login'e atar
  if (!token && !isGuest) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* OYUN ALANI: Artık hem kayıtlı kullanıcıya hem misafire açık */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <GamePage />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/how-to-play" element={<HowToPlayPage />} />
          <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Hatalı rotaları ana sayfaya (ProtectedRoute üzerinden) yönlendirir */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;