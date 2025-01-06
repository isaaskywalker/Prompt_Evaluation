import axios from 'axios';

// 기본 설정
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '', // 환경 변수로 API 기본 URL 설정
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (필요 시 인증 토큰 추가)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // 예: 로컬 스토리지에 저장된 토큰
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 (에러 통합 처리)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 여기서 에러 로깅 또는 특정 에러 처리
    // 예: 인증 에러 처리
    if (error.response && error.response.status === 401) {
      // 로그아웃 처리 또는 리다이렉션
      console.error('인증 실패: 로그인 필요');
    }
    return Promise.reject(error);
  }
);

/**
 * 프롬프트 처리 API 호출
 * @param {string} prompt 사용자 입력 프롬프트
 * @param {object} hyperparams 하이퍼파라미터 설정
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const processPrompt = async (prompt, hyperparams) => {
  try {
    const response = await apiClient.post('/api/process-prompt', {
      prompt,
      hyperparams,
    });
    return response.data;
  } catch (error) {
    // 에러 처리는 인터셉터에서 이미 수행했지만, 추가적인 처리 필요 시
    throw error;
  }
};

/**
 * 사용자 데이터 가져오기 API 호출
 * @returns {Promise<object>} 사용자 데이터
 */
export const getUserData = async () => {
  try {
    const response = await apiClient.get('/api/user');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 사용자 프로필 업데이트 API 호출
 * @param {object} profileData 업데이트할 프로필 데이터
 * @returns {Promise<object>} 업데이트된 사용자 데이터
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await apiClient.put('/api/user/profile', profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 하이퍼파라미터 기본 값 가져오기
 * @returns {Promise<object>} 하이퍼파라미터 기본 값
 */
export const getDefaultHyperparams = async () => {
  try {
    const response = await apiClient.get('/api/hyperparams/default');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 하이퍼파라미터 기본 값 업데이트
 * @param {object} hyperparams 업데이트할 하이퍼파라미터 데이터
 * @returns {Promise<object>} 업데이트된 하이퍼파라미터 데이터
 */
export const updateDefaultHyperparams = async (hyperparams) => {
  try {
    const response = await apiClient.put('/api/hyperparams/default', hyperparams);
    return response.data;
  } catch (error) {
    throw error;
  }
};
