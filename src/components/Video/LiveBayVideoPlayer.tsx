import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Video, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Radio, 
  Eye, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  Layers, 
  Download, 
  Activity,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { REAL_ASSETS } from '../../assets/images';
import { Booking, WashStageId } from '../../types';
import { WASH_STAGES } from '../../data/packages';
import { soundManager } from '../../utils/audio';

export interface LiveBayVideoPlayerProps {
  activeBooking?: Booking | null;
  activeStage?: WashStageId;
  onSelectStage?: (stage: WashStageId) => void;
  className?: string;
  isCompact?: boolean;
}

export interface CameraChannel {
  id: string;
  name: string;
  tagline: string;
  image: string;
  stageMatch: WashStageId[];
  angle: string;
  resolution: string;
  fps: number;
}

export const CAMERA_CHANNELS: CameraChannel[] = [
  {
    id: 'cam-1',
    name: 'CAM 01 • Tunnel Ingress & Hydro Arch',
    tagline: 'Wide-angle panoramic tunnel entrance with LED guide beacons',
    image: REAL_ASSETS.cctvTunnel,
    stageMatch: ['idle', 'pre_soak', 'pressure_wash'],
    angle: 'Overhead 45° Ingress',
    resolution: '1920x1080 HD',
    fps: 60
  },
  {
    id: 'cam-2',
    name: 'CAM 02 • Snow Foam & Bubble Curtain',
    tagline: 'High-density tri-color foam blanket application',
    image: REAL_ASSETS.foamWash,
    stageMatch: ['foam_cannon', 'brush_scrub'],
    angle: 'Top-Mount Hood Macro',
    resolution: '1920x1080 HD',
    fps: 60
  },
  {
    id: 'cam-3',
    name: 'CAM 03 • Alloy Wheel & Undercarriage Blast',
    tagline: 'High-pressure 1500 PSI rotary wheel scrubbers and mud removal',
    image: REAL_ASSETS.wheelBlast,
    stageMatch: ['wheel_blast', 'pressure_wash'],
    angle: 'Low-Angle Rim Tracker',
    resolution: '1920x1080 HD',
    fps: 60
  },
  {
    id: 'cam-4',
    name: 'CAM 04 • Graphene Ceramic Studio & Turbo Dry',
    tagline: 'Hydrophobic coating inspection and 180 MPH heated air dry',
    image: REAL_ASSETS.ceramicShine,
    stageMatch: ['ceramic_wax', 'turbo_dry', 'completed'],
    angle: 'Rear Quarter Specular',
    resolution: '4K Ultra-HD',
    fps: 60
  }
];

export const LiveBayVideoPlayer: React.FC<LiveBayVideoPlayerProps> = ({
  activeBooking,
  activeStage = 'foam_cannon',
  onSelectStage,
  className = '',
  isCompact = false
}) => {
  const [selectedCamIndex, setSelectedCamIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [filterMode, setFilterMode] = useState<'optical' | 'night_vision' | 'thermal'>('optical');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timecode, setTimecode] = useState('');
  const [snapshotSuccess, setSnapshotSuccess] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  // Sync selected camera to stage if current camera doesn't match active stage
  useEffect(() => {
    const matchedIdx = CAMERA_CHANNELS.findIndex(c => c.stageMatch.includes(activeStage));
    if (matchedIdx !== -1 && matchedIdx !== selectedCamIndex) {
      setSelectedCamIndex(matchedIdx);
    }
  }, [activeStage]);

  // Live timestamp clock update (every 100ms for realistic CCTV timecode)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const pad = (n: number, z = 2) => String(n).padStart(z, '0');
      const year = now.getFullYear();
      const month = pad(now.getMonth() + 1);
      const date = pad(now.getDate());
      const hours = pad(now.getHours());
      const min = pad(now.getMinutes());
      const sec = pad(now.getSeconds());
      const ms = pad(Math.floor(now.getMilliseconds() / 10));
      setTimecode(`${year}-${month}-${date} ${hours}:${min}:${sec}.${ms}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, []);

  // Canvas-based realistic video simulation renderer with dynamic water droplets, mist, scanlines and lighting
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let tick = 0;
    const currentCam = CAMERA_CHANNELS[selectedCamIndex];

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = currentCam.image;

    // Simulated water droplets / spray particles on camera lens
    const droplets: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
    for (let i = 0; i < 45; i++) {
      droplets.push({
        x: Math.random() * 800,
        y: Math.random() * 450,
        size: Math.random() * 4 + 1,
        speed: Math.random() * 2 + 1,
        opacity: Math.random() * 0.7 + 0.3
      });
    }

    const render = () => {
      tick++;

      const width = canvas.width;
      const height = canvas.height;

      // Draw base real image
      if (img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, width, height);
      } else {
        // Fallback dark gradient
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(1, '#020617');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // Filter modes: Night Vision vs Thermal vs Optical
      if (filterMode === 'night_vision') {
        // Green phosphor tint
        ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
        ctx.fillRect(0, 0, width, height);
        // Vignette
        const radGrad = ctx.createRadialGradient(width / 2, height / 2, width / 4, width / 2, height / 2, width / 1.5);
        radGrad.addColorStop(0, 'transparent');
        radGrad.addColorStop(1, 'rgba(0, 30, 10, 0.85)');
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, width, height);
      } else if (filterMode === 'thermal') {
        // Thermal false color overlay (electric violet + yellow gradient)
        ctx.globalCompositeOperation = 'color';
        ctx.fillStyle = 'rgba(236, 72, 153, 0.5)';
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'source-over';
      }

      // Water spray & mist animation across the camera lens (active wash action)
      if (isPlaying) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        // Pulsing water haze
        const hazeIntensity = Math.sin(tick * 0.08) * 0.03 + 0.05;
        ctx.fillStyle = `rgba(186, 230, 253, ${hazeIntensity})`;
        ctx.fillRect(0, 0, width, height);

        // Animated water drops running down lens
        for (const drop of droplets) {
          drop.y += drop.speed;
          if (drop.y > height) {
            drop.y = -10;
            drop.x = Math.random() * width;
          }

          ctx.beginPath();
          ctx.arc(drop.x, drop.y, drop.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${drop.opacity})`;
          ctx.fill();

          // Droplet streak
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x, drop.y - drop.size * 2);
          ctx.strokeStyle = `rgba(224, 242, 254, ${drop.opacity * 0.5})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Horizontal TV scanlines
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        for (let y = 0; y < height; y += 4) {
          ctx.fillRect(0, y, width, 1.5);
        }

        // Occasional video static / telemetry flicker
        if (Math.random() < 0.03) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
          ctx.fillRect(0, Math.random() * height, width, Math.random() * 8);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [selectedCamIndex, isPlaying, filterMode]);

  const handleTakeSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    soundManager.playNotificationChime();
    setSnapshotSuccess(true);
    setTimeout(() => setSnapshotSuccess(false), 3000);

    try {
      const link = document.createElement('a');
      link.download = `aquaglow-bay-cctv-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      // Fallback
    }
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const currentCam = CAMERA_CHANNELS[selectedCamIndex];
  const stageInfo = WASH_STAGES.find(s => s.id === activeStage) || WASH_STAGES[0];

  return (
    <div 
      ref={containerRef}
      id="live-bay-video-player"
      className={`relative bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col ${className}`}
    >
      {/* Video Viewport Stage */}
      <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden select-none">
        {/* Render Canvas */}
        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          className="w-full h-full object-cover"
        />

        {/* CCTV Top Overlay HUD */}
        <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-start justify-between gap-3 text-white pointer-events-none font-mono">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-600/90 text-[11px] font-black uppercase tracking-wider animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white" />
              LIVE ● REC
            </span>
            <span className="text-xs font-bold text-cyan-300 drop-shadow">
              AQUAGLOW-BAY-{activeBooking?.bayNumber || 1}
            </span>
            <span className="hidden sm:inline text-xs text-slate-300">
              [{currentCam.name.split('•')[0].trim()}]
            </span>
          </div>

          <div className="text-right">
            <div className="text-xs font-bold text-white tracking-widest drop-shadow">
              {timecode}
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold drop-shadow">
              {currentCam.resolution} • {currentCam.fps} FPS
            </div>
          </div>
        </div>

        {/* Real Vehicle Crosshair & Telemetry Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* Subtle targeting grid */}
          <div className="w-48 h-32 sm:w-80 sm:h-52 border border-cyan-500/30 rounded-2xl relative">
            <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
            <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
            <div className="absolute top-2 left-2 text-[10px] text-cyan-300 font-mono bg-black/60 px-1.5 py-0.5 rounded">
              VEH: {activeBooking?.vehicleMakeModel || 'BMW M3'} [{activeBooking?.licensePlate || '7XYZ892'}]
            </div>
            <div className="absolute bottom-2 right-2 text-[10px] text-amber-300 font-mono bg-black/60 px-1.5 py-0.5 rounded">
              STAGE: {stageInfo.shortName.toUpperCase()}
            </div>
          </div>
        </div>

        {/* CCTV Bottom Right Real Telemetry Meters */}
        <div className="absolute bottom-12 sm:bottom-14 left-3 right-3 flex items-end justify-between pointer-events-none text-white font-mono text-[10px] sm:text-xs">
          <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800/80 space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Pressure:</span>
              <span className="text-cyan-400 font-bold">1,480 PSI</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Flow:</span>
              <span className="text-cyan-400 font-bold">14.2 GPM</span>
            </div>
          </div>

          <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800/80 space-y-0.5 text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="text-slate-400">Water Recycled:</span>
              <span className="text-emerald-400 font-bold">88.5%</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className="text-slate-400">Dry Temp:</span>
              <span className="text-amber-400 font-bold">115°F</span>
            </div>
          </div>
        </div>

        {/* Snapshot Success Toast Overlay */}
        {snapshotSuccess && (
          <div className="absolute inset-0 bg-white/20 backdrop-blur-xs flex items-center justify-center pointer-events-none animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900/95 border-2 border-cyan-400 rounded-2xl px-5 py-3 text-white flex items-center gap-2 shadow-2xl">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-bold">High-Res Bay Snapshot Saved to Downloads!</span>
            </div>
          </div>
        )}

        {/* Bottom Video Control Bar Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center justify-between gap-2 text-white">
          <div className="flex items-center gap-1.5">
            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 sm:p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white transition-colors"
              title={isPlaying ? 'Pause Feed' : 'Resume Feed'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            {/* Audio Ambience */}
            <button
              onClick={() => {
                setIsMuted(!isMuted);
                if (isMuted) soundManager.playSprayWater();
              }}
              className="p-1.5 sm:p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white transition-colors"
              title={isMuted ? 'Unmute Bay Hydro Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* Filter Mode Selector (Optical / Night Vision / Thermal) */}
            <div className="flex items-center gap-0.5 bg-slate-900/90 p-0.5 rounded-lg border border-slate-800 text-[10px] font-semibold">
              <button
                onClick={() => setFilterMode('optical')}
                className={`px-2 py-1 rounded transition-colors ${
                  filterMode === 'optical' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Optical
              </button>
              <button
                onClick={() => setFilterMode('night_vision')}
                className={`px-2 py-1 rounded transition-colors ${
                  filterMode === 'night_vision' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Night IR
              </button>
              <button
                onClick={() => setFilterMode('thermal')}
                className={`px-2 py-1 rounded transition-colors ${
                  filterMode === 'thermal' ? 'bg-pink-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Thermal
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Snapshot */}
            <button
              onClick={handleTakeSnapshot}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Save Photo Snapshot"
            >
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Snapshot</span>
            </button>

            {/* Fullscreen */}
            <button
              onClick={handleToggleFullscreen}
              className="p-1.5 sm:p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Video'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Camera Channel Switcher Grid */}
      <div className="p-3 sm:p-4 bg-slate-900/90 border-t border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Select CCTV Angle ({CAMERA_CHANNELS.length} HD Feeds)</span>
          </div>
          <span className="text-[11px] text-cyan-400 font-medium">
            Active: {currentCam.angle}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CAMERA_CHANNELS.map((cam, idx) => {
            const isSelected = selectedCamIndex === idx;
            return (
              <button
                key={cam.id}
                id={`btn-cctv-${cam.id}`}
                onClick={() => setSelectedCamIndex(idx)}
                className={`group relative rounded-xl overflow-hidden border text-left transition-all p-2 ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/40 ring-2 ring-cyan-400/40'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div className="relative aspect-video rounded-lg overflow-hidden mb-1.5 bg-slate-900">
                  <img
                    src={cam.image}
                    alt={cam.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {isSelected && (
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-rose-600 text-white font-mono text-[9px] font-bold">
                      ON AIR
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-bold text-white truncate">
                  {cam.name.split('•')[0]}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {cam.name.split('•')[1] || cam.angle}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
