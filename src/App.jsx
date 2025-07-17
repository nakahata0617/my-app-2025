import { Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header.jsx';
import QuizList from './components/QuizList.jsx';
import CreateQuiz from './components/CreateQuiz.jsx';
import NoteUploader from './components/NoteUploader.jsx'; // この行を追加

function App() {
  return (
    <div className="app-container">
      <Header />
      <nav className="app-nav">
        <Link to="/">ホーム</Link> | <Link to="/create">クイズ作成</Link> | <Link to="/upload">ノート投稿</Link> {/* リンクを追加 */}
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<QuizList />} />
          <Route path="/create" element={<CreateQuiz />} />
          <Route path="/upload" element={<NoteUploader />} /> {/* この行を追加 */}
        </Routes>
      </main>
    </div>
  );
}

export default App;