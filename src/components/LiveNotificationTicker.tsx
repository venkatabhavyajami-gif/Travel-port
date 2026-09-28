import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Users, Armchair } from 'lucide-react';

const LIVE_NOTIFICATIONS = [
  '⚡ High demand: 2 seats just booked on High-Speed Train EXP-8419 (New York → Washington DC)',
  '✈️ Fare Alert: SkyWings Direct Flight SW-4190 has 4 window seats remaining today',
  '🚌 Student special applied: 15% discount active on FlixPrime Royal Sleeper buses',
  '🚗 Instant Pickup: Intercity Tesla Model Y cab confirmed for traveler in London',
  '🟢 Real-time Network Status: All 2,400+ rail, flight, bus, and road routes operating on-time',
];

export const LiveNotificationTicker: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % LIVE_NOTIFICATIONS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-sky-50/90 border border-sky-200/80 rounded-xl px-4 py-2 flex items-center justify-between text-xs text-sky-900 shadow-2xs">
      <div className="flex items-center gap-2 overflow-hidden">
        <span className="flex h-2 w-2 relative shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-600"></span>
        </span>
        <span className="font-bold text-[11px] uppercase tracking-wider text-sky-800 shrink-0">
          Live Transit Pulse:
        </span>
        <span className="font-medium truncate transition-all duration-300">
          {LIVE_NOTIFICATIONS[index]}
        </span>
      </div>

      <div className="hidden md:flex items-center gap-2 text-[11px] text-sky-700 shrink-0 font-medium">
        <Users className="w-3.5 h-3.5 text-sky-600" />
        <span>1,840 travelers browsing live seats right now</span>
      </div>
    </div>
  );
};
