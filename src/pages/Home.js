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
  const [hyperparams, setHyperparams] = useState({
    learningRate: 0.001,
    batchSize: 32,
    epochs: 10,
  });

  const handlePromptSubmit = async (prompt) => {
    setLoading(true);
    setError(null);

    try {
      // API 키 가져오기
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      
      if (!userDoc.exists() || !userDoc.data().apiKey) {
        throw new Error(
          '설정에서 API 키를 먼저 입력해주세요. Settings 메뉴에서 OpenAI API 키를 등록할 수 있습니다.'
        );
      }

      const apiKey = userDoc.data().apiKey;

      // OpenAI API 요청
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              "role": "user",
              "content": prompt
            }
          ],
          temperature: hyperparams.learningRate,  // 적절한 매핑이 필요할 수 있습니다
          max_tokens: hyperparams.batchSize * 10  // 적절한 매핑이 필요할 수 있습니다
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API 요청 실패');
      }

      const data = await response.json();
      setOutputData(data.choices[0].message.content);
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
