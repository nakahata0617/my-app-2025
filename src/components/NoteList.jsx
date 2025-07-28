import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
        .select('id, original_filename');
      
      if (error) {
        console.error('Error fetching notes:', error);
      } else {
        setNotes(data);
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
            <Link to={`/note/${note.id}`}>
              {note.original_filename}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NoteList;