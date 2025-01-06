import React, { useState } from 'react';
import Auth from '../components/Auth';
import PromptInput from '../components/PromptInput';
import Hyperparameters from '../components/Hyperparameters';
import Output from '../components/Output';
import { useAuth } from '../hooks/useAuth';
import '../styles/Home.css';  // 새로 생성할 CSS 파일

const Home = () => {
  const { currentUser } = useAuth();
  const [outputData, setOutputData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hyperparams, setHyperparams] = useState({
    learningRate: 0.001,
    batchSize: 32,
    epochs: 10,
  });

  const handlePromptSubmit = async (prompt) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/process-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, hyperparams }),
      });
      if (!response.ok) {
        throw new Error('API 요청 실패');
      }
      const data = await response.json();
      setOutputData(data);
    } catch (err) {
      setError(err.message || '프롬프트 처리에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleHyperparametersSave = (newHyperparams) => {
    setHyperparams(newHyperparams);
    console.log('저장된 하이퍼파라미터:', newHyperparams);
  };

  if (!currentUser) {
    return (
      <div className="auth-container">
        <h1 className="auth-title">환영합니다!</h1>
        <Auth />
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="main-title">AI 프롬프트 애플리케이션</h1>
      
      <section className="section">
        <PromptInput onSubmit={handlePromptSubmit} />
      </section>

      <section className="section">
        <Hyperparameters 
          onSave={handleHyperparametersSave} 
          initialParams={hyperparams} 
        />
      </section>

      <section className="section">
        <Output 
          data={outputData} 
          loading={loading} 
          error={error} 
        />
      </section>
    </div>
  );
};

export default Home;
