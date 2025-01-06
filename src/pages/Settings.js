import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Hyperparameters from '../components/Hyperparameters';

const Settings = () => {
  const { currentUser, updateProfile, updatePassword } = useAuth();
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
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
    }
  }, [currentUser]);

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

  const handleHyperparametersSave = (newHyperparams) => {
    setHyperparams(newHyperparams);
    // 필요에 따라 서버로 하이퍼파라미터를 저장할 수 있습니다.
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
        <h2>기본 하이퍼파라미터 설정</h2>
        <Hyperparameters onSave={handleHyperparametersSave} initialParams={hyperparams} />
      </section>
      
      <section style={styles.section}>
        <h2>애플리케이션 설정</h2>
        {/* 애플리케이션 설정 폼을 추가할 수 있습니다 */}
        <p>현재는 기본 하이퍼파라미터 설정만 가능합니다. 추가 설정은 추후 업데이트 예정입니다.</p>
      </section>
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
