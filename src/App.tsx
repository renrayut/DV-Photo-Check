import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageWorkspace } from './components/ImageWorkspace';
import { ValidationReport } from './components/ValidationReport';
import { OfficialGuidelinesSection } from './components/OfficialGuidelinesSection';
import { FaqSection } from './components/FaqSection';
import { AiDeepAuditModal } from './components/AiDeepAuditModal';
import { PhotoAnalysisResult, CropSettings } from './types/dv';
import { ShieldCheck, Crop, FileCheck, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { Language, translations } from './i18n/translations';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('dv_photo_lang');
    return (saved === 'kh' || saved === 'en') ? saved : 'kh'; // Default to Khmer as requested
  });

  const [activeTab, setActiveTab] = useState<'checker' | 'guidelines' | 'faq'>('checker');
  const [mobileView, setMobileView] = useState<'crop' | 'report'>('crop');
  const [analysis, setAnalysis] = useState<PhotoAnalysisResult | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<CropSettings>({
    zoom: 1.0,
    panX: 0,
    panY: 0,
    rotation: 0,
  });

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Save selected language in localStorage and update document html lang
  useEffect(() => {
    localStorage.setItem('dv_photo_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const handleAnalysisUpdate = useCallback(
    (result: PhotoAnalysisResult, img: HTMLImageElement, currentCrop: CropSettings) => {
      setAnalysis(result);
      setImageElement(img);
    },
    []
  );

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 3-Zone Top Navigation Bar with Language Switcher */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {activeTab === 'checker' && (
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Contextual Hero Banner */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900">
                    {lang === 'kh'
                      ? 'ឧបករណ៍ត្រួតពិនិត្យ និងកាត់រូបថត DV Lottery'
                      : 'DV Lottery Photo Validator & Cropper'}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                    {t.appSubtitle}
                  </p>
                </div>

                {/* Trust markers (unboxed metadata with subtle dot separators) */}
                <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-500 shrink-0 flex-wrap">
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{t.heroBadgePrivacy}</span>
                  </div>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>{t.heroBadgeStandards}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>{t.heroBadgeCompress}</span>
                </div>
              </div>
            </div>

            {/* Mobile View Toggle Segmented Tabs (Visible on mobile/tablet screens < 1024px) */}
            <div className="lg:hidden flex items-center justify-center p-1 bg-slate-200/80 rounded-xl">
              <button
                onClick={() => setMobileView('crop')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mobileView === 'crop'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Crop className="w-3.5 h-3.5" />
                <span>{t.mobileTabCrop}</span>
              </button>
              <button
                onClick={() => setMobileView('report')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mobileView === 'report'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>{t.mobileTabReport}</span>
                {analysis && (
                  <span
                    className={`ml-1 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                      analysis.overallPass ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {analysis.overallPass ? '✓' : `!${analysis.failCount}`}
                  </span>
                )}
              </button>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
              {/* Left Column: Interactive Cropping Workspace (7 cols) */}
              <div
                className={`lg:col-span-6 xl:col-span-7 flex flex-col gap-4 ${
                  mobileView === 'report' ? 'hidden lg:flex' : 'flex'
                }`}
              >
                <ImageWorkspace
                  onAnalysisUpdate={handleAnalysisUpdate}
                  crop={crop}
                  setCrop={setCrop}
                  lang={lang}
                />
              </div>

              {/* Right Column: Real-time Compliance Feedback & Export (5 cols) */}
              <div
                className={`lg:col-span-6 xl:col-span-5 flex flex-col gap-4 ${
                  mobileView === 'crop' ? 'hidden lg:flex' : 'flex'
                }`}
              >
                <ValidationReport
                  analysis={analysis}
                  imageElement={imageElement}
                  crop={crop}
                  onOpenAiAudit={() => setIsAiModalOpen(true)}
                  lang={lang}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guidelines' && <OfficialGuidelinesSection lang={lang} />}

        {activeTab === 'faq' && <FaqSection lang={lang} />}
      </main>

      {/* AI Deep Inspection Modal */}
      <AiDeepAuditModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        imageElement={imageElement}
        crop={crop}
        lang={lang}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-5 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="text-center sm:text-left">
            <span className="font-semibold text-slate-700">{t.appName}</span>
            <span className="mx-2">·</span>
            <span>{t.footerNotice}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('guidelines')}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              {t.navGuidelines}
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              {t.navFaq}
            </button>
            <a
              href="https://dvprogram.state.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors inline-flex items-center gap-1"
            >
              <span>dvprogram.state.gov</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
