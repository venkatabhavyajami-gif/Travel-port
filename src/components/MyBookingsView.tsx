import React, { useState } from 'react';
import {
  Ticket,
  Search,
  Train,
  Bus,
  Plane,
  Car,
  Clock,
  Printer,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Booking } from '../types/travel';
import { formatCurrency, cancelBookingInStorage } from '../utils/travelUtils';

interface MyBookingsViewProps {
  bookings: Booking[];
  setBookings: (b: Booking[]) => void;
  onViewETicket: (booking: Booking) => void;
  currency: string;
  onStartBooking: () => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  bookings,
  setBookings,
  onViewETicket,
  currency,
  onStartBooking,
}) => {
  const [searchPnr, setSearchPnr] = useState('');
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter((b) => {
    if (!searchPnr.trim()) return true;
    const term = searchPnr.trim().toLowerCase();
    return (
      b.pnr.toLowerCase().includes(term) ||
      b.travelOption.fromCity.toLowerCase().includes(term) ||
      b.travelOption.toCity.toLowerCase().includes(term) ||
      b.passengers.some((p) => p.fullName.toLowerCase().includes(term))
    );
  });

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'train':
        return <Train className="w-5 h-5 text-sky-600" />;
      case 'flight':
        return <Plane className="w-5 h-5 text-indigo-600" />;
      case 'bus':
        return <Bus className="w-5 h-5 text-emerald-600" />;
      case 'car':
        return <Car className="w-5 h-5 text-amber-600" />;
      default:
        return <Ticket className="w-5 h-5 text-slate-600" />;
    }
  };

  const handleConfirmCancel = () => {
    if (!cancellingBooking) return;
    // Calculate refund: 90% if confirmed
    const refund = Math.round(cancellingBooking.totalAmount * 0.9);
    const updated = cancelBookingInStorage(cancellingBooking.id, refund);
    setBookings(updated);
    setCancellingBooking(null);
  };

  return (
    <div className="space-y-6">
      {/* Header and PNR Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Ticket className="w-5 h-5 text-sky-600" />
              <span>My Trips & Booking Management</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Access digital tickets, track live journey status, or manage cancellations & refunds.
            </p>
          </div>

          {/* PNR Quick Search */}
          <div className="w-full sm:w-72 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchPnr}
              onChange={(e) => setSearchPnr(e.target.value)}
              placeholder="Search PNR or Passenger..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl mx-auto flex items-center justify-center">
            <Ticket className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {searchPnr ? `No bookings found for "${searchPnr}"` : 'No Travel Bookings Yet'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Search live seats across trains, flights, buses, and cabs, and book your tickets with instant confirmation.
            </p>
          </div>
          <button
            type="button"
            onClick={onStartBooking}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
          >
            Explore & Book Travels
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const opt = b.travelOption;
            const isCancelled = b.status === 'CANCELLED';

            return (
              <div
                key={b.id}
                className={`bg-white rounded-2xl border ${
                  isCancelled ? 'border-slate-300 opacity-80' : 'border-slate-200'
                } p-5 shadow-sm space-y-4`}
              >
                {/* Top strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                      {getModeIcon(opt.mode)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {opt.operatorName}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-mono">
                          {opt.serviceNumber}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        Booked on {new Date(b.bookedAt).toLocaleDateString()} · Travel Date: {b.travelDate}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      PNR Code
                    </div>
                    <div className="text-lg font-mono font-black text-sky-700 tracking-wider">
                      {b.pnr}
                    </div>
                    <div
                      className={`text-[10px] font-bold px-2 py-0.5 rounded inline-block mt-0.5 ${
                        isCancelled
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {b.status}
                    </div>
                  </div>
                </div>

                {/* Route and Timings */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Departure ({b.travelDate})
                    </span>
                    <span className="text-base font-black text-slate-900 block mt-0.5">
                      {opt.departureTime}
                    </span>
                    <span className="font-semibold text-slate-800 block">
                      {opt.fromCity}
                    </span>
                    <span className="text-slate-400 text-[11px] block truncate">
                      {opt.fromStation}
                    </span>
                  </div>

                  <div className="text-center sm:border-x border-slate-100 px-2">
                    <span className="text-slate-500 font-medium block">
                      {opt.durationText}
                    </span>
                    <div className="flex items-center justify-center gap-1 my-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                      <div className="w-20 h-0.5 bg-slate-300"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                    </div>
                    <span className="text-emerald-600 font-semibold text-[10px]">
                      Seats: {b.selectedSeatLabels.join(', ')}
                    </span>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Arrival
                    </span>
                    <span className="text-base font-black text-slate-900 block mt-0.5">
                      {opt.arrivalTime}
                    </span>
                    <span className="font-semibold text-slate-800 block">
                      {opt.toCity}
                    </span>
                    <span className="text-slate-400 text-[11px] block truncate">
                      {opt.toStation}
                    </span>
                  </div>
                </div>

                {/* Passenger & Actions Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Travelers:</span>
                    <div className="flex items-center gap-1 font-semibold text-slate-800">
                      {b.passengers.map((p, i) => (
                        <span key={p.id}>
                          {p.fullName} ({p.seatLabel})
                          {i < b.passengers.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isCancelled && (
                      <button
                        type="button"
                        onClick={() => setCancellingBooking(b)}
                        className="px-3 py-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg font-semibold transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel Booking</span>
                      </button>
                    )}

                    {isCancelled && b.cancellationRefund && (
                      <span className="text-[11px] text-slate-500 italic">
                        Refund of {formatCurrency(b.cancellationRefund, b.currency)} processed
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => onViewETicket(b)}
                      className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View & Print E-Ticket</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Confirmation Dialog */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 text-slate-800 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">
                Cancel Booking {cancellingBooking.pnr}?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to cancel your travel from{' '}
                <strong>{cancellingBooking.travelOption.fromCity}</strong> to{' '}
                <strong>{cancellingBooking.travelOption.toCity}</strong>?
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Original Fare Paid:</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(cancellingBooking.totalAmount, cancellingBooking.currency)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Cancellation Fee (10%):</span>
                <span className="font-semibold text-rose-600">
                  -{formatCurrency(Math.round(cancellingBooking.totalAmount * 0.1), cancellingBooking.currency)}
                </span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold pt-2 border-t border-slate-200">
                <span>Instant Refund to Original Method:</span>
                <span className="text-emerald-600 text-sm font-black">
                  {formatCurrency(Math.round(cancellingBooking.totalAmount * 0.9), cancellingBooking.currency)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancellingBooking(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
