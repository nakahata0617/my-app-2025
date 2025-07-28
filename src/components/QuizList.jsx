import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Card.css';

function QuizList() {
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);

  useEffect(() => {
    async function fetchData() {
      // 全てのタグを取得
      const { data: tagsData } = await supabase.from('tags').select('name');
      if (tagsData) setAllTags(tagsData);

      // クイズとタグを取得
      let query = supabase.from('quizzes').select('id, title, description, tags ( name )');
      
      // もしタグが選択されていたら、そのタグで絞り込む
      if (selectedTag) {
        query = query.in('tags.name', [selectedTag]);
      }

      const { data: quizzesData, error } = await query;
      
      if (error) {
        console.error('Error fetching quizzes:', error);
      } else {
        setQuizzes(quizzesData);
      }
      setLoading(false);
    }

    fetchData();
  }, [selectedTag]); // selectedTagが変わるたびにデータを再取得

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <main>
      <h2>クイズ一覧</h2>
      {/* タグフィルターのUI */}
      <div>
        <button onClick={() => setSelectedTag(null)} style={{ marginRight: '5px' }}>すべて</button>
        {allTags.map(tag => (
          <button key={tag.name} onClick={() => setSelectedTag(tag.name)} style={{ marginRight: '5px' }}>
            {tag.name}
          </button>
        ))}
      </div>
      <hr />
      <ul className="card-list">
        {quizzes.map(quiz => (
          <li key={quiz.id} className="card">
            <Link to={`/quiz/${quiz.id}`}>{quiz.title}</Link>
            <div style={{ marginTop: '10px', fontSize: '0.9em' }}>
              {quiz.tags.map(tag => (
                <span key={tag.name} style={{ backgroundColor: '#ddd', padding: '2px 6px', borderRadius: '4px', marginRight: '5px' }}>
                  {tag.name}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default QuizList;