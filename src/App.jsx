import { Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header.jsx';
import QuizList from './components/QuizList.jsx';
import CreateQuiz from './components/CreateQuiz.jsx';
import NoteUploader from './components/NoteUploader.jsx';
import QuizPage from './components/QuizPage.jsx';
import NoteList from './components/NoteList.jsx';
import './App.css';
import './components/Navigation.css';

function App() {
  return (
    <div className="app-container">
      <Header />
      <nav className="app-nav">
        <Link to="/">ホーム</Link> | 
        <Link to="/create">クイズ作成</Link> | 
        <Link to="/upload">ノート投稿</Link> | 
        <Link to="/notes">ノート一覧</Link>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<QuizList />} />
          <Route path="/create" element={<CreateQuiz />} />
          <Route path="/upload" element={<NoteUploader />} />
          <Route path="/quiz/:quizId" element={<QuizPage />} />
          <Route path="/notes" element={<NoteList />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;