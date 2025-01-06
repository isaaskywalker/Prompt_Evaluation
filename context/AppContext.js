import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [apiKeys, setApiKeys] = useState({
        openAI: '',
        claude: '',
        gemini: '',
    });
    const [prompt, setPrompt] = useState('');
    const [selectedModel, setSelectedModel] = useState('OpenAI');
    const [hyperparameters, setHyperparameters] = useState({
        temperature: 0.7,
        maxTokens: 150,
        // 기타 하이퍼파라미터
    });
    const [output, setOutput] = useState(null);
    const [evaluation, setEvaluation] = useState(null);

    return (
        <AppContext.Provider value={{
            user, setUser,
            apiKeys, setApiKeys,
            prompt, setPrompt,
            selectedModel, setSelectedModel,
            hyperparameters, setHyperparameters,
            output, setOutput,
            evaluation, setEvaluation
        }}>
            {children}
        </AppContext.Provider>
    );
};
