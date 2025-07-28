import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Header from './components/Header.jsx';
import QuizList from './components/QuizList.jsx';
import CreateQuiz from './components/CreateQuiz.jsx';
import NoteUploader from './components/NoteUploader.jsx';
import QuizPage from './components/QuizPage.jsx';
import NoteList from './components/NoteList.jsx';
import AuthPage from './components/AuthPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './App.css';
import './components/Navigation.css';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="app-container">
      <Header />
      <nav className="app-nav">
        <Link to="/">ホーム</Link> | 
        <Link to="/create">クイズ作成</Link> | 
        <Link to="/upload">ノート投稿</Link> | 
        <Link to="/notes">ノート一覧</Link> | 
        {session ? (
          <button onClick={handleLogout}>ログアウト</button>
        ) : (
          <Link to="/auth">ログイン</Link>
        )}
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<QuizList />} />
          <Route 
            path="/create" 
            element={
              <ProtectedRoute session={session}>
                <CreateQuiz />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute session={session}>
                <NoteUploader />
              </ProtectedRoute>
            } 
          />
          <Route path="/quiz/:quizId" element={<QuizPage />} />
          <Route path="/notes" element={<NoteList />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
