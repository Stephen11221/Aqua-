import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  ChevronRight, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Waves,
  Star,
  Zap,
  ArrowRight,
  Eye
} from 'lucide-react';
import { REAL_ASSETS } from '../../assets/images';
import { formatKES } from '../../utils/currency';

interface ProfessionalHeroProps {
  onOpenBooking: () => void;
  onBrowseServices: () => void;
  onLaunch3D: () => void;
  onViewLiveCCTV: () => void;
}

export const ProfessionalHero: React.FC<ProfessionalHeroProps> = ({
  onOpenBooking,
  onBrowseServices,
  onLaunch3D,
  onViewLiveCCTV
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Value Proposition & Customer CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Live Operational Status Pill */}
            <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-md">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-emerald-400">Open Today: 7:00 AM – 9:00 PM</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-300 font-medium">Nairobi Express Bays (Est. Wait: ~8 mins)</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Nairobi’s Premier <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
                  Touchless Auto Spa
                </span> <br />
                & Precision Detailing
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Restore showroom gloss without touching your vehicle’s clearcoat. Powered by high-velocity 1,500 PSI laser-guided hydro jets, pH-neutral snow foam, and molecular graphene ceramic defense.
              </p>
            </div>

            {/* Key Trust Checkmarks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>100% Scratch-Free</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Spot-Free RO Rinse</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>M-Pesa & Card Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Graphene Ceramic</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>15-Minute Turnaround</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Eco-Recycled Water</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                id="btn-hero-book-wash"
                onClick={onOpenBooking}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
              >
                <span>Book Bay Service ({formatKES(1500)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-hero-browse-services"
                onClick={onBrowseServices}
                className="px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700/80 flex items-center justify-center gap-2 transition-all"
              >
                <span>View Full Service Menu</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                id="btn-hero-launch-3d"
                onClick={onLaunch3D}
                className="px-4 py-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-900 text-cyan-400 hover:text-cyan-300 font-semibold text-xs border border-cyan-500/30 flex items-center justify-center gap-1.5 transition-all"
                title="Open Interactive 3D Simulation Bay"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>3D Simulation Bay</span>
              </button>
            </div>

            {/* Customer Rating & Metric Strip */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-white text-sm">4.9 / 5.0</span>
                <span>(1,280+ Nairobi Reviews)</span>
              </div>
              <div className="h-4 w-px bg-slate-800 hidden sm:block" />
              <div>
                <span className="font-bold text-white">15,000+</span> Vehicles Handled
              </div>
              <div className="h-4 w-px bg-slate-800 hidden sm:block" />
              <div className="text-cyan-400 font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Westlands • Kilimani • Karen • Mombasa Rd</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Showcase Card with Real Car Wash Photo (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-2xl group">
              {/* Real Photograph of vehicle in automated wash */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={REAL_ASSETS.realCarHero}
                  alt="Professional Luxury Car Wash in Nairobi"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-cyan-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Waves className="w-3.5 h-3.5" />
                    <span>Optical Contour Wash Bay #1</span>
                  </span>
                </div>

                {/* Live CCTV overlay trigger */}
                <button
                  onClick={onViewLiveCCTV}
                  className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all"
                >
                  <Eye className="w-3 h-3" />
                  <span>Live CCTV</span>
                </button>
              </div>

              {/* Card Footer Detail */}
              <div className="p-5 bg-slate-950/95 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">AquaGlow Flagship Bay Facility</h3>
                    <p className="text-xs text-slate-400">German engineered touchless gantry • Spot-free dry</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Starting from</div>
                    <div className="text-lg font-black text-cyan-400 font-display">
                      {formatKES(1500)}
                    </div>
                  </div>
                </div>

                {/* Quick 3-feature pills */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-xs font-bold text-cyan-400">12 Mins</div>
                    <div className="text-[10px] text-slate-400">Express Wash</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-xs font-bold text-emerald-400">100% Zero</div>
                    <div className="text-[10px] text-slate-400">Swirl Contact</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-xs font-bold text-amber-400">9H Shield</div>
                    <div className="text-[10px] text-slate-400">Graphene Glaze</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
