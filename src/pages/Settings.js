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
  const [apiKey, setApiKey] = useState('');  // API 키 state 추가
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
      // API 키 로드
      loadApiKey();
    }
  }, [currentUser]);

  // API 키 로드 함수
  const loadApiKey = async () => {
    if (currentUser) {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        setApiKey(userDoc.data().apiKey || '');
      }
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');
    let valid = true;
    const newErrors = {};

    if (password && password !== passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    try {
      if (displayName !== currentUser.displayName) {
        await updateProfile({ displayName });
      }
      if (email !== currentUser.email) {
        await updateProfile({ email });
      }
      if (password) {
        await updatePassword(password);
      }
      setSuccess('프로필이 성공적으로 업데이트되었습니다.');
    } catch (err) {
      setErrors({ submit: err.message });
    }
  };

  const handleApiKeySave = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      await setDoc(doc(db, 'users', currentUser.uid), 
        { apiKey }, 
        { merge: true }
      );
      setSuccess('API 키가 성공적으로 저장되었습니다.');
    } catch (err) {
      setErrors({ ...errors, apiKey: err.message });
    }
  };

  const handleHyperparametersSave = (newHyperparams) => {
    setHyperparams(newHyperparams);
    console.log('저장된 기본 하이퍼파라미터:', newHyperparams);
  };

  return (
    <div style={styles.container}>
      <h1>설정</h1>
      
      <section style={styles.section}>
        <h2>계정 정보 수정</h2>
        {success && <p style={{ color: 'green' }}>{success}</p>}
        {errors.submit && <p style={{ color: 'red' }}>{errors.submit}</p>}
        <form onSubmit={handleProfileUpdate} style={styles.form}>
          <div style={styles.formGroup}>
            <label>이름:</label>
            <input 
              type="text" 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)} 
            />
          </div>
          <div style={styles.formGroup}>
            <label>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div style={styles.formGroup}>
            <label>새 비밀번호:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="비밀번호를 변경하려면 입력하세요"
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
            {errors.passwordConfirm && <p style={{ color: 'red' }}>{errors.passwordConfirm}</p>}
          </div>
          <button type="submit">프로필 업데이트</button>
        </form>
      </section>
      
      <section style={styles.section}>
        <h2>API 설정</h2>
        <form onSubmit={handleApiKeySave} style={styles.form}>
          <div style={styles.formGroup}>
            <label>API 키:</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="OpenAI API 키를 입력하세요"
              required
            />
          </div>
          <button type="submit">API 키 저장</button>
        </form>
      </section>

      <section style={styles.section}>
        <h2>기본 하이퍼파라미터 설정</h2>
        <Hyperparameters onSave={handleHyperparametersSave} initialParams={hyperparams} />
      </section>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  section: {
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
  },
};

export default Settings;
