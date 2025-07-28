import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function NotePage() {
  const { noteId } = useParams();
  const [note, setNote] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNoteAndComments() {
      // 1. ノートの情報を取得
      const { data: noteData, error: noteError } = await supabase.from('notes').select('*').eq('id', noteId).single();
      if (noteError) { console.error('Error fetching note:', noteError); }
      else {
        const { data: { publicUrl } } = supabase.storage.from('notes').getPublicUrl(noteData.storage_path);
        setNote({ ...noteData, publicUrl });
      }

      // 2. コメントを取得
      const { data: commentsData, error: commentsError } = await supabase.from('comments').select('*').eq('note_id', noteId);
      if (commentsError) { console.error('Error fetching comments:', commentsError); }
      else { setComments(commentsData); }
      
      setLoading(false);
    }
    fetchNoteAndComments();
  }, [noteId]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert('コメントするにはログインが必要です。'); return; }
    if (!newComment.trim()) return;

    const { data: newCommentData, error } = await supabase
      .from('comments')
      .insert({ note_id: noteId, user_id: user.id, content: newComment })
      .select()
      .single();

    if (error) {
      alert('コメントの投稿に失敗しました: ' + error.message);
    } else {
      setComments([...comments, newCommentData]);
      setNewComment('');
    }
  };

  if (loading) return <div>読み込み中...</div>;
  if (!note) return <div>ノートが見つかりません。</div>;

  return (
    <div>
      <h2>{note.title}</h2>
      <p><strong>授業名:</strong> {note.lecture_name}</p>
      <a href={note.publicUrl} target="_blank" rel="noopener noreferrer">ファイルをダウンロード</a>
      <hr />
      <h3>コメント</h3>
      <ul>
        {comments.map(comment => (
          <li key={comment.id}>{comment.content}</li>
        ))}
      </ul>
      <form onSubmit={handlePostComment} className="quiz-form">
        <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="コメントを入力..." />
        <button type="submit">コメントを投稿</button>
      </form>
    </div>
  );
}

export default NotePage;