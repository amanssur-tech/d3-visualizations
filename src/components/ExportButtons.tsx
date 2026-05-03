/**
 * ExportButtons.tsx provides the shared SVG/PNG export action row for charts.
 * Charts mount this inline so designers can toggle controls per page.
 */
import React from 'react';

import { Button } from '../ui/Button';
import { useTranslator } from '../hooks/useTranslator';

interface ExportButtonsProps {
  onExportSvg: () => void;
  onExportPng: () => void;
  disabled?: boolean;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ onExportSvg, onExportPng, disabled }) => {
  const { translate } = useTranslator(['export']);

  /* ----------------------------- Action row layout ----------------------------- */
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3" aria-live="polite">
      {/* Buttons stay inline so charts can opt in/out easily */}
      <Button type="button" onClick={onExportSvg} disabled={disabled} aria-label={translate('export:ariaSvg')}>
        {translate('export:saveSvg')}
      </Button>
      <Button type="button" onClick={onExportPng} disabled={disabled} aria-label={translate('export:ariaPng')}>
        {translate('export:savePng')}
      </Button>
    </div>
  );
};

export default ExportButtons;
