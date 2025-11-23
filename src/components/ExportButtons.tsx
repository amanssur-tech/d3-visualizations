/**
 * ExportButtons.tsx provides the shared SVG/PNG export action row for charts.
 * Charts mount this inline so designers can toggle controls per page.
 */
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '../ui/Button';

interface ExportButtonsProps {
  onExportSvg: () => void;
  onExportPng: () => void;
  disabled?: boolean;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ onExportSvg, onExportPng, disabled }) => {
  const { t } = useTranslation('export');
  /* ----------------------------- Action row layout ----------------------------- */
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3" aria-live="polite">
      {/* Buttons stay inline so charts can opt in/out easily */}
      <Button type="button" onClick={onExportSvg} disabled={disabled} aria-label={t('ariaSvg')}>
        {t('saveSvg')}
      </Button>
      <Button type="button" onClick={onExportPng} disabled={disabled} aria-label={t('ariaPng')}>
        {t('savePng')}
      </Button>
    </div>
  );
};

export default ExportButtons;
