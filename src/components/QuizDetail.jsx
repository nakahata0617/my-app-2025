import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // useParams を使ってURLパラメータを取得
import { supabase } from '../supabaseClient'; // Supabaseクライアントをインポート
import './QuizDetail.css'; // このコンポーネント専用のCSSファイル (必要であれば作成)

function QuizDetail() {
  const { id } = useParams(); // URLからクイズID (例: /quiz/123 の 123) を取得
  const [loading, setLoading] = useState(true); // データ読み込み中の状態
  const [quiz, setQuiz] = useState(null); // 取得したクイズ本体のデータ
  const [problems, setProblems] = useState([]); // 取得した問題のリスト
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0); // 現在表示中の問題のインデックス
  const [showAnswer, setShowAnswer] = useState(false); // 解答と解説を表示するかどうかの状態

  // コンポーネントがマウントされた時、またはクイズIDが変わった時にデータをフェッチ
  useEffect(() => {
    async function fetchQuizDetail() {
      setLoading(true); // データフェッチ開始時にローディング状態にする
      
      // 1. クイズ本体の情報を取得
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select(`
          id,
          title,
          description
        `)
        .eq('id', id) // URLから取得したIDに一致するクイズを検索
        .single(); // 1件だけ取得することを想定

      if (quizError) {
        console.error('Error fetching quiz:', quizError);
        setLoading(false); // エラーが発生してもローディング状態を解除
        return; // エラーの場合は処理を中断
      }
      setQuiz(quizData); // 取得したクイズデータをステートにセット

      // 2. そのクイズに紐づく問題と解答を取得
      const { data: problemsData, error: problemsError } = await supabase
        .from('problems')
        .select(`
          id,
          question,
          answer,
          explanation
        `)
        .eq('quiz_id', id) // このクイズIDに一致する問題のみを検索
        .order('id', { ascending: true }); // 問題をIDで昇順に並べ替え (順番を保証するため)

      if (problemsError) {
        console.error('Error fetching problems:', problemsError);
      } else {
        setProblems(problemsData); // 取得した問題データをステートにセット
      }
      setLoading(false); // データフェッチ完了時にローディング状態を解除
    }

    fetchQuizDetail();
  }, [id]); // 依存配列に id を含めることで、URLのクイズIDが変わったら再度データをフェッチする

  // 「次の問題」ボタンがクリックされた時のハンドラー
  const handleNextProblem = () => {
    // 現在の問題が最後の問題でなければ、次の問題に進む
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
      setShowAnswer(false); // 次の問題へ進むときに解答・解説を非表示にする
    }
  };

  // 「前の問題」ボタンがクリックされた時のハンドラー
  const handlePreviousProblem = () => {
    // 現在の問題が最初の問題でなければ、前の問題に戻る
    if (currentProblemIndex > 0) {
      setCurrentProblemIndex(currentProblemIndex - 1);
      setShowAnswer(false); // 前の問題へ戻る時に解答・解説を非表示にする
    }
  };

  // ローディング中の表示
  if (loading) {
    return <div>クイズを読み込み中...</div>;
  }

  // クイズが見つからなかった場合の表示
  if (!quiz) {
    return <div>クイズが見つかりませんでした。</div>;
  }

  // クイズには問題がまだ登録されていない場合の表示
  if (problems.length === 0) {
    return (
      <main>
        <h2>{quiz.title}</h2>
        <p>このクイズにはまだ問題がありません。</p>
        <Link to="/">クイズ一覧に戻る</Link>
      </main>
    );
  }

  // 現在表示する問題のデータを取得
  const currentProblem = problems[currentProblemIndex];

  return (
    <main>
      <h2>{quiz.title}</h2>
      <h3>問題 {currentProblemIndex + 1} / {problems.length}</h3> {/* 現在の問題数と総問題数 */}
      
      {/* 問題表示エリア */}
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h4>{currentProblem.question}</h4> {/* 問題文 */}
        
        {/* 「解答を見る」ボタン（解答がまだ表示されていない場合のみ表示） */}
        {!showAnswer && (
          <button 
            onClick={() => setShowAnswer(true)} 
            style={{ 
              marginTop: '15px', 
              padding: '8px 15px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer' 
            }}
          >
            解答を見る
          </button>
        )}

        {/* 解答と解説エリア（解答が表示されている場合のみ表示） */}
        {showAnswer && (
          <div style={{ 
            marginTop: '20px', 
            backgroundColor: '#f9f9f9', 
            padding: '15px', 
            borderRadius: '5px', 
            borderLeft: '3px solid #007bff' // 左側に青い線で装飾
          }}>
            <h4>解答:</h4>
            <p>{currentProblem.answer}</p>
            <h4>解説:</h4>
            <p>{currentProblem.explanation}</p>
          </div>
        )}
      </div>

      {/* 問題ナビゲーションボタン */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button
          onClick={handlePreviousProblem}
          disabled={currentProblemIndex === 0} // 最初の問題の場合は無効化
          style={{ 
            padding: '10px 20px', 
            backgroundColor: currentProblemIndex === 0 ? '#ddd' : '#6c757d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: currentProblemIndex === 0 ? 'not-allowed' : 'pointer' 
          }}
        >
          前の問題
        </button>
        <button
          onClick={handleNextProblem}
          disabled={currentProblemIndex === problems.length - 1} // 最後の問題の場合は無効化
          style={{ 
            padding: '10px 20px', 
            backgroundColor: currentProblemIndex === problems.length - 1 ? '#ddd' : '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: currentProblemIndex === problems.length - 1 ? 'not-allowed' : 'pointer' 
          }}
        >
          次の問題
        </button>
      </div>

      {/* クイズ一覧に戻るリンク */}
      <div style={{ marginTop: '30px' }}>
        <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>
          &larr; クイズ一覧に戻る
        </Link>
      </div>
    </main>
  );
}

export default QuizDetail;