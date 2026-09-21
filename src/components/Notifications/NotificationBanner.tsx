import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Sparkles, 
  X, 
  Droplets,
  Award
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: 'status_update' | 'completion' | 'message';
  timestamp: string;
}

export interface NotificationBannerProps {
  notifications: InAppNotification[];
  onDismiss: (id: string) => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  notifications,
  onDismiss
}) => {
  if (notifications.length === 0) return null;

  return (
    <div id="push-notification-container" className="fixed bottom-20 sm:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="bg-slate-900/95 border-2 border-cyan-500/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-white pointer-events-auto animate-in slide-in-from-bottom-5 duration-300 flex items-start gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            {n.type === 'completion' ? (
              <Award className="w-5 h-5 text-emerald-400" />
            ) : (
              <Droplets className="w-5 h-5" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <h5 className="text-xs font-bold text-white truncate">{n.title}</h5>
              <span className="text-[10px] text-slate-400">{n.timestamp}</span>
            </div>
            <p className="text-xs text-slate-300 leading-snug">{n.message}</p>
          </div>

          <button
            onClick={() => onDismiss(n.id)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

// Helper to trigger system browser push notification
export async function triggerSystemPushNotification(title: string, body: string) {
  soundManager.playNotificationChime();

  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico'
        });
      } catch {
        // Fallback to in-app toast
      }
    } else if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification(title, {
            body,
            icon: '/favicon.ico'
          });
        }
      } catch {
        // Ignore
      }
    }
  }
}
