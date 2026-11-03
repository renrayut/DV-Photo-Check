import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Upload,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Maximize2,
  Eye,
  Sliders,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Info,
  Plus,
  Minus
} from 'lucide-react';
import { CropSettings, PhotoAnalysisResult, CompositionMetrics } from '../types/dv';
import { analyzeBackgroundFromCanvas, estimateCompositionFromCanvas, runDVValidation } from '../utils/imageAnalyzer';
import { OfficialOverlay } from './OfficialOverlay';
import { Language, translations } from '../i18n/translations';

// Import generated sample portraits
import sampleCompliant from '../assets/images/dv_sample_compliant_1793613006401.jpg';
import sampleNeedsCrop from '../assets/images/dv_sample_needs_crop_1793613007275.jpg';

interface ImageWorkspaceProps {
  onAnalysisUpdate: (result: PhotoAnalysisResult, imageElement: HTMLImageElement, crop: CropSettings) => void;
  crop: CropSettings;
  setCrop: React.Dispatch<React.SetStateAction<CropSettings>>;
  lang: Language;
}

export const ImageWorkspace: React.FC<ImageWorkspaceProps> = ({
  onAnalysisUpdate,
  crop,
  setCrop,
  lang,
}) => {
  const t = translations[lang];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [sourceFileInfo, setSourceFileInfo] = useState<{
    name: string;
    sizeBytes: number;
    mimeType: string;
  } | null>(null);

  // Overlay visibility toggles
  const [showOval, setShowOval] = useState(true);
  const [showEyeBand, setShowEyeBand] = useState(true);
  const [showProbes, setShowProbes] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  // Manual composition override slider
  const [manualHeadHeight, setManualHeadHeight] = useState<number | null>(null);
  const [manualEyeLevel, setManualEyeLevel] = useState<number | null>(null);

  // Dragging state for canvas pan
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragOver, setIsDragOver] = useState(false);

  const CANVAS_SIZE = 500; // base coordinates for overlay vector

  // Load an image from URL or File
  const loadImage = useCallback((src: string, fileInfo?: { name: string; sizeBytes: number; mimeType: string }) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImageObj(img);
      setSourceFileInfo(
        fileInfo || {
          name: 'sample_photo.jpg',
          sizeBytes: 154200,
          mimeType: 'image/jpeg',
        }
      );
      // Reset crop to centered initial view
      setCrop({ zoom: 1.0, panX: 0, panY: 0, rotation: 0 });
      setManualHeadHeight(null);
      setManualEyeLevel(null);
    };
    img.src = src;
  }, [setCrop]);

  // Load compliant sample by default on mount
  useEffect(() => {
    loadImage(sampleCompliant, {
      name: 'dv_official_sample_compliant.jpg',
      sizeBytes: 168400,
      mimeType: 'image/jpeg',
    });
  }, [loadImage]);

  // Render canvas & run validation analysis whenever crop, image, or language changes
  useEffect(() => {
    if (!imageObj) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Fixed 600x600 internal resolution for precise pixel and composition analysis
    canvas.width = 600;
    canvas.height = 600;

    // 1. Clear background to white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 600, 600);

    // 2. Draw transformed image
    ctx.save();
    ctx.translate(300, 300);
    ctx.rotate((crop.rotation * Math.PI) / 180);
    ctx.scale(crop.zoom, crop.zoom);

    const minImgDim = Math.min(imageObj.naturalWidth, imageObj.naturalHeight);
    const baseScale = 600 / minImgDim;
    const drawWidth = imageObj.naturalWidth * baseScale;
    const drawHeight = imageObj.naturalHeight * baseScale;

    ctx.drawImage(
      imageObj,
      -drawWidth / 2 + crop.panX,
      -drawHeight / 2 + crop.panY,
      drawWidth,
      drawHeight
    );
    ctx.restore();

    // 3. Analyze background and composition in real-time
    const background = analyzeBackgroundFromCanvas(ctx, 600, 600, lang);
    const autoComposition = estimateCompositionFromCanvas(ctx, 600, 600);

    const effectiveComposition: CompositionMetrics = {
      headHeightPercent: manualHeadHeight ?? autoComposition.headHeightPercent,
      eyeLevelPercent: manualEyeLevel ?? autoComposition.eyeLevelPercent,
      horizontalCenterOffsetPercent: autoComposition.horizontalCenterOffsetPercent,
      manualCalibration: manualHeadHeight !== null || manualEyeLevel !== null,
    };

    const analysis = runDVValidation({
      width: 600,
      height: 600,
      fileSizeBytes: sourceFileInfo?.sizeBytes || 150000,
      mimeType: sourceFileInfo?.mimeType || 'image/jpeg',
      background,
      composition: effectiveComposition,
      lang,
    });

    onAnalysisUpdate(analysis, imageObj, crop);
  }, [imageObj, crop, sourceFileInfo, manualHeadHeight, manualEyeLevel, lang, onAnalysisUpdate]);

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        loadImage(reader.result, {
          name: file.name,
          sizeBytes: file.size,
          mimeType: file.type || 'image/jpeg',
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Canvas Pan Interaction (Desktop Mouse)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - crop.panX, y: e.clientY - crop.panY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const newPanX = Math.round(e.clientX - dragStart.x);
    const newPanY = Math.round(e.clientY - dragStart.y);
    setCrop(prev => ({ ...prev, panX: newPanX, panY: newPanY }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.05 : -0.05;
    setCrop(prev => ({
      ...prev,
      zoom: Math.min(3.0, Math.max(0.8, Number((prev.zoom + zoomFactor).toFixed(2)))),
    }));
  };

  // Mobile Touch Pan and Pinch-Zoom support
  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchDistanceRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      touchDistanceRef.current = null;
      touchStartRef.current = {
        x: e.touches[0].clientX - crop.panX,
        y: e.touches[0].clientY - crop.panY,
      };
    } else if (e.touches.length === 2) {
      // Pinch to zoom start
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchDistanceRef.current = Math.hypot(dx, dy);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && touchDistanceRef.current === null) {
      const newPanX = Math.round(e.touches[0].clientX - touchStartRef.current.x);
      const newPanY = Math.round(e.touches[0].clientY - touchStartRef.current.y);
      setCrop(prev => ({ ...prev, panX: newPanX, panY: newPanY }));
    } else if (e.touches.length === 2 && touchDistanceRef.current !== null) {
      // Pinch to zoom move
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentDist = Math.hypot(dx, dy);
      const delta = (currentDist - touchDistanceRef.current) * 0.005;
      touchDistanceRef.current = currentDist;

      setCrop(prev => ({
        ...prev,
        zoom: Math.min(3.0, Math.max(0.8, Number((prev.zoom + delta).toFixed(2)))),
      }));
    }
  };

  const handleTouchEnd = () => {
    touchDistanceRef.current = null;
  };

  // Step zoom buttons for easy mobile thumb clicking
  const stepZoom = (amount: number) => {
    setCrop(prev => ({
      ...prev,
      zoom: Math.min(3.0, Math.max(0.8, Number((prev.zoom + amount).toFixed(2)))),
    }));
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Top action strip: Upload button + Sample loaders */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Upload className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            <span>{t.uploadBtn}</span>
          </button>
        </div>

        {/* Quick sample buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg justify-between sm:justify-start">
          <button
            onClick={() =>
              loadImage(sampleCompliant, {
                name: 'dv_official_sample_compliant.jpg',
                sizeBytes: 168400,
                mimeType: 'image/jpeg',
              })
            }
            className="flex-1 sm:flex-initial px-2.5 py-1.5 sm:py-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white shadow-2xs rounded-md transition-colors cursor-pointer text-center"
          >
            {t.sampleCompliantBtn}
          </button>
          <button
            onClick={() =>
              loadImage(sampleNeedsCrop, {
                name: 'dv_sample_needs_crop.jpg',
                sizeBytes: 295000,
                mimeType: 'image/jpeg',
              })
            }
            className="flex-1 sm:flex-initial px-2.5 py-1.5 sm:py-1 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-md transition-colors cursor-pointer text-center"
          >
            {t.sampleNeedsCropBtn}
          </button>
        </div>
      </div>

      {/* Main Cropper Stage */}
      <div className="relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-md flex flex-col items-center justify-center p-3 sm:p-5">
        {/* Subtle dropzone drag-over notice */}
        {isDragOver && (
          <div className="absolute inset-0 z-50 bg-blue-600/90 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center">
            <Upload className="w-12 h-12 mb-2 animate-bounce" />
            <p className="font-semibold text-base sm:text-lg">{t.dropPhotoHere}</p>
            <p className="text-xs text-blue-100">{t.dropPhotoSub}</p>
          </div>
        )}

        {/* Top Floating Helper in Viewport */}
        <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
          <div className="flex items-center gap-1.5 text-slate-300 truncate text-[11px] sm:text-xs">
            <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">{t.workspaceInstruction}</span>
          </div>
          <span className="font-mono text-slate-400 text-[10px] sm:text-[11px] shrink-0 ml-2">
            600×600 px (1:1)
          </span>
        </div>

        {/* Square Workspace Container with Overlay */}
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative cursor-grab active:cursor-grabbing select-none overflow-hidden rounded-xl bg-slate-950 border-2 touch-none ${
            isDragOver ? 'border-blue-400' : 'border-slate-700'
          }`}
          style={{
            width: 'min(100%, 460px)',
            height: 'min(calc(100vw - 40px), 460px)',
          }}
        >
          {/* Internal Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain pointer-events-none"
          />

          {/* Official Department of State Overlay */}
          <OfficialOverlay
            showOval={showOval}
            showEyeBand={showEyeBand}
            showGrid={showGrid}
            showProbes={showProbes}
            canvasSize={CANVAS_SIZE}
            lang={lang}
          />
        </div>

        {/* Workspace Toolbar Controls */}
        <div className="w-full max-w-[460px] mt-3.5 flex flex-col gap-2.5">
          {/* Zoom & Rotation Controls (Optimized for Mobile Touch) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-800/80 p-2.5 sm:p-3 rounded-xl border border-slate-700 text-xs text-slate-200">
            {/* Zoom Slider + Quick Tap Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => stepZoom(-0.1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors shrink-0 cursor-pointer"
                title="Zoom Out"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <div className="flex-1 flex flex-col gap-0.5">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>{t.zoom}</span>
                  <span className="font-mono">{crop.zoom.toFixed(2)}×</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="3.0"
                  step="0.05"
                  value={crop.zoom}
                  onChange={e =>
                    setCrop(prev => ({ ...prev, zoom: parseFloat(e.target.value) }))
                  }
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <button
                onClick={() => stepZoom(0.1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors shrink-0 cursor-pointer"
                title="Zoom In"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tilt Rotation Slider */}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setCrop(prev => ({
                    ...prev,
                    rotation: Math.max(-12, Number((prev.rotation - 1).toFixed(1))),
                  }))
                }
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors shrink-0 cursor-pointer"
                title="Rotate Left 1°"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <div className="flex-1 flex flex-col gap-0.5">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>{t.fineTilt}</span>
                  <span className="font-mono">
                    {crop.rotation > 0 ? `+${crop.rotation}°` : `${crop.rotation}°`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="0.5"
                  value={crop.rotation}
                  onChange={e =>
                    setCrop(prev => ({ ...prev, rotation: parseFloat(e.target.value) }))
                  }
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <button
                onClick={() =>
                  setCrop(prev => ({
                    ...prev,
                    rotation: Math.min(12, Number((prev.rotation + 1).toFixed(1))),
                  }))
                }
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors shrink-0 cursor-pointer"
                title="Rotate Right 1°"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Action Buttons & Guide Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
            {/* Toggle Overlay Elements */}
            <div className="flex items-center gap-1 flex-wrap">
              <button
                onClick={() => setShowOval(!showOval)}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer text-xs ${
                  showOval
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.headOvalToggle}
              </button>
              <button
                onClick={() => setShowEyeBand(!showEyeBand)}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer text-xs ${
                  showEyeBand
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.eyeBandToggle}
              </button>
              <button
                onClick={() => setShowProbes(!showProbes)}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer text-xs ${
                  showProbes
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.bgProbesToggle}
              </button>
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`px-2 py-1.5 rounded-lg font-medium transition-colors cursor-pointer text-xs ${
                  showGrid
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.gridToggle}
              </button>
            </div>

            {/* Reset / Center */}
            <button
              onClick={() => {
                setCrop({ zoom: 1.0, panX: 0, panY: 0, rotation: 0 });
                setManualHeadHeight(null);
                setManualEyeLevel(null);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors font-medium text-xs cursor-pointer ml-auto sm:ml-0"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{t.resetBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
