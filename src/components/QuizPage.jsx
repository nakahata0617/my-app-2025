import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function QuizPage() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [problems, setProblems] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [results, setResults] = useState(null);

  useEffect(() => {
    async function fetchQuizData() {
      const { data: quizData } = await supabase.from('quizzes').select('title, description').eq('id', quizId).single();
      const { data: problemsData } = await supabase.from('problems').select('question_text, options').eq('quiz_id', quizId);

      if (quizData && problemsData) {
        setQuiz(quizData);
        setProblems(problemsData);
      }
    }
    fetchQuizData();
  }, [quizId]);

  const handleAnswer = (problemIndex, selectedOption) => {
    setUserAnswers({
      ...userAnswers,
      [problemIndex]: selectedOption,
    });
  };

  const checkAnswers = () => {
    let correctCount = 0;
    const resultsArray = problems.map((problem, index) => {
      const correctAnswer = problem.options.options[0]; // 正解は常に最初の選択肢
      const userAnswer = userAnswers[index];
      const isCorrect = userAnswer === correctAnswer;
      if (isCorrect) {
        correctCount++;
      }
      return { question: problem.question_text, userAnswer, correctAnswer, isCorrect };
    });
    setResults({ resultsArray, correctCount, total: problems.length });
  };

  if (!quiz) {
    return <div>読み込み中...</div>;
  }

  return (
    <div>
      <h2>{quiz.title}</h2>
      <p>{quiz.description}</p>
      <hr />
      {!results ? (
        <div>
          {problems.map((problem, pIndex) => (
            <div key={pIndex}>
              <h3>問題 {pIndex + 1}: {problem.question_text}</h3>
              <ul>
                {problem.options.options.map((option, oIndex) => (
                  <li key={oIndex}>
                    <label>
                      <input
                        type="radio"
                        name={`problem-${pIndex}`}
                        value={option}
                        onChange={() => handleAnswer(pIndex, option)}
                        checked={userAnswers[pIndex] === option}
                      />
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button onClick={checkAnswers}>答え合わせ</button>
        </div>
      ) : (
        <div>
          <h3>結果発表</h3>
          <p>{results.total}問中 {results.correctCount}問正解です！</p>
          {results.resultsArray.map((result, index) => (
            <div key={index}>
              <h4>問題 {index + 1}: {result.question}</h4>
              <p style={{ color: result.isCorrect ? 'green' : 'red' }}>あなたの回答: {result.userAnswer}</p>
              {!result.isCorrect && <p>正解: {result.correctAnswer}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuizPage;