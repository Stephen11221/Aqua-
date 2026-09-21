import React from 'react';
import { 
  Droplets, 
  Car, 
  Calendar, 
  Radio, 
  Star, 
  Shield, 
  MessageSquare, 
  User, 
  Plus,
  Sparkles,
  Video,
  Home,
  Layers,
  MapPin
} from 'lucide-react';
import { UserProfile, Booking } from '../types';

export type WebsiteView = 'home' | 'services' | '3d_wash' | 'showcase' | 'booking' | 'tracker' | 'locations' | 'reviews' | 'admin';

export interface NavbarProps {
  currentView: WebsiteView;
  onSelectView: (view: WebsiteView) => void;
  onOpenBooking: () => void;
  onOpenMessages: () => void;
  onOpenAuth: () => void;
  currentUser: UserProfile;
  activeBooking: Booking | null;
  unreadMessagesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  onOpenBooking,
  onOpenMessages,
  onOpenAuth,
  currentUser,
  activeBooking,
  unreadMessagesCount
}) => {
  return (
    <header id="app-navbar" className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <div 
          onClick={() => onSelectView('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Droplets className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-white font-display">
                Aqua<span className="text-cyan-400">Glow</span>
              </span>
              <span className="px-1.5 py-0.2 rounded-md bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[9px] font-extrabold uppercase">
                Spa
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium block -mt-0.5">
              Touchless Auto Spa & Detailing
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links for Customer Website */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
          <button
            id="nav-link-home"
            onClick={() => onSelectView('home')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              currentView === 'home'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            id="nav-link-services"
            onClick={() => onSelectView('services')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              currentView === 'services'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Services & Pricing</span>
          </button>

          <button
            id="nav-link-showcase"
            onClick={() => onSelectView('showcase')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              currentView === 'showcase'
                ? 'bg-rose-600 text-white shadow-md font-bold ring-1 ring-rose-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <Video className="w-3.5 h-3.5 text-rose-400" />
            <span>CCTV & Feeds</span>
          </button>

          <button
            id="nav-link-tracker"
            onClick={() => onSelectView('tracker')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 relative ${
              currentView === 'tracker'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Track Wash</span>
            {activeBooking && activeBooking.status === 'in_progress' && (
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute -top-0.5 -right-0.5" />
            )}
          </button>

          <button
            id="nav-link-locations"
            onClick={() => onSelectView('locations')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              currentView === 'locations'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Locations</span>
          </button>

          <button
            id="nav-link-3d"
            onClick={() => onSelectView('3d_wash')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              currentView === '3d_wash'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>3D Bay Sim</span>
          </button>

          <button
            id="nav-link-reviews"
            onClick={() => onSelectView('reviews')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              currentView === 'reviews'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span>Reviews</span>
          </button>

          <button
            id="nav-link-admin"
            onClick={() => onSelectView('admin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              currentView === 'admin'
                ? 'bg-indigo-600 text-white shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>Admin</span>
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2">
          {/* Messaging Trigger */}
          <button
            id="btn-nav-messages"
            onClick={onOpenMessages}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors relative"
            title="Chat with Bay Technicians"
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-slate-950 rounded-full text-[10px] font-black flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* User Auth Avatar */}
          <button
            id="btn-nav-auth"
            onClick={onOpenAuth}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {currentUser.name.charAt(0)}
            </div>
            <span className="text-xs font-semibold text-slate-200 hidden sm:inline">
              {currentUser.name.split(' ')[0]}
            </span>
            {currentUser.role === 'admin' && (
              <span className="hidden lg:inline px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-bold uppercase">
                Staff
              </span>
            )}
          </button>

          {/* Book Wash Primary Button */}
          <button
            id="btn-nav-book"
            onClick={onOpenBooking}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Book Service</span>
          </button>
        </div>
      </div>
    </header>
  );
};
