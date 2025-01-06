import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Hyperparameters from '../components/Hyperparameters';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Settings = () => {
  // 상태 관리
  const { currentUser, updateProfile, updatePassword } = useAuth();
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
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
        setClaudeApiKey(data.claudeApiKey || '');
      }
    }
  };

  // 프로필 업데이트 핸들러
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

  // API 키 저장 핸들러
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

  // 하이퍼파라미터 저장 핸들러
  const handleHyperparametersSave = (newHyperparams) => {
    setHyperparams(newHyperparams);
    console.log('저장된 기본 하이퍼파라미터:', newHyperparams);
  };

  // UI 렌더링
  return (
    <div style={styles.container}>
      <h1>설정</h1>
      
      <section style={styles.section}>
        <h2>계정 정보 수정</h2>
        {success && <p style={{ color: 'green' }}>{success}</p>}
        {errors.submit && <p style={{ color: 'red' }}>{errors.submit}</p>}
        <form onSubmit={handleProfileUpdate} style={styles.form}>
          {/* 계정 정보 입력 필드들 */}
          <button type="submit">프로필 업데이트</button>
        </form>
      </section>
      
      <section style={styles.section}>
        <h2>API 설정</h2>
        <form onSubmit={handleApiKeysSave} style={styles.form}>
          {/* API 키 입력 필드들 */}
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

// 스타일 정의
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
