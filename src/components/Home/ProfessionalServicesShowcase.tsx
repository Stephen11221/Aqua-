import React, { useState } from 'react';
import { 
  Sparkles, 
  Droplets, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  Car, 
  Zap, 
  Wind, 
  Plus,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { WASH_PACKAGES, WASH_ADDONS } from '../../data/packages';
import { formatKES } from '../../utils/currency';
import { REAL_ASSETS } from '../../assets/images';

interface ProfessionalServicesShowcaseProps {
  onSelectPackageToBook: (packageId: string) => void;
}

type ServiceCategory = 'all' | 'exterior' | 'ceramic' | 'interior';

export const ProfessionalServicesShowcase: React.FC<ProfessionalServicesShowcaseProps> = ({
  onSelectPackageToBook
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');
  const [hoveredPkg, setHoveredPkg] = useState<string | null>(null);

  // Extended service descriptions and badges
  const getPackageImage = (pkgId: string) => {
    switch (pkgId) {
      case 'express':
        return REAL_ASSETS.tunnelBay;
      case 'deluxe':
        return REAL_ASSETS.foamWash;
      case 'ceramic':
        return REAL_ASSETS.ceramicShine;
      case 'diamond':
        return REAL_ASSETS.realCarHero;
      default:
        return REAL_ASSETS.wheelBlast;
    }
  };

  const filteredPackages = WASH_PACKAGES.filter((pkg) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'exterior') return pkg.id === 'express' || pkg.id === 'deluxe';
    if (selectedCategory === 'ceramic') return pkg.id === 'ceramic' || pkg.id === 'diamond';
    if (selectedCategory === 'interior') return pkg.id === 'diamond';
    return true;
  });

  return (
    <section id="services-showcase" className="py-12 sm:py-16 bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Droplets className="w-3.5 h-3.5" />
              <span>Full Service Menu & Transparent Pricing</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Professional Detailing & Wash Packages
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl">
              Engineered with zero-contact high pressure water arches, pH-balanced foams, and long-lasting graphene coatings. All prices in Kenyan Shillings with no hidden charges.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              All Packages
            </button>
            <button
              onClick={() => setSelectedCategory('exterior')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'exterior'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Touchless Exterior
            </button>
            <button
              onClick={() => setSelectedCategory('ceramic')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'ceramic'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Ceramic & 9H Armor
            </button>
            <button
              onClick={() => setSelectedCategory('interior')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'interior'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Interior Detailing
            </button>
          </div>
        </div>

        {/* Main Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPackages.map((pkg) => {
            const isPopular = pkg.popular;
            return (
              <div
                key={pkg.id}
                onMouseEnter={() => setHoveredPkg(pkg.id)}
                onMouseLeave={() => setHoveredPkg(null)}
                className={`rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden bg-slate-900/80 relative group ${
                  isPopular
                    ? 'border-cyan-500 shadow-2xl shadow-cyan-500/10'
                    : 'border-slate-800 hover:border-slate-700 hover:shadow-xl'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute top-3 right-3 z-20 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-lg">
                    Most Popular Choice
                  </div>
                )}

                {/* Card Image Header */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                  <img
                    src={getPackageImage(pkg.id)}
                    alt={pkg.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                  
                  {/* Estimated Duration pill */}
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{pkg.estimatedMinutes} Mins Bay Time</span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div>
                    {/* Title & Tagline */}
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {pkg.tagline}
                      </p>
                    </div>

                    {/* Price Header in Kenyan Shillings */}
                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 mb-4">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Starting Price (Saloon / Sedan)
                      </div>
                      <div className="text-2xl font-black text-cyan-400 font-display mt-0.5">
                        {formatKES(pkg.price)}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        SUVs & Trucks calculated proportionally at checkout
                      </div>
                    </div>

                    {/* What's Included Feature List */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        What's Included:
                      </div>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span className="leading-snug">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => onSelectPackageToBook(pkg.id)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all transform group-hover:scale-[1.02] ${
                      isPopular
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-white'
                    }`}
                  >
                    <span>Book {pkg.name}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Specialized Detailing Add-Ons Bar */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Specialized Auto Spa Add-On Treatments</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Customize your bay wash appointment with our specialized molecular treatments. Add directly during online booking.
              </p>
            </div>
            <div className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/20 self-start sm:self-auto">
              Flat KSh Pricing • No Extra Wait
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WASH_ADDONS.map((addon) => (
              <div 
                key={addon.id}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="font-bold text-sm text-white">{addon.name}</h4>
                    <span className="text-xs font-bold text-cyan-400 font-display">
                      +{formatKES(addon.price)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {addon.description}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-900 text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Selectable in checkout</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
