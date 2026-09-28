import React from 'react';
import {
  X,
  Printer,
  Calendar,
  CheckCircle2,
  Copy,
  Train,
  Bus,
  Plane,
  Car,
  ShieldCheck,
  Download,
  Share2,
} from 'lucide-react';
import { Booking } from '../types/travel';
import { formatCurrency } from '../utils/travelUtils';

interface ETicketModalProps {
  booking: Booking;
  onClose: () => void;
}

export const ETicketModal: React.FC<ETicketModalProps> = ({ booking, onClose }) => {
  const opt = booking.travelOption;

  const handlePrint = () => {
    window.print();
  };

  const copyPNR = () => {
    navigator.clipboard.writeText(booking.pnr);
    alert(`PNR ${booking.pnr} copied to clipboard!`);
  };

  const getModeIcon = () => {
    switch (opt.mode) {
      case 'train':
        return <Train className="w-5 h-5 text-sky-600" />;
      case 'flight':
        return <Plane className="w-5 h-5 text-indigo-600" />;
      case 'bus':
        return <Bus className="w-5 h-5 text-emerald-600" />;
      case 'car':
        return <Car className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden print:border-none print:shadow-none animate-in fade-in zoom-in-95 duration-200">
        {/* Header Actions (hidden on print) */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-base sm:text-lg">
              Official Electronic Ticket & Boarding Pass
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Container */}
        <div className="p-5 sm:p-8 space-y-6 text-slate-800 bg-white">
          {/* Top Brand & Status Strip */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                {getModeIcon()}
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-950 tracking-tight">
                  {opt.operatorName}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Service {opt.serviceNumber} · {opt.vehicleModel}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Booking Reference (PNR)
              </div>
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-xl font-mono font-black text-sky-700 tracking-wider">
                  {booking.pnr}
                </span>
                <button
                  type="button"
                  onClick={copyPNR}
                  className="text-slate-400 hover:text-slate-700 print:hidden"
                  title="Copy PNR"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded inline-block mt-0.5 border border-emerald-200">
                {booking.status} · PAID
              </div>
            </div>
          </div>

          {/* Route Matrix */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            {/* Origin */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Departing
              </span>
              <span className="text-xl font-black text-slate-900 block mt-0.5">
                {opt.departureTime}
              </span>
              <span className="text-xs font-bold text-slate-800 block">
                {opt.fromCity}
              </span>
              <span className="text-[11px] text-slate-500 block truncate">
                {opt.fromStation}
              </span>
            </div>

            {/* Middle Duration & Mode */}
            <div className="text-center flex flex-col items-center">
              <span className="text-xs font-bold text-slate-500 mb-1">
                {opt.durationText}
              </span>
              <div className="w-full flex items-center justify-center gap-1">
                <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                <div className="flex-1 h-0.5 bg-slate-300"></div>
                <div className="w-2 h-2 rounded-full bg-sky-600"></div>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold uppercase mt-1">
                Direct Scheduled Route
              </span>
              <span className="text-[10px] text-slate-400">
                Date: {booking.travelDate}
              </span>
            </div>

            {/* Destination */}
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Arriving
              </span>
              <span className="text-xl font-black text-slate-900 block mt-0.5">
                {opt.arrivalTime}
              </span>
              <span className="text-xs font-bold text-slate-800 block">
                {opt.toCity}
              </span>
              <span className="text-[11px] text-slate-500 block truncate">
                {opt.toStation}
              </span>
            </div>
          </div>

          {/* Passenger & Seat Assignment Manifest */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Passenger Manifest & Allocated Seats
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Passenger Name</th>
                    <th className="p-2.5">Age / Gender</th>
                    <th className="p-2.5">Govt ID / Passport</th>
                    <th className="p-2.5 text-right">Seat Number</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {booking.passengers.map((p, idx) => (
                    <tr key={p.id}>
                      <td className="p-2.5 font-bold text-slate-900">{p.fullName}</td>
                      <td className="p-2.5 text-slate-600">
                        {p.age} yrs · {p.gender}
                      </td>
                      <td className="p-2.5 text-slate-600 font-mono">{p.idNumber}</td>
                      <td className="p-2.5 text-right font-black text-sky-700 text-sm">
                        {p.seatLabel}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Barcode / QR Code Strip */}
          <div className="border-t-2 border-dashed border-slate-300 pt-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* High-fidelity SVG QR Code */}
              <div className="w-20 h-20 bg-slate-900 p-1.5 rounded-lg shrink-0">
                <svg className="w-full h-full text-white" viewBox="0 0 100 100" fill="currentColor">
                  <rect x="5" y="5" width="30" height="30" fill="white" />
                  <rect x="10" y="10" width="20" height="20" fill="#0f172a" />
                  <rect x="15" y="15" width="10" height="10" fill="white" />

                  <rect x="65" y="5" width="30" height="30" fill="white" />
                  <rect x="70" y="10" width="20" height="20" fill="#0f172a" />
                  <rect x="75" y="15" width="10" height="10" fill="white" />

                  <rect x="5" y="65" width="30" height="30" fill="white" />
                  <rect x="10" y="70" width="20" height="20" fill="#0f172a" />
                  <rect x="15" y="75" width="10" height="10" fill="white" />

                  <rect x="45" y="10" width="10" height="25" fill="white" />
                  <rect x="40" y="45" width="20" height="10" fill="white" />
                  <rect x="70" y="55" width="15" height="15" fill="white" />
                  <rect x="45" y="70" width="15" height="20" fill="white" />
                </svg>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                  Scan at Gate / Conductor
                </span>
                <span className="text-xs font-mono font-bold text-slate-800 block">
                  TXN: {booking.transactionId}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Issued to: {booking.contactEmail} · {booking.contactPhone}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Total Paid
              </span>
              <span className="text-xl font-black text-slate-900">
                {formatCurrency(booking.totalAmount, booking.currency)}
              </span>
              <span className="text-[10px] text-slate-400 block">
                Method: {booking.paymentMethod.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Important Traveler Notice */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 leading-relaxed">
            <strong>Boarding Notice:</strong> Please present this e-ticket along with a valid government photo ID during boarding. Please arrive at the platform/gate at least 20 minutes prior to departure.
          </div>
        </div>

        {/* Modal Footer (hidden on print) */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between print:hidden">
          <div className="text-xs text-slate-500">
            A confirmation copy has been sent to <strong>{booking.contactEmail}</strong>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
