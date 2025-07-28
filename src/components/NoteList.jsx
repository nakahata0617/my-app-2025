import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Card.css';

function NoteList() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotes() {
      const { data, error } = await supabase.storage.from('notes').list();
      if (error) {
        console.error('Error fetching notes:', error);
      } else {
        const notesWithUrls = data.map(file => {
          const { data: { publicUrl } } = supabase.storage
            .from('notes')
            .getPublicUrl(file.name);
          return { ...file, publicUrl };
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
              {note.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NoteList;