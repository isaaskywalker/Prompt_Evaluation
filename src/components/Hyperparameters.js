import React, { useState } from 'react';

const Hyperparameters = ({ onSave }) => {
  // Existing ML hyperparameters
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
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-6 text-center">하이퍼파라미터 설정</h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - ML Hyperparameters */}
        <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">ML Hyperparameters</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-2">학습률 (Learning Rate): </label>
              <input 
                type="number" 
                step="0.0001" 
                value={learningRate} 
                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required 
              />
            </div>

            <div>
              <label className="block mb-2">배치 크기 (Batch Size): </label>
              <input 
                type="number" 
                value={batchSize} 
                onChange={(e) => setBatchSize(parseInt(e.target.value))}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required 
              />
            </div>

            <div>
              <label className="block mb-2">에포크 수 (Epochs): </label>
              <input 
                type="number" 
                value={epochs} 
                onChange={(e) => setEpochs(parseInt(e.target.value))}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required 
              />
            </div>
          </div>
        </div>

        {/* Right Column - GPT Hyperparameters */}
        <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">GPT Hyperparameters</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Temperature: </label>
              <input 
                type="number" 
                step="0.1" 
                min="0" 
                max="2" 
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required 
              />
              <small className="text-gray-500">Controls randomness (0.0 to 2.0)</small>
            </div>

            <div>
              <label className="block mb-2">Top K: </label>
              <input 
                type="number" 
                min="1" 
                max="100" 
                value={topK}
                onChange={(e) => setTopK(parseInt(e.target.value))}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required 
              />
              <small className="text-gray-500">Controls diversity (1 to 100)</small>
            </div>

            <div>
              <label className="block mb-2">Frequency Penalty: </label>
              <input 
                type="number" 
                step="0.1" 
                min="-2.0" 
                max="2.0" 
                value={frequencyPenalty}
                onChange={(e) => setFrequencyPenalty(parseFloat(e.target.value))}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required 
              />
              <small className="text-gray-500">Prevents repetition (-2.0 to 2.0)</small>
            </div>

            <div>
              <label className="block mb-2">Presence Penalty: </label>
              <input 
                type="number" 
                step="0.1" 
                min="-2.0" 
                max="2.0" 
                value={presencePenalty}
                onChange={(e) => setPresencePenalty(parseFloat(e.target.value))}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required 
              />
              <small className="text-gray-500">Encourages new topics (-2.0 to 2.0)</small>
            </div>
          </div>
        </div>

        {/* Submit Button - Full Width */}
        <div className="col-span-1 md:col-span-2 mt-6">
          <button 
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            저장
          </button>
        </div>
      </form>
    </div>
  );
};

export default Hyperparameters;
