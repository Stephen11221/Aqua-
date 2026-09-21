import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Droplets, 
  Wind, 
  Waves, 
  Scan, 
  Play, 
  Pause, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Gauge
} from 'lucide-react';
import { REAL_ASSETS } from '../../assets/images';
import { formatKES } from '../../utils/currency';
import { soundManager } from '../../utils/audio';

interface RealCarAnimationBannerProps {
  onOpenBooking: () => void;
  onExplore3D?: () => void;
}

type AnimationMode = 'scan' | 'hydro' | 'foam' | 'ceramic';

export const RealCarAnimationBanner: React.FC<RealCarAnimationBannerProps> = ({
  onOpenBooking,
  onExplore3D
}) => {
  const [activeMode, setActiveMode] = useState<AnimationMode>('scan');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [scanProgress, setScanProgress] = useState<number>(35); // 0 to 100
  const [gleamPosition, setGleamPosition] = useState<number>(-20); // -20 to 120
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Cycle telemetry scan and gleam animation
  useEffect(() => {
    if (!isPlaying) return;

    let scanDirection = 1;
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 95) scanDirection = -1;
        if (prev <= 5) scanDirection = 1;
        return prev + scanDirection * 0.8;
      });

      setGleamPosition((prev) => {
        if (prev > 140) return -30;
        return prev + 1.2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Canvas particle animation for active mode (water spray or foam or ceramic sparkle)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      life: number;
      color: string;
    }
    const particles: Particle[] = [];

    const initParticles = (count: number) => {
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 3 + 1,
          size: Math.random() * 3 + 1.5,
          alpha: Math.random() * 0.6 + 0.2,
          life: Math.random() * 100,
          color: activeMode === 'foam' 
            ? 'rgba(255, 255, 255,' 
            : activeMode === 'ceramic' 
              ? 'rgba(253, 224, 71,' 
              : 'rgba(56, 189, 248,'
        });
      }
    };

    initParticles(isPlaying ? (activeMode === 'foam' ? 80 : 60) : 0);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (isPlaying) {
        // Draw active mode effects
        if (activeMode === 'hydro') {
          // Oscillating high-pressure jet streams
          ctx.lineWidth = 2;
          for (let i = 0; i < 4; i++) {
            const startX = (width / 5) * (i + 1) + Math.sin(Date.now() * 0.005 + i) * 25;
            const grad = ctx.createLinearGradient(startX, 0, startX + 30, height);
            grad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
            grad.addColorStop(0.7, 'rgba(6, 182, 212, 0.15)');
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.strokeStyle = grad;
            ctx.beginPath();
            ctx.moveTo(startX, 0);
            ctx.lineTo(startX + 40, height * 0.85);
            ctx.stroke();
          }
        }

        // Draw and update particles
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.life++;

          if (p.y > height || p.life > 120) {
            p.y = 0;
            p.x = Math.random() * width;
            p.life = 0;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color} ${p.alpha})`;
          ctx.fill();
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeMode, isPlaying]);

  const handleModeChange = (mode: AnimationMode) => {
    setActiveMode(mode);
    if (mode === 'hydro') {
      soundManager.playSprayWater();
    } else if (mode === 'ceramic' || mode === 'foam') {
      soundManager.playScrubSound();
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden relative">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>High-Definition Car Wash Animation</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
            Real Vehicle Laser Hydro-Cleaning Simulation
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Watch our automated optical alignment, multi-angle hydro jets, and ceramic molecular curing animated on an authentic luxury sports vehicle.
          </p>
        </div>

        {/* Price in Kenyan Shillings Banner */}
        <div className="flex items-center gap-3 self-start md:self-auto bg-slate-950/80 border border-cyan-500/30 rounded-2xl px-4 py-3 shadow-inner">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Services Starting At
            </div>
            <div className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              {formatKES(1500)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage & Viewport */}
      <div className="relative z-10 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Side: Real Animated Picture Canvas (8 cols on lg) */}
        <div className="lg:col-span-8">
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-black group select-none">
            {/* Real Vehicle Photograph Base Layer */}
            <img
              src={REAL_ASSETS.realCarHero}
              alt="Real Luxury Car in Automated AquaGlow Car Wash"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-[1.02]"
            />

            {/* Specular Gleam Light Sweep (passing across real car) */}
            <div 
              className="absolute inset-y-0 w-32 pointer-events-none transform -skew-x-12 mix-blend-overlay opacity-80"
              style={{
                left: `${gleamPosition}%`,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.75) 50%, transparent 100%)',
                filter: 'blur(6px)',
                transition: 'left 0.05s linear'
              }}
            />

            {/* Interactive Particle Animation Canvas (Hydro spray, foam, ceramic beads) */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
            />

            {/* Laser Surface Telemetry Scan Beam */}
            {activeMode === 'scan' && (
              <div 
                className="absolute inset-y-0 pointer-events-none z-20 flex flex-col justify-between"
                style={{
                  left: `${scanProgress}%`,
                  transition: 'left 0.04s linear'
                }}
              >
                {/* Glowing Vertical Line */}
                <div className="w-0.5 h-full bg-cyan-400 shadow-[0_0_15px_#22d3ee] relative">
                  <div className="absolute top-1/4 -left-1 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#22d3ee]" />
                  <div className="absolute top-3/4 -left-1 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#22d3ee]" />
                </div>
              </div>
            )}

            {/* In-Frame HUD Overlays */}
            <div className="absolute top-3 left-3 z-30 flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                ACTIVE ANIMATION: {activeMode.toUpperCase()}
              </div>
            </div>

            {/* Real-time Telemetry Readout Box (Bottom Left inside picture) */}
            <div className="absolute bottom-3 left-3 z-30 hidden sm:block bg-black/75 backdrop-blur-md border border-white/10 rounded-xl p-2.5 text-[11px] font-mono text-slate-300 space-y-1">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">SURFACE SCAN:</span>
                <span className="text-cyan-400 font-bold">100% CLEAR</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">HYDRO PRESSURE:</span>
                <span className="text-emerald-400 font-bold">1,500 PSI</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">CERAMIC ANGLE:</span>
                <span className="text-yellow-400 font-bold">&gt;118° CONTACT</span>
              </div>
            </div>

            {/* Play / Pause Toggle Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute bottom-3 right-3 z-30 p-2.5 rounded-xl bg-black/75 hover:bg-black/90 backdrop-blur-md border border-white/10 text-white transition-all transform hover:scale-105"
              title={isPlaying ? 'Pause Animation' : 'Resume Animation'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-cyan-400" />}
            </button>
          </div>
        </div>

        {/* Right Side: Interactive Controls & Action Cards (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Select Cleaning Animation:</span>
            <span className="text-cyan-400">Interactive</span>
          </div>

          {/* Mode Switchers */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5">
            <button
              onClick={() => handleModeChange('scan')}
              className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                activeMode === 'scan'
                  ? 'bg-cyan-500/10 border-cyan-500/50 text-white shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                activeMode === 'scan' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-cyan-400'
              }`}>
                <Scan className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">Optical Laser Scan</div>
                <div className="text-[11px] text-slate-400 truncate">Surface contour profiling</div>
              </div>
            </button>

            <button
              onClick={() => handleModeChange('hydro')}
              className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                activeMode === 'hydro'
                  ? 'bg-cyan-500/10 border-cyan-500/50 text-white shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                activeMode === 'hydro' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-cyan-400'
              }`}>
                <Waves className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">1500 PSI Hydro Blast</div>
                <div className="text-[11px] text-slate-400 truncate">High velocity dirt stripping</div>
              </div>
            </button>

            <button
              onClick={() => handleModeChange('foam')}
              className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                activeMode === 'foam'
                  ? 'bg-pink-500/10 border-pink-500/50 text-white shadow-lg shadow-pink-500/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                activeMode === 'foam' ? 'bg-pink-500 text-slate-950' : 'bg-slate-800 text-pink-400'
              }`}>
                <Droplets className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">Thick Snow Foam Curtain</div>
                <div className="text-[11px] text-slate-400 truncate">pH-neutral deep encapsulation</div>
              </div>
            </button>

            <button
              onClick={() => handleModeChange('ceramic')}
              className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                activeMode === 'ceramic'
                  ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-lg shadow-amber-500/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                activeMode === 'ceramic' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-400'
              }`}>
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">Ceramic Graphene Shine</div>
                <div className="text-[11px] text-slate-400 truncate">Mirror gloss & UV lock</div>
              </div>
            </button>
          </div>

          {/* Quick CTA to Book Service in Kenyan Shillings */}
          <div className="pt-2">
            <button
              onClick={onOpenBooking}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 transition-all transform hover:scale-[1.02]"
            >
              <span>Book Bay Service in KSh</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              Instant online confirmation • M-Pesa & Stripe Cards accepted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
