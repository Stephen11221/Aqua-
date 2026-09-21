import React from 'react';
import { 
  Droplets, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  CheckCircle2,
  Heart
} from 'lucide-react';
import { WebsiteView } from '../Navbar';

interface WebsiteFooterProps {
  onSelectView: (view: WebsiteView) => void;
  onOpenBooking: () => void;
}

export const WebsiteFooter: React.FC<WebsiteFooterProps> = ({
  onSelectView,
  onOpenBooking
}) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1 & 2: Brand Story (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                <Droplets className="w-5 h-5 fill-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-white font-display">
                Aqua<span className="text-cyan-400">Glow</span> Auto Spa
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Nairobi's standard in robotic touchless car washing, 9H graphene ceramic clearcoat protection, and precision detailing. 100% scratch-free cleaning engineered for vehicle enthusiasts.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Registered Environmental Water Conservation Facility</span>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Browse Website
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onSelectView('home')} 
                  className="hover:text-cyan-400 transition-colors"
                >
                  Home Page
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectView('services')} 
                  className="hover:text-cyan-400 transition-colors"
                >
                  Wash Services & Pricing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectView('locations')} 
                  className="hover:text-cyan-400 transition-colors"
                >
                  Nairobi Locations & Hours
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectView('showcase')} 
                  className="hover:text-cyan-400 transition-colors"
                >
                  Live Bay CCTV Feeds
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectView('3d_wash')} 
                  className="hover:text-cyan-400 transition-colors"
                >
                  Interactive 3D Simulator
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectView('reviews')} 
                  className="hover:text-cyan-400 transition-colors"
                >
                  Customer Reviews
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Service Packages */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Popular Services
            </h4>
            <ul className="space-y-2">
              <li className="flex justify-between items-center pr-4">
                <span>Express Hydro Wash</span>
                <span className="text-cyan-400 font-bold">KSh 1,500</span>
              </li>
              <li className="flex justify-between items-center pr-4">
                <span>Deluxe Foam & Wheels</span>
                <span className="text-cyan-400 font-bold">KSh 3,200</span>
              </li>
              <li className="flex justify-between items-center pr-4">
                <span>Ceramic Shield Pro</span>
                <span className="text-cyan-400 font-bold">KSh 5,800</span>
              </li>
              <li className="flex justify-between items-center pr-4">
                <span>Diamond Showroom Spa</span>
                <span className="text-cyan-400 font-bold">KSh 9,800</span>
              </li>
              <li className="flex justify-between items-center pr-4">
                <span>Interior Ozone Sanitization</span>
                <span className="text-cyan-400 font-bold">KSh 4,500</span>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact & Help */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Bays & Support
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>+254 700 123 456</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>concierge@aquaglow.co.ke</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Bays Open: 6:30 AM – 9:30 PM</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={onOpenBooking}
                  className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all w-full text-center"
                >
                  Book Wash Online
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} AquaGlow Auto Spa & Detailing Lounge Ltd. All rights reserved. Prices in KES.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Water Recycled Certificate</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
