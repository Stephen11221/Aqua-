import React from 'react';
import { 
  Home,
  Layers,
  Radio, 
  PlusCircle, 
  MapPin, 
  Shield, 
  Video
} from 'lucide-react';
import { Booking } from '../types';
import { WebsiteView } from './Navbar';

export interface MobileNavProps {
  currentView: WebsiteView;
  onSelectView: (view: WebsiteView) => void;
  onOpenBooking: () => void;
  activeBooking: Booking | null;
  unreadMessagesCount: number;
  onOpenMessages: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentView,
  onSelectView,
  onOpenBooking,
  activeBooking,
  unreadMessagesCount,
  onOpenMessages
}) => {
  return (
    <div id="mobile-nav-bar" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-2 py-2 flex items-center justify-around select-none">
      <button
        onClick={() => onSelectView('home')}
        className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-[10px] font-medium transition-colors ${
          currentView === 'home' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </button>

      <button
        onClick={() => onSelectView('services')}
        className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-[10px] font-medium transition-colors ${
          currentView === 'services' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Layers className="w-5 h-5" />
        <span>Services</span>
      </button>

      {/* Center Floating Book Button */}
      <button
        onClick={onOpenBooking}
        className="flex flex-col items-center -mt-5"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-cyan-500/30 border-2 border-slate-950">
          <PlusCircle className="w-6 h-6" />
        </div>
        <span className="text-[10px] text-cyan-300 font-bold mt-0.5">Book</span>
      </button>

      <button
        onClick={() => onSelectView('tracker')}
        className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-[10px] font-medium relative transition-colors ${
          currentView === 'tracker' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Radio className={`w-5 h-5 ${activeBooking ? 'text-cyan-400 animate-pulse' : ''}`} />
        <span>Track</span>
        {activeBooking && activeBooking.status === 'in_progress' && (
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute top-0.5 right-2" />
        )}
      </button>

      <button
        onClick={() => onSelectView('locations')}
        className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-[10px] font-medium transition-colors ${
          currentView === 'locations' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <MapPin className="w-5 h-5" />
        <span>Locations</span>
      </button>

      <button
        onClick={() => onSelectView('admin')}
        className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-[10px] font-medium transition-colors ${
          currentView === 'admin' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Shield className="w-5 h-5" />
        <span>Admin</span>
      </button>
    </div>
  );
};
