// src/utils/evaluation.js

/**
 * 레벤슈타인 거리 계산 함수
 * @param {string} a 첫 번째 문자열
 * @param {string} b 두 번째 문자열
 * @returns {number} 레벤슈타인 거리
 */
const levenshteinDistance = (a, b) => {
  const matrix = [];

  // 초기화
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // 동적 프로그래밍을 통한 거리 계산
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,    // 삭제
          matrix[i][j - 1] + 1,    // 삽입
          matrix[i - 1][j - 1] + 1 // 교체
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

/**
 * 간단한 레벤슈타인 거리(Levenshtein Distance) 알고리즘을 사용하여 두 문자열 간의 유사도를 계산합니다.
 * @param {string} a 첫 번째 문자열
 * @param {string} b 두 번째 문자열
 * @returns {number} 두 문자열 간의 유사도 (0~1 사이의 값)
 */
export const calculateTextSimilarity = (a, b) => {
  if (!a || !b) return 0;

  const distance = levenshteinDistance(a, b);
  const maxLen = Math.max(a.length, b.length);
  return maxLen === 0 ? 1 : 1 - distance / maxLen;
};

/**
 * 이진 분류 모델의 정확도를 계산합니다.
 * @param {Array} predictions 모델의 예측값 배열 (0 또는 1)
 * @param {Array} actual 실제 값 배열 (0 또는 1)
 * @returns {number} 정확도 (0~1 사이의 값)
 */
export const calculateAccuracy = (predictions, actual) => {
  if (!Array.isArray(predictions) || !Array.isArray(actual)) {
    throw new Error('predictions와 actual은 배열이어야 합니다.');
  }
  if (predictions.length !== actual.length) {
    throw new Error('predictions과 actual 배열의 길이는 같아야 합니다.');
  }

  const correct = predictions.reduce((acc, pred, idx) => (pred === actual[idx] ? acc + 1 : acc), 0);
  return predictions.length === 0 ? 0 : correct / predictions.length;
};

/**
 * 다중 클래스 분류 모델의 정확도를 계산합니다.
 * @param {Array} predictions 모델의 예측값 배열
 * @param {Array} actual 실제 값 배열
 * @returns {number} 정확도 (0~1 사이의 값)
 */
export const calculateMultiClassAccuracy = (predictions, actual) => {
  return calculateAccuracy(predictions, actual);
};

/**
 * 배열의 평균을 계산합니다.
 * @param {Array<number>} data 숫자 배열
 * @returns {number} 평균값
 */
export const calculateMean = (data) => {
  if (!Array.isArray(data) || data.length === 0) return 0;
  const sum = data.reduce((acc, val) => acc + val, 0);
  return sum / data.length;
};

/**
 * 배열의 분산을 계산합니다.
 * @param {Array<number>} data 숫자 배열
 * @returns {number} 분산
 */
export const calculateVariance = (data) => {
  if (!Array.isArray(data) || data.length === 0) return 0;
  const mean = calculateMean(data);
  const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
  return variance;
};

/**
 * 배열의 표준 편차를 계산합니다.
 * @param {Array<number>} data 숫자 배열
 * @returns {number} 표준 편차
 */
export const calculateStandardDeviation = (data) => {
  return Math.sqrt(calculateVariance(data));
};
