import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, AlertTriangle, XCircle, Loader2, ShieldCheck } from 'lucide-react';
import { exportCompliantJPEG } from '../utils/photoExporter';
import { CropSettings } from '../types/dv';
import { Language, translations } from '../i18n/translations';

interface AiAuditResult {
  isEyeglassesDetected: boolean;
  isExpressionNeutral: boolean;
  expressionDescription: string;
  isEyesOpenAndDirect: boolean;
  isHeadPoseStraight: boolean;
  isBackgroundNeutralWhite: boolean;
  hasHarshShadows: boolean;
  isDigitallyAltered: boolean;
  overallAiVerdict: 'pass' | 'fail' | 'warn';
  actionableFeedback: string[];
}

interface AiDeepAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageElement: HTMLImageElement | null;
  crop: CropSettings;
  lang: Language;
}

export const AiDeepAuditModal: React.FC<AiDeepAuditModalProps> = ({
  isOpen,
  onClose,
  imageElement,
  crop,
  lang,
}) => {
  const t = translations[lang];
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiAuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const runAudit = async () => {
    if (!imageElement) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Export current cropped frame to base64
      const exported = await exportCompliantJPEG(imageElement, crop, 600);
      
      const response = await fetch('/api/ai-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: exported.dataUrl, lang }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.fallback) {
          setError(
            lang === 'kh'
              ? 'សេវាត្រួតពិនិត្យ AI តម្រូវឱ្យកំណត់ GEMINI_API_KEY នៅលើ Server។ ទោះជាយ៉ាងណា ប្រព័ន្ធត្រួតពិនិត្យវិមាត្រ និងគុណភាពផ្ទៃខាងក្រោយលើ Browser នៅតែដំណើរការ 100% ធម្មតា។'
              : 'AI Inspection service requires server GEMINI_API_KEY. All client-side geometric and background algorithms are fully operational.'
          );
        } else {
          setError(data.error || (lang === 'kh' ? 'ការពិនិត្យ AI បានជួបប្រទះបញ្ហា។' : 'AI audit encountered an error.'));
        }
        return;
      }

      setResult(data.result);
    } catch (err: any) {
      console.error(err);
      setError(
        lang === 'kh' ? 'មិនអាចភ្ជាប់ទៅកាន់សេវា AI ត្រួតពិនិត្យបានទេ។' : 'Could not connect to AI audit service.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-8 animate-fadeIn">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900">{t.aiModalTitle}</h2>
              <p className="text-[10px] sm:text-[11px] text-slate-500">{t.aiModalSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 flex flex-col gap-4">
          {!result && !loading && !error && (
            <div className="text-center py-4 sm:py-6 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                {t.aiModalStartPrompt}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mb-5 leading-relaxed">
                {t.aiModalStartDesc}
              </p>
              <button
                onClick={runAudit}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.aiModalStartBtn}</span>
              </button>
            </div>
          )}

          {loading && (
            <div className="py-10 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-xs font-medium text-slate-600">{t.aiModalInspecting}</p>
            </div>
          )}

          {error && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3.5 rounded-xl text-xs flex flex-col gap-2">
              <div className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{lang === 'kh' ? 'ដំណឹង' : 'Notice'}</span>
              </div>
              <p className="leading-relaxed">{error}</p>
              <button
                onClick={runAudit}
                className="self-start text-[11px] font-semibold text-blue-600 hover:underline mt-1 cursor-pointer"
              >
                {lang === 'kh' ? 'សាកល្បងម្តងទៀត' : 'Try Again'}
              </button>
            </div>
          )}

          {result && (
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* Verdict header */}
              <div
                className={`p-3 rounded-xl border flex items-center gap-3 ${
                  result.overallAiVerdict === 'pass'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                {result.overallAiVerdict === 'pass' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider">
                    {result.overallAiVerdict === 'pass' ? t.aiVerdictPass : t.aiVerdictRisk}
                  </div>
                  <div className="text-xs opacity-90 mt-0.5">
                    {result.expressionDescription || (result.isExpressionNeutral ? 'Natural' : 'Adjust pose')}
                  </div>
                </div>
              </div>

              {/* Checklist points */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <span className="text-slate-600">{t.aiNoGlasses}</span>
                  <span className="font-semibold text-emerald-600">
                    {!result.isEyeglassesDetected
                      ? (lang === 'kh' ? 'ត្រឹមត្រូវ' : 'Passed')
                      : (lang === 'kh' ? 'មានវ៉ែនតា (ធ្លាក់)' : 'Glasses Detected (Fail)')}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <span className="text-slate-600">{t.aiNeutralExp}</span>
                  <span className={`font-semibold ${result.isExpressionNeutral ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {result.isExpressionNeutral
                      ? (lang === 'kh' ? 'ធម្មតា' : 'Neutral')
                      : (lang === 'kh' ? 'មិនធម្មតា' : 'Non-neutral')}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <span className="text-slate-600">{t.aiDirectGaze}</span>
                  <span className={`font-semibold ${result.isEyesOpenAndDirect ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {result.isEyesOpenAndDirect
                      ? (lang === 'kh' ? 'ត្រង់' : 'Direct')
                      : (lang === 'kh' ? 'មិនចំកាមេរ៉ា' : 'Misaligned')}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <span className="text-slate-600">{t.aiHeadPose}</span>
                  <span className={`font-semibold ${result.isHeadPoseStraight ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {result.isHeadPoseStraight
                      ? (lang === 'kh' ? 'ត្រង់ល្អ' : 'Upright')
                      : (lang === 'kh' ? 'ផ្អៀង' : 'Tilted')}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <span className="text-slate-600">{t.aiBgNeutral}</span>
                  <span className={`font-semibold ${result.isBackgroundNeutralWhite ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {result.isBackgroundNeutralWhite
                      ? (lang === 'kh' ? 'ពណ៌ស' : 'Pure / Off-White')
                      : (lang === 'kh' ? 'មានពណ៌' : 'Toned / Colored')}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <span className="text-slate-600">{t.aiLighting}</span>
                  <span className={`font-semibold ${!result.hasHarshShadows ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {!result.hasHarshShadows
                      ? (lang === 'kh' ? 'ស្មើល្អ' : 'Balanced')
                      : (lang === 'kh' ? 'មានស្រមោល' : 'Harsh Shadows')}
                  </span>
                </div>
              </div>

              {/* Feedback bullets */}
              {result.actionableFeedback && result.actionableFeedback.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {t.aiGuidanceTitle}
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    {result.actionableFeedback.map((tip, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
