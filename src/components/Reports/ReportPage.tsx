import { FormEvent } from 'react';
import type { ReportSubmission, AuthSession } from '../../App';
import { ReportSelector } from './ReportSelector';
import { ReportForm } from './ReportForm';
import { ReportAdmin } from './ReportAdmin';

interface ReportPageProps {
  session: AuthSession;
  reportMode: 'select' | 'form' | 'view';
  reportForm: Partial<ReportSubmission>;
  allReports: ReportSubmission[];
  onModeChange: (mode: 'select' | 'form' | 'view') => void;
  onFormChange: (updates: Partial<ReportSubmission>) => void;
  onSubmitReport: (e: FormEvent<HTMLFormElement>) => void;
  onExportJSON: () => void;
  onBack: () => void;
}

export function ReportPage({
  session,
  reportMode,
  reportForm,
  allReports,
  onModeChange,
  onFormChange,
  onSubmitReport,
  onExportJSON,
  onBack,
}: ReportPageProps) {
  const backLabel = reportMode === 'select' ? 'Quay lại dashboard' : 'Quay lại chọn báo cáo';

  return (
    <section className="personnel-page panel">
      <div className="personnel-page-header">
        <div>
          <small>Báo cáo toàn trường</small>
          <h1>Biên bản tập trung học sinh đầu năm</h1>
        </div>
        <button type="button" className="ghost-btn" onClick={onBack}>{backLabel}</button>
      </div>

      {reportMode === 'select' && (
        <ReportSelector 
          allReports={allReports}
          isAdmin={session.user.role === 'admin'}
          onSelectForm={() => onModeChange('form')}
          onSelectView={() => onModeChange('view')}
        />
      )}

      {reportMode === 'form' && (
        <ReportForm 
          reportForm={reportForm}
          onFormChange={onFormChange}
          onSubmit={onSubmitReport}
          onCancel={() => onModeChange('select')}
        />
      )}

      {reportMode === 'view' && session.user.role === 'admin' && (
        <ReportAdmin 
          allReports={allReports}
          onExport={onExportJSON}
        />
      )}
    </section>
  );
}
