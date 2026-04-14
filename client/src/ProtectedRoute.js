import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Senin bouncer'ın anahtarı burada: Token var mı?
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Token yoksa kış kış, login'e git. 
    // 'replace' sayesinde geri tuşuna basınca tekrar buraya gelemez.
    return <Navigate to="/login" replace />;
  }

  // Token varsa "geç kanka" diyoruz
  return children;
};

export default ProtectedRoute;