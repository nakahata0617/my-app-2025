import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Card.css';

function NoteList() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotes() {
      // データベースのnotesテーブルから情報を取得
      const { data, error } = await supabase
        .from('notes')
        .select('id, original_filename, storage_path');
      
      if (error) {
        console.error('Error fetching notes:', error);
      } else {
        // 各ファイルにダウンロード用の公開URLを追加
        const notesWithUrls = data.map(note => {
          const { data: { publicUrl } } = supabase.storage
            .from('notes')
            .getPublicUrl(note.storage_path);
          return { ...note, publicUrl };
        });
        setNotes(notesWithUrls);
      }
      setLoading(false);
    }
    fetchNotes();
  }, []);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div>
      <h2>ノート一覧</h2>
      <ul className="card-list">
        {notes.map(note => (
          <li key={note.id} className="card">
            <a href={note.publicUrl} target="_blank" rel="noopener noreferrer">
              {note.original_filename} {/* 元の日本語ファイル名を表示 */}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NoteList;