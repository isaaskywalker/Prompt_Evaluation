import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Hyperparameters from '../components/Hyperparameters';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Settings = () => {
  const { currentUser, updateProfile, updatePassword } = useAuth();
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');  // OpenAI API 키
  const [claudeApiKey, setClaudeApiKey] = useState('');  // Claude API 키
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [hyperparams, setHyperparams] = useState({
    learningRate: 0.001,
    batchSize: 32,
    epochs: 10,
  });

  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email || '');
      setDisplayName(currentUser.displayName || '');
      loadApiKeys();
    }
  }, [currentUser]);

  const loadApiKeys = async () => {
    if (currentUser) {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        setOpenaiApiKey(userDoc.data().openaiApiKey || '');
        setClaudeApiKey(userDoc.data().claudeApiKey || '');
      }
    }
  };

  // ... handleProfileUpdate 함수는 그대로 유지 ...

  const handleApiKeysSave = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      await setDoc(doc(db, 'users', currentUser.uid), 
        { 
          openaiApiKey: openaiApiKey,
          claudeApiKey: claudeApiKey 
        }, 
        { merge: true }
      );
      setSuccess('API 키가 성공적으로 저장되었습니다.');
    } catch (err) {
      setErrors({ ...errors, apiKey: err.message });
    }
  };

  // ... handleHyperparametersSave 함수는 그대로 유지 ...

  return (
    <div style={styles.container}>
      {/* ... 계정 정보 수정 섹션은 그대로 유지 ... */}
      
      <section style={styles.section}>
        <h2>API 설정</h2>
        <form onSubmit={handleApiKeysSave} style={styles.form}>
          <div style={styles.formGroup}>
            <label>OpenAI API 키:</label>
            <input
              type="password"
              value={openaiApiKey}
              onChange={(e) => setOpenaiApiKey(e.target.value)}
              placeholder="OpenAI API 키를 입력하세요"
            />
          </div>
          <div style={styles.formGroup}>
            <label>Claude API 키:</label>
            <input
              type="password"
              value={claudeApiKey}
              onChange={(e) => setClaudeApiKey(e.target.value)}
              placeholder="Claude API 키를 입력하세요"
            />
          </div>
          <button type="submit">API 키 저장</button>
        </form>
      </section>

      {/* ... 하이퍼파라미터 섹션은 그대로 유지 ... */}
    </div>
  );
};

// ... styles 객체는 그대로 유지 ...

export default Settings;
