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
      // explanationも取得
      const { data: problemsData } = await supabase.from('problems').select('question_text, options, explanation').eq('quiz_id', quizId);

      if (quizData && problemsData) {
        setQuiz(quizData);
        setProblems(problemsData);
      }
    }
    fetchQuizData();
  }, [quizId]);

  const handleAnswer = (problemIndex, selectedOption) => {
    setUserAnswers({ ...userAnswers, [problemIndex]: selectedOption });
  };

  const checkAnswers = async () => {
    // ... checkAnswers関数の前半は変更なし
    let correctCount = 0;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert('結果を保存するにはログインが必要です。'); return; }

    const resultsArray = problems.map((problem, index) => {
      const correctAnswer = problem.options.options[0];
      const userAnswer = userAnswers[index];
      const isCorrect = userAnswer === correctAnswer;
      if (isCorrect) correctCount++;
      return { question: problem.question_text, userAnswer, correctAnswer, isCorrect, explanation: problem.explanation };
    });

    const { error } = await supabase.from('quiz_attempts').insert({ user_id: user.id, quiz_id: quizId, score: correctCount });
    if (error) { alert('結果の保存に失敗しました: ' + error.message); }

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
                  <li key={oIndex}><label><input type="radio" name={`problem-${pIndex}`} value={option} onChange={() => handleAnswer(pIndex, option)} checked={userAnswers[pIndex] === option} />{option}</label></li>
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
            <div key={index} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #555', borderRadius: '8px' }}>
              <h4>問題 {index + 1}: {result.question}</h4>
              <p style={{ color: result.isCorrect ? 'lightgreen' : 'lightcoral' }}>あなたの回答: {result.userAnswer || "（無回答）"}</p>
              {!result.isCorrect && <p>正解: {result.correctAnswer}</p>}
              {/* 解説を表示 */}
              {result.explanation && <p style={{ marginTop: '10px', background: '#444', padding: '10px', borderRadius: '4px' }}><strong>解説:</strong> {result.explanation}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuizPage;