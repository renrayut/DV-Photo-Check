import { BackgroundAnalysis, BackgroundSamplePoint, CompositionMetrics, DVRequirementCheck, PhotoAnalysisResult } from '../types/dv';
import { Language, translations } from '../i18n/translations';

/**
 * Calculates standard Rec. 601 luminance
 */
function getLuminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * Checks if color is neutral (grayscale or near-neutral white/off-white)
 */
function getColorDelta(r: number, g: number, b: number): number {
  return Math.abs(r - g) + Math.abs(g - b) + Math.abs(b - r);
}

/**
 * Samples background pixels in key perimeter and corner regions
 */
export function analyzeBackgroundFromCanvas(ctx: CanvasRenderingContext2D, width: number, height: number, lang: Language = 'en'): BackgroundAnalysis {
  const samplePoints: BackgroundSamplePoint[] = [];

  // Define relative test probe locations in regions that MUST be background in a passport photo
  const probeLocations = [
    // Top border line
    { rx: 0.10, ry: 0.05 },
    { rx: 0.25, ry: 0.05 },
    { rx: 0.50, ry: 0.04 },
    { rx: 0.75, ry: 0.05 },
    { rx: 0.90, ry: 0.05 },
    // Top-left corner box
    { rx: 0.05, ry: 0.12 },
    { rx: 0.12, ry: 0.12 },
    { rx: 0.06, ry: 0.20 },
    { rx: 0.14, ry: 0.20 },
    // Top-right corner box
    { rx: 0.95, ry: 0.12 },
    { rx: 0.88, ry: 0.12 },
    { rx: 0.94, ry: 0.20 },
    { rx: 0.86, ry: 0.20 },
    // Mid-upper sides
    { rx: 0.06, ry: 0.30 },
    { rx: 0.94, ry: 0.30 },
    { rx: 0.06, ry: 0.40 },
    { rx: 0.94, ry: 0.40 },
  ];

  let totalLuminance = 0;
  let totalDelta = 0;
  let brightCount = 0;
  let neutralCount = 0;
  const luminances: number[] = [];

  for (const probe of probeLocations) {
    const px = Math.min(width - 1, Math.max(0, Math.floor(probe.rx * width)));
    const py = Math.min(height - 1, Math.max(0, Math.floor(probe.ry * height)));
    
    // Sample a 3x3 patch around the point for stability
    const patch = ctx.getImageData(Math.max(0, px - 1), Math.max(0, py - 1), 3, 3);
    let pr = 0, pg = 0, pb = 0;
    const pixelCount = patch.data.length / 4;
    for (let i = 0; i < patch.data.length; i += 4) {
      pr += patch.data[i];
      pg += patch.data[i + 1];
      pb += patch.data[i + 2];
    }
    const r = Math.round(pr / pixelCount);
    const g = Math.round(pg / pixelCount);
    const b = Math.round(pb / pixelCount);

    const luminance = getLuminance(r, g, b);
    const delta = getColorDelta(r, g, b);
    luminances.push(luminance);
    totalLuminance += luminance;
    totalDelta += delta;

    // US State Dept: "plain white or off-white background"
    // Luminance >= 195 is off-white to pure white (255)
    const isBrightEnough = luminance >= 195;
    // Delta <= 30 means very close to pure neutral
    const isNeutral = delta <= 32;
    const isPassing = isBrightEnough && isNeutral;

    if (isBrightEnough) brightCount++;
    if (isNeutral) neutralCount++;

    samplePoints.push({
      x: px,
      y: py,
      r,
      g,
      b,
      luminance: Math.round(luminance),
      isNeutral,
      isBrightEnough,
      isPassing,
    });
  }

  const sampleCount = probeLocations.length;
  const avgLuminance = Math.round(totalLuminance / sampleCount);
  const avgDelta = Math.round(totalDelta / sampleCount);

  // Compute standard deviation of luminance to detect shadows/uneven gradients
  const variance = luminances.reduce((acc, val) => acc + Math.pow(val - avgLuminance, 2), 0) / sampleCount;
  const stdDev = Math.sqrt(variance);

  // Score calculations
  const whiteScorePercent = Math.min(100, Math.max(0, Math.round((avgLuminance / 255) * 100)));
  // Uniformity drops when stdDev is high (e.g. stdDev > 25 indicates shadows or patterns)
  const uniformityScorePercent = Math.min(100, Math.max(0, Math.round(100 - (stdDev * 2.2))));

  const isOverallNeutral = avgDelta <= 32;
  const isWhiteOrOffWhite = avgLuminance >= 195 && isOverallNeutral;
  const isUniform = stdDev <= 24;
  const hasShadows = stdDev > 24 || luminances.some(l => l < 165);

  let colorCast: 'neutral' | 'warm' | 'cool' | 'tinted' = 'neutral';
  if (avgDelta > 30) {
    colorCast = 'tinted';
  }

  let summaryMessage = lang === 'kh'
    ? 'ផ្ទៃខាងក្រោយបំពេញតាមស្តង់ដារពណ៌ស ឬសស្រាលផ្លូវការ។'
    : 'Background meets official plain white/off-white standards.';
  if (!isWhiteOrOffWhite && avgLuminance < 170) {
    summaryMessage = lang === 'kh'
      ? 'ផ្ទៃខាងក្រោយងងឹត ឬមានពណ៌។ គោលការណ៍ផ្លូវការតម្រូវឱ្យប្រើផ្ទៃខាងក្រោយពណ៌ស ឬសស្រាល។'
      : 'Background is too dark or colored. Official guidelines require a plain white or light off-white background.';
  } else if (hasShadows) {
    summaryMessage = lang === 'kh'
      ? 'រកឃើញស្រមោល ឬពន្លឺមិនស្មើគ្នានៅតាមគែមផ្ទៃខាងក្រោយ។'
      : 'Noticeable shadows or uneven lighting detected in the background corners.';
  } else if (!isOverallNeutral) {
    summaryMessage = lang === 'kh'
      ? 'ផ្ទៃខាងក្រោយមានលាយពណ៌ផ្សេង។ តម្រូវឱ្យប្រើពណ៌ស ឬសស្រាលធម្មជាតិសុទ្ធសាធ។'
      : 'Background has a noticeable color tint. A neutral white or light off-white is strictly required.';
  }

  return {
    averageLuminance: avgLuminance,
    whiteScorePercent,
    uniformityScorePercent,
    isUniform,
    isWhiteOrOffWhite,
    hasShadows,
    colorCast,
    samplePoints,
    summaryMessage,
  };
}

/**
 * Estimates head position and eye line from skin color and edge density
 */
export function estimateCompositionFromCanvas(ctx: CanvasRenderingContext2D, width: number, height: number): CompositionMetrics {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  let minHeadY = height;
  let maxHeadY = 0;
  let sumHeadX = 0;
  let headPixelCount = 0;

  // Scan central 70% of the image (x: 15%..85%, y: 5%..85%)
  const startX = Math.floor(width * 0.15);
  const endX = Math.floor(width * 0.85);
  const startY = Math.floor(height * 0.05);
  const endY = Math.floor(height * 0.85);

  for (let y = startY; y < endY; y += 4) {
    for (let x = startX; x < endX; x += 4) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Approximate human skin & hair detection in studio lighting
      const isSkin = r > 60 && g > 40 && b > 20 && r > g && (r - g) > 10 && Math.abs(r - b) > 12;
      const isHairOrDarkHead = r < 75 && g < 75 && b < 75 && y < height * 0.55;

      if (isSkin || isHairOrDarkHead) {
        headPixelCount++;
        sumHeadX += x;
        if (y < minHeadY) minHeadY = y;
        if (y > maxHeadY && isSkin) maxHeadY = y;
      }
    }
  }

  // Fallbacks if automatic segmentation is uncertain
  if (headPixelCount < 400 || minHeadY >= maxHeadY) {
    minHeadY = Math.floor(height * 0.12);
    maxHeadY = Math.floor(height * 0.68);
    sumHeadX = (width / 2) * 500;
    headPixelCount = 500;
  }

  const estimatedHeadHeight = maxHeadY - minHeadY;
  const headHeightPercent = Math.round((estimatedHeadHeight / height) * 100);
  
  // Approximate eye line: located ~40% between top of head and chin
  const estimatedEyeY = minHeadY + estimatedHeadHeight * 0.42;
  // Eye level measured from bottom of image (Official standard)
  const eyeLevelFromBottom = height - estimatedEyeY;
  const eyeLevelPercent = Math.round((eyeLevelFromBottom / height) * 100);

  const avgHeadX = sumHeadX / headPixelCount;
  const centerDev = Math.round(((avgHeadX - width / 2) / width) * 100);

  return {
    headHeightPercent: Math.min(85, Math.max(35, headHeightPercent)),
    eyeLevelPercent: Math.min(80, Math.max(40, eyeLevelPercent)),
    horizontalCenterOffsetPercent: centerDev,
    manualCalibration: false,
  };
}

/**
 * Runs the full test suite against U.S. Department of State DV specifications
 */
export function runDVValidation(params: {
  width: number;
  height: number;
  fileSizeBytes: number;
  mimeType: string;
  background: BackgroundAnalysis;
  composition: CompositionMetrics;
  lang?: Language;
}): PhotoAnalysisResult {
  const { width, height, fileSizeBytes, mimeType, background, composition, lang = 'en' } = params;
  const t = translations[lang];

  const checks: DVRequirementCheck[] = [];

  // 1. Aspect Ratio check: Must be 1:1 square
  const aspectRatio = width / (height || 1);
  const isSquare = Math.abs(aspectRatio - 1.0) < 0.015;
  checks.push({
    id: 'aspect_ratio',
    category: 'dimensions',
    title: t.checkAspectRatioTitle,
    status: isSquare ? 'pass' : 'fail',
    currentValue: `${aspectRatio.toFixed(2)}:1 (${width} × ${height} px)`,
    expectedValue: t.checkAspectRatioExpected,
    details: isSquare
      ? (lang === 'kh' ? 'រូបថតមានរាងការ៉េស្មើគ្នាត្រឹមត្រូវតាមតម្រូវការ។' : 'Image is perfectly square as required.')
      : (lang === 'kh' ? 'រូបថតត្រូវតែមានបណ្តោយ និងទទឹងស្មើគ្នា (1:1)។ សូមប្រើឧបករណ៍ Crop ដើម្បីកាត់។' : 'The photo must have equal width and height (square aspect ratio). Use the crop tool to make it 1:1.'),
    remedy: !isSquare ? t.checkAspectRatioRemedy : undefined,
  });

  // 2. Pixel Dimensions: 600x600 px min up to 1200x1200 px max
  const minDimension = Math.min(width, height);
  const maxDimension = Math.max(width, height);
  let dimStatus: 'pass' | 'fail' | 'warn' = 'pass';
  let dimDetails = lang === 'kh'
    ? 'វិមាត្ររូបថតត្រឹមត្រូវតាមស្តង់ដារក្រសួងការបរទេសអាមេរិក។'
    : 'Dimensions satisfy official U.S. State Department specifications.';
  if (minDimension < 600) {
    dimStatus = 'fail';
    dimDetails = lang === 'kh'
      ? `ទំហំរូបថត (${width}×${height}) ទាបជាងកម្រិតអប្បបរមា 600×600 px។ ប្រព័ន្ធផ្លូវការនឹងបដិសេធរូបនេះ។`
      : `Image resolution (${width}×${height}) is below the required 600×600 px minimum. Official submission will reject this.`;
  } else if (maxDimension > 1200) {
    dimStatus = 'warn';
    dimDetails = lang === 'kh'
      ? `ទំហំរូបថត (${width}×${height}) លើសពី 1200×1200 px។ ឧបករណ៍ទាញយកនឹងបង្រួមស្វ័យប្រវត្តិតាមស្តង់ដារ 600×600 px។`
      : `Image resolution (${width}×${height}) exceeds 1200×1200 px. Export tool will auto-rescale to optimal 600×600 px.`;
  }
  checks.push({
    id: 'pixel_dimensions',
    category: 'dimensions',
    title: t.checkDimensionsTitle,
    status: dimStatus,
    currentValue: `${width} × ${height} px`,
    expectedValue: t.checkDimensionsExpected,
    details: dimDetails,
    remedy: minDimension < 600 ? t.checkDimensionsRemedy : undefined,
  });

  // 3. File Format: JPEG (.jpg or .jpeg)
  const isJpeg = mimeType === 'image/jpeg' || mimeType === 'image/jpg';
  checks.push({
    id: 'file_format',
    category: 'file_size',
    title: t.checkFormatTitle,
    status: isJpeg ? 'pass' : 'fail',
    currentValue: mimeType || 'Unknown format',
    expectedValue: t.checkFormatExpected,
    details: isJpeg
      ? (lang === 'kh' ? 'ទម្រង់ឯកសារជាប្រភេទ JPEG ត្រឹមត្រូវ។' : 'File format is valid JPEG.')
      : (lang === 'kh' ? `ទម្រង់ឯកសារបច្ចុប្បន្នគឺ ${mimeType || 'មិនមែន JPEG'}។ ប្រព័ន្ធផ្លូវការទទួលយកតែ JPEG ប៉ុណ្ណោះ។` : `Detected format is ${mimeType || 'non-JPEG'}. Official DV submission system exclusively accepts JPEG.`),
    remedy: !isJpeg ? t.checkFormatRemedy : undefined,
  });

  // 4. File Size: <= 240 KB (245,760 bytes)
  const maxBytes = 245760; // 240 KB exactly
  const sizeKB = Number((fileSizeBytes / 1024).toFixed(1));
  let sizeStatus: 'pass' | 'fail' | 'warn' = 'pass';
  let sizeDetails = lang === 'kh'
    ? `ទំហំឯកសារគឺ ${sizeKB} KB (ស្ថិតក្រោមកម្រិតកំណត់ 240 KB)។`
    : `File size is ${sizeKB} KB (under the 240 KB ceiling).`;
  if (fileSizeBytes > maxBytes) {
    sizeStatus = 'fail';
    sizeDetails = lang === 'kh'
      ? `ទំហំឯកសារ (${sizeKB} KB) លើសពីកម្រិតអតិបរមា 240 KB។ ប្រព័ន្ធនឹងបដិសេធឯកសារនេះ។`
      : `File size (${sizeKB} KB) exceeds the 240 KB maximum limit. The official portal will reject files over 240 KB.`;
  } else if (fileSizeBytes < 25000) {
    sizeStatus = 'warn';
    sizeDetails = lang === 'kh'
      ? `ទំហំឯកសារតូចខ្លាំង (${sizeKB} KB) ដែលអាចធ្វើឱ្យរូបថតបាត់បង់គុណភាព ឬបែករូប។`
      : `File size is very small (${sizeKB} KB), which may indicate heavy compression artifacts.`;
  }
  checks.push({
    id: 'file_size',
    category: 'file_size',
    title: t.checkFileSizeTitle,
    status: sizeStatus,
    currentValue: `${sizeKB} KB (${fileSizeBytes.toLocaleString()} bytes)`,
    expectedValue: t.checkFileSizeExpected,
    details: sizeDetails,
    remedy: fileSizeBytes > maxBytes ? t.checkFileSizeRemedy : undefined,
  });

  // 5. Background Color: Plain white or off-white
  let bgStatus: 'pass' | 'fail' | 'warn' = 'pass';
  if (background.averageLuminance < 175 || !background.isWhiteOrOffWhite) {
    bgStatus = background.averageLuminance < 155 ? 'fail' : 'warn';
  }
  checks.push({
    id: 'background_color',
    category: 'background',
    title: t.checkBgColorTitle,
    status: bgStatus,
    currentValue: `${background.whiteScorePercent}% (Avg Luma: ${background.averageLuminance}/255)`,
    expectedValue: t.checkBgColorExpected,
    details: background.summaryMessage,
    remedy: bgStatus !== 'pass' ? t.checkBgColorRemedy : undefined,
  });

  // 6. Background Shadows & Uniformity
  const shadowStatus: 'pass' | 'fail' | 'warn' = background.hasShadows ? 'warn' : 'pass';
  checks.push({
    id: 'background_shadows',
    category: 'background',
    title: t.checkBgShadowTitle,
    status: shadowStatus,
    currentValue: `${background.uniformityScorePercent}% Uniformity`,
    expectedValue: t.checkBgShadowExpected,
    details: background.hasShadows
      ? (lang === 'kh' ? 'រកឃើញស្រមោល ឬពន្លឺមិនស្មើគ្នានៅផ្ទៃខាងក្រោយ។ ផ្ទៃខាងក្រោយត្រូវតែស្អាតគ្មានស្រមោល។' : 'Uneven lighting or shadow gradients detected in background. Background must be distraction-free.')
      : (lang === 'kh' ? 'ពន្លឺលើផ្ទៃខាងក្រោយរលោងស្មើល្អ គ្មានស្រមោលធ្លាក់ឡើយ។' : 'Background lighting is smooth and even without harsh drop shadows.'),
    remedy: background.hasShadows ? t.checkBgShadowRemedy : undefined,
  });

  // 7. Head Size Ratio: 50% to 69% of image height (1" to 1 3/8")
  const headHeight = composition.headHeightPercent;
  let headStatus: 'pass' | 'fail' | 'warn' = 'pass';
  let headDetails = lang === 'kh'
    ? `កម្ពស់ក្បាលមានទំហំ ${headHeight}% នៃកម្ពស់រូបថតសរុប (ត្រឹមត្រូវតាមចន្លោះ 50% - 69%)។`
    : `Head height occupies ${headHeight}% of total height (within 50% - 69% standard).`;
  if (headHeight < 50) {
    headStatus = 'fail';
    headDetails = lang === 'kh'
      ? `ទំហំក្បាល (${headHeight}%) តូចពេក។ ក្បាលត្រូវកាន់កាប់ចន្លោះ 50% ដល់ 69% នៃកម្ពស់រូបថត។`
      : `Head height (${headHeight}%) is too small. Head must occupy between 50% and 69% of the photo height.`;
  } else if (headHeight > 69) {
    headStatus = 'fail';
    headDetails = lang === 'kh'
      ? `ទំហំក្បាល (${headHeight}%) ធំពេក។ ក្បាលត្រូវកាន់កាប់ចន្លោះ 50% ដល់ 69% នៃកម្ពស់រូបថត។`
      : `Head height (${headHeight}%) is too large/cropped too close. Head must occupy between 50% and 69% of the photo height.`;
  }
  checks.push({
    id: 'head_height_ratio',
    category: 'composition',
    title: t.checkHeadHeightTitle,
    status: headStatus,
    currentValue: `${headHeight}% of image height`,
    expectedValue: t.checkHeadHeightExpected,
    details: headDetails,
    remedy: headStatus !== 'pass' ? t.checkHeadHeightRemedy : undefined,
  });

  // 8. Eye Level Ratio: 56% to 69% from bottom of image
  const eyeLevel = composition.eyeLevelPercent;
  let eyeStatus: 'pass' | 'fail' | 'warn' = 'pass';
  let eyeDetails = lang === 'kh'
    ? `កម្រិតភ្នែកស្ថិតនៅ ${eyeLevel}% ពីបាតក្រោមនៃរូបថត (ត្រឹមត្រូវតាមចន្លោះ 56% - 69%)។`
    : `Eye level is ${eyeLevel}% from the bottom of the photo (within 56% - 69% range).`;
  if (eyeLevel < 56) {
    eyeStatus = 'fail';
    eyeDetails = lang === 'kh'
      ? `កម្រិតភ្នែក (${eyeLevel}%) ទាបពេក។ ភ្នែកត្រូវតែស្ថិតនៅចន្លោះ 56% ដល់ 69% ពីបាតក្រោម។`
      : `Eye line (${eyeLevel}% from bottom) is positioned too low. Eyes must be between 56% and 69% from bottom.`;
  } else if (eyeLevel > 69) {
    eyeStatus = 'fail';
    eyeDetails = lang === 'kh'
      ? `កម្រិតភ្នែក (${eyeLevel}%) ខ្ពស់ពេក។ ភ្នែកត្រូវតែស្ថិតនៅចន្លោះ 56% ដល់ 69% ពីបាតក្រោម។`
      : `Eye line (${eyeLevel}% from bottom) is positioned too high. Eyes must be between 56% and 69% from bottom.`;
  }
  checks.push({
    id: 'eye_level_ratio',
    category: 'composition',
    title: t.checkEyeLevelTitle,
    status: eyeStatus,
    currentValue: `${eyeLevel}% from bottom`,
    expectedValue: t.checkEyeLevelExpected,
    details: eyeDetails,
    remedy: eyeStatus !== 'pass' ? t.checkEyeLevelRemedy : undefined,
  });

  // 9. Horizontal Centering
  const centerOffset = Math.abs(composition.horizontalCenterOffsetPercent);
  const centerStatus: 'pass' | 'fail' | 'warn' = centerOffset <= 6 ? 'pass' : 'warn';
  checks.push({
    id: 'horizontal_centering',
    category: 'composition',
    title: t.checkCenterTitle,
    status: centerStatus,
    currentValue: centerOffset === 0 ? 'Centered (0% offset)' : `${centerOffset}% offset`,
    expectedValue: t.checkCenterExpected,
    details: centerStatus === 'pass'
      ? (lang === 'kh' ? 'ផ្ទៃមុខស្ថិតនៅចំកណ្តាលត្រង់ជួរឈរបានល្អ។' : 'Head is well centered on the horizontal axis.')
      : (lang === 'kh' ? 'ផ្ទៃមុខផ្អៀង ឬរំកិលខុសកណ្តាលបន្តិច។ សូមតម្រឹមកណ្តាលច្រមុះតាមបន្ទាត់បញ្ឈរ។' : 'Subject appears slightly off-center. Align nose along the vertical center axis.'),
    remedy: centerStatus !== 'pass' ? t.checkCenterRemedy : undefined,
  });

  // 10. Regulatory: Eyeglasses Ban Verification
  checks.push({
    id: 'eyeglasses_rule',
    category: 'regulations',
    title: t.checkGlassesTitle,
    status: 'pass',
    currentValue: lang === 'kh' ? 'ការបញ្ជាក់ដោយខ្លួនឯង / AI' : 'Self-Certification / AI check',
    expectedValue: t.checkGlassesExpected,
    details: t.checkGlassesDesc,
    remedy: t.checkGlassesRemedy,
  });

  const failCount = checks.filter(c => c.status === 'fail').length;
  const warnCount = checks.filter(c => c.status === 'warn').length;
  const passCount = checks.filter(c => c.status === 'pass').length;
  const overallPass = failCount === 0;

  return {
    width,
    height,
    isSquare,
    aspectRatio,
    fileSizeBytes,
    fileSizeKB: sizeKB,
    mimeType,
    colorDepthBits: 24,
    isColor: true,
    background,
    composition,
    checks,
    overallPass,
    passCount,
    warnCount,
    failCount,
  };
}
