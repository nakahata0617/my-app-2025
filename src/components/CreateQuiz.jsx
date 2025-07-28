import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './CreateQuiz.css';

function CreateQuiz() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState(''); // タグを管理するためのstateを追加
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

    // 1. クイズの基本情報を保存
    const { data: quizData, error: quizError } = await supabase.from('quizzes').insert([{ title, description, user_id: user.id }]).select().single();
    if (quizError) { alert('クイズの作成に失敗しました: ' + quizError.message); return; }

    // 2. 問題と解説を保存
    const problemData = questions.map(q => ({ quiz_id: quizData.id, question_text: q.text, options: { options: q.options }, explanation: q.explanation }));
    const { error: problemsError } = await supabase.from('problems').insert(problemData);
    if (problemsError) { alert('問題の保存に失敗しました: ' + problemsError.message); return; }

    // 3. タグを保存
    const tagNames = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    if (tagNames.length > 0) {
      const tagObjects = tagNames.map(name => ({ name }));
      const { data: insertedTags, error: tagsError } = await supabase.from('tags').upsert(tagObjects, { onConflict: 'name' }).select();

      if (tagsError) { alert('タグの保存に失敗しました: ' + tagsError.message); return; }
      
      const quizTagRelations = insertedTags.map(tag => ({ quiz_id: quizData.id, tag_id: tag.id }));
      const { error: quizTagsError } = await supabase.from('quiz_tags').insert(quizTagRelations);

      if (quizTagsError) { alert('クイズとタグの紐付けに失敗しました: ' + quizTagsError.message); return; }
    }

    alert('クイズが正常にデータベースに保存されました！');
    setTitle('');
    setDescription('');
    setTags('');
    setQuestions([{ text: '', options: ['', '', '', ''], explanation: '' }]);
  };

  return (
    <div>
      <h2>新しいクイズを作成</h2>
      <form onSubmit={handleSubmit} className="quiz-form">
        <div><label>タイトル:</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
        <div><label>説明:</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        {/* タグ入力欄を追加 */}
        <div>
          <label>タグ (カンマ区切り):</label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="例: ソフトウェア工学, 中間試験" />
        </div>
        <hr />
        {questions.map((question, qIndex) => (
          <div key={qIndex} className="question-block">
            <div className="question-header"><label>問題 {qIndex + 1}:</label><button type="button" onClick={() => removeQuestion(qIndex)} className="remove-btn">削除</button></div>
            <input name="text" type="text" placeholder="問題文を入力" value={question.text} onChange={e => handleInputChange(qIndex, e)} />
            <div className="options-container">
              {question.options.map((option, oIndex) => (
                <input key={oIndex} name={`option-${oIndex}`} type="text" placeholder={`選択肢${oIndex + 1}${oIndex === 0 ? ' (正解)' : ''}`} value={option} onChange={e => handleInputChange(qIndex, e)} />
              ))}
            </div>
            <label>解説:</label>
            <textarea name="explanation" placeholder="正解の解説を入力" value={question.explanation} onChange={e => handleInputChange(qIndex, e)} />
          </div>
        ))}
        <div className="form-actions"><button type="button" onClick={addQuestion}>問題を追加</button><button type="submit">クイズを保存</button></div>
      </form>
    </div>
  );
}

export default CreateQuiz;