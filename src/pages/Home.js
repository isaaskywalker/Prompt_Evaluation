import React, { useState } from 'react';
import Auth from '../components/Auth';
import PromptInput from '../components/PromptInput';
import Hyperparameters from '../components/Hyperparameters';
import Output from '../components/Output';
import { useAuth } from '../hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/Home.css';

const Home = () => {
  const { currentUser } = useAuth();
  const [outputData, setOutputData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedApi, setSelectedApi] = useState('openai');
  const [hyperparams, setHyperparams] = useState({
    learningRate: 0.001,
    batchSize: 32,
    epochs: 10,
  });

  const handlePromptSubmit = async (prompt) => {
    setLoading(true);
    setError(null);

    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      
      if (!userDoc.exists()) {
        throw new Error('사용자 설정을 찾을 수 없습니다.');
      }

      const userData = userDoc.data();
      const openaiApiKey = userData.openaiApiKey;
      const claudeApiKey = userData.claudeApiKey;

      if (selectedApi === 'openai' && !openaiApiKey) {
        throw new Error('OpenAI API 키를 설정에서 먼저 입력해주세요.');
      }
      if (selectedApi === 'claude' && !claudeApiKey) {
        throw new Error('Claude API 키를 설정에서 먼저 입력해주세요.');
      }

      let response;
      let formattedOutput;

      if (selectedApi === 'openai') {
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiApiKey}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ "role": "user", "content": prompt }],
            temperature: hyperparams.learningRate,
            max_tokens: hyperparams.batchSize * 10
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error?.message || 'OpenAI API 요청 실패');
        }
        formattedOutput = data.choices[0].message.content;

      } else {
        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': claudeApiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: "claude-3-opus-20240229",
            max_tokens: hyperparams.batchSize * 10,
            messages: [{ "role": "user", "content": prompt }]
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error?.message || 'Claude API 요청 실패');
        }
        formattedOutput = data.content[0].text;
      }

      setOutputData(formattedOutput);

    } catch (err) {
      setError(err.message || '프롬프트 처리에 실패했습니다.');
      console.error('API 요청 오류:', err);
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
        <div className="api-selector">
          <label>AI 모델 선택:</label>
          <select 
            value={selectedApi} 
            onChange={(e) => setSelectedApi(e.target.value)}
            className="api-select"
          >
            <option value="openai">OpenAI GPT-3.5</option>
            <option value="claude">Anthropic Claude</option>
          </select>
        </div>
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
