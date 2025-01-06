// src/components/PromptInput.js
import React, { useState } from 'react';

const PromptInput = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() === '') {
      setError('프롬프트를 입력해주세요.');
      return;
    }
    setError('');
    onSubmit(prompt);
    setPrompt('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>프롬프트 입력</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <textarea 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)} 
          placeholder="질문이나 명령어를 입력하세요..." 
          rows="4" 
          cols="50" 
          required 
        />
      </div>
      <button type="submit">전송</button>
    </form>
  );
};

export default PromptInput;
