import React from 'react';
import { Compass, Train, Bus, Plane, Car, Ticket, ShieldCheck, Globe } from 'lucide-react';
import { INITIAL_CURRENCIES } from '../data/travelData';

interface NavbarProps {
  activeTab: 'search' | 'matrix' | 'bookings';
  setActiveTab: (tab: 'search' | 'matrix' | 'bookings') => void;
  currency: string;
  setCurrency: (c: string) => void;
  bookingsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  bookingsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white">
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/60">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Transit Network: 2,400+ Active Departures
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline">Instant Seat Confirmation & Bank-Grade Direct Booking</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Official Carrier Verified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-slate-800 text-slate-200 rounded px-1.5 py-0.5 text-xs border border-slate-700 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              {Object.keys(INITIAL_CURRENCIES).map((code) => (
                <option key={code} value={code}>
                  {code} ({INITIAL_CURRENCIES[code].symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => setActiveTab('search')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:shadow-sky-500/40 transition-all">
            <Compass className="w-6 h-6 animate-[spin_20s_linear_infinite]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors">
                Voyage<span className="text-sky-400">Hub</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Multi-Modal Travel & Live Seat Availability
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Functional interactive button controls) */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'search'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>Search & Book</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'matrix'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>Fare & Mode Comparison</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-2 relative ${
              activeTab === 'bookings'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>My Bookings</span>
            {bookingsCount > 0 && (
              <span className="ml-1 bg-amber-500 text-slate-950 font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {bookingsCount}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Mode Quick Indicator Strip */}
      <div className="bg-slate-950/60 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 py-1.5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-4 scrollbar-none">
          <div className="flex items-center gap-5 shrink-0">
            <span className="text-slate-500 uppercase tracking-wider text-[10px] font-semibold">Supported Modes:</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Train className="w-3.5 h-3.5 text-sky-400" /> High-Speed Trains
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Plane className="w-3.5 h-3.5 text-indigo-400" /> Domestic & Int'l Flights
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Bus className="w-3.5 h-3.5 text-emerald-400" /> Intercity Buses & Sleepers
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Car className="w-3.5 h-3.5 text-amber-400" /> Door-to-Door Cabs & Carpools
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-slate-400 text-[11px] shrink-0">
            <span>Direct Carrier API</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Seat Matrices</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">Instant PNR Generation</span>
          </div>
        </div>
      </div>
    </header>
  );
};
