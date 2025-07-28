import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './buttons.css'; // 新しいCSSをインポート

function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert('ログインに失敗しました: ' + error.message);
      else alert('ログインしました！');
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert('サインアップに失敗しました: ' + error.message);
      else alert('確認メールを送信しました。メールを確認してください。');
    }
  };

  return (
    <div>
      <h2>{isLogin ? 'ログイン' : '新規登録'}</h2>
      <form onSubmit={handleAuth} className="quiz-form">
        <div>
          <label>メールアドレス:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>パスワード:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-actions">
           {/* className="button" を追加 */}
          <button type="submit" className="button">{isLogin ? 'ログイン' : '登録'}</button>
        </div>
      </form>
      {/* className="button button-secondary" を追加 */}
      <button onClick={() => setIsLogin(!isLogin)} className="button button-secondary" style={{ marginTop: '10px' }}>
        {isLogin ? '新規登録はこちら' : 'ログインはこちら'}
      </button>
    </div>
  );
}

export default AuthPage;