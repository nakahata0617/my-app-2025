import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

// ファイル名から日本語などの特殊文字を安全な名前に変換する関数
function sanitizeFileName(fileName) {
  return fileName.replace(/[^a-zA-Z0-9.\-_]/g, '');
}

function NoteUploader() {
  const [title, setTitle] = useState('');
  const [lecture, setLecture] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('ファイルが選択されていません。');
      return;
    }

    setUploading(true);
    // 新しいファイル名生成ロジック
    const sanitizedName = sanitizeFileName(file.name);
    const fileName = `${Date.now()}_${sanitizedName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('notes')
      .upload(fileName, file);

    if (uploadError) {
      alert('ファイルのアップロードに失敗しました: ' + uploadError.message);
    } else {
      alert('ファイルが正常にアップロードされました！');
      setTitle('');
      setLecture('');
      setFile(null);
      e.target.reset();
    }
    setUploading(false);
  };

  return (
    <div>
      <h2>ノートをアップロード</h2>
      <form onSubmit={handleSubmit} className="quiz-form">
        <div>
          <label>タイトル:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>授業名:</label>
          <input type="text" value={lecture} onChange={(e) => setLecture(e.target.value)} required />
        </div>
        <div>
          <label>ファイル:</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        </div>
        <div className="form-actions">
          <button type="submit" disabled={uploading}>
            {uploading ? 'アップロード中...' : 'アップロード'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NoteUploader;