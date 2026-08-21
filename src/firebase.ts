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
  getDoc,
  setDoc,
  updateDoc,
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
  if (!auth || !db) {
    throw new Error('Firebase chưa được cấu hình.');
  }

  const result = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, 'users', result.user.uid), {
    email: result.user.email ?? email,
    role: 'member',
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
  return result.user;
}

export type AccountProfile = {
  email: string;
  role: 'member' | 'admin';
  status: 'pending' | 'approved';
};

export async function getAccountProfile(uid: string): Promise<AccountProfile | null> {
  if (!db) {
    throw new Error('Firestore chưa được cấu hình.');
  }

  const snapshot = await getDoc(doc(db, 'users', uid));
  return snapshot.exists() ? (snapshot.data() as AccountProfile) : null;
}

export async function ensureAccountProfile(uid: string, email: string, isAdmin: boolean): Promise<AccountProfile> {
  if (!db) {
    throw new Error('Firestore chưa được cấu hình.');
  }

  let existingProfile: AccountProfile | null = null;
  try {
    existingProfile = await getAccountProfile(uid);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Missing or insufficient permissions')) {
      return {
        email,
        role: isAdmin ? 'admin' : 'member',
        status: 'approved',
      };
    }
    throw error;
  }

  if (existingProfile) {
    return existingProfile;
  }

  const profile: AccountProfile = {
    email,
    role: isAdmin ? 'admin' : 'member',
    status: isAdmin ? 'approved' : 'pending',
  };
  await setDoc(doc(db, 'users', uid), profile);
  return profile;
}

export async function fetchPendingAccounts(): Promise<Array<AccountProfile & { id: string }>> {
  if (!db) {
    throw new Error('Firestore chưa được cấu hình.');
  }

  const snapshot = await getDocs(collection(db, 'users'));
  return snapshot.docs
    .map((account) => ({ id: account.id, ...(account.data() as AccountProfile) }))
    .filter((account) => account.status === 'pending');
}

export async function approveAccount(uid: string) {
  if (!db) {
    throw new Error('Firestore chưa được cấu hình.');
  }

  await updateDoc(doc(db, 'users', uid), { status: 'approved' });
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
