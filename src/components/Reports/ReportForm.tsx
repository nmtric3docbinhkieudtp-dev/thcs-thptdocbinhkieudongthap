import { FormEvent } from 'react';
import type { ReportSubmission } from '../../types';
import { SectionThanhPhan } from './sections/SectionThanhPhan';
import { SectionThongTinHocSinh } from './sections/SectionThongTinHocSinh';
import { SectionBanCanSu } from './sections/SectionBanCanSu';
import { SectionCoSoVatChat } from './sections/SectionCoSoVatChat';
import { SectionHocSinhVang } from './sections/SectionHocSinhVang';
import { SectionYKien } from './sections/SectionYKien';

interface ReportFormProps {
  reportForm: Partial<ReportSubmission>;
  onFormChange: (updates: Partial<ReportSubmission>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

export function ReportForm({ reportForm, onFormChange, onSubmit, onCancel }: ReportFormProps) {
  return (
    <div className="report-form-wrapper">
      <form className="report-form" onSubmit={onSubmit}>
        <SectionThanhPhan reportForm={reportForm} onFormChange={onFormChange} />
        <SectionThongTinHocSinh reportForm={reportForm} onFormChange={onFormChange} />
        <SectionBanCanSu reportForm={reportForm} onFormChange={onFormChange} />
        <SectionCoSoVatChat reportForm={reportForm} onFormChange={onFormChange} />
        <SectionHocSinhVang reportForm={reportForm} onFormChange={onFormChange} />
        <SectionYKien reportForm={reportForm} onFormChange={onFormChange} />

        <div className="form-actions">
          <button type="button" className="ghost-btn" onClick={onCancel}>Quay lại</button>
          <button type="submit" className="primary-btn">Gửi báo cáo</button>
        </div>
      </form>
    </div>
  );
}
