import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function QuizList() {
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
    }

    fetchQuizzes();
  }, []);

  return (
    <main>
      <h2>クイズ一覧</h2>
      <ul>
        {quizzes.map(quiz => (
          <li key={quiz.id}>
            <Link to={`/quiz/${quiz.id}`}>{quiz.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default QuizList;