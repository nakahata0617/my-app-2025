import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './CreateQuiz.css';

function CreateQuiz() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([{ text: '', options: ['', '', '', ''], correctAnswer: '' }]);

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].text = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: quizData, error: quizError } = await supabase.from('quizzes').insert([{ title, description }]).select().single();
    if (quizError) {
      alert('クイズの作成に失敗しました: ' + quizError.message);
      return;
    }
    const problemData = questions.map(q => ({ quiz_id: quizData.id, question_text: q.text, options: { options: q.options } }));
    const { error: problemsError } = await supabase.from('problems').insert(problemData);
    if (problemsError) {
      alert('いくつかの問題の保存に失敗しました。');
    } else {
      alert('クイズが正常にデータベースに保存されました！');
      setTitle('');
      setDescription('');
      setQuestions([{ text: '', options: ['', '', '', ''] }]);
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
            <input type="text" placeholder="問題文を入力" value={question.text} onChange={(e) => handleQuestionChange(qIndex, e.target.value)} />
            <label>選択肢:</label>
            <div className="options-container">
              {question.options.map((option, oIndex) => (
                <input key={oIndex} type="text" placeholder={`選択肢${oIndex + 1}${oIndex === 0 ? ' (正解)' : ''}`} value={option} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} />
              ))}
            </div>
          </div>
        ))}
        <div className="form-actions"><button type="button" onClick={addQuestion}>問題を追加</button><button type="submit">クイズを保存</button></div>
      </form>
    </div>
  );
}

export default CreateQuiz;