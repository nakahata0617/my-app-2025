function QuizList() {
  // 本来はここにデータベースから取得したクイズのリストが入ります
  const quizzes = [
    { id: 1, title: '応用数学 第1回 小テスト' },
    { id: 2, title: 'ソフトウェア工学 中間試験' },
    { id: 3, title: '待ち行列理論 確認問題' },
  ];

  return (
    <main>
      <h2>クイズ一覧</h2>
      <ul>
        {quizzes.map(quiz => (
          <li key={quiz.id}>{quiz.title}</li>
        ))}
      </ul>
    </main>
  );
}

export default QuizList;