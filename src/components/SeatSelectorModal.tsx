import React, { useState } from 'react';
import { X, Armchair, Shield, Check, Info, Train, Bus, Plane, Car } from 'lucide-react';
import { TravelOption, Seat, TravelMode } from '../types/travel';
import { formatCurrency } from '../utils/travelUtils';

interface SeatSelectorModalProps {
  option: TravelOption;
  passengersCount: number;
  currency: string;
  onClose: () => void;
  onProceedToCheckout: (selectedSeats: Seat[]) => void;
}

export const SeatSelectorModal: React.FC<SeatSelectorModalProps> = ({
  option,
  passengersCount,
  currency,
  onClose,
  onProceedToCheckout,
}) => {
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [activeDeck, setActiveDeck] = useState<'lower' | 'upper'>('lower');

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked') return;

    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds(selectedSeatIds.filter((id) => id !== seat.id));
    } else {
      if (selectedSeatIds.length < passengersCount) {
        setSelectedSeatIds([...selectedSeatIds, seat.id]);
      } else {
        // Replace the oldest selected seat if at max
        setSelectedSeatIds([...selectedSeatIds.slice(1), seat.id]);
      }
    }
  };

  const selectedSeats = option.seats.filter((s) => selectedSeatIds.includes(s.id));
  const seatSelectionExtraTotal = selectedSeats.reduce((acc, s) => acc + s.priceDelta, 0);
  const baseTotal = option.price * passengersCount;
  const grandTotal = baseTotal + seatSelectionExtraTotal;

  const isSelectionComplete = selectedSeats.length === passengersCount;

  // Render Seat representation
  const renderSeatButton = (seat: Seat) => {
    const isSelected = selectedSeatIds.includes(seat.id);
    const isBooked = seat.status === 'booked';

    let btnColor = 'bg-white border-slate-300 text-slate-800 hover:border-sky-500 hover:bg-sky-50';
    if (isBooked) {
      btnColor = 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed';
    } else if (isSelected) {
      btnColor = 'bg-sky-600 border-sky-600 text-white font-bold shadow-md shadow-sky-600/30';
    } else if (seat.priceDelta > 0) {
      btnColor = 'bg-amber-50/60 border-amber-300 text-amber-900 hover:bg-amber-100';
    }

    return (
      <button
        key={seat.id}
        type="button"
        disabled={isBooked}
        onClick={() => handleSeatClick(seat)}
        className={`w-10 h-10 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center relative transition-all duration-150 ${btnColor}`}
        title={`${seat.label} - ${seat.tier.toUpperCase()} ${seat.priceDelta > 0 ? `(+${formatCurrency(seat.priceDelta, currency)})` : ''} [${seat.type}]`}
      >
        <span className="text-[11px] leading-tight">{seat.label}</span>
        {seat.priceDelta > 0 && !isSelected && !isBooked && (
          <span className="text-[8px] text-amber-700 font-normal">
            +{formatCurrency(seat.priceDelta, currency)}
          </span>
        )}
        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
      </button>
    );
  };

  // 1. Flight Fuselage Grid
  const renderFlightLayout = () => {
    // Group seats by row
    const rowMap = new Map<number, Seat[]>();
    option.seats.forEach((seat) => {
      const r = seat.row;
      if (!rowMap.has(r)) rowMap.set(r, []);
      rowMap.get(r)!.push(seat);
    });

    const rows = Array.from(rowMap.keys()).sort((a, b) => a - b);

    return (
      <div className="flex flex-col items-center max-w-sm mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-inner">
        {/* Cockpit / Front */}
        <div className="w-32 h-10 bg-slate-200 rounded-t-full mb-4 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-300">
          Cockpit / Front
        </div>

        {/* Column Headers */}
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-400">
          <div className="flex gap-1.5 w-[130px] justify-between px-1">
            <span>A</span>
            <span>B</span>
            <span>C</span>
          </div>
          <div className="w-6 text-center text-[10px]">Aisle</div>
          <div className="flex gap-1.5 w-[130px] justify-between px-1">
            <span>D</span>
            <span>E</span>
            <span>F</span>
          </div>
        </div>

        {/* Rows */}
        <div className="space-y-2">
          {rows.map((rowNum) => {
            const seatsInRow = rowMap.get(rowNum) || [];
            const leftSeats = seatsInRow.filter((s) => ['A', 'B', 'C'].includes(s.col));
            const rightSeats = seatsInRow.filter((s) => ['D', 'E', 'F'].includes(s.col));

            return (
              <div key={rowNum} className="flex items-center gap-2">
                {/* Left 3 (A, B, C) */}
                <div className="flex gap-1.5 w-[130px] justify-between">
                  {leftSeats.map((s) => renderSeatButton(s))}
                </div>

                {/* Row Number Marker */}
                <div className="w-6 text-center text-[11px] font-bold text-slate-400">
                  {rowNum}
                </div>

                {/* Right 3 (D, E, F) */}
                <div className="flex gap-1.5 w-[130px] justify-between">
                  {rightSeats.map((s) => renderSeatButton(s))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-[11px] text-slate-400 text-center">
          Row 1-2: Premium Front · Row 5: Emergency Exit Row (Extra Legroom)
        </div>
      </div>
    );
  };

  // 2. Train Coach Grid
  const renderTrainLayout = () => {
    const rowMap = new Map<number, Seat[]>();
    option.seats.forEach((seat) => {
      const r = seat.row;
      if (!rowMap.has(r)) rowMap.set(r, []);
      rowMap.get(r)!.push(seat);
    });

    const rows = Array.from(rowMap.keys()).sort((a, b) => a - b);

    return (
      <div className="flex flex-col items-center max-w-sm mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-5">
        <div className="w-full bg-slate-800 text-white rounded-lg py-1.5 px-3 text-xs font-bold flex items-center justify-between mb-4">
          <span className="flex items-center gap-1.5">
            <Train className="w-3.5 h-3.5 text-sky-400" /> High-Speed Coach A1
          </span>
          <span className="text-[10px] text-slate-300">Vestibule & Restroom ➔</span>
        </div>

        <div className="flex items-center gap-4 mb-2 text-xs font-bold text-slate-400">
          <div className="flex gap-2 w-[88px] justify-between">
            <span>Window</span>
            <span>Aisle</span>
          </div>
          <div className="w-6"></div>
          <div className="flex gap-2 w-[88px] justify-between">
            <span>Aisle</span>
            <span>Window</span>
          </div>
        </div>

        <div className="space-y-2">
          {rows.map((rowNum) => {
            const seatsInRow = rowMap.get(rowNum) || [];
            const left = seatsInRow.slice(0, 2);
            const right = seatsInRow.slice(2, 4);

            return (
              <div key={rowNum} className="flex items-center gap-4">
                <div className="flex gap-2 w-[88px] justify-between">
                  {left.map((s) => renderSeatButton(s))}
                </div>

                <div className="w-6 text-center text-xs font-bold text-slate-400">
                  {rowNum}
                </div>

                <div className="flex gap-2 w-[88px] justify-between">
                  {right.map((s) => renderSeatButton(s))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 3. Bus Layout
  const renderBusLayout = () => {
    const hasUpperDeck = option.seats.some((s) => s.deck === 'upper');
    const currentDeckSeats = option.seats.filter(
      (s) => !hasUpperDeck || s.deck === activeDeck
    );

    return (
      <div className="max-w-sm mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-5">
        {hasUpperDeck && (
          <div className="flex items-center justify-center gap-2 mb-4 bg-slate-200 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveDeck('lower')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeDeck === 'lower'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lower Deck (Seater & Recliner)
            </button>
            <button
              type="button"
              onClick={() => setActiveDeck('upper')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeDeck === 'upper'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upper Deck (Sleeper Pods)
            </button>
          </div>
        )}

        <div className="w-full flex items-center justify-between border-b border-slate-200 pb-2 mb-3 text-xs text-slate-500 font-semibold">
          <div className="flex items-center gap-1">
            <Bus className="w-4 h-4 text-emerald-600" />
            <span>Driver Cabin & Entry Door</span>
          </div>
          <span>Steering Wheel ✇</span>
        </div>

        <div className="grid grid-cols-3 gap-3 justify-items-center">
          {currentDeckSeats.map((seat) => (
            <div key={seat.id} className="flex flex-col items-center">
              {renderSeatButton(seat)}
              <span className="text-[10px] text-slate-400 mt-0.5">
                {seat.type === 'berth_upper' || seat.type === 'berth_lower'
                  ? 'Bed'
                  : seat.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 4. Car / Cab Layout
  const renderCarLayout = () => {
    return (
      <div className="max-w-xs mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-6 text-center">
        <div className="w-24 h-6 bg-slate-300 rounded-t-full mx-auto mb-4 text-[10px] font-bold text-slate-600 uppercase flex items-center justify-center">
          Windshield
        </div>

        {/* Row 1: Driver & Front Passenger */}
        <div className="flex items-center justify-around mb-5 pb-4 border-b border-slate-200">
          <div className="w-12 h-12 bg-slate-300 text-slate-600 rounded-xl flex flex-col items-center justify-center text-[10px] font-bold border border-slate-400">
            <span>Chauffeur</span>
            <span className="text-[8px] text-slate-500">Driver</span>
          </div>

          <div>
            {option.seats[0] && renderSeatButton(option.seats[0])}
            <span className="text-[10px] text-slate-500 mt-1 block">Front Seat</span>
          </div>
        </div>

        {/* Row 2: Rear Seats */}
        <div className="flex items-center justify-between gap-2">
          {option.seats.slice(1).map((s) => (
            <div key={s.id} className="flex flex-col items-center">
              {renderSeatButton(s)}
              <span className="text-[10px] text-slate-400 mt-1">
                {s.col === 'L' ? 'Left' : s.col === 'M' ? 'Middle' : 'Right'}
              </span>
            </div>
          ))}
        </div>

        <div className="w-32 h-8 bg-slate-200 border border-slate-300 rounded-b-xl mx-auto mt-6 text-[10px] font-bold text-slate-500 flex items-center justify-center">
          Trunk (3x Large Bags)
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg">
                Interactive Seat Selection
              </span>
              <span className="text-xs bg-slate-800 text-sky-400 px-2 py-0.5 rounded font-mono">
                {option.serviceNumber}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Select <strong className="text-white">{passengersCount}</strong> seat
              {passengersCount > 1 ? 's' : ''} for {option.fromCity} → {option.toCity}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Seat Status Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 bg-slate-50 py-2.5 px-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded border border-slate-300 bg-white"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-sky-600 text-white flex items-center justify-center font-bold text-[10px]">
                ✓
              </div>
              <span className="font-semibold text-sky-900">Your Selection</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-amber-100 border border-amber-300"></div>
              <span>Premium (+Fare)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-slate-200 border border-slate-300"></div>
              <span>Booked / Occupied</span>
            </div>
          </div>

          {/* Mode-specific Layout Rendering */}
          <div className="py-2">
            {option.mode === 'flight' && renderFlightLayout()}
            {option.mode === 'train' && renderTrainLayout()}
            {option.mode === 'bus' && renderBusLayout()}
            {option.mode === 'car' && renderCarLayout()}
          </div>
        </div>

        {/* Modal Footer / Checkout Action */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-600">Selected ({selectedSeats.length}/{passengersCount}):</span>
              {selectedSeats.length > 0 ? (
                <div className="flex items-center gap-1">
                  {selectedSeats.map((s) => (
                    <span
                      key={s.id}
                      className="bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded text-xs"
                    >
                      {s.label}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-slate-400 italic">None selected yet</span>
              )}
            </div>

            <div className="text-xs text-slate-500">
              Total Fare:{' '}
              <strong className="text-slate-900 text-base font-extrabold">
                {formatCurrency(grandTotal, currency)}
              </strong>{' '}
              {seatSelectionExtraTotal > 0 && (
                <span className="text-amber-700 font-medium">
                  (incl. {formatCurrency(seatSelectionExtraTotal, currency)} seat add-on)
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!isSelectionComplete}
              onClick={() => onProceedToCheckout(selectedSeats)}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-sky-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Proceed to Booking ({selectedSeats.length}/{passengersCount})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
