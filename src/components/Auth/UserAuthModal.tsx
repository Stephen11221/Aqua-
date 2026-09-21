import React, { useState } from 'react';
import { 
  X, 
  User, 
  Shield, 
  Lock, 
  Award, 
  Car, 
  Check, 
  LogOut, 
  Sparkles,
  KeyRound
} from 'lucide-react';
import { UserProfile, VehicleType } from '../../types';

export interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'admin_login'>('profile');
  const [adminPin, setAdminPin] = useState('');
  const [adminError, setAdminError] = useState('');

  if (!isOpen) return null;

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '2026' || adminPin === 'admin' || adminPin === '1234') {
      onUpdateUser({
        ...currentUser,
        role: 'admin'
      });
      setAdminError('');
      onClose();
    } else {
      setAdminError('Invalid manager passcode. Hint: Use 2026 or 1234');
    }
  };

  const handleSwitchToCustomer = () => {
    onUpdateUser({
      ...currentUser,
      role: 'customer'
    });
  };

  return (
    <div id="auth-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/90 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Selection */}
        <div className="flex gap-2 p-1 bg-slate-950 rounded-2xl mb-6 border border-slate-800">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'profile' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Driver Account
          </button>
          <button
            onClick={() => setActiveTab('admin_login')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 ${
              activeTab === 'admin_login' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Staff / Admin</span>
          </button>
        </div>

        {activeTab === 'profile' ? (
          <div className="space-y-5">
            {/* User Profile Overview */}
            <div className="flex items-center gap-3.5 p-4 bg-slate-950/80 border border-slate-800 rounded-2xl">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-lg">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-white text-base">{currentUser.name}</h4>
                <p className="text-xs text-slate-400">{currentUser.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase border border-cyan-500/20">
                    Role: {currentUser.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Loyalty AquaPoints Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/60 to-blue-950/40 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  <span>AquaPoints Loyalty</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                  Platinum Tier
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-3xl font-black text-white font-display">
                  {currentUser.loyaltyPoints} pts
                </span>
                <span className="text-xs text-cyan-300 font-medium">80 pts until Free Deluxe Wash</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[84%] h-full bg-gradient-to-r from-cyan-400 to-blue-500" />
              </div>
            </div>

            {/* Saved Vehicles in Garage */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Garage (Saved Vehicles)
              </label>
              <div className="space-y-2">
                {currentUser.savedVehicles.map((veh, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <Car className="w-4 h-4 text-cyan-400" />
                      <div>
                        <span className="font-semibold text-white block">{veh.makeModel}</span>
                        <span className="text-slate-400 font-mono text-[11px]">{veh.plate}</span>
                      </div>
                    </div>
                    <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: veh.color }} />
                  </div>
                ))}
              </div>
            </div>

            {currentUser.role === 'admin' && (
              <button
                onClick={handleSwitchToCustomer}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Switch Back to Customer View
              </button>
            )}
          </div>
        ) : (
          /* Admin / Staff Passcode Verification */
          <div className="space-y-4">
            <div className="text-center py-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-base">Manager / Technician Authentication</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                Enter your authorization PIN to unlock live bay dispatch and full revenue metrics.
              </p>
            </div>

            <form onSubmit={handleAdminAuth} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Passcode PIN</label>
                <input
                  type="password"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="Enter 2026 or 1234"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-center text-lg tracking-widest text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
                {adminError && (
                  <p className="text-xs text-rose-400 mt-1 text-center">{adminError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-lg"
              >
                Unlock Operations Dashboard
              </button>

              <button
                type="button"
                onClick={() => {
                  onUpdateUser({
                    ...currentUser,
                    role: 'admin'
                  });
                  onClose();
                }}
                className="w-full py-2 text-xs text-slate-400 hover:text-cyan-400 text-center block"
              >
                Quick Demo: One-Click Instant Admin Access
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
