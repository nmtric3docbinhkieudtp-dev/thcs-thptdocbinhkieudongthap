import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';

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

export type FirebaseUser = User;
