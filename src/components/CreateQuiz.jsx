import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './CreateQuiz.css';

function CreateQuiz() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([{ text: '', options: ['', '', '', ''], explanation: '' }]);

  const handleInputChange = (index, event) => {
    const values = [...questions];
    if (event.target.name.startsWith("option")) {
      const optionIndex = parseInt(event.target.name.split('-')[1]);
      values[index].options[optionIndex] = event.target.value;
    } else {
      values[index][event.target.name] = event.target.value;
    }
    setQuestions(values);
  };

  const addQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], explanation: '' }]);
  };

  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert('クイズを作成するにはログインが必要です。'); return; }

    const { data: quizData, error: quizError } = await supabase.from('quizzes').insert([{ title, description, user_id: user.id }]).select().single();
    if (quizError) { alert('クイズの作成に失敗しました: ' + quizError.message); return; }

    const problemData = questions.map(q => ({
      quiz_id: quizData.id,
      question_text: q.text,
      options: { options: q.options },
      explanation: q.explanation // 解説を保存
    }));

    const { error: problemsError } = await supabase.from('problems').insert(problemData);
    if (problemsError) {
      alert('問題の保存に失敗しました: ' + problemsError.message);
    } else {
      alert('クイズが正常にデータベースに保存されました！');
      setTitle('');
      setDescription('');
      setQuestions([{ text: '', options: ['', '', '', ''], explanation: '' }]);
    }
  };

  return (
    <div>
      <h2>新しいクイズを作成</h2>
      <form onSubmit={handleSubmit} className="quiz-form">
        <div><label>タイトル:</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
        <div><label>説明:</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        <hr />
        {questions.map((question, qIndex) => (
          <div key={qIndex} className="question-block">
            <div className="question-header"><label>問題 {qIndex + 1}:</label><button type="button" onClick={() => removeQuestion(qIndex)} className="remove-btn">削除</button></div>
            <input name="text" type="text" placeholder="問題文を入力" value={question.text} onChange={e => handleInputChange(qIndex, e)} />
            <label>選択肢:</label>
            <div className="options-container">
              {question.options.map((option, oIndex) => (
                <input key={oIndex} name={`option-${oIndex}`} type="text" placeholder={`選択肢${oIndex + 1}${oIndex === 0 ? ' (正解)' : ''}`} value={option} onChange={e => handleInputChange(qIndex, e)} />
              ))}
            </div>
            <label>解説:</label> {/* 解説入力欄を追加 */}
            <textarea name="explanation" placeholder="正解の解説を入力" value={question.explanation} onChange={e => handleInputChange(qIndex, e)} />
          </div>
        ))}
        <div className="form-actions"><button type="button" onClick={addQuestion}>問題を追加</button><button type="submit">クイズを保存</button></div>
      </form>
    </div>
  );
}

export default CreateQuiz;