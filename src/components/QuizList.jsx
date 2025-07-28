import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Card.css';

function QuizList() {
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    async function fetchQuizzes() {
      // 元のシンプルなクイズ取得処理に戻します
      const { data, error } = await supabase
        .from('quizzes')
        .select(`
          id,
          title,
          description,
          tags ( name )
        `);
      
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
      {/* タグフィルターのUIを一旦削除 */}
      <ul className="card-list">
        {quizzes.map(quiz => (
          <li key={quiz.id} className="card">
            <Link to={`/quiz/${quiz.id}`}>{quiz.title}</Link>
            <div style={{ marginTop: '10px', fontSize: '0.9em' }}>
              {quiz.tags.map(tag => (
                <span key={tag.name} style={{ backgroundColor: '#ddd', padding: '2px 6px', borderRadius: '4px', marginRight: '5px' }}>
                  {tag.name}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default QuizList;