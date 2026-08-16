import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId,
);

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

export async function firebaseSignIn(email: string, password: string) {
  if (!auth) {
    throw new Error('Firebase chưa được cấu hình.');
  }

  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function firebaseSignUp(email: string, password: string) {
  if (!auth) {
    throw new Error('Firebase chưa được cấu hình.');
  }

  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function firebaseLogout() {
  if (!auth) {
    return;
  }

  await signOut(auth);
}

// Lưu báo cáo lên Cloud Firestore
export async function saveReportToFirestore(report: any) {
  if (!db) {
    throw new Error('Firestore chưa được cấu hình.');
  }
  const docRef = doc(db, 'reports', report.id);
  await setDoc(docRef, report);
}

// Lấy tất cả báo cáo từ Cloud Firestore sắp xếp theo ngày gửi giảm dần
export async function fetchAllReportsFromFirestore() {
  if (!db) {
    return [];
  }
  const reportsCol = collection(db, 'reports');
  const q = query(reportsCol, orderBy('submittedAt', 'desc'));
  const querySnapshot = await getDocs(q);
  const reports: any[] = [];
  querySnapshot.forEach((docSnap) => {
    reports.push(docSnap.data());
  });
  return reports;
}

export type FirebaseUser = User;
