// src/utils/evaluation.js

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
