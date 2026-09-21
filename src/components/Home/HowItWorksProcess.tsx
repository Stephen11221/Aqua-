import React from 'react';
import { 
  Scan, 
  Waves, 
  Droplets, 
  Wind, 
  ShieldCheck, 
  ArrowRight,
  Gauge,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { REAL_ASSETS } from '../../assets/images';

export const HowItWorksProcess: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Laser Contour Optical Scan',
      subtitle: 'Millimeter-accurate vehicle profile mapping',
      description: 'Ultrasonic sensors scan your exact ride height, side mirrors, and wheel track to program the precision robotic spray arch for maximum cleaning without physical contact.',
      icon: Scan,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
      bgGlow: 'bg-cyan-500/10'
    },
    {
      step: '02',
      title: '1,500 PSI Hydro Blast & Chassis Flush',
      subtitle: 'Oscillating pre-rinse removes heavy road grit',
      description: 'Dual oscillating high-pressure water bars target road tar, mud, and salt deposits from undercarriage, wheel arches, and rocker panels safely.',
      icon: Waves,
      color: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      bgGlow: 'bg-blue-500/10'
    },
    {
      step: '03',
      title: 'Tri-Foam Bio-Enzyme Encapsulation',
      subtitle: 'pH-neutral snow foam gently dissolves oils',
      description: 'Thick conditioned foam blankets the entire vehicle, lifting microscopic dust into suspension so it cascades off without abrasion or swirl marks.',
      icon: Droplets,
      color: 'text-pink-400',
      borderColor: 'border-pink-500/30',
      bgGlow: 'bg-pink-500/10'
    },
    {
      step: '04',
      title: 'Graphene Ceramic Seal & Heated Dry',
      subtitle: 'Molecular hydrophobic shield & hurricane dry',
      description: 'Nano-graphene sealant bonds instantaneously with your clearcoat, followed by spot-free reverse osmosis pure water and 45-HP heated air blowers.',
      icon: Sparkles,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      bgGlow: 'bg-amber-500/10'
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-slate-900/40 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Gauge className="w-3.5 h-3.5" />
            <span>Robotic Touchless Technology</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            How Our Automated Touchless Bay Works
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Engineered in Germany and calibrated for Kenyan roads. Zero abrasive brushes, zero swirl marks, and 100% spotless brilliance in under 15 minutes.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div 
                key={idx}
                className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between relative group hover:border-slate-700 transition-all hover:shadow-xl"
              >
                {/* Step Number Watermark */}
                <div className="absolute top-4 right-5 text-3xl font-black font-mono text-slate-800 group-hover:text-slate-700 transition-colors">
                  {s.step}
                </div>

                <div className="space-y-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-2xl ${s.bgGlow} border ${s.borderColor} flex items-center justify-center ${s.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {s.title}
                    </h3>
                    <div className="text-xs text-cyan-400 font-medium mt-0.5">
                      {s.subtitle}
                    </div>
                    <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Status */}
                <div className="pt-4 mt-4 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Automated
                  </span>
                  <span>Step {idx + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Environmental & Safety Commitment Strip */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">85% Water Reclaim & Eco Filtration System</div>
              <div className="text-slate-400">Environmentally certified in accordance with Nairobi County conservation guidelines.</div>
            </div>
          </div>
          <div className="text-right font-mono text-cyan-400 font-bold self-start sm:self-auto">
            100% Bio-Degradable Chemicals
          </div>
        </div>

      </div>
    </section>
  );
};
