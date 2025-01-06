import React, { useState } from 'react';
import Auth from '../components/Auth';
import PromptInput from '../components/PromptInput';
import Hyperparameters from '../components/Hyperparameters';
import Output from '../components/Output';
import { useAuth } from '../hooks/useAuth';

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
      // 실제 API 호출 부분. 예를 들어 OpenAI API를 호출할 수 있습니다.
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
    // 필요한 경우 서버로 하이퍼파라미터를 저장할 수 있습니다.
    console.log('저장된 하이퍼파라미터:', newHyperparams);
  };

  if (!currentUser) {
    return (
      <div>
        <h1>환영합니다!</h1>
        <Auth />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>AI 프롬프트 애플리케이션</h1>
      <div style={styles.section}>
        <PromptInput onSubmit={handlePromptSubmit} />
      </div>
      <div style={styles.section}>
        <Hyperparameters onSave={handleHyperparametersSave} initialParams={hyperparams} />
      </div>
      <div style={styles.section}>
        <Output data={outputData} loading={loading} error={error} />
      </div>
    </div>
  );
};

// 간단한 인라인 스타일링 예시
const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  section: {
    marginBottom: '20px',
  },
};

export default Home;
