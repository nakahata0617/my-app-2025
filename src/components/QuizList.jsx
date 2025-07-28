import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Card.css'; // この行を追加

function QuizList() {
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    async function fetchQuizzes() {
      const { data, error } = await supabase
        .from('quizzes')
        .select('id, title, description');
      
      if (error) {
        console.error('Error fetching quizzes:', error);
      } else {
        setQuizzes(data);
      }
      setLoading(false);
    }
    fetchQuizzes();
  }, []);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <main>
      <h2>クイズ一覧</h2>
      <ul className="card-list"> {/* classNameを追加 */}
        {quizzes.map(quiz => (
          <li key={quiz.id} className="card"> {/* classNameを追加 */}
            <Link to={`/quiz/${quiz.id}`}>{quiz.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default QuizList;