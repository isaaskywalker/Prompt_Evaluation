import React, { useState } from 'react';

const Hyperparameters = ({ onSave }) => {
  // Existing hyperparameters
  const [learningRate, setLearningRate] = useState(0.001);
  const [batchSize, setBatchSize] = useState(32);
  const [epochs, setEpochs] = useState(10);

  // New hyperparameters
  const [temperature, setTemperature] = useState(0.7);
  const [topK, setTopK] = useState(40);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0.0);
  const [presencePenalty, setPresencePenalty] = useState(0.0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const hyperparams = {
      learningRate,
      batchSize,
      epochs,
      temperature,
      topK,
      frequencyPenalty,
      presencePenalty
    };
    onSave(hyperparams);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>하이퍼파라미터 설정</h2>
      
      {/* Existing hyperparameters */}
      <div className="mb-4">
        <label className="block mb-2">학습률 (Learning Rate): </label>
        <input 
          type="number" 
          step="0.0001" 
          value={learningRate} 
          onChange={(e) => setLearningRate(parseFloat(e.target.value))}
          className="w-full p-2 border rounded"
          required 
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">배치 크기 (Batch Size): </label>
        <input 
          type="number" 
          value={batchSize} 
          onChange={(e) => setBatchSize(parseInt(e.target.value))}
          className="w-full p-2 border rounded"
          required 
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">에포크 수 (Epochs): </label>
        <input 
          type="number" 
          value={epochs} 
          onChange={(e) => setEpochs(parseInt(e.target.value))}
          className="w-full p-2 border rounded"
          required 
        />
      </div>

      {/* New hyperparameters */}
      <div className="mb-4">
        <label className="block mb-2">Temperature: </label>
        <input 
          type="number" 
          step="0.1" 
          min="0" 
          max="2" 
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="w-full p-2 border rounded"
          required 
        />
        <small className="text-gray-500">Controls randomness (0.0 to 2.0)</small>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Top K: </label>
        <input 
          type="number" 
          min="1" 
          max="100" 
          value={topK}
          onChange={(e) => setTopK(parseInt(e.target.value))}
          className="w-full p-2 border rounded"
          required 
        />
        <small className="text-gray-500">Controls diversity (1 to 100)</small>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Frequency Penalty: </label>
        <input 
          type="number" 
          step="0.1" 
          min="-2.0" 
          max="2.0" 
          value={frequencyPenalty}
          onChange={(e) => setFrequencyPenalty(parseFloat(e.target.value))}
          className="w-full p-2 border rounded"
          required 
        />
        <small className="text-gray-500">Prevents repetition (-2.0 to 2.0)</small>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Presence Penalty: </label>
        <input 
          type="number" 
          step="0.1" 
          min="-2.0" 
          max="2.0" 
          value={presencePenalty}
          onChange={(e) => setPresencePenalty(parseFloat(e.target.value))}
          className="w-full p-2 border rounded"
          required 
        />
        <small className="text-gray-500">Encourages new topics (-2.0 to 2.0)</small>
      </div>

      <button 
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        저장
      </button>
    </form>
  );
};

export default Hyperparameters;
