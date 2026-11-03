export type CheckStatus = 'pass' | 'fail' | 'warn';

export interface DVRequirementCheck {
  id: string;
  category: 'dimensions' | 'file_size' | 'background' | 'composition' | 'regulations';
  title: string;
  status: CheckStatus;
  currentValue: string;
  expectedValue: string;
  details: string;
  remedy?: string;
}

export interface BackgroundSamplePoint {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  luminance: number;
  isNeutral: boolean;
  isBrightEnough: boolean;
  isPassing: boolean;
}

export interface BackgroundAnalysis {
  averageLuminance: number; // 0 - 255
  whiteScorePercent: number; // 0 - 100%
  uniformityScorePercent: number; // 0 - 100%
  isUniform: boolean;
  isWhiteOrOffWhite: boolean;
  hasShadows: boolean;
  colorCast: 'neutral' | 'warm' | 'cool' | 'tinted';
  samplePoints: BackgroundSamplePoint[];
  summaryMessage: string;
}

export interface CropSettings {
  zoom: number; // 1.0 - 3.0
  panX: number; // offset in px
  panY: number; // offset in px
  rotation: number; // degrees -15 to +15
}

export interface CompositionMetrics {
  headHeightPercent: number; // 50% - 69% is compliant
  eyeLevelPercent: number; // 56% - 69% from bottom is compliant
  horizontalCenterOffsetPercent: number; // deviation from 50% center
  manualCalibration: boolean;
}

export interface PhotoAnalysisResult {
  width: number;
  height: number;
  isSquare: boolean;
  aspectRatio: number;
  fileSizeBytes: number;
  fileSizeKB: number;
  mimeType: string;
  colorDepthBits: number;
  isColor: boolean;
  background: BackgroundAnalysis;
  composition: CompositionMetrics;
  checks: DVRequirementCheck[];
  overallPass: boolean;
  passCount: number;
  warnCount: number;
  failCount: number;
}
