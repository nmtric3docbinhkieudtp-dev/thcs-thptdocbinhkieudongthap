import { FormEvent, useState, useEffect } from 'react';
import { auth, firebaseLogout } from './firebase';
import type { AuthSession, ReportSubmission, ViewMode } from './types';
import { readStoredSession, clearSession, signInWithFirebase, signUpWithFirebase } from './auth/session';
import { readStoredReports, saveReport, exportReportsAsJSON, createEmptyReportForm, buildReportFromForm } from './reports/storage';
import { personnelRecords, TOTAL_PERSONNEL } from './data/personnel';
import { navItems } from './data/dashboard';
import { LoginPage } from './components/Auth/LoginPage';
import { OverviewDashboard } from './components/Overview/OverviewDashboard';
import { PersonnelView } from './components/Personnel/PersonnelView';
import { ReportPage } from './components/Reports/ReportPage';

export type { AuthSession, ReportSubmission } from './types';

function App() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [view, setView] = useState<ViewMode>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [reportMode, setReportMode] = useState<'select' | 'form' | 'view'>('select');
  const [allReports, setAllReports] = useState<ReportSubmission[]>([]);
  const [reportForm, setReportForm] = useState<Partial<ReportSubmission>>(createEmptyReportForm(''));

  useEffect(() => {
    const existingSession = readStoredSession();
    if (existingSession) {
      setSession(existingSession);
      setReportForm(createEmptyReportForm(existingSession.user.email, existingSession.user.name));
    }
    const reports = readStoredReports();
    setAllReports(reports);
  }, []);

  const filteredPersonnel = personnelRecords.filter((person) => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return true;

    return [person.name, person.position, person.unit, person.department, person.subject]
      .join(' ')
      .toLowerCase()
      .includes(keyword);
  });

  const handleAuthSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setAuthError('');

    try {
      const nextSession = authMode === 'login'
        ? await signInWithFirebase(email, password)
        : await signUpWithFirebase(email, password);

      setSession(nextSession);
      setReportForm(createEmptyReportForm(nextSession.user.email, nextSession.user.name));
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Xảy ra lỗi khi xác thực tài khoản.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (auth) {
        await firebaseLogout();
      }
    } catch (error) {
      console.warn('Firebase logout warning:', error);
    }

    clearSession();
    setSession(null);
    setAuthMode('login');
  };

  const handleSubmitReport = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!reportForm.className || !reportForm.gcvnName) {
      alert('Vui lòng điền đầy đủ thông tin lớp và tên GVCN');
      return;
    }

    const existing = allReports.find(
      (report) => report.gcvnEmail === session?.user.email && report.className === reportForm.className,
    );
    if (existing && !window.confirm(`Lớp ${reportForm.className} đã có báo cáo. Ghi đè báo cáo cũ?`)) {
      return;
    }

    const newReport = buildReportFromForm(reportForm, session?.user.email || '', existing?.id);

    saveReport(newReport);
    const updatedReports = readStoredReports();
    setAllReports(updatedReports);
    alert('Báo cáo đã được gửi thành công!');
    setReportMode('select');
    setReportForm(createEmptyReportForm(session?.user.email || '', session?.user.name));
  };

  if (!session) {
    return (
      <LoginPage
        authMode={authMode}
        email={email}
        password={password}
        authError={authError}
        isSubmitting={isSubmitting}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onAuthModeChange={setAuthMode}
        onSubmit={handleAuthSubmit}
      />
    );
  }

  return (
    <div className="school-app">
      <aside className="sidebar">
        <div className="brand-box">
          <div className="brand-icon">DBK</div>
          <div>
            <small>Trường</small>
            <strong>THCS-THPT Đốc Binh Kiều</strong>
          </div>
        </div>

        <nav className="nav-menu">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`nav-item ${view === item.view && item.label === 'Tổng quan' ? 'active' : item.label === 'Nhân sự' && view === 'personnel' ? 'active' : item.label === 'Báo cáo' && view === 'reports' ? 'active' : ''}`}
              onClick={() => {
                if (item.view === 'personnel') setView('personnel');
                else if (item.view === 'reports') setView('reports');
                else setView('overview');
              }}
            >
              <span>{item.label}</span>
              {item.badge && <em>{item.badge}</em>}
            </button>
          ))}
        </nav>

        <div className="sidebar-card">
          <p>Hệ thống báo cáo</p>
          <strong>12 báo cáo mới</strong>
          <button type="button">Xem chi tiết</button>
        </div>
      </aside>

      <main className="main-panel">
        {view === 'personnel' ? (
          <PersonnelView
            totalPersonnel={TOTAL_PERSONNEL}
            allPersonnel={personnelRecords}
            filteredPersonnel={filteredPersonnel}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onBackToOverview={() => setView('overview')}
          />
        ) : view === 'reports' ? (
          <ReportPage
            session={session}
            reportMode={reportMode}
            reportForm={reportForm}
            allReports={allReports}
            onModeChange={setReportMode}
            onFormChange={(updates) => setReportForm({...reportForm, ...updates})}
            onSubmitReport={handleSubmitReport}
            onExportJSON={exportReportsAsJSON}
            onEditReport={(report) => {
              setReportForm(report);
              setReportMode('form');
            }}
            onBackToOverview={() => setView('overview')}
          />
        ) : (
          <OverviewDashboard session={session} onLogout={handleLogout} />
        )}
      </main>
    </div>
  );
}

export default App;
