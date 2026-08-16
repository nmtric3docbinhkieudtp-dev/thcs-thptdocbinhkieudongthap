import { FormEvent } from 'react';

type LoginPageProps = {
  authMode: 'login' | 'register';
  email: string;
  password: string;
  authError: string;
  isSubmitting: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onAuthModeChange: (mode: 'login' | 'register') => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function LoginPage({
  authMode,
  email,
  password,
  authError,
  isSubmitting,
  onEmailChange,
  onPasswordChange,
  onAuthModeChange,
  onSubmit,
}: LoginPageProps) {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-icon">DBK</div>
          <div>
            <small>Hệ thống quản lý</small>
            <h2>Trường THCS-THPT Đốc Binh Kiều</h2>
          </div>
        </div>

        <div className="auth-intro">
          <span>{authMode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}</span>
          <h1>{authMode === 'login' ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}</h1>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="email@dbk.edu.vn"
              required
            />
          </label>

          <label>
            <span>Mật khẩu</span>
            <input
              type="password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="Nhập mật khẩu"
              required
            />
          </label>

          <div className="auth-options">
            <label className="remember-box">
              <input type="checkbox" defaultChecked />
              <span>Ghi nhớ đăng nhập</span>
            </label>
            <button type="button" className="text-link" onClick={() => onAuthModeChange(authMode === 'login' ? 'register' : 'login')}>
              {authMode === 'login' ? 'Tạo tài khoản' : 'Đăng nhập'}
            </button>
          </div>

          {authError && <div className="auth-error">{authError}</div>}

          <button type="submit" className="primary-btn auth-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Đang xử lý...' : authMode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
          </button>
        </form>
      </div>
    </div>
  );
}
