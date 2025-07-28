import { Navigate } from 'react-router-dom';

function ProtectedRoute({ session, children }) {
  if (!session) {
    // ユーザーがログインしていない場合、ログインページにリダイレクト
    return <Navigate to="/auth" replace />;
  }

  // ユーザーがログインしている場合、要求されたページを表示
  return children;
}

export default ProtectedRoute;