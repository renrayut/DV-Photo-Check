import React from 'react';
import { BackgroundSamplePoint } from '../types/dv';
import { Language } from '../i18n/translations';

interface OfficialOverlayProps {
  showOval: boolean;
  showEyeBand: boolean;
  showGrid: boolean;
  showProbes: boolean;
  samplePoints?: BackgroundSamplePoint[];
  canvasSize: number; // in pixels (e.g. 500)
  lang?: Language;
}

export const OfficialOverlay: React.FC<OfficialOverlayProps> = ({
  showOval,
  showEyeBand,
  showGrid,
  showProbes,
  samplePoints = [],
  canvasSize,
  lang = 'en',
}) => {
  // Official U.S. State Dept ratios
  // Head height: 50% to 69%
  // Eye height from bottom: 56% to 69% -> from top: 31% to 44%
  const eyeBandTop = canvasSize * (1 - 0.69); // 31% from top
  const eyeBandHeight = canvasSize * (0.69 - 0.56); // 13% band
  const eyeBandBottom = eyeBandTop + eyeBandHeight; // 44% from top

  // Head oval dimensions (typical centered head fitting 58% height)
  const ovalCenterX = canvasSize * 0.5;
  const ovalCenterY = canvasSize * 0.44;
  const ovalRadiusX = canvasSize * 0.22;
  const ovalRadiusY = canvasSize * 0.29; // 58% total height

  // Crown upper limit (8% from top) and lower limit (20% from top)
  const crownMinY = canvasSize * 0.08;
  const crownMaxY = canvasSize * 0.20;

  // Chin line (approx 68% - 74% from top)
  const chinY = canvasSize * 0.72;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      viewBox={`0 0 ${canvasSize} ${canvasSize}`}
    >
      {/* 1. Rule of Thirds Grid */}
      {showGrid && (
        <g stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1" strokeDasharray="4 4">
          <line x1={canvasSize / 3} y1="0" x2={canvasSize / 3} y2={canvasSize} />
          <line x1={(canvasSize * 2) / 3} y1="0" x2={(canvasSize * 2) / 3} y2={canvasSize} />
          <line x1="0" y1={canvasSize / 3} x2={canvasSize} y2={canvasSize / 3} />
          <line x1="0" y1={(canvasSize * 2) / 3} x2={canvasSize} y2={(canvasSize * 2) / 3} />
        </g>
      )}

      {/* 2. Vertical Center Plumb Line */}
      <line
        x1={canvasSize / 2}
        y1="0"
        x2={canvasSize / 2}
        y2={canvasSize}
        stroke="rgba(59, 130, 246, 0.4)"
        strokeWidth="1.5"
        strokeDasharray="6 4"
      />

      {/* 3. Official Eye Level Band (56% – 69% from bottom) */}
      {showEyeBand && (
        <g>
          {/* Subtle translucent band */}
          <rect
            x="0"
            y={eyeBandTop}
            width={canvasSize}
            height={eyeBandHeight}
            fill="rgba(59, 130, 246, 0.12)"
            stroke="rgba(59, 130, 246, 0.75)"
            strokeWidth="1.5"
          />
          {/* Eye line center marker */}
          <line
            x1="0"
            y1={(eyeBandTop + eyeBandBottom) / 2}
            x2={canvasSize}
            y2={(eyeBandTop + eyeBandBottom) / 2}
            stroke="rgba(37, 99, 235, 0.85)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          {/* Label badge */}
          <rect
            x="8"
            y={eyeBandTop + 4}
            width={lang === 'kh' ? '142' : '128'}
            height="18"
            rx="3"
            fill="rgba(15, 23, 42, 0.85)"
          />
          <text
            x="12"
            y={eyeBandTop + 16}
            fill="#FFFFFF"
            fontSize="10"
            fontFamily={lang === 'kh' ? "'Content', 'Noto Sans Khmer', sans-serif" : 'monospace'}
            fontWeight="bold"
          >
            {lang === 'kh' ? 'កម្រិតភ្នែក (56%–69%)' : 'EYE LEVEL (56%–69%)'}
          </text>
        </g>
      )}

      {/* 4. Head Silhouette & Crown/Chin Boundaries */}
      {showOval && (
        <g>
          {/* Crown upper tolerance limit */}
          <line
            x1={canvasSize * 0.25}
            y1={crownMinY}
            x2={canvasSize * 0.75}
            y2={crownMinY}
            stroke="#10B981"
            strokeWidth="1.5"
          />
          <text
            x={canvasSize * 0.26}
            y={crownMinY - 4}
            fill="#10B981"
            fontSize="9"
            fontFamily={lang === 'kh' ? "'Content', 'Noto Sans Khmer', sans-serif" : 'monospace'}
            fontWeight="bold"
          >
            {lang === 'kh' ? 'ក្បាលអតិបរមា (69%)' : 'MAX CROWN (69% HEAD)'}
          </text>

          {/* Crown lower tolerance limit */}
          <line
            x1={canvasSize * 0.3}
            y1={crownMaxY}
            x2={canvasSize * 0.7}
            y2={crownMaxY}
            stroke="#10B981"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
          <text
            x={canvasSize * 0.31}
            y={crownMaxY - 3}
            fill="#10B981"
            fontSize="9"
            fontFamily={lang === 'kh' ? "'Content', 'Noto Sans Khmer', sans-serif" : 'monospace'}
          >
            {lang === 'kh' ? 'ក្បាលអប្បបរមា (50%)' : 'MIN CROWN (50% HEAD)'}
          </text>

          {/* Chin boundary line */}
          <line
            x1={canvasSize * 0.3}
            y1={chinY}
            x2={canvasSize * 0.7}
            y2={chinY}
            stroke="#F59E0B"
            strokeWidth="1.5"
          />
          <text
            x={canvasSize * 0.31}
            y={chinY + 12}
            fill="#F59E0B"
            fontSize="9"
            fontFamily={lang === 'kh' ? "'Content', 'Noto Sans Khmer', sans-serif" : 'monospace'}
            fontWeight="bold"
          >
            {lang === 'kh' ? 'បន្ទាត់ចង្កា (CHIN)' : 'CHIN BASELINE'}
          </text>

          {/* Biometric Head Silhouette Oval */}
          <ellipse
            cx={ovalCenterX}
            cy={ovalCenterY}
            rx={ovalRadiusX}
            ry={ovalRadiusY}
            fill="none"
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth="2"
            strokeDasharray="6 4"
          />

          {/* Shoulder guide curve */}
          <path
            d={`M ${canvasSize * 0.1} ${canvasSize * 0.96} Q ${canvasSize * 0.32} ${canvasSize * 0.82} ${canvasSize * 0.38} ${chinY + 15} M ${canvasSize * 0.9} ${canvasSize * 0.96} Q ${canvasSize * 0.68} ${canvasSize * 0.82} ${canvasSize * 0.62} ${chinY + 15}`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        </g>
      )}

      {/* 5. Background Quality Probe Test Points */}
      {showProbes && samplePoints.length > 0 && (
        <g>
          {samplePoints.map((pt, i) => {
            const scale = canvasSize / 600;
            const px = pt.x * scale;
            const py = pt.y * scale;
            return (
              <g key={i}>
                <circle
                  cx={px}
                  cy={py}
                  r="5"
                  fill={pt.isPassing ? '#10B981' : pt.isBrightEnough ? '#F59E0B' : '#EF4444'}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
};
