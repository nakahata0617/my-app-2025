import React, { useState } from 'react';
import './CreateQuiz.css'; // この行を追加

function CreateQuiz() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`作成されたクイズ:\nタイトル: ${title}\n説明: ${description}`);
    setTitle('');
    setDescription('');
  };

  return (
    <div>
      <h2>新しいクイズを作成</h2>
      <form onSubmit={handleSubmit} className="quiz-form"> {/* classNameを追加 */}
        <div>
          <label>
            タイトル:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            説明:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">クイズを作成</button>
      </form>
    </div>
  );
}

export default CreateQuiz;