import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  RotateCw, 
  ArrowRight,
  Droplets,
  Layers
} from 'lucide-react';

interface CustomerTrustAndFAQProps {
  onLaunch3D: () => void;
  onOpenBooking: () => void;
}

export const CustomerTrustAndFAQ: React.FC<CustomerTrustAndFAQProps> = ({
  onLaunch3D,
  onOpenBooking
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is touchless washing genuinely 100% scratch and swirl-free?',
      a: 'Yes, absolutely. Unlike conventional car washes that drag abrasive rotating plastic brushes or dirty cloths across your paintwork, our automated gantry utilizes zero physical contact. We use specialized 1,500 PSI oscillating water jets, pH-neutral citrus pre-soaks, and non-contact air blowers to preserve flawless clearcoats and delicate ceramic coatings.'
    },
    {
      q: 'How long does a wash appointment take from entry to exit?',
      a: 'Our Express Hydro wash takes approximately 12 minutes inside the bay. The Deluxe Tri-Foam takes 20 minutes, and the Ceramic Shield Pro takes 30 minutes. You can stay comfortably inside your vehicle during the entire process with your windows up, or relax in our customer lounge with complimentary high-speed Wi-Fi and artisan coffee.'
    },
    {
      q: 'What payment methods do you accept at the bays?',
      a: 'We accept M-Pesa Express (STK push directly to your phone), Visa, Mastercard, American Express, Apple Pay, and Google Pay. All online reservations and on-site bay terminals are denominated in Kenyan Shillings (KES).'
    },
    {
      q: 'Can I drive in without an advance booking?',
      a: 'Yes! All our Nairobi branches feature express drive-in lanes. However, booking your slot online guarantees zero queue wait time and priority bay routing, especially during peak weekend hours.'
    },
    {
      q: 'What is your 48-Hour Rain & Spot Guarantee?',
      a: 'If it rains in Nairobi within 48 hours of your Deluxe, Ceramic, or Diamond wash, bring your vehicle back with your booking ID and we will provide a complimentary exterior hydro pre-rinse and spot-free blow dry.'
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Interactive 3D Simulator Feature Teaser Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-cyan-500/30 p-8 sm:p-10 relative overflow-hidden shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Digital Twin Bay</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Want to See the Robotic System in Action?
              </h3>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                Explore our proprietary 3D interactive car wash simulator. Inspect water nozzles, foam cannons, Neoglide rollers, and graphene ceramic curing from any angle with real-time audio and vehicle paint controls.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                onClick={onLaunch3D}
                className="w-full py-3.5 px-5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
              >
                <RotateCw className="w-4 h-4" />
                <span>Launch 3D Simulator Studio</span>
              </button>

              <button
                onClick={onOpenBooking}
                className="w-full py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-all"
              >
                <span>Book Real Wash Service</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Customer Help & Questions</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Everything You Need to Know Before Your Visit
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Transparent service guidelines, water conservation standards, and paint care best practices for vehicle owners across Nairobi.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm font-bold text-white hover:text-cyan-300 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-cyan-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
