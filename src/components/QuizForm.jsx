// src/components/QuizForm.jsx
import React from 'react';

// コンポーネント定義の前に 'export default' をつける
export default function QuizForm() {
  return (
    <div>
      <h2>新しいクイズを作成</h2>
      {/* ここにクイズ作成フォームの要素が入ります */}
      <form>
        {/* 例: <label>タイトル:</label> <input type="text" /> */}
        {/* 例: <button type="submit">保存</button> */}
      </form>
    </div>
  );
}