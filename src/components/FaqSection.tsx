import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface FaqSectionProps {
  lang: Language;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ lang }) => {
  const t = translations[lang];

  const faqs = lang === 'kh'
    ? [
        {
          q: 'តើខ្ញុំអាចប្រើកាមេរ៉ាទូរស័ព្ទដៃដើម្បីថតរូប DV Lottery បានដែរឬទេ?',
          a: 'បាទ/ចាស! អាចប្រើបានយ៉ាងងាយស្រួល។ កាមេរ៉ាទូរស័ព្ទទំនើបបច្ចុប្បន្នមានកម្រិតភាពច្បាស់លើសពី 600×600 px ដែលជាកម្រិតអប្បបរមា។ សូមពឹងនរណាម្នាក់ឱ្យឈរចម្ងាយ 1.5 ម៉ែត្រ ទៅ 2 ម៉ែត្រ ហើយថតរូបនៅកម្រិតភ្នែកដោយប្រើកាមេរ៉ាក្រោយ នៅមុខជញ្ជាំងពណ៌សភ្លឺស្អាតដែលមានពន្លឺថ្ងៃធម្មជាតិ។ បន្ទាប់មក យករូបនោះមក Upload លើកម្មវិធីនេះដើម្បីកាត់តម្រឹម ពិនិត្យកម្រិតភ្នែក និងបង្រួមឯកសារក្រោម 240 KB។',
        },
        {
          q: 'ហេតុអ្វីបានជាទំហំឯកសារត្រូវតែតិចជាង ឬស្មើ 240 KB?',
          a: 'ប្រព័ន្ធចុះឈ្មោះអនឡាញផ្លូវការរបស់ក្រសួងការបរទេសអាមេរិក (dvprogram.state.gov) បានកំណត់កម្រិតទំហំឯកសាររូបថតយ៉ាងតឹងរ៉ឹងគឺមិនលើសពី 240 KB (245,760 bytes) ឡើយ។ ប្រសិនបើឯកសារលើសត្រឹមតែ 1 KB ប្រព័ន្ធនឹងបដិសេធមិនទទួលភ្លាមៗ។ កម្មវិធីនេះមានមុខងារបង្រួមគុណភាព JPEG ស្វ័យប្រវត្តិដើម្បីធានាថារូបថតរបស់អ្នកមានទំហំសមស្រប និងរក្សាភាពច្បាស់បានល្អបំផុត។',
        },
        {
          q: 'តើខ្ញុំអាចពាក់វ៉ែនតាបានទេ ប្រសិនបើខ្ញុំមានវេជ្ជបញ្ជាពីគ្រូពេទ្យ?',
          a: 'ចាប់តាំងពីថ្ងៃទី 1 ខែវិច្ឆិកា ឆ្នាំ 2016 មក ក្រសួងការបរទេសអាមេរិកបានហាមឃាត់ការដាច់ខាតនូវការពាក់វ៉ែនតាគ្រប់ប្រភេទ (រួមទាំងវ៉ែនតាភ្នែក ឬវ៉ែនតាថ្លា) នៅក្នុងរូបថតទិដ្ឋាការ និងលិខិតឆ្លងដែន។ ករណីលើកលែងកម្របំផុតគឺសម្រាប់អ្នកដែលទើបតែវះកាត់ភ្នែក ហើយមានលិខិតបញ្ជាក់សុខភាពផ្លូវការពីគ្រូពេទ្យប៉ុណ្ណោះ។ ក្រៅពីនេះ រូបណាមានពាក់វ៉ែនតានឹងត្រូវធ្លាក់ដោយស្វ័យប្រវត្តិ។',
        },
        {
          q: 'តើរូបថតរបស់ខ្ញុំមានសុវត្ថិភាព និងភាពឯកជនដែរឬទេ?',
          a: 'សុវត្ថិភាព 100%! រាល់ដំណើរការនៃការបង្ហាញរូបភាព ការកាត់តម្រឹម ការវាស់ស្ទង់ផ្ទៃខាងក្រោយ និងការបង្រួមឯកសារ JPEG គឺធ្វើឡើងនៅក្នុង Browser លើទូរស័ព្ទ ឬកុំព្យូទ័ររបស់អ្នកផ្ទាល់ ដោយប្រើបច្ចេកវិទ្យា HTML5 Canvas។ រូបថតរបស់អ្នកមិនត្រូវបានផ្ញើ ឬរក្សាទុកនៅលើ Server ឬ Database ណាមួយឡើយ។',
        },
        {
          q: 'តើស្រ្តីអាចពាក់កន្សែងទទូរមុខ ឬសម្លៀកបំពាក់សាសនា (Hijab) បានដែរឬទេ?',
          a: 'បាន ប្រសិនបើអ្នកពាក់វាជាប្រចាំថ្ងៃដោយសារជំនឿសាសនា។ ទោះជាយ៉ាងណា ផ្ទៃមុខរបស់អ្នកទាំងមូលត្រូវតែបង្ហាញឱ្យឃើញច្បាស់ចាប់ពីចុងចង្កា រហូតដល់ថ្ងាស និងថ្ពាល់ទាំងសងខាង ដោយមិនមានស្រមោលធ្លាក់លើផ្ទៃមុខឡើយ។',
        },
        {
          q: 'តើខ្ញុំអាចយករូបថតដែលធ្លាប់ដាក់ពាក្យ DV កាលពីឆ្នាំមុនមកប្រើឡើងវិញបានទេ?',
          a: 'មិនបានដាច់ខាត! ប្រព័ន្ធរបស់ក្រសួងការបរទេសអាមេរិកប្រើបច្ចេកវិទ្យា Facial Recognition ដើម្បីប្រៀបធៀបរូបថតថ្មីជាមួយរូបថតចាស់ៗក្នុងទិន្នន័យ។ ប្រសិនបើប្រព័ន្ធរកឃើញថាអ្នកយករូបចាស់មកប្រើឡើងវិញ ពាក្យសុំរបស់អ្នកនឹងត្រូវដកសិទ្ធិដោយស្វ័យប្រវត្តិ។',
        },
        {
          q: 'តើគេអាចដាក់ Host កម្មវិធីនេះលើ Vercel បានដោយរបៀបណា?',
          a: 'កម្មវិធីនេះត្រូវបានបង្កើតឡើងដោយប្រើប្រាស់ស្តង់ដារ Vite និង React។ ដើម្បី Deploy ទៅកាន់ Vercel អ្នកគ្រាន់តែ Push កូដទៅកាន់ GitHub ហើយភ្ជាប់គម្រោងជាមួយ Vercel ដោយកំណត់ពាក្យបញ្ជា Build `npm run build` និងថត Output `dist` ជាការស្រេច។',
        },
      ]
    : [
        {
          q: 'Can I take my DV lottery photo with a smartphone camera?',
          a: 'Yes, absolutely. Modern smartphones produce high-resolution images well above the 600×600 px minimum. Have someone stand 4–6 feet away and take the photo at eye level using the rear camera against a bright, plain white wall with diffused daylight. Then upload it here to crop, align eye height, and compress to under 240 KB.',
        },
        {
          q: 'Why does the file size have to be strictly under 240 KB?',
          a: 'The U.S. Department of State Electronic Diversity Visa portal (dvprogram.state.gov) enforces an automatic hard cap of 240 kB (245,760 bytes). Any upload exceeding this limit is rejected instantly with an upload error. Our tool automatically calculates optimal JPEG compression to ensure your exported photo is safe and compliant.',
        },
        {
          q: 'Are eyeglasses allowed if I have a doctor prescription?',
          a: 'Since November 1, 2016, eyeglasses are strictly forbidden in all U.S. visa and passport photos, even with clear prescription lenses. The only rare exception is a signed medical statement for recent eye surgery (e.g., ocular surgery where eye patches/protection cannot be removed). In all standard circumstances, photos with glasses will be disqualified.',
        },
        {
          q: 'Is my photo private and secure?',
          a: 'Yes. 100% of your image processing, cropping, canvas rendering, background quality scanning, and JPEG file generation happens locally inside your browser via the HTML5 Canvas API. Your personal biometric photo is never uploaded to any remote server or database.',
        },
        {
          q: 'Can I wear religious head coverings (hijab, turban, etc.)?',
          a: 'Yes, religious headwear is allowed if you wear it daily as part of your religious faith. However, your entire face must be clearly visible from the tip of your chin to the top of your forehead, and both sides of your face must be completely unobstructed. No shadows may fall across your face.',
        },
        {
          q: 'Can I submit a photo I used in a previous DV lottery entry?',
          a: 'No. The Department of State uses automated facial recognition to compare photos against previous years. If the system detects you reused an old photo from an earlier DV entry, your entry will be automatically disqualified.',
        },
        {
          q: 'How do I deploy this tool to Vercel?',
          a: 'This application is built with standard Vite and React 19. To deploy to Vercel, simply push the repository to GitHub, connect it on Vercel, and click Deploy. The build command is `npm run build` with output directory `dist`.',
        },
      ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-white p-4 sm:p-8 rounded-2xl border border-slate-200 max-w-4xl mx-auto py-4 sm:py-6">
      <div className="flex items-center gap-2 mb-2">
        <HelpCircle className="w-5 h-5 text-blue-600 shrink-0" />
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          {t.faqTitle}
        </h2>
      </div>
      <p className="text-xs text-slate-500 mb-6">
        {t.faqSubtitle}
      </p>

      <div className="divide-y divide-slate-100">
        {faqs.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="py-3.5 sm:py-4">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left gap-4 group cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {item.q}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {isOpen && (
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed pr-2 sm:pr-6 animate-fadeIn">
                  {item.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
