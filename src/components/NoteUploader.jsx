// src/components/NoteUploader.jsx

import React, { useState } from 'react';

function NoteUploader() {
  const [title, setTitle] = useState('');
  const [lecture, setLecture] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      alert(`ノートをアップロードします:\nタイトル: ${title}\n授業名: ${lecture}\nファイル: ${file.name}`);
    } else {
      alert('ファイルが選択されていません。');
    }
  };

  return (
    <div>
      <h2>ノートをアップロード</h2>
      <form onSubmit={handleSubmit} className="quiz-form">
        <div><label>タイトル:</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
        <div><label>授業名:</label><input type="text" value={lecture} onChange={(e) => setLecture(e.target.value)} required /></div>
        <div><label>ファイル:</label><input type="file" onChange={(e) => setFile(e.target.files[0])} required /></div>
        <div className="form-actions"><button type="submit">アップロード</button></div>
      </form>
    </div>
  );
}

export default NoteUploader;