import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Eye, 
  Sparkles, 
  Droplets, 
  Volume2, 
  VolumeX, 
  Eraser, 
  Maximize2,
  Camera,
  Car,
  Video
} from 'lucide-react';
import { VehicleType, WashStageId } from '../../types';
import { WASH_STAGES, VEHICLE_OPTIONS } from '../../data/packages';

export interface ThreeControlsOverlayProps {
  currentStage: WashStageId;
  onSelectStage: (stage: WashStageId) => void;
  vehicleType: VehicleType;
  onSelectVehicle: (type: VehicleType) => void;
  carColor: string;
  onChangeColor: (color: string) => void;
  cleanliness: number; // 0 to 1
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
  isScrubbingActive: boolean;
  onToggleScrubbing: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onResetCar: () => void;
  cameraPreset: string;
  onSelectCamera: (preset: 'cinematic' | 'front' | 'side' | 'wheel' | 'top') => void;
  onToggleFullscreen?: () => void;
  speed: number;
  onChangeSpeed: (speed: number) => void;
  isLiveVideoOpen?: boolean;
  onToggleLiveVideo?: () => void;
}

const COLOR_PALETTE = [
  { name: 'Deep Navy', hex: '#1e3a8a' },
  { name: 'Crimson Red', hex: '#b91c1c' },
  { name: 'Onyx Black', hex: '#0f172a' },
  { name: 'Glacier Silver', hex: '#cbd5e1' },
  { name: 'Electric Cyan', hex: '#0284c7' },
  { name: 'Sunset Bronze', hex: '#b45309' },
  { name: 'British Green', hex: '#15803d' }
];

export const ThreeControlsOverlay: React.FC<ThreeControlsOverlayProps> = ({
  currentStage,
  onSelectStage,
  vehicleType,
  onSelectVehicle,
  carColor,
  onChangeColor,
  cleanliness,
  isAutoPlaying,
  onToggleAutoPlay,
  isScrubbingActive,
  onToggleScrubbing,
  isMuted,
  onToggleMute,
  onResetCar,
  cameraPreset,
  onSelectCamera,
  speed,
  onChangeSpeed,
  isLiveVideoOpen = false,
  onToggleLiveVideo
}) => {
  const [showConfigDrawer, setShowConfigDrawer] = React.useState(false);
  const currentStageInfo = WASH_STAGES.find(s => s.id === currentStage) || WASH_STAGES[0];

  return (
    <div id="three-controls-overlay" className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-5">
      {/* Top Bar: Active Stage HUD & Quick Stats */}
      <div className="flex items-start justify-between gap-2 pointer-events-auto">
        {/* Stage Status Badge */}
        <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-xl max-w-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAutoPlaying ? 'bg-cyan-400' : 'bg-slate-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isAutoPlaying ? 'bg-cyan-500' : 'bg-slate-500'}`}></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              {isAutoPlaying ? 'Live Simulation Active' : 'Manual 3D Inspection'}
            </span>
          </div>
          
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            {currentStageInfo.name}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
            {currentStageInfo.description}
          </p>

          {/* Cleanliness Progress Meter */}
          <div className="mt-2.5">
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Paint Reflection</span>
              <span className="font-semibold text-cyan-300">{Math.round(cleanliness * 100)}% Clean</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 via-cyan-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${Math.round(cleanliness * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Top Right Floating Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Live CCTV Video PiP Toggle */}
          {onToggleLiveVideo && (
            <button
              id="btn-live-cctv-pip"
              onClick={onToggleLiveVideo}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg backdrop-blur-md ${
                isLiveVideoOpen
                  ? 'bg-rose-600 text-white ring-2 ring-rose-400 font-bold'
                  : 'bg-slate-900/85 text-slate-200 hover:bg-slate-800 border border-slate-700/60'
              }`}
              title="Toggle Picture-in-Picture Live CCTV Camera Video"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <Video className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">{isLiveVideoOpen ? 'Hide CCTV' : 'Live CCTV (PiP)'}</span>
            </button>
          )}

          {/* Sponge Scrub Tool */}
          <button
            id="btn-scrub-tool"
            onClick={onToggleScrubbing}
            className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all shadow-lg backdrop-blur-md ${
              isScrubbingActive 
                ? 'bg-amber-500 text-black ring-2 ring-amber-300 ring-offset-2 ring-offset-slate-900 font-bold' 
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
            }`}
            title="Click and drag over the car in 3D to hand scrub dirt away!"
          >
            <Eraser className="w-4 h-4" />
            <span className="hidden sm:inline">{isScrubbingActive ? 'Sponge Active' : 'Scrub Sponge'}</span>
          </button>

          {/* Sound Mute */}
          <button
            id="btn-sound-toggle"
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-colors shadow-lg backdrop-blur-md"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Vehicle & Color Config Toggle */}
          <button
            id="btn-config-toggle"
            onClick={() => setShowConfigDrawer(!showConfigDrawer)}
            className="px-3 py-2 rounded-xl bg-slate-900/80 text-slate-200 hover:bg-slate-800 border border-slate-700/60 transition-colors shadow-lg backdrop-blur-md text-xs font-semibold flex items-center gap-1.5"
          >
            <Car className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Vehicle Setup</span>
          </button>
        </div>
      </div>

      {/* Floating Config Drawer for Vehicle & Color (Collapsible) */}
      {showConfigDrawer && (
        <div className="self-end my-2 bg-slate-900/95 border border-slate-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl pointer-events-auto max-w-sm w-full space-y-3 z-20">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Vehicle Customization</span>
            <button 
              onClick={() => setShowConfigDrawer(false)}
              className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
            >
              Close
            </button>
          </div>

          {/* Vehicle Type Picker */}
          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">Vehicle Chassis</label>
            <div className="grid grid-cols-2 gap-1.5">
              {VEHICLE_OPTIONS.map((v) => (
                <button
                  key={v.id}
                  id={`btn-chassis-${v.id}`}
                  onClick={() => onSelectVehicle(v.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-all flex items-center justify-between border ${
                    vehicleType === v.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                      : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{v.name.split('/')[0]}</span>
                  {vehicleType === v.id && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">Clearcoat Paint Color</label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c.hex}
                  id={`btn-color-${c.hex}`}
                  onClick={() => onChangeColor(c.hex)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    carColor.toLowerCase() === c.hex.toLowerCase()
                      ? 'scale-110 border-cyan-400 shadow-md ring-2 ring-cyan-400/40'
                      : 'border-slate-600 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Dirt / Reset */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <button
              id="btn-apply-mud"
              onClick={onResetCar}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset with Road Grime
            </button>
          </div>
        </div>
      )}

      {/* Bottom Bar: Camera Presets & Wash Stage Timeline */}
      <div className="space-y-2 pointer-events-auto">
        {/* Camera Views & Action Controls */}
        <div className="flex items-center justify-between gap-2">
          {/* Camera angles */}
          <div className="flex items-center gap-1 bg-slate-900/85 backdrop-blur-md border border-slate-800/80 p-1 rounded-xl shadow-lg">
            <span className="text-[10px] text-slate-400 px-2 uppercase font-semibold hidden md:inline flex items-center gap-1">
              <Camera className="w-3 h-3" /> Camera:
            </span>
            {(['cinematic', 'front', 'side', 'wheel', 'top'] as const).map((preset) => (
              <button
                key={preset}
                id={`btn-cam-${preset}`}
                onClick={() => onSelectCamera(preset)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                  cameraPreset === preset
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Auto-Play Simulation & Speed */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-900/85 backdrop-blur-md border border-slate-800/80 rounded-xl p-1 shadow-lg">
              <button
                id="btn-auto-simulate"
                onClick={onToggleAutoPlay}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isAutoPlaying
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold'
                }`}
              >
                {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isAutoPlaying ? 'Pause Wash' : 'Run Full Wash Cycle'}</span>
              </button>

              {/* Speed toggle */}
              <button
                id="btn-speed-toggle"
                onClick={() => onChangeSpeed(speed === 1 ? 2 : speed === 2 ? 4 : 1)}
                className="px-2 py-1 text-[11px] font-mono text-slate-300 hover:text-white ml-1"
                title="Simulation Speed Multiplier"
              >
                {speed}x
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Wash Stage Step Bar */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-2xl p-2 sm:p-2.5 shadow-2xl overflow-x-auto">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
            {WASH_STAGES.filter(s => s.id !== 'idle').map((stage, idx) => {
              const isActive = currentStage === stage.id;
              return (
                <button
                  key={stage.id}
                  id={`btn-stage-${stage.id}`}
                  onClick={() => onSelectStage(stage.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 border ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold border-cyan-400 shadow-lg shadow-cyan-500/20 scale-[1.02]'
                      : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300 border-slate-700/50'
                  }`}
                >
                  <span className="text-[10px] opacity-75 font-mono">0{idx + 1}</span>
                  <span className="whitespace-nowrap">{stage.shortName}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
