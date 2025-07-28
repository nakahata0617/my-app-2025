import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function NoteList() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    async function fetchNotes() {
      // 1. ファイルのリストを取得
      const { data, error } = await supabase.storage.from('notes').list();
      if (error) {
        console.error('Error fetching notes:', error);
        return;
      }
      
      // 2. 各ファイルの公開URLを取得
      const notesWithUrls = data.map(file => {
        const { data: { publicUrl } } = supabase.storage
          .from('notes')
          .getPublicUrl(file.name);
        return { ...file, publicUrl };
      });
      
      setNotes(notesWithUrls);
    }
    fetchNotes();
  }, []);

  return (
    <div>
      <h2>ノート一覧</h2>
      <ul>
        {notes.map(note => (
          <li key={note.id}>
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