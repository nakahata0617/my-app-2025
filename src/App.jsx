import { Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header.jsx';
import QuizList from './components/QuizList.jsx';
import CreateQuiz from './components/CreateQuiz.jsx';
import './components/Navigation.css'; // この行を追加

function App() {
  return (
    <div className="app-container">
      <Header />
      <nav className="app-nav"> {/* この行にclassNameを追加 */}
        <Link to="/">ホーム</Link> | <Link to="/create">クイズ作成</Link>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<QuizList />} />
          <Route path="/create" element={<CreateQuiz />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;