import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// 다른 Firebase 서비스도 필요에 따라 임포트하세요

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  // 기타 설정
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
