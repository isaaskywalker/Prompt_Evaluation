// src/components/Hyperparameters.js
import React, { useState } from 'react';

const Hyperparameters = ({ onSave }) => {
  const [learningRate, setLearningRate] = useState(0.001);
  const [batchSize, setBatchSize] = useState(32);
  const [epochs, setEpochs] = useState(10);

  const handleSubmit = (e) => {
    e.preventDefault();
    const hyperparams = { learningRate, batchSize, epochs };
    onSave(hyperparams);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>하이퍼파라미터 설정</h2>
      <div>
        <label>학습률 (Learning Rate): </label>
        <input 
          type="number" 
          step="0.0001" 
          value={learningRate} 
          onChange={(e) => setLearningRate(parseFloat(e.target.value))}
          required 
        />
      </div>
      <div>
        <label>배치 크기 (Batch Size): </label>
        <input 
          type="number" 
          value={batchSize} 
          onChange={(e) => setBatchSize(parseInt(e.target.value))}
          required 
        />
      </div>
      <div>
        <label>에포크 수 (Epochs): </label>
        <input 
          type="number" 
          value={epochs} 
          onChange={(e) => setEpochs(parseInt(e.target.value))}
          required 
        />
      </div>
      <button type="submit">저장</button>
    </form>
  );
};

export default Hyperparameters;
