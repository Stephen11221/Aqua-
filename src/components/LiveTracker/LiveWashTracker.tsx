import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Bell, 
  BellRing, 
  MessageSquare, 
  Camera, 
  Sparkles, 
  ChevronRight, 
  ShieldCheck, 
  Droplets,
  RotateCw,
  Award,
  Video,
  ListOrdered
} from 'lucide-react';
import { Booking, WashStageId } from '../../types';
import { WASH_STAGES } from '../../data/packages';
import { soundManager } from '../../utils/audio';
import { LiveBayVideoPlayer } from '../Video/LiveBayVideoPlayer';

export interface LiveWashTrackerProps {
  activeBooking: Booking | null;
  onOpenMessages: () => void;
  onSelect3DStage?: (stage: WashStageId) => void;
  onAdvanceStage?: (newStage: WashStageId) => void;
  onRequestNotificationPermission?: () => void;
  hasPushPermission?: boolean;
}

export const LiveWashTracker: React.FC<LiveWashTrackerProps> = ({
  activeBooking,
  onOpenMessages,
  onSelect3DStage,
  onAdvanceStage,
  onRequestNotificationPermission,
  hasPushPermission = false
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(480);
  const [estimatedTotalSeconds, setEstimatedTotalSeconds] = useState(1200);
  const [viewMode, setViewMode] = useState<'timeline' | 'video'>('timeline');

  // Timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!activeBooking) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
        <Droplets className="w-12 h-12 mx-auto mb-3 text-cyan-400 opacity-60" />
        <h3 className="text-lg font-bold text-white mb-1">No Active Wash in Progress</h3>
        <p className="text-sm max-w-md mx-auto mb-4">
          Book a wash service or view an existing appointment to track real-time 3D cleaning progress.
        </p>
      </div>
    );
  }

  const currentStageIndex = WASH_STAGES.findIndex(s => s.id === activeBooking.currentStage);
  const activeStageInfo = WASH_STAGES[currentStageIndex] || WASH_STAGES[0];
  const isCompleted = activeBooking.status === 'completed' || activeBooking.currentStage === 'completed';

  const formatMinutesSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const remainingSec = Math.max(0, estimatedTotalSeconds - elapsedSeconds);

  return (
    <div id="live-wash-tracker-card" className="bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
      {/* Top Header: Bay Info & Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
            <RotateCw className={`w-6 h-6 ${!isCompleted ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-bold tracking-wider uppercase border border-cyan-500/30">
                Bay #{activeBooking.bayNumber} Live
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {activeBooking.id}</span>
            </div>
            <h3 className="text-xl font-bold text-white font-display mt-0.5">
              {activeBooking.vehicleMakeModel}
            </h3>
            <p className="text-xs text-slate-400">
              {activeBooking.licensePlate} • {activeBooking.packageName}
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'timeline'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Timeline</span>
            </button>
            <button
              onClick={() => setViewMode('video')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'video'
                  ? 'bg-rose-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <Video className="w-3.5 h-3.5" />
              <span>Live CCTV</span>
            </button>
          </div>

          <button
            id="btn-tracker-message-tech"
            onClick={onOpenMessages}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700/60 shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Chat Tech</span>
          </button>

          <button
            id="btn-tracker-push-alert"
            onClick={onRequestNotificationPermission}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border shadow-sm ${
              hasPushPermission
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold border-cyan-400'
            }`}
          >
            {hasPushPermission ? <BellRing className="w-3.5 h-3.5 text-emerald-400" /> : <Bell className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{hasPushPermission ? 'Push Active' : 'Push Alerts'}</span>
          </button>
        </div>
      </div>

      {/* Live Progress Bar & Timers */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">{activeStageInfo.name}</span>
            <span className="text-slate-400 hidden sm:inline">({activeBooking.stageProgress}% complete)</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Elapsed: <strong className="text-white">{formatMinutesSeconds(elapsedSeconds)}</strong>
            </span>
            <span>•</span>
            <span>
              Est. remaining: <strong className="text-cyan-300">{formatMinutesSeconds(remainingSec)}</strong>
            </span>
          </div>
        </div>

        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-500 shadow-md shadow-cyan-500/30"
            style={{ width: `${Math.max(8, activeBooking.stageProgress)}%` }}
          />
        </div>
      </div>

      {/* Conditional View: Live CCTV Video Player vs Timeline Sequence Cards */}
      {viewMode === 'video' ? (
        <div className="space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
            <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Live Security & Telemetry Stream • Bay #{activeBooking.bayNumber}
            </span>
            <span className="text-cyan-400 font-mono">1080p 60FPS</span>
          </div>
          <LiveBayVideoPlayer
            activeBooking={activeBooking}
            activeStage={activeBooking.currentStage}
            onSelectStage={(stage) => onSelect3DStage && onSelect3DStage(stage)}
          />
        </div>
      ) : (
        /* Stage Flow Timeline Cards */
        <div className="space-y-3 animate-in fade-in duration-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Cleaning Sequence & Milestone Progress
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {WASH_STAGES.filter(s => s.id !== 'idle').map((stage, idx) => {
              const isPast = currentStageIndex > idx + 1;
              const isCurrent = activeBooking.currentStage === stage.id;
              const isUpcoming = currentStageIndex < idx + 1;

              return (
                <div
                  key={stage.id}
                  onClick={() => onSelect3DStage && onSelect3DStage(stage.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                      : isPast
                      ? 'bg-slate-950/70 border-slate-800 text-slate-300'
                      : 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono text-slate-400">Step 0{idx + 1}</span>
                    {isPast && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {isCurrent && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                  </div>

                  <div className="text-xs font-bold text-white mb-0.5 truncate">{stage.shortName}</div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{stage.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Technician Notes & Live Bay Camera Preview Banner */}
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            {activeBooking.notes ? (
              <>Technician applied special request: <strong className="text-white">{activeBooking.notes}</strong></>
            ) : (
              <>Technician: <strong>Alex R.</strong> performing contour roller inspection</>
            )}
          </span>
        </div>

        {onAdvanceStage && !isCompleted && (
          <button
            onClick={() => {
              const nextIdx = Math.min(WASH_STAGES.length - 1, currentStageIndex + 1);
              onAdvanceStage(WASH_STAGES[nextIdx].id);
            }}
            className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 self-end sm:self-auto"
          >
            <span>Simulate Next Stage</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
