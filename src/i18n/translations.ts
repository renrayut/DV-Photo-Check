export type Language = 'en' | 'kh';

export interface Translations {
  appName: string;
  appSubtitle: string;
  heroBadgePrivacy: string;
  heroBadgeStandards: string;
  heroBadgeCompress: string;
  navChecker: string;
  navGuidelines: string;
  navFaq: string;
  officialPortalBtn: string;

  // Workspace controls
  uploadBtn: string;
  sampleTestHint: string;
  sampleCompliantBtn: string;
  sampleNeedsCropBtn: string;
  workspaceInstruction: string;
  targetSpec: string;
  dropPhotoHere: string;
  dropPhotoSub: string;
  zoom: string;
  fineTilt: string;
  headOvalToggle: string;
  eyeBandToggle: string;
  bgProbesToggle: string;
  gridToggle: string;
  resetBtn: string;
  touchHelper: string;

  // Mobile Tabs
  mobileTabCrop: string;
  mobileTabReport: string;

  // Validation Scorecard
  passedVerdictTitle: string;
  passedVerdictDesc: string;
  needsFixVerdictTitle: string;
  needsFixVerdictDesc: string;
  metricDimensions: string;
  metricDimensionsSub: string;
  metricFileSize: string;
  metricFileSizeSub: string;
  metricBackground: string;
  metricBackgroundUniform: string;
  metricBackgroundShadows: string;
  metricHeadHeight: string;
  metricHeadHeightSub: string;
  metricEyeLevel: string;
  metricEyeLevelSub: string;
  metricFormat: string;
  metricFormatSub: string;

  // Export
  exportSectionTitle: string;
  exportSafeBadge: string;
  download600Btn: string;
  download1200Btn: string;
  printSheetBtn: string;
  aiAuditTriggerPrompt: string;
  runAiAuditBtn: string;

  // Checklist
  checklistTitle: string;
  criteriaAudited: string;
  howToFixPrefix: string;
  officialRulePrefix: string;

  // Specific check titles & remedies
  checkAspectRatioTitle: string;
  checkAspectRatioExpected: string;
  checkAspectRatioRemedy: string;
  checkDimensionsTitle: string;
  checkDimensionsExpected: string;
  checkDimensionsRemedy: string;
  checkFormatTitle: string;
  checkFormatExpected: string;
  checkFormatRemedy: string;
  checkFileSizeTitle: string;
  checkFileSizeExpected: string;
  checkFileSizeRemedy: string;
  checkBgColorTitle: string;
  checkBgColorExpected: string;
  checkBgColorRemedy: string;
  checkBgShadowTitle: string;
  checkBgShadowExpected: string;
  checkBgShadowRemedy: string;
  checkHeadHeightTitle: string;
  checkHeadHeightExpected: string;
  checkHeadHeightRemedy: string;
  checkEyeLevelTitle: string;
  checkEyeLevelExpected: string;
  checkEyeLevelRemedy: string;
  checkCenterTitle: string;
  checkCenterExpected: string;
  checkCenterRemedy: string;
  checkGlassesTitle: string;
  checkGlassesExpected: string;
  checkGlassesDesc: string;
  checkGlassesRemedy: string;

  // AI Modal
  aiModalTitle: string;
  aiModalSubtitle: string;
  aiModalStartPrompt: string;
  aiModalStartDesc: string;
  aiModalStartBtn: string;
  aiModalInspecting: string;
  aiVerdictPass: string;
  aiVerdictRisk: string;
  aiNoGlasses: string;
  aiNeutralExp: string;
  aiDirectGaze: string;
  aiHeadPose: string;
  aiBgNeutral: string;
  aiLighting: string;
  aiGuidanceTitle: string;
  closeBtn: string;

  // Guidelines page
  guidelinesTitle: string;
  guidelinesSubtitle: string;
  officialGuideLink: string;
  guidelinesIntro: string;
  pitfallsTitle: string;
  pitfallsSubtitle: string;

  // FAQ
  faqTitle: string;
  faqSubtitle: string;

  // Footer
  footerNotice: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'DV PhotoPass',
    appSubtitle: 'Automated real-time inspection for official U.S. Diversity Visa Program (EDV) entry standards. Verify dimensions, 240 KB file size limits, plain white background quality, and biometric head alignment before final submission.',
    heroBadgePrivacy: '100% In-Browser Privacy',
    heroBadgeStandards: 'DV-2026/2027 Standards',
    heroBadgeCompress: 'Auto-Compress <240 KB',
    navChecker: 'Validator & Cropper',
    navGuidelines: 'Official Standards',
    navFaq: 'Common Rejections & FAQ',
    officialPortalBtn: 'Official DV Portal',

    uploadBtn: 'Upload Your Photo',
    sampleTestHint: 'or test with sample:',
    sampleCompliantBtn: 'Compliant Demo',
    sampleNeedsCropBtn: 'Needs Crop Demo',
    workspaceInstruction: 'Drag image to pan · Scroll/pinch to zoom · Align eyes in blue band',
    targetSpec: 'Target: 600 × 600 px (1:1)',
    dropPhotoHere: 'Drop your photo here',
    dropPhotoSub: 'JPEG format, min 600×600 px',
    zoom: 'Zoom',
    fineTilt: 'Fine Tilt',
    headOvalToggle: 'Head Oval',
    eyeBandToggle: 'Eye Band',
    bgProbesToggle: 'BG Probes',
    gridToggle: 'Grid',
    resetBtn: 'Reset Position',
    touchHelper: 'Use 1 finger to pan, pinch to zoom',

    mobileTabCrop: 'Crop & Align',
    mobileTabReport: 'Audit Report',

    passedVerdictTitle: 'Official DV Compliance Verified',
    passedVerdictDesc: 'Your photo meets all strict technical, background, and biometric dimensions required by the U.S. Department of State for the Diversity Visa Program.',
    needsFixVerdictTitle: 'Requirements Need Adjustment',
    needsFixVerdictDesc: 'Review the flagged items below and use the crop, pan, and zoom controls to achieve 100% compliance before final submission.',
    metricDimensions: 'Dimensions',
    metricDimensionsSub: '1:1 Square (600–1200 px)',
    metricFileSize: 'File Size',
    metricFileSizeSub: 'Max allowed: 240 KB',
    metricBackground: 'Background',
    metricBackgroundUniform: 'Uniform lighting',
    metricBackgroundShadows: 'Shadows detected',
    metricHeadHeight: 'Head Height',
    metricHeadHeightSub: 'Required: 50% – 69%',
    metricEyeLevel: 'Eye Level',
    metricEyeLevelSub: 'Required: 56% – 69%',
    metricFormat: 'Format & Color',
    metricFormatSub: 'sRGB Color space',

    exportSectionTitle: 'Export Certified Photo',
    exportSafeBadge: 'Guaranteed < 240 KB JPEG',
    download600Btn: 'Download 600×600 JPEG',
    download1200Btn: 'Download 1200×1200',
    printSheetBtn: 'Print 2×2″ Sheet',
    aiAuditTriggerPrompt: 'Need AI inspection for subtle shadows, glasses, or facial expression?',
    runAiAuditBtn: 'Run Deep AI Audit',

    checklistTitle: 'Official Checklist & Rule Audits',
    criteriaAudited: 'criteria audited',
    howToFixPrefix: 'How to fix:',
    officialRulePrefix: 'Rule:',

    checkAspectRatioTitle: 'Aspect Ratio (Square 1:1)',
    checkAspectRatioExpected: '1:1 (Equal width and height)',
    checkAspectRatioRemedy: 'Use the Crop tool to crop your photo to a 1:1 square.',
    checkDimensionsTitle: 'Pixel Dimensions (600×600 to 1200×1200)',
    checkDimensionsExpected: '600 × 600 px min, 1200 × 1200 px max',
    checkDimensionsRemedy: 'Provide an original higher-resolution photo taken with a modern camera or smartphone.',
    checkFormatTitle: 'File Format (JPEG / .jpg)',
    checkFormatExpected: 'image/jpeg (.jpg)',
    checkFormatRemedy: 'Export your image using our Export tool to save as compliant JPEG.',
    checkFileSizeTitle: 'File Size (≤ 240 KB)',
    checkFileSizeExpected: '≤ 240 KB (245,760 bytes)',
    checkFileSizeRemedy: 'Click "Download 600×600 JPEG" to auto-compress to < 240 KB.',
    checkBgColorTitle: 'Background Brightness & Whiteness',
    checkBgColorExpected: 'Plain white or light off-white (≥ 78%)',
    checkBgColorRemedy: 'Take photo against a bright white wall or lit seamless white backdrop.',
    checkBgShadowTitle: 'Background Uniformity & Shadows',
    checkBgShadowExpected: 'Clean, shadow-free, no patterns or gradient',
    checkBgShadowRemedy: 'Position subject 2–3 feet away from the wall and use diffused front lighting.',
    checkHeadHeightTitle: 'Head Height Ratio (50% – 69%)',
    checkHeadHeightExpected: '50% to 69% (1 to 1 3/8 inches)',
    checkHeadHeightRemedy: 'Use the Crop tool zoom and oval template overlay to adjust head framing.',
    checkEyeLevelTitle: 'Eye Level Height (56% – 69% from bottom)',
    checkEyeLevelExpected: '56% to 69% (1 1/8 to 1 3/8 inches)',
    checkEyeLevelRemedy: 'Shift pan vertically in the Crop tool to align eyes inside the guide line.',
    checkCenterTitle: 'Face Centering (Horizontal Alignment)',
    checkCenterExpected: 'Directly centered horizontally',
    checkCenterRemedy: 'Pan horizontally to center the face with the vertical guide line.',
    checkGlassesTitle: 'No Eyeglasses (Strict Prohibition)',
    checkGlassesExpected: 'No glasses, sunglasses, or tinted lenses',
    checkGlassesDesc: 'Since Nov 1, 2016, eyeglasses of any kind are strictly forbidden in U.S. visa photos. Photos with glasses are automatically disqualified.',
    checkGlassesRemedy: 'If you are wearing glasses in this photo, take a new photo without glasses.',

    aiModalTitle: 'Gemini AI Visa Photo Inspector',
    aiModalSubtitle: 'Multimodal audit for subtle facial, accessory, and lighting details',
    aiModalStartPrompt: 'Run Comprehensive Visa Biometrics Audit',
    aiModalStartDesc: 'Gemini will audit your cropped image against strict U.S. State Department biometric criteria: no eyeglasses, neutral expression, straight head pose, shadow-free lighting, and zero digital alterations.',
    aiModalStartBtn: 'Start AI Inspection',
    aiModalInspecting: 'Inspecting photo biometrics & lighting...',
    aiVerdictPass: 'AI Verdict: Highly Compliant',
    aiVerdictRisk: 'AI Verdict: Rejection Risk Detected',
    aiNoGlasses: 'No Eyeglasses',
    aiNeutralExp: 'Neutral Expression',
    aiDirectGaze: 'Direct Camera Gaze',
    aiHeadPose: 'Head Pose Straight',
    aiBgNeutral: 'Background Neutral',
    aiLighting: 'Lighting & Shadows',
    aiGuidanceTitle: 'Actionable Guidance',
    closeBtn: 'Close',

    guidelinesTitle: 'Official U.S. Diversity Visa Photo Standards',
    guidelinesSubtitle: 'Directly aligned with U.S. Department of State Consular Affairs & DV Program Bulletin',
    officialGuideLink: 'State Department Official Guide',
    guidelinesIntro: 'More than 30% of Diversity Visa applications are disqualified annually due to non-compliant digital photos. The official online registration system validates digital dimensions and file size during upload, while automated biometric scanning and consular officers verify background quality, eye alignment, and authenticity.',
    pitfallsTitle: 'Common Rejection Causes & How to Avoid Them',
    pitfallsSubtitle: 'Top mistakes that cause entrants to be disqualified before the lottery draw',

    faqTitle: 'Frequently Asked Questions & Entry Advice',
    faqSubtitle: 'Everything you need to know about photo preparation, biometric rules, and official upload.',

    footerNotice: 'Independent technical verification & image cropping utility. Not affiliated with the U.S. government.',
  },
  kh: {
    appName: 'DV PhotoPass',
    appSubtitle: 'ឧបករណ៍ត្រួតពិនិត្យ និងកែតម្រឹមរូបថតស្វ័យប្រវត្តិតាមស្តង់ដារផ្លូវការនៃកម្មវិធី Diversity Visa (DV Lottery / កាតបៃតងអាមេរិក)។ ផ្ទៀងផ្ទាត់វិមាត្រ ទំហំឯកសារក្រោម 240 KB គុណភាពផ្ទៃខាងក្រោយពណ៌ស និងកម្រិតភ្នែកមុនពេលដាក់ពាក្យផ្លូវការ។',
    heroBadgePrivacy: 'សុវត្ថិភាពខ្ពស់ 100% លើ Browser',
    heroBadgeStandards: 'ស្តង់ដារ DV-2026/2027',
    heroBadgeCompress: 'បង្រួមឯកសារ <240 KB ស្វ័យប្រវត្តិ',
    navChecker: 'ឧបករណ៍ពិនិត្យ និងកាត់រូប',
    navGuidelines: 'ស្តង់ដារផ្លូវការ',
    navFaq: 'កំហុសទូទៅ & សំណួរញឹកញាប់',
    officialPortalBtn: 'គេហទំព័រផ្លូវការ DV',

    uploadBtn: 'ជ្រើសរើសរូបថតរបស់អ្នក',
    sampleTestHint: 'ឬសាកល្បងជាមួយរូបគំរូ:',
    sampleCompliantBtn: 'រូបគំរូត្រឹមត្រូវ',
    sampleNeedsCropBtn: 'រូបគំរូត្រូវកាត់តម្រឹម',
    workspaceInstruction: 'អូសរូបដើម្បីរំកិល · ពង្រីក/បង្រួម · តម្រឹមកម្រិតភ្នែកក្នុងបន្ទាត់ពណ៌ខៀវ',
    targetSpec: 'គោលដៅ: 600 × 600 px (1:1)',
    dropPhotoHere: 'ទម្លាក់រូបថតរបស់អ្នកនៅទីនេះ',
    dropPhotoSub: 'ទម្រង់ JPEG, អប្បបរមា 600×600 px',
    zoom: 'ពង្រីក/បង្រួម',
    fineTilt: 'បង្វិលកែតម្រង់',
    headOvalToggle: 'រង្វង់ក្បាល',
    eyeBandToggle: 'បន្ទាត់ភ្នែក',
    bgProbesToggle: 'ចំណុចផ្ទៃខាងក្រោយ',
    gridToggle: 'ក្រឡាចត្រង្គ',
    resetBtn: 'កំណត់ទីតាំងដើម',
    touchHelper: 'ប្រើម្រាមដៃ ១ ដើម្បីអូសរំកិល, ប្រើ ២ ម្រាមដៃដើម្បីពង្រីក',

    mobileTabCrop: 'កាត់ និងតម្រឹមរូប',
    mobileTabReport: 'របាយការណ៍ត្រួតពិនិត្យ',

    passedVerdictTitle: 'រូបថតស្របតាមស្តង់ដារផ្លូវការ DV',
    passedVerdictDesc: 'រូបថតរបស់អ្នកបំពេញតាមលក្ខខណ្ឌបច្ចេកទេស គុណភាពផ្ទៃខាងក្រោយ និងវិមាត្រជីវមាត្រទាំងអស់ដែលក្រសួងការបរទេសសហរដ្ឋអាមេរិកតម្រូវ។',
    needsFixVerdictTitle: 'លក្ខខណ្ឌមួយចំនួនត្រូវការកែតម្រូវ',
    needsFixVerdictDesc: 'សូមពិនិត្យចំណុចដែលមានសញ្ញាព្រមានខាងក្រោម ហើយប្រើឧបករណ៍កាត់ ពង្រីក និងរំកិលដើម្បីទទួលបានលទ្ធផលត្រឹមត្រូវ 100% មុនពេលដាក់ពាក្យ។',
    metricDimensions: 'វិមាត្ររូបថត',
    metricDimensionsSub: 'ការ៉េ 1:1 (600–1200 px)',
    metricFileSize: 'ទំហំឯកសារ',
    metricFileSizeSub: 'អនុញ្ញាតអតិបរមា: 240 KB',
    metricBackground: 'ផ្ទៃខាងក្រោយ',
    metricBackgroundUniform: 'ពន្លឺរលោងស្មើល្អ',
    metricBackgroundShadows: 'មានស្រមោលលើផ្ទៃក្រោយ',
    metricHeadHeight: 'កម្ពស់ក្បាល',
    metricHeadHeightSub: 'តម្រូវការ: 50% – 69%',
    metricEyeLevel: 'កម្រិតភ្នែក',
    metricEyeLevelSub: 'តម្រូវការ: 56% – 69% ពីបាត',
    metricFormat: 'ទម្រង់ & ពណ៌',
    metricFormatSub: 'កម្រិតពណ៌ sRGB 24-bit',

    exportSectionTitle: 'ទាញយករូបថតដែលបានបញ្ជាក់ត្រឹមត្រូវ',
    exportSafeBadge: 'ធានាទំហំក្រោម 240 KB ប្រភេទ JPEG',
    download600Btn: 'ទាញយក 600×600 JPEG',
    download1200Btn: 'ទាញយក 1200×1200',
    printSheetBtn: 'សន្លឹកបោះពុម្ពទំហំ 2×2″',
    aiAuditTriggerPrompt: 'ត្រូវការ AI ជួយពិនិត្យស្រមោល ការពាក់វ៉ែនតា ឬទឹកមុខបន្ថែម?',
    runAiAuditBtn: 'ដំណើរការត្រួតពិនិត្យ AI',

    checklistTitle: 'បញ្ជីផ្ទៀងផ្ទាត់ស្តង់ដារលម្អិត',
    criteriaAudited: 'លក្ខខណ្ឌត្រូវបានពិនិត្យ',
    howToFixPrefix: 'វិធីដោះស្រាយ:',
    officialRulePrefix: 'ច្បាប់ផ្លូវការ:',

    checkAspectRatioTitle: 'សមាមាត្ររូបថត (ការ៉េ 1:1)',
    checkAspectRatioExpected: '1:1 (បណ្តោយ និងទទឹងស្មើគ្នា)',
    checkAspectRatioRemedy: 'ប្រើឧបករណ៍ Crop ដើម្បីកាត់រូបថតឱ្យមានរាងការ៉េ 1:1។',
    checkDimensionsTitle: 'ទំហំភីកសែល (600×600 ដល់ 1200×1200 px)',
    checkDimensionsExpected: 'អប្បបរមា 600 × 600 px, អតិបរមា 1200 × 1200 px',
    checkDimensionsRemedy: 'សូមប្រើប្រាស់រូបថតច្បាស់ដើមដែលថតដោយកាមេរ៉ា ឬទូរស័ព្ទទំនើប។',
    checkFormatTitle: 'ទម្រង់ឯកសារ (JPEG / .jpg)',
    checkFormatExpected: 'image/jpeg (.jpg)',
    checkFormatRemedy: 'ចុចប៊ូតុងទាញយកដើម្បីរក្សាទុកជារូបថតទម្រង់ JPEG ត្រឹមត្រូវ។',
    checkFileSizeTitle: 'ទំហំឯកសារ (≤ 240 KB)',
    checkFileSizeExpected: '≤ 240 KB (245,760 bytes)',
    checkFileSizeRemedy: 'ចុច "ទាញយក 600×600 JPEG" ប្រព័ន្ធនឹងបង្រួមស្វ័យប្រវត្តិតិចជាង 240 KB។',
    checkBgColorTitle: 'ពន្លឺ និងភាពសនៃផ្ទៃខាងក្រោយ',
    checkBgColorExpected: 'ពណ៌សសុទ្ធ ឬសស្រាល (≥ 78%)',
    checkBgColorRemedy: 'ថតរូបនៅមុខជញ្ជាំងពណ៌សភ្លឺ ឬក្រណាត់សរលោងគ្មានផ្នត់។',
    checkBgShadowTitle: 'ភាពស្មើគ្នានិងស្រមោលលើផ្ទៃក្រោយ',
    checkBgShadowExpected: 'ស្អាត គ្មានស្រមោល គ្មានក្បាច់ឬពណ៌ជម្រាល',
    checkBgShadowRemedy: 'ឈរឱ្យឆ្ងាយពីជញ្ជាំងចម្ងាយប្រហែលកន្លះម៉ែត្រ ទៅមួយម៉ែត្រ ដើម្បីកុំឱ្យធ្លាក់ស្រមោលលើជញ្ជាំង។',
    checkHeadHeightTitle: 'សមាមាត្រកម្ពស់ក្បាល (50% – 69%)',
    checkHeadHeightExpected: '50% ដល់ 69% នៃកម្ពស់រូបសរុប (1 ដល់ 1 3/8 អ៊ីញ)',
    checkHeadHeightRemedy: 'ប្រើរបារ Zoom និងរង្វង់គំរូដើម្បីកំណត់ទំហំក្បាលឱ្យត្រូវតាមកម្រិត។',
    checkEyeLevelTitle: 'កម្ពស់កម្រិតភ្នែក (56% – 69% ពីបាត)',
    checkEyeLevelExpected: '56% ដល់ 69% ពីបាតក្រោមនៃរូបថត',
    checkEyeLevelRemedy: 'រំកិលរូបថតឡើងលើ ឬចុះក្រោមឱ្យភ្នែកស្ថិតក្នុងបន្ទាត់ពណ៌ខៀវ។',
    checkCenterTitle: 'ទីតាំងកណ្តាលនៃមុខ (Horizontal Centering)',
    checkCenterExpected: 'ចំកណ្តាលត្រង់ជួរឈរ',
    checkCenterRemedy: 'រំកិលរូបថតទៅឆ្វេង ឬស្តាំឱ្យច្រមុះចំកណ្តាលបន្ទាត់បញ្ឈរ។',
    checkGlassesTitle: 'ហាមពាក់វ៉ែនតាដាច់ខាត (Strict Prohibition)',
    checkGlassesExpected: 'ហាមពាក់វ៉ែនតាគ្រប់ប្រភេទ (ទាំងវ៉ែនតាភ្នែក)',
    checkGlassesDesc: 'ចាប់តាំងពីថ្ងៃទី 1 ខែវិច្ឆិកា ឆ្នាំ 2016 ក្រសួងការបរទេសអាមេរិកហាមពាក់វ៉ែនតាដាច់ខាតក្នុងរូបថតទិដ្ឋាការ។ រូបណាមានពាក់វ៉ែនតានឹងត្រូវធ្លាក់ស្វ័យប្រវត្តិ។',
    checkGlassesRemedy: 'ប្រសិនបើអ្នកកំពុងពាក់វ៉ែនតាក្នុងរូបនេះ សូមដោះវ៉ែនតាចេញហើយថតរូបថ្មី។',

    aiModalTitle: 'ប្រព័ន្ធ AI ពិនិត្យរូបថតទិដ្ឋាការអាមេរិក',
    aiModalSubtitle: 'ការត្រួតពិនិត្យកម្រិតខ្ពស់លើផ្ទៃមុខ វ៉ែនតា និងពន្លឺស្រមោល',
    aiModalStartPrompt: 'ដំណើរការត្រួតពិនិត្យលម្អិតដោយ AI',
    aiModalStartDesc: 'Gemini AI នឹងវិភាគរូបថតរបស់អ្នកផ្អែកលើស្តង់ដារតឹងរ៉ឹង៖ គ្មានវ៉ែនតា ទឹកមុខស្មើធម្មតា ភ្នែកមើលត្រង់កាមេរ៉ា ក្បាលត្រង់ និងគ្មានស្រមោលលើផ្ទៃមុខ។',
    aiModalStartBtn: 'ចាប់ផ្តើមពិនិត្យជាមួយ AI',
    aiModalInspecting: 'កំពុងពិនិត្យផ្ទៃមុខ ពន្លឺ និងស្តង់ដារជីវមាត្រ...',
    aiVerdictPass: 'លទ្ធផល AI: ត្រឹមត្រូវស្របតាមស្តង់ដារ',
    aiVerdictRisk: 'លទ្ធផល AI: រកឃើញចំណុចប្រឈមនឹងការធ្លាក់',
    aiNoGlasses: 'គ្មានវ៉ែនតា',
    aiNeutralExp: 'ទឹកមុខស្មើធម្មតា',
    aiDirectGaze: 'ភ្នែកមើលចំកាមេរ៉ា',
    aiHeadPose: 'ក្បាលត្រង់ មិនផ្អៀង',
    aiBgNeutral: 'ផ្ទៃខាងក្រោយពណ៌ស',
    aiLighting: 'ពន្លឺ និងស្រមោល',
    aiGuidanceTitle: 'ការណែនាំដើម្បីកែលម្អ',
    closeBtn: 'បិទ',

    guidelinesTitle: 'ស្តង់ដាររូបថតផ្លូវការសម្រាប់ Diversity Visa (DV)',
    guidelinesSubtitle: 'ស្របតាមសេចក្តីណែនាំផ្លូវការរបស់ការិយាល័យកុងស៊ុល នៃក្រសួងការបរទេសសហរដ្ឋអាមេរិក',
    officialGuideLink: 'សៀវភៅណែនាំផ្លូវការក្រសួងការបរទេស',
    guidelinesIntro: 'ជារៀងរាល់ឆ្នាំ បេក្ខជនជាង 30% ត្រូវបានដកសិទ្ធិដោយសារតែរូបថតមិនត្រឹមត្រូវតាមស្តង់ដារបច្ចេកទេស។ ប្រព័ន្ធចុះឈ្មោះអនឡាញផ្លូវការពិនិត្យវិមាត្រ និងទំហំឯកសារពេល Upload ចំណែកប្រព័ន្ធស្កេនជីវមាត្រ និងមន្ត្រីកុងស៊ុលនឹងពិនិត្យផ្ទៃខាងក្រោយ ភ្នែក និងភាពពិតនៃរូបថត។',
    pitfallsTitle: 'មូលហេតុចម្បងដែលនាំឱ្យធ្លាក់រូបថត និងវិធីបង្ការ',
    pitfallsSubtitle: 'កំហុសដែលកើតឡើងញឹកញាប់បំផុតមុនពេលចាប់ឆ្នោត DV',

    faqTitle: 'សំណួរដែលសួរញឹកញាប់ និងការណែនាំដាក់ពាក្យ',
    faqSubtitle: 'ព័ត៌មានចាំបាច់ទាំងអស់អំពីការថតរូប ច្បាប់ជីវមាត្រ និងការរៀបចំដាក់ពាក្យផ្លូវការ។',

    footerNotice: 'ឧបករណ៍ឯករាជ្យសម្រាប់ពិនិត្យ និងកាត់រូបថតបច្ចេកទេស។ មិនមានទំនាក់ទំនងផ្លូវការជាមួយរដ្ឋាភិបាលសហរដ្ឋអាមេរិកឡើយ។',
  },
};
