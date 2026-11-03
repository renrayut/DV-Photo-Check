import React from 'react';
import { ExternalLink, X, ShieldAlert, Sparkles, Scale, FileText } from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface OfficialGuidelinesSectionProps {
  lang: Language;
}

export const OfficialGuidelinesSection: React.FC<OfficialGuidelinesSectionProps> = ({ lang }) => {
  const t = translations[lang];

  const criteria = lang === 'kh'
    ? [
        {
          title: 'វិមាត្ររូបថតការ៉េ 1:1',
          rule: 'សមាមាត្រ 1:1 ស្មើគ្នា',
          details: 'បណ្តោយ និងទទឹងត្រូវតែស្មើគ្នា។ អប្បបរមា 600×600 px រហូតដល់អតិបរមា 1200×1200 px។',
          status: 'ជាកាតព្វកិច្ច',
        },
        {
          title: 'ទំហំឯកសារ & ទម្រង់',
          rule: 'JPEG (≤ 240 KB)',
          details: 'ត្រូវតែជាប្រភេទ JPEG (.jpg)។ ឯកសារធំជាង 240 KB (245,760 bytes) នឹងត្រូវបដិសេធពេល Upload។',
          status: 'ជាកាតព្វកិច្ច',
        },
        {
          title: 'សមាមាត្រកម្ពស់ក្បាល',
          rule: '50% ដល់ 69% នៃកម្ពស់សរុប',
          details: 'វាស់ចាប់ពីកំពូលក្បាល (រាប់ទាំងសក់) រហូតដល់ចុងចង្កា។ ត្រូវមានទំហំចន្លោះ 1 អ៊ីញ ទៅ 1 3/8 អ៊ីញ។',
          status: 'ជាកាតព្វកិច្ច',
        },
        {
          title: 'កម្ពស់កម្រិតភ្នែក',
          rule: '56% ដល់ 69% ពីបាតក្រោម',
          details: 'វាស់ពីគែមបាតក្រោមនៃរូបថត រហូតដល់បន្ទាត់ផ្តេកនៃគ្រាប់ភ្នែកទាំងសងខាង។',
          status: 'ជាកាតព្វកិច្ច',
        },
        {
          title: 'គុណភាពផ្ទៃខាងក្រោយ',
          rule: 'ពណ៌សសុទ្ធ ឬសស្រាល',
          details: 'ត្រូវតែស្អាតរលោងស្មើ គ្មានស្រមោលធ្លាក់ គ្មានក្បាច់ គ្មានគ្រឿងសង្ហារិម ឬមនុស្សផ្សេងឡើយ។',
          status: 'ជាកាតព្វកិច្ច',
        },
        {
          title: 'ហាមពាក់វ៉ែនតាដាច់ខាត',
          rule: 'គ្មានវ៉ែនតាគ្រប់ប្រភេទ',
          details: 'ចាប់ពីថ្ងៃទី 1 វិច្ឆិកា 2016 វ៉ែនតាគ្រប់ប្រភេទ (រួមទាំងវ៉ែនតាភ្នែក) ត្រូវបានហាមឃាត់ដាច់ខាត។',
          status: 'មិនលើកលែង',
        },
        {
          title: 'ការបញ្ចេញទឹកមុខ',
          rule: 'ទឹកមុខស្មើធម្មតា',
          details: 'ភ្នែកទាំងពីរបើកមើលត្រង់ មាត់បិទ មិនសើចចេញធ្មេញ មិនជ្រួញចិញ្ចើម ឬធ្វើមុខកំប្លែង។',
          status: 'ជាកាតព្វកិច្ច',
        },
        {
          title: 'កាលបរិច្ឆេទថតរូប',
          rule: 'ថតក្នុងរយៈពេល ៦ ខែចុងក្រោយ',
          details: 'ត្រូវតែឆ្លុះបញ្ចាំងពីរូបរាងបច្ចុប្បន្នរបស់អ្នក។ ហាមដាច់ខាតយករូបថត DV ឆ្នាំមុនៗមកប្រើឡើងវិញ។',
          status: 'ជាកាតព្វកិច្ច',
        },
      ]
    : [
        {
          title: '1:1 Square Dimensions',
          rule: 'Exactly 1:1 Aspect Ratio',
          details: 'Width and height must be identical. Minimum 600×600 px up to 1200×1200 px.',
          status: 'Mandatory',
        },
        {
          title: 'File Size & Format',
          rule: 'JPEG (≤ 240 KB)',
          details: 'Must be standard JPEG (.jpg). Files larger than 240 KB (245,760 bytes) will be rejected by the server.',
          status: 'Mandatory',
        },
        {
          title: 'Head Height Ratio',
          rule: '50% to 69% of total height',
          details: 'Measured from top of head (hair included) to bottom of chin. Must be between 1 inch and 1 3/8 inches.',
          status: 'Mandatory',
        },
        {
          title: 'Eye Level Height',
          rule: '56% to 69% from bottom',
          details: 'Measured from the bottom edge of the image to the imaginary horizontal line passing through the eye pupils.',
          status: 'Mandatory',
        },
        {
          title: 'Background Quality',
          rule: 'Plain White or Off-White',
          details: 'Must be completely uniform, light, and free of shadows, textures, patterns, furniture, or other people.',
          status: 'Mandatory',
        },
        {
          title: 'Strict Eyeglasses Ban',
          rule: 'Zero Eyeglasses Allowed',
          details: 'Effective November 1, 2016, eyeglasses (even clear prescription glasses) are strictly prohibited.',
          status: 'Zero Tolerance',
        },
        {
          title: 'Facial Expression',
          rule: 'Neutral Expression',
          details: 'Both eyes open, mouth closed, no smiling with teeth visible, no squinting or exaggerated expressions.',
          status: 'Mandatory',
        },
        {
          title: 'Recent Photo',
          rule: 'Taken within last 6 months',
          details: 'Must reflect current appearance. Never reuse photos from previous DV lottery entries.',
          status: 'Mandatory',
        },
      ];

  const pitfalls = lang === 'kh'
    ? [
        {
          issue: 'ការពាក់វ៉ែនតា',
          consequence: 'ធ្លាក់ដោយស្វ័យប្រវត្តិ',
          solution: 'ត្រូវដោះវ៉ែនតាចេញ។ ផ្លាតពន្លឺលើកញ្ចក់ និងដងវ៉ែនតារារាំងប្រព័ន្ធស្កេនជីវមាត្រភ្នែក។',
        },
        {
          issue: 'មានស្រមោលធ្លាក់លើជញ្ជាំង',
          consequence: 'ដកសិទ្ធិប្រកួតប្រជែង',
          solution: 'ឈរឱ្យឆ្ងាយពីជញ្ជាំងប្រហែលកន្លះម៉ែត្រ ទៅមួយម៉ែត្រ ហើយប្រើពន្លឺថ្ងៃធម្មជាតិពីខាងមុខ។',
        },
        {
          issue: 'កាត់ខុសទំហំ ឬកម្ពស់ភ្នែក',
          consequence: 'ប្រព័ន្ធបដិសេធមិនទទួល',
          solution: 'ប្រើឧបករណ៍កាត់តម្រឹមក្នុងកម្មវិធីនេះជាមួយរង្វង់គំរូ និងបន្ទាត់ភ្នែកពណ៌ខៀវ។',
        },
        {
          issue: 'យករូបថតឆ្នាំមុនមកប្រើឡើងវិញ',
          consequence: 'លុបចោលពាក្យសុំភ្លាមៗ',
          solution: 'ប្រព័ន្ធ Facial Recognition របស់ក្រសួងការបរទេសនឹងរកឃើញរូបចាស់ៗដែលធ្លាប់ដាក់ពាក្យ។',
        },
        {
          issue: 'ការប្រើ Filter ឬកែស្បែកមុខឱ្យរលោង',
          consequence: 'បាត់បង់សិទ្ធិជាអចិន្ត្រៃយ៍',
          solution: 'ហាមកាត់ត រុះរើមាត់ច្រមុះ លុបស្នាម ឬប្រើកម្មវិធីកែសម្ផស្សទូរស័ព្ទដាច់ខាត។',
        },
        {
          issue: 'ជញ្ជាំងផ្ទៃក្រោយមានពណ៌ ឬងងឹត',
          consequence: 'ធ្លាក់កូដពណ៌',
          solution: 'ប្រើជញ្ជាំងពណ៌សភ្លឺស្អាត ឬក្រណាត់សរលោងលាតត្រដាងឱ្យស្មើ។',
        },
      ]
    : [
        {
          issue: 'Wearing Eyeglasses',
          consequence: 'Automatic rejection',
          solution: 'Remove eyeglasses completely. Glare and frames obscure biometric iris matching.',
        },
        {
          issue: 'Heavy Drop Shadows',
          consequence: 'Disqualification',
          solution: 'Step 2–3 feet forward from the wall and use soft diffused front lighting.',
        },
        {
          issue: 'Improper Crop & Eye Height',
          consequence: 'Automated ingestion rejection',
          solution: 'Use our interactive crop tool with the official State Department oval template.',
        },
        {
          issue: 'Reusing Old DV Photos',
          consequence: 'Entry cancellation',
          solution: 'State Department automated facial recognition flags previously submitted photos.',
        },
        {
          issue: 'Digital Retouching / AI Filters',
          consequence: 'Permanent ineligibility',
          solution: 'Never airbrush skin, remove blemishes, or apply social media filters.',
        },
        {
          issue: 'Off-White / Colored Walls',
          consequence: 'Color rejection',
          solution: 'Use a bright pure white wall or smooth white bedsheet hung wrinkle-free.',
        },
      ];

  return (
    <div className="flex flex-col gap-6 sm:gap-8 max-w-5xl mx-auto py-2 sm:py-4">
      {/* Overview Intro */}
      <div className="bg-white p-4 sm:p-8 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {t.guidelinesTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t.guidelinesSubtitle}
            </p>
          </div>
          <a
            href="https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>{t.officialGuideLink}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          {t.guidelinesIntro}
        </p>

        {/* Specifications Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 mt-6">
          {criteria.map((item, idx) => (
            <div key={idx} className="p-3.5 sm:p-4 rounded-xl border border-slate-100 bg-slate-50/70">
              <div className="flex items-center justify-between mb-1 gap-2">
                <span className="text-xs font-bold text-slate-900">{item.title}</span>
                <span className="text-[10px] sm:text-[11px] font-mono text-blue-700 font-semibold shrink-0">
                  {item.rule}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{item.details}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Common Pitfalls & Rejections */}
      <div className="bg-white p-4 sm:p-8 rounded-2xl border border-slate-200">
        <div className="mb-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {t.pitfallsTitle}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {t.pitfallsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
          {pitfalls.map((item, idx) => (
            <div key={idx} className="p-3.5 sm:p-4 rounded-xl border border-rose-100 bg-rose-50/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <X className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-900">{item.issue}</span>
                </div>
                <div className="text-[11px] text-rose-700 font-medium mb-1.5">
                  {lang === 'kh' ? 'លទ្ធផល:' : 'Outcome:'} {item.consequence}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.solution}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
