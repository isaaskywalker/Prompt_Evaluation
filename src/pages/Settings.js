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
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [gpt4ApiKey, setGpt4ApiKey] = useState('');  // GPT-4.0 API 키 추가
  const [claudeApiKey, setClaudeApiKey] = useState('');
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
        const data = userDoc.data();
        setOpenaiApiKey(data.openaiApiKey || '');
        setGpt4ApiKey(data.gpt4ApiKey || '');  // GPT-4.0 API 키 로드
        setClaudeApiKey(data.claudeApiKey || '');
      }
    }
  };

  const handleApiKeysSave = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      await setDoc(doc(db, 'users', currentUser.uid), 
        { 
          openaiApiKey,
          gpt4ApiKey,  // GPT-4.0 API 키 저장
          claudeApiKey 
        }, 
        { merge: true }
      );
      setSuccess('API 키가 성공적으로 저장되었습니다.');
    } catch (err) {
      setErrors({ ...errors, apiKey: err.message });
    }
  };

  const handleHyperparametersSave = (newHyperparams) => {
    setHyperparams(newHyperparams);
    setSuccess('하이퍼파라미터가 성공적으로 저장되었습니다.');
  };

  return (
    <div style={styles.container}>
      <section style={styles.section}>
        <h2>계정 설정</h2>
        <form style={styles.form}>
          <div style={styles.formGroup}>
            <label>이메일:</label>
            <input
              type="email"
              value={email}
              disabled
              placeholder="이메일을 입력하세요"
            />
          </div>
          <div style={styles.formGroup}>
            <label>사용자 이름:</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="사용자 이름을 입력하세요"
            />
          </div>
          <div style={styles.formGroup}>
            <label>새 비밀번호:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="새 비밀번호를 입력하세요"
            />
          </div>
          <div style={styles.formGroup}>
            <label>비밀번호 확인:</label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
            />
          </div>
        </form>
      </section>

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
            <label>GPT-4.0 API 키:</label>
            <input
              type="password"
              value={gpt4ApiKey}
              onChange={(e) => setGpt4ApiKey(e.target.value)}
              placeholder="GPT-4.0 API 키를 입력하세요"
            />
            <small style={styles.helperText}>
              GPT-4.0을 사용하기 위한 별도의 API 키를 입력하세요
            </small>
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
          <button type="submit" style={styles.button}>API 키 저장</button>
        </form>
      </section>

      <section style={styles.section}>
        <h2>하이퍼파라미터 설정</h2>
        <Hyperparameters
          initialValues={hyperparams}
          onSave={handleHyperparametersSave}
        />
      </section>

      {success && <div style={styles.success}>{success}</div>}
      {Object.keys(errors).length > 0 && (
        <div style={styles.error}>
          {Object.values(errors).map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  section: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  success: {
    padding: '10px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '4px',
    marginTop: '10px',
  },
  error: {
    padding: '10px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '4px',
    marginTop: '10px',
  },
  helperText: {
    fontSize: '0.875rem',
    color: '#6c757d',
    marginTop: '4px',
  }
};

export default Settings;
