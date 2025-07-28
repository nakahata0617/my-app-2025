import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function NoteUploader() {
  const [title, setTitle] = useState('');
  const [lecture, setLecture] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!file || !user) return;

    setUploading(true);
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const fileNameInStorage = `${Date.now()}_${sanitizedName}`;
    
    // 1. ファイルをストレージにアップロード
    const { error: uploadError } = await supabase.storage
      .from('notes')
      .upload(fileNameInStorage, file);

    if (uploadError) {
      alert('ファイルのアップロードに失敗しました: ' + uploadError.message);
      setUploading(false);
      return;
    }

    // 2. ファイル情報をデータベースに保存
    const { error: dbError } = await supabase
      .from('notes')
      .insert({
        title: title,
        lecture_name: lecture,
        storage_path: fileNameInStorage,
        original_filename: file.name, // ここで元の日本語ファイル名を保存
        uploader_id: user.id
      });

    if (dbError) {
      alert('データベースへの保存に失敗しました: ' + dbError.message);
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
        <div><label>タイトル:</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
        <div><label>授業名:</label><input type="text" value={lecture} onChange={(e) => setLecture(e.target.value)} required /></div>
        <div><label>ファイル:</label><input type="file" onChange={(e) => setFile(e.target.files[0])} required /></div>
        <div className="form-actions"><button type="submit" disabled={uploading}>{uploading ? 'アップロード中...' : 'アップロード'}</button></div>
      </form>
    </div>
  );
}

export default NoteUploader;