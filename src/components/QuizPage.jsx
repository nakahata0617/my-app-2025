import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function QuizPage() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    async function fetchQuizData() {
      // 1. クイズの基本情報を取得
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('title, description')
        .eq('id', quizId)
        .single();

      if (quizError) {
        console.error('Error fetching quiz:', quizError);
        return;
      }

      // 2. クイズに紐づく問題を取得
      const { data: problemsData, error: problemsError } = await supabase
        .from('problems')
        .select('question_text, options')
        .eq('quiz_id', quizId);
      
      if (problemsError) {
        console.error('Error fetching problems:', problemsError);
      } else {
        setQuiz(quizData);
        setProblems(problemsData);
      }
    }

    fetchQuizData();
  }, [quizId]);

  if (!quiz) {
    return <div>読み込み中...</div>;
  }

  return (
    <div>
      <h2>{quiz.title}</h2>
      <p>{quiz.description}</p>
      <hr />
      {problems.map((problem, index) => (
        <div key={index}>
          <h3>問題 {index + 1}: {problem.question_text}</h3>
          <ul>
            {problem.options.options.map((option, oIndex) => (
              <li key={oIndex}>{option}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default QuizPage;