import React from 'react';
import { useTranslation } from 'react-i18next';

interface ExportButtonsProps {
  onExportSvg: () => void;
  onExportPng: () => void;
  disabled?: boolean;
}

const buttonClasses =
  'rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0';

const ExportButtons: React.FC<ExportButtonsProps> = ({ onExportSvg, onExportPng, disabled }) => {
  const { t } = useTranslation('export');
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3" aria-live="polite">
      <button
        type="button"
        className={buttonClasses}
        onClick={onExportSvg}
        disabled={disabled}
        aria-label={t('ariaSvg')}
      >
        {t('saveSvg')}
      </button>
      <button
        type="button"
        className={buttonClasses}
        onClick={onExportPng}
        disabled={disabled}
        aria-label={t('ariaPng')}
      >
        {t('savePng')}
      </button>
    </div>
  );
};

export default ExportButtons;
