import React, { useState } from 'react';
import '../styles/layout/Grid.css';

const Hyperparameters = ({ onSave }) => {
  // ML hyperparameters
  const [learningRate, setLearningRate] = useState(0.001);
  const [batchSize, setBatchSize] = useState(32);
  const [epochs, setEpochs] = useState(10);

  // GPT hyperparameters
  const [temperature, setTemperature] = useState(0.7);
  const [topK, setTopK] = useState(40);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0.0);
  const [presencePenalty, setPresencePenalty] = useState(0.0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      learningRate,
      batchSize,
      epochs,
      temperature,
      topK,
      frequencyPenalty,
      presencePenalty
    });
  };

  return (
    <div className="container">
      <h2>하이퍼파라미터 설정</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="hyperparameters-grid">
          {/* ML Hyperparameters Card */}
          <div className="hyperparameters-card">
            <h3>ML Hyperparameters</h3>
            
            <div className="form-group">
              <label>학습률 (Learning Rate): </label>
              <input 
                type="number" 
                step="0.0001" 
                value={learningRate} 
                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                required 
              />
            </div>

            <div className="form-group">
              <label>배치 크기 (Batch Size): </label>
              <input 
                type="number" 
                value={batchSize} 
                onChange={(e) => setBatchSize(parseInt(e.target.value))}
                required 
              />
            </div>

            <div className="form-group">
              <label>에포크 수 (Epochs): </label>
              <input 
                type="number" 
                value={epochs} 
                onChange={(e) => setEpochs(parseInt(e.target.value))}
                required 
              />
            </div>
          </div>

          {/* GPT Hyperparameters Card */}
          <div className="hyperparameters-card">
            <h3>GPT Hyperparameters</h3>
            
            <div className="form-group">
              <label>Temperature: </label>
              <input 
                type="number" 
                step="0.1" 
                min="0" 
                max="2" 
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                required 
              />
              <small>Controls randomness (0.0 to 2.0)</small>
            </div>

            <div className="form-group">
              <label>Top K: </label>
              <input 
                type="number" 
                min="1" 
                max="100" 
                value={topK}
                onChange={(e) => setTopK(parseInt(e.target.value))}
                required 
              />
              <small>Controls diversity (1 to 100)</small>
            </div>

            <div className="form-group">
              <label>Frequency Penalty: </label>
              <input 
                type="number" 
                step="0.1" 
                min="-2.0" 
                max="2.0" 
                value={frequencyPenalty}
                onChange={(e) => setFrequencyPenalty(parseFloat(e.target.value))}
                required 
              />
              <small>Prevents repetition (-2.0 to 2.0)</small>
            </div>

            <div className="form-group">
              <label>Presence Penalty: </label>
              <input 
                type="number" 
                step="0.1" 
                min="-2.0" 
                max="2.0" 
                value={presencePenalty}
                onChange={(e) => setPresencePenalty(parseFloat(e.target.value))}
                required 
              />
              <small>Encourages new topics (-2.0 to 2.0)</small>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <button 
              type="submit"
              style={{
                width: '100%',
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              저장
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Hyperparameters;
