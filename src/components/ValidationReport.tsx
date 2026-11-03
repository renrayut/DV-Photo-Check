import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Printer,
  Sparkles,
  Maximize,
} from 'lucide-react';
import { PhotoAnalysisResult, CropSettings } from '../types/dv';
import { exportCompliantJPEG, downloadFile, generatePrintSheet } from '../utils/photoExporter';
import { Language, translations } from '../i18n/translations';

interface ValidationReportProps {
  analysis: PhotoAnalysisResult | null;
  imageElement: HTMLImageElement | null;
  crop: CropSettings;
  onOpenAiAudit: () => void;
  lang: Language;
}

export const ValidationReport: React.FC<ValidationReportProps> = ({
  analysis,
  imageElement,
  crop,
  onOpenAiAudit,
  lang,
}) => {
  const t = translations[lang];
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  if (!analysis) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-slate-500">
        <p className="text-sm">
          {lang === 'kh'
            ? 'សូមជ្រើសរើស ឬទម្លាក់រូបថតដើម្បីចាប់ផ្តើមត្រួតពិនិត្យស្តង់ដារ DV Lottery តាមពេលវេលាជាក់ស្តែង។'
            : 'Upload or select a photo to begin real-time DV lottery compliance check.'}
        </p>
      </div>
    );
  }

  const handleDownloadJPEG = async (dimension: 600 | 1200) => {
    if (!imageElement) return;
    setIsExporting(true);
    setExportNotice(null);

    try {
      const result = await exportCompliantJPEG(imageElement, crop, dimension);
      const filename = `dv_photo_${dimension}x${dimension}_${Date.now()}.jpg`;
      downloadFile(result.dataUrl, filename);
      setExportNotice(
        lang === 'kh'
          ? `បានទាញយក ${filename} (${result.sizeKB} KB · ${dimension}×${dimension} px · គុណភាព ${result.qualityUsed}%)`
          : `Downloaded ${filename} (${result.sizeKB} KB · ${dimension}×${dimension} px · ${result.qualityUsed}% quality)`
      );
      setTimeout(() => setExportNotice(null), 6000);
    } catch (err: any) {
      console.error(err);
      setExportNotice(
        lang === 'kh' ? 'មិនអាចបង្កើតរូបថតទាញយកបានទេ។' : 'Failed to generate export image.'
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrintSheet = async () => {
    if (!imageElement) return;
    setIsExporting(true);
    try {
      const result = await exportCompliantJPEG(imageElement, crop, 600);
      const printUrl = await generatePrintSheet(result.dataUrl);
      downloadFile(printUrl, `dv_printable_sheet_4x6_${Date.now()}.jpg`);
      setExportNotice(
        lang === 'kh'
          ? 'បានបង្កើតសន្លឹកបោះពុម្ពទំហំ 4×6 អ៊ីញ ដែលមានរូបថត 2×2 អ៊ីញចំនួន 6 សន្លឹក។'
          : 'Generated 4×6 inch photo sheet with 6x (2×2 inch) passport cutouts.'
      );
      setTimeout(() => setExportNotice(null), 6000);
    } catch (err) {
      console.error(err);
      setExportNotice(
        lang === 'kh' ? 'មិនអាចបង្កើតសន្លឹកបោះពុម្ពបានទេ។' : 'Failed to create printable sheet.'
      );
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusIcon = (status: 'pass' | 'fail' | 'warn') => {
    if (status === 'pass') return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
    if (status === 'warn') return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
    return <XCircle className="w-4 h-4 text-rose-600 shrink-0" />;
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* 1. Master Overall Compliance Verdict Banner */}
      <div
        className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
          analysis.overallPass
            ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
            : 'bg-amber-50/90 border-amber-200 text-amber-950'
        }`}
      >
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div className="mt-0.5">
            {analysis.overallPass ? (
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold tracking-tight">
                {analysis.overallPass ? t.passedVerdictTitle : t.needsFixVerdictTitle}
              </h2>
              <div className="text-[11px] sm:text-xs font-mono text-slate-600">
                {analysis.passCount} {lang === 'kh' ? 'ត្រឹមត្រូវ' : 'passed'} · {analysis.failCount} {lang === 'kh' ? 'ត្រូវកែ' : 'failures'}
              </div>
            </div>
            <p className="text-xs mt-1 leading-relaxed opacity-90">
              {analysis.overallPass ? t.passedVerdictDesc : t.needsFixVerdictDesc}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Grid (Tabular Numerals, High Density) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
        {/* Metric 1: Dimensions */}
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] sm:text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            {t.metricDimensions}
          </div>
          <div className="text-sm sm:text-base font-bold font-mono text-slate-900 mt-0.5">
            {analysis.width} × {analysis.height}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">
            {t.metricDimensionsSub}
          </div>
        </div>

        {/* Metric 2: File Size */}
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] sm:text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            {t.metricFileSize}
          </div>
          <div className="text-sm sm:text-base font-bold font-mono text-slate-900 mt-0.5">
            {analysis.fileSizeKB} KB
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">
            {t.metricFileSizeSub}
          </div>
        </div>

        {/* Metric 3: Background Quality */}
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] sm:text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            {t.metricBackground}
          </div>
          <div className="text-sm sm:text-base font-bold font-mono text-slate-900 mt-0.5">
            {analysis.background.whiteScorePercent}% {lang === 'kh' ? 'ស' : 'White'}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">
            {analysis.background.isUniform ? t.metricBackgroundUniform : t.metricBackgroundShadows}
          </div>
        </div>

        {/* Metric 4: Head Height */}
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] sm:text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            {t.metricHeadHeight}
          </div>
          <div className="text-sm sm:text-base font-bold font-mono text-slate-900 mt-0.5">
            {analysis.composition.headHeightPercent}%
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">
            {t.metricHeadHeightSub}
          </div>
        </div>

        {/* Metric 5: Eye Level */}
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] sm:text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            {t.metricEyeLevel}
          </div>
          <div className="text-sm sm:text-base font-bold font-mono text-slate-900 mt-0.5">
            {analysis.composition.eyeLevelPercent}%
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">
            {t.metricEyeLevelSub}
          </div>
        </div>

        {/* Metric 6: Format */}
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] sm:text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            {t.metricFormat}
          </div>
          <div className="text-sm sm:text-base font-bold font-mono text-slate-900 mt-0.5">
            JPEG / 24-bit
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">
            {t.metricFormatSub}
          </div>
        </div>
      </div>

      {/* 3. Export & Download Action Bar */}
      <div className="bg-slate-900 text-white p-3.5 sm:p-4 rounded-xl flex flex-col gap-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide uppercase text-slate-300">
            {t.exportSectionTitle}
          </span>
          <span className="text-[10px] sm:text-[11px] text-slate-400">
            {t.exportSafeBadge}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Primary Action: Standard 600x600 */}
          <button
            onClick={() => handleDownloadJPEG(600)}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 px-3 py-3 sm:py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 active:bg-slate-200 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-blue-600" />
            <span>{t.download600Btn}</span>
          </button>

          {/* High Res Action: 1200x1200 */}
          <button
            onClick={() => handleDownloadJPEG(1200)}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-lg transition-colors cursor-pointer"
          >
            <Maximize className="w-3.5 h-3.5" />
            <span>{t.download1200Btn}</span>
          </button>

          {/* Physical Print Sheet */}
          <button
            onClick={handlePrintSheet}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.printSheetBtn}</span>
          </button>
        </div>

        {/* AI Inspection Trigger */}
        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-[11px] text-slate-400">
            {t.aiAuditTriggerPrompt}
          </div>
          <button
            onClick={onOpenAiAudit}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.runAiAuditBtn}</span>
          </button>
        </div>

        {exportNotice && (
          <div className="text-xs bg-blue-950 text-blue-200 p-2.5 rounded-md border border-blue-800 animate-fadeIn">
            {exportNotice}
          </div>
        )}
      </div>

      {/* 4. Detailed Specification Checklist Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="px-3.5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
            {t.checklistTitle}
          </span>
          <span className="text-[11px] sm:text-xs text-slate-500">
            {analysis.checks.length} {t.criteriaAudited}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {analysis.checks.map(check => (
            <div key={check.id} className="p-3 sm:p-3.5 hover:bg-slate-50/60 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">{getStatusIcon(check.status)}</div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900">{check.title}</h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{check.details}</p>
                    {check.remedy && (
                      <p className="text-[11px] text-blue-700 font-medium mt-1">
                        {t.howToFixPrefix} {check.remedy}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-medium text-slate-900">
                    {check.currentValue}
                  </div>
                  <div className="text-[10px] text-slate-400 max-w-[130px] truncate">
                    {t.officialRulePrefix} {check.expectedValue}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
