import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Card.css'; // カードデザインを再利用

function RankingPage() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRanking() {
      // quiz_attemptsテーブルからスコアの高い順に10件取得
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('score, created_at')
        .order('score', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching ranking:', error);
      } else {
        setRanking(data);
      }
      setLoading(false);
    }

    fetchRanking();
  }, []);

  if (loading) {
    return <div>ランキングを読み込み中...</div>;
  }

  return (
    <div>
      <h2>トップスコアランキング</h2>
      <ul className="card-list">
        {ranking.map((attempt, index) => (
          <li key={index} className="card">
            {index + 1}位: {attempt.score}点 
            <span style={{ fontSize: '0.8em', marginLeft: '10px', color: '#666' }}>
              ({new Date(attempt.created_at).toLocaleString()})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RankingPage;