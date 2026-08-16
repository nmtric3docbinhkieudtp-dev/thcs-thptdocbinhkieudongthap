import {
  auth,
  firebaseSignIn,
  firebaseSignUp,
  isFirebaseConfigured,
} from '../firebase';
import { DEFAULT_PASSWORD, findAccountByEmail, type AuthorizedAccount } from '../accounts';
import type { AppUser, AuthSession } from '../types';

const STORAGE_KEY = 'dbk-auth-session';

function getDemoId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return 'demo-user';
}

export function readStoredSession(): AuthSession | null {
  try {
    const sessionText = window.localStorage.getItem(STORAGE_KEY);
    return sessionText ? (JSON.parse(sessionText) as AuthSession) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: AuthSession) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  window.localStorage.removeItem(STORAGE_KEY);
}

function buildLocalSession(account: AuthorizedAccount): AuthSession {
  const demoUser: AppUser = {
    id: getDemoId(),
    email: account.email,
    name: account.name,
    role: account.role,
    demo: true,
  };

  const demoSession: AuthSession = {
    access_token: 'demo-access-token',
    refresh_token: 'demo-refresh-token',
    user: demoUser,
  };

  saveSession(demoSession);
  return demoSession;
}

export async function signInWithFirebase(email: string, password: string): Promise<AuthSession> {
  const account = findAccountByEmail(email);
  if (!account) {
    throw new Error('Email này chưa được cấp tài khoản. Vui lòng liên hệ quản trị viên (Thầy Nguyễn Minh Trí).');
  }

  if (!isFirebaseConfigured || !auth) {
    if (password !== DEFAULT_PASSWORD) {
      throw new Error('Mật khẩu không đúng. Vui lòng thử lại.');
    }
    return buildLocalSession(account);
  }

  const user = await firebaseSignIn(account.email, password);
  return {
    access_token: user.uid,
    refresh_token: user.refreshToken,
    user: {
      id: user.uid,
      email: user.email ?? account.email,
      name: account.name,
      role: account.role,
      demo: false,
    },
  };
}

export async function signUpWithFirebase(email: string, password: string): Promise<AuthSession> {
  const account = findAccountByEmail(email);
  if (!account) {
    throw new Error('Email này chưa được cấp tài khoản. Vui lòng liên hệ quản trị viên (Thầy Nguyễn Minh Trí).');
  }

  if (!isFirebaseConfigured || !auth) {
    if (password !== DEFAULT_PASSWORD) {
      throw new Error('Mật khẩu không đúng. Vui lòng thử lại.');
    }
    return buildLocalSession(account);
  }

  const user = await firebaseSignUp(account.email, password);
  return {
    access_token: user.uid,
    refresh_token: user.refreshToken,
    user: {
      id: user.uid,
      email: user.email ?? account.email,
      name: account.name,
      role: account.role,
      demo: false,
    },
  };
}
