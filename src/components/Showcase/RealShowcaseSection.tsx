import React, { useState } from 'react';
import { 
  Sparkles, 
  Video, 
  Layers, 
  Droplets, 
  ShieldCheck, 
  ArrowRight, 
  Play, 
  Radio, 
  Eye, 
  Maximize2,
  Sliders,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { REAL_ASSETS } from '../../assets/images';
import { LiveBayVideoPlayer } from '../Video/LiveBayVideoPlayer';
import { WashStageId } from '../../types';

export interface RealShowcaseSectionProps {
  onBookNow?: () => void;
  onOpenBooking?: () => void;
  onSelectStage?: (stage: WashStageId) => void;
}

export const RealShowcaseSection: React.FC<RealShowcaseSectionProps> = ({ 
  onBookNow,
  onOpenBooking,
  onSelectStage
}) => {
  const triggerBooking = onOpenBooking || onBookNow || (() => {});
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 to 100
  const [activeTab, setActiveTab] = useState<'video' | 'slider' | 'gallery'>('video');
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(null);

  const GALLERY_ITEMS = [
    {
      title: 'Automated Tunnel Ingress & Neon Guide Arches',
      category: 'Facility & Equipment',
      image: REAL_ASSETS.tunnelBay,
      description: 'Wide-angle view of our 120-foot automated wash tunnel featuring electric LED guide arches and soft-touch micro-cellular foam rolls.'
    },
    {
      title: 'Graphene Ceramic Mirror Reflection',
      category: 'Paint Protection',
      image: REAL_ASSETS.ceramicShine,
      description: 'Extreme hydrophobic contact angle (>115°) with deep wet-look clarity and 12-month swirl mark resistance.'
    },
    {
      title: 'Tri-Color Snow Foam Cascade',
      category: 'Chemical Bath',
      image: REAL_ASSETS.foamWash,
      description: 'pH-neutral active foam blanket encapsulates grit, pollen, and road grease before brushes make contact.'
    },
    {
      title: '1500 PSI Alloy Wheel & Caliper Hydro Blast',
      category: 'Wheel Restoration',
      image: REAL_ASSETS.wheelBlast,
      description: 'Rotary high-pressure turbo nozzles blast baked-on metallic brake dust out of alloy spoke crevices.'
    },
    {
      title: 'CCTV Telemetry Monitoring System',
      category: 'Security & Quality',
      image: REAL_ASSETS.cctvTunnel,
      description: '360° optical surveillance tracking vehicle dimensions and wash gantry clearance in real-time.'
    }
  ];

  return (
    <section id="real-showcase-section" className="py-16 sm:py-24 bg-slate-950 border-t border-slate-900 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>High-Definition Visuals & Real Live CCTV</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Real 3D Environments & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Live Video Streams</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Experience our facility through photorealistic 3D rendering, live surveillance camera feeds, and ultra-high-resolution before-and-after imagery.
          </p>

          {/* Navigation Pill Tabs */}
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl gap-1">
            <button
              id="tab-video-feed"
              onClick={() => setActiveTab('video')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'video'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Live CCTV Feeds</span>
            </button>
            <button
              id="tab-before-after"
              onClick={() => setActiveTab('slider')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'slider'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Real Before & After</span>
            </button>
            <button
              id="tab-gallery"
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'gallery'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>HD Gallery</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Live CCTV Stream Player */}
        {activeTab === 'video' && (
          <div className="space-y-6">
            <LiveBayVideoPlayer 
              onSelectStage={onSelectStage}
              className="max-w-5xl mx-auto shadow-2xl shadow-cyan-950/40" 
            />

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-cyan-400">1080p / 4K</div>
                <div className="text-xs text-slate-400 mt-1">Multi-Angle Cameras</div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-emerald-400">&lt; 150 ms</div>
                <div className="text-xs text-slate-400 mt-1">Ultra-Low Latency Feed</div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-amber-400">3 Sensor Modes</div>
                <div className="text-xs text-slate-400 mt-1">Optical, Night IR & Thermal</div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-indigo-400">100% Secure</div>
                <div className="text-xs text-slate-400 mt-1">Encrypted Customer Stream</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Real Before & After Slider */}
        {activeTab === 'slider' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Interactive Finish Comparison
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Drag the slider to compare thick snow foam cleansing vs deep ceramic hydrophobic mirror gloss.
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-cyan-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  <span>SWIPE TO REVEAL</span>
                </div>
              </div>

              {/* Slider Viewport Container */}
              <div 
                className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden select-none cursor-ew-resize border border-slate-700/60"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
                  setSliderPos((x / rect.width) * 100);
                }}
                onTouchMove={(e) => {
                  if (!e.touches[0]) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = Math.max(0, Math.min(rect.width, e.touches[0].clientX - rect.left));
                  setSliderPos((x / rect.width) * 100);
                }}
              >
                {/* Right Image (After: Ceramic Mirror Finish) */}
                <img
                  src={REAL_ASSETS.ceramicShine}
                  alt="After: Ceramic Coated Supercar"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Left Image (Before: Active Tri-Color Foam Bath) */}
                <div
                  className="absolute inset-y-0 left-0 overflow-hidden"
                  style={{ width: `${sliderPos}%` }}
                >
                  <img
                    src={REAL_ASSETS.foamWash}
                    alt="Before: Snow Foam Cascade"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ width: '100%', maxWidth: 'none', height: '100%' }}
                  />
                  {/* Before Label */}
                  <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md px-3 py-1 rounded-xl text-white text-xs font-bold uppercase tracking-wider border border-white/20">
                    Active Foam Bath
                  </div>
                </div>

                {/* After Label */}
                <div className="absolute bottom-4 right-4 bg-cyan-950/85 backdrop-blur-md px-3 py-1 rounded-xl text-cyan-300 text-xs font-bold uppercase tracking-wider border border-cyan-500/30">
                  Ceramic Mirror Shine
                </div>

                {/* Draggable Divider Line & Knob */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl flex items-center justify-center -ml-0.5"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-950">
                    <Sliders className="w-4 h-4 rotate-90" />
                  </div>
                </div>
              </div>

              {/* Slider Controls Range */}
              <div className="mt-4 flex items-center gap-4">
                <span className="text-xs text-slate-400">Foam Soak</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="flex-1 accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-xs text-cyan-400 font-bold">Showroom Finish</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: HD Real Photo Gallery */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {GALLERY_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedGalleryImg(item.image)}
                  className="group relative bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 cursor-pointer shadow-xl flex flex-col"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                    <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-semibold text-cyan-300 border border-slate-800">
                      {item.category}
                    </span>
                    <button className="absolute bottom-3 right-3 p-2 rounded-xl bg-cyan-500 text-slate-950 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                    <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Lightbox Modal */}
            {selectedGalleryImg && (
              <div
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
                onClick={() => setSelectedGalleryImg(null)}
              >
                <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
                  <img
                    src={selectedGalleryImg}
                    alt="Gallery item large"
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl border border-slate-800"
                  />
                  <button
                    onClick={() => setSelectedGalleryImg(null)}
                    className="mt-4 px-6 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900/80 to-blue-950/60 border border-cyan-500/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Ready to see your car transformed in real life?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Book a bay online in 60 seconds and watch live through your personal CCTV stream.
            </p>
          </div>
          <button
            onClick={triggerBooking}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/20 flex items-center gap-2 transition-all transform hover:scale-[1.02] whitespace-nowrap"
          >
            <span>Book Online Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
