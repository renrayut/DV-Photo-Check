import React from 'react';
import { ExternalLink, Globe } from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface HeaderProps {
  activeTab: 'checker' | 'guidelines' | 'faq';
  setActiveTab: (tab: 'checker' | 'guidelines' | 'faq') => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
        {/* Zone 1: Brand title */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
            DV
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
            {t.appName}
          </span>
        </div>

        {/* Zone 2: Navigation Links for Tablet/Desktop */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('checker')}
            className={`whitespace-nowrap transition-colors pb-0.5 cursor-pointer ${
              activeTab === 'checker'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'hover:text-slate-900'
            }`}
          >
            {t.navChecker}
          </button>
          <button
            onClick={() => setActiveTab('guidelines')}
            className={`whitespace-nowrap transition-colors pb-0.5 cursor-pointer ${
              activeTab === 'guidelines'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'hover:text-slate-900'
            }`}
          >
            {t.navGuidelines}
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`whitespace-nowrap transition-colors pb-0.5 cursor-pointer ${
              activeTab === 'faq'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'hover:text-slate-900'
            }`}
          >
            {t.navFaq}
          </button>
        </nav>

        {/* Zone 3: Language Switcher & Primary Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Switcher Segmented Control */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200/80">
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => setLang('kh')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                lang === 'kh'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="ភាសាខ្មែរ (Khmer)"
            >
              KH
            </button>
          </div>

          {/* Official Government Portal Link */}
          <a
            href="https://dvprogram.state.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            <span>{t.officialPortalBtn}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Mobile-Friendly Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-100 bg-slate-50/90 px-2 py-1.5 text-xs font-medium">
        <button
          onClick={() => setActiveTab('checker')}
          className={`py-1 px-2.5 rounded-md whitespace-nowrap transition-colors ${
            activeTab === 'checker'
              ? 'bg-white text-blue-600 font-semibold shadow-2xs'
              : 'text-slate-600'
          }`}
        >
          {t.navChecker}
        </button>
        <button
          onClick={() => setActiveTab('guidelines')}
          className={`py-1 px-2.5 rounded-md whitespace-nowrap transition-colors ${
            activeTab === 'guidelines'
              ? 'bg-white text-blue-600 font-semibold shadow-2xs'
              : 'text-slate-600'
          }`}
        >
          {t.navGuidelines}
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`py-1 px-2.5 rounded-md whitespace-nowrap transition-colors ${
            activeTab === 'faq'
              ? 'bg-white text-blue-600 font-semibold shadow-2xs'
              : 'text-slate-600'
          }`}
        >
          {t.navFaq}
        </button>
      </div>
    </header>
  );
};
