import { useEffect, useState } from 'react';
import {
  approveAccount,
  fetchPendingAccounts,
  type AccountProfile,
} from '../firebase';

type PendingAccount = AccountProfile & { id: string };

export function AccountApproval() {
  const [accounts, setAccounts] = useState<PendingAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAccounts = async () => {
    setIsLoading(true);
    setError('');
    try {
      setAccounts(await fetchPendingAccounts());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Không thể tải danh sách đăng ký.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadAccounts();
  }, []);

  const handleApprove = async (uid: string) => {
    try {
      await approveAccount(uid);
      setAccounts((current) => current.filter((account) => account.id !== uid));
    } catch (approvalError) {
      setError(approvalError instanceof Error ? approvalError.message : 'Không thể duyệt tài khoản.');
    }
  };

  return (
    <section className="panel account-approval">
      <div className="admin-header">
        <div>
          <small>Quản trị hệ thống</small>
          <h2>Duyệt tài khoản đăng ký</h2>
        </div>
        <button type="button" className="ghost-btn small" onClick={() => void loadAccounts()} disabled={isLoading}>
          Làm mới
        </button>
      </div>

      {error && <p className="auth-error">{error}</p>}
      {isLoading ? (
        <p className="empty-state">Đang tải danh sách...</p>
      ) : accounts.length === 0 ? (
        <p className="empty-state">Không có tài khoản nào đang chờ duyệt.</p>
      ) : (
        <div className="approval-list">
          {accounts.map((account) => (
            <div className="approval-row" key={account.id}>
              <strong>{account.email}</strong>
              <button type="button" className="primary-btn small" onClick={() => void handleApprove(account.id)}>
                Duyệt tài khoản
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
