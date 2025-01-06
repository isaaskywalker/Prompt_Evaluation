// src/pages/Settings.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Hyperparameters from '../components/Hyperparameters';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// 스타일 타입 정의
interface StylesType {
  container: React.CSSProperties;
  section: React.CSSProperties;
  form: React.CSSProperties;
  formGroup: React.CSSProperties;
}

const Settings: React.FC = () => {
  const { currentUser, updateProfile, updatePassword } = useAuth();
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [claudeApiKey, setClaudeApiKey] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
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

  // ... 나머지 함수들은 동일하게 유지 ...

  const handleApiKeysSave = async (e: React.FormEvent) => {
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
      if (err instanceof Error) {
        setErrors({ ...errors, apiKey: err.message });
      }
    }
  };

  // ... JSX 부분은 동일하게 유지 ...

};

const styles: StylesType = {
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
