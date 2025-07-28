import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function QuizCreator() {
  const [quizTitle, setQuizTitle] = useState(''); // ★この行を追加
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [correctOption, setCorrectOption] = useState(''); // 'a', 'b', 'c'
  const [explanation, setExplanation] = useState('');
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quizTitle || !questionText || !optionA || !optionB || !correctOption) { // ★quizTitleを必須条件に追加
      alert('クイズタイトル、質問文、選択肢A、選択肢B、正解は必須です。');
      return;
    }

    setCreating(true);

    const { data, error } = await supabase
      .from('quizzes') // 作成したテーブル名
      .insert([
        { 
          quiz_title: quizTitle, // ★この行を追加
          question_text: questionText,
          option_a: optionA,
          option_b: optionB,
          option_c: optionC,
          correct_option: correctOption,
          explanation: explanation,
        },
      ]);

    if (error) {
      alert('クイズの作成に失敗しました: ' + error.message);
      console.error('Quiz Creation Error:', error);
    } else {
      alert('クイズが正常に作成されました！');
      // フォームをリセット
      setQuizTitle(''); // ★この行を追加
      setQuestionText('');
      setOptionA('');
      setOptionB('');
      setOptionC('');
      setCorrectOption('');
      setExplanation('');
    }
    setCreating(false);
  };

  return (
    <div>
      <h2>クイズを作成</h2>
      <form onSubmit={handleSubmit} className="quiz-form">
        <div>
          <label>タイトル:</label> {/* ★この部分を追加 */}
          <input
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>質問:</label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
            rows="3"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', backgroundColor: '#444', color: '#fff', border: '1px solid #555', borderRadius: '4px' }}
          ></textarea>
        </div>
        <div>
          <label>選択肢 A:</label>
          <input type="text" value={optionA} onChange={(e) => setOptionA(e.target.value)} required />
        </div>
        <div>
          <label>選択肢 B:</label>
          <input type="text" value={optionB} onChange={(e) => setOptionB(e.target.value)} required />
        </div>
        <div>
          <label>選択肢 C :</label>
          <input type="text" value={optionC} onChange={(e) => setOptionC(e.target.value)} />
        </div>
        <div>
          <label>正解 :</label>
          <input
            type="text"
            value={correctOption}
            onChange={(e) => setCorrectOption(e.target.value.toLowerCase())}
            maxLength="1"
            required
            placeholder="例: a, b, c"
          />
        </div>
        <div>
          <label>解説 :</label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            rows="2"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', backgroundColor: '#444', color: '#fff', border: '1px solid #555', borderRadius: '4px' }}
          ></textarea>
        </div>
        <div className="form-actions">
          <button type="submit" disabled={creating}>
            {creating ? '作成中...' : 'クイズを作成'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default QuizCreator;