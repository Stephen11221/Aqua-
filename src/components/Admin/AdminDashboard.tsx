import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Car, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Play, 
  RotateCw, 
  ChevronRight,
  Filter,
  BarChart3,
  Layers,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';
import { Booking, WashStageId } from '../../types';
import { 
  REVENUE_CHART_DATA, 
  PACKAGE_POPULARITY, 
  HOURLY_BAY_TRAFFIC, 
  WASH_STAGES 
} from '../../data/packages';
import { formatKES } from '../../utils/currency';

export interface AdminDashboardProps {
  bookings: Booking[];
  onUpdateBookingStatus: (bookingId: string, newStatus: Booking['status'], newStage: WashStageId) => void;
  onOpenMessagesForBooking: (booking: Booking) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  onUpdateBookingStatus,
  onOpenMessagesForBooking
}) => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'bays' | 'analytics'>('appointments');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // KPI Calculations in Kenyan Shillings
  const totalRevenue = bookings.reduce((acc, b) => acc + (b.paymentStatus === 'paid' ? b.totalAmount : 0), 385000);
  const activeWashes = bookings.filter(b => b.status === 'in_progress').length;
  const completedToday = bookings.filter(b => b.status === 'completed').length + 42;
  const avgTicket = Math.round(totalRevenue / (completedToday + activeWashes));

  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === statusFilter);

  return (
    <div id="admin-dashboard-container" className="space-y-6">
      {/* Header & Mode Switcher */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Operations Center • Admin Portal
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            AquaGlow Bay & Revenue Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time bay telemetry, service queue dispatch, and financial metrics.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
          <button
            id="tab-appointments"
            onClick={() => setActiveTab('appointments')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'appointments'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Daily Queue ({bookings.length})</span>
          </button>
          <button
            id="tab-bays"
            onClick={() => setActiveTab('bays')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'bays'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Wash Bays</span>
          </button>
          <button
            id="tab-analytics"
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Revenue</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            {formatKES(totalRevenue)}
          </span>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
            <TrendingUp className="w-3 h-3" /> +14.2% vs last Monday
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active in Bays</span>
            <RotateCw className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-display">
            {activeWashes} Vehicles
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            Bay 1 & Bay 2 currently washing
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed Washes</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            {completedToday}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            Zero re-wash requests
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Ticket Size</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            {formatKES(avgTicket)}
          </span>
          <span className="text-[11px] text-amber-400 block mt-1 font-medium">
            Ceramic package leading
          </span>
        </div>
      </div>

      {/* TAB 1: Appointments Queue */}
      {activeTab === 'appointments' && (
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Vehicle Queue & Service Dispatch
              </h3>
              <p className="text-xs text-slate-400">
                Click "Advance" to transition wash stage in real time and trigger push notifications to customer.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start">
              {['all', 'in_progress', 'booked', 'completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                    statusFilter === st
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Appointments Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Customer & Phone</th>
                  <th className="py-3 px-4">Vehicle & Plate</th>
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4">Bay</th>
                  <th className="py-3 px-4">Current Stage</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredBookings.map((b) => {
                  const stageInfo = WASH_STAGES.find(s => s.id === b.currentStage) || WASH_STAGES[0];
                  return (
                    <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-semibold text-cyan-400">
                        {b.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{b.customerName}</div>
                        <div className="text-slate-400 text-[11px]">{b.customerPhone}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{b.vehicleMakeModel}</div>
                        <div className="font-mono text-slate-400 text-[11px]">{b.licensePlate}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-200">
                          {b.packageName}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-300">
                        Bay #{b.bayNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          b.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : b.status === 'in_progress'
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {stageInfo.shortName}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold font-display text-white">
                        {formatKES(b.totalAmount)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {b.status !== 'completed' && (
                            <button
                              id={`btn-admin-advance-${b.id}`}
                              onClick={() => {
                                const currIdx = WASH_STAGES.findIndex(s => s.id === b.currentStage);
                                const nextStage = WASH_STAGES[Math.min(WASH_STAGES.length - 1, currIdx + 1)].id;
                                const newStatus = nextStage === 'completed' ? 'completed' : 'in_progress';
                                onUpdateBookingStatus(b.id, newStatus, nextStage);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] flex items-center gap-1 transition-colors"
                            >
                              <span>Advance</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            onClick={() => onOpenMessagesForBooking(b)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                            title="Chat with Customer"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Wash Bays Monitor */}
      {activeTab === 'bays' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((bayNum) => {
            const activeForBay = bookings.find(b => b.bayNumber === bayNum && b.status === 'in_progress');
            const bayType = bayNum === 1 
              ? 'Touchless Hydro Tunnel' 
              : bayNum === 2 
              ? 'Microfiber Soft-Cloth Bay' 
              : 'Ceramic Detail & Interior Bay';

            return (
              <div
                key={bayNum}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      Bay #{bayNum}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      activeForBay 
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {activeForBay ? 'Active Wash' : 'Standby / Ready'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{bayType}</h3>

                  {activeForBay ? (
                    <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
                      <div className="flex justify-between text-white font-semibold">
                        <span>{activeForBay.vehicleMakeModel}</span>
                        <span className="font-mono text-cyan-400">{activeForBay.licensePlate}</span>
                      </div>
                      <div className="text-slate-400">
                        {activeForBay.packageName}
                      </div>
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Current Phase:</span>
                        <span className="font-bold text-amber-400 capitalize">
                          {activeForBay.currentStage.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 p-6 rounded-2xl bg-slate-950/50 border border-dashed border-slate-800 text-center text-xs text-slate-500">
                      Bay is empty. Ready for next arriving vehicle.
                    </div>
                  )}
                </div>

                {activeForBay && (
                  <div className="pt-3 border-t border-slate-800 flex gap-2">
                    <button
                      onClick={() => onUpdateBookingStatus(activeForBay.id, 'completed', 'completed')}
                      className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                    >
                      Mark Complete & Notify Customer
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: Revenue Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Revenue Trends Chart */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white font-display">Weekly Gross Revenue</h3>
                <p className="text-xs text-slate-400">Total wash package revenue + tip breakdown</p>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-1 rounded-lg">
                Week Total: {formatKES(2198000)}
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_CHART_DATA}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                  <Tooltip 
                    formatter={(val: any) => [formatKES(Number(val || 0)), 'Revenue']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} 
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Grid: Popular Packages & Hourly Heat */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Package Revenue Share */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white font-display">Revenue by Wash Package</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={PACKAGE_POPULARITY}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }: { name?: string; percent?: number }) => `${(name || '').split(' ')[0]} ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                      {PACKAGE_POPULARITY.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Peak Hourly Throughput */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white font-display">Hourly Bay Traffic Throughput</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={HOURLY_BAY_TRAFFIC}>
                    <XAxis dataKey="hour" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} 
                    />
                    <Bar dataKey="washes" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
