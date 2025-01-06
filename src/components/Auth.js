// src/components/Auth.js
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Auth = () => {
  const { currentUser, login, signup, logout } = useAuth();
  const [isLogin, setIsLogin] = useState(true); // 로그인 또는 회원가입 전환
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (err) {
      setError('인증에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div>
      {currentUser ? (
        <div>
          <p>안녕하세요, {currentUser.email}님!</p>
          <button onClick={logout}>로그아웃</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>{isLogin ? '로그인' : '회원가입'}</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div>
            <label>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label>Password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit">{isLogin ? '로그인' : '회원가입'}</button>
          <p>
            {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}{' '}
            <button type="button" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? '회원가입' : '로그인'}
            </button>
          </p>
        </form>
      )}
    </div>
  );
};

export default Auth;
