import React, { useState } from 'react';
import {
  Train,
  Bus,
  Plane,
  Car,
  Clock,
  Star,
  Shield,
  Wifi,
  Zap,
  Coffee,
  Leaf,
  ChevronDown,
  ChevronUp,
  Armchair,
  CheckCircle2,
  Luggage,
  Sparkles,
} from 'lucide-react';
import { TravelOption } from '../types/travel';
import { formatCurrency } from '../utils/travelUtils';

interface TravelCardProps {
  option: TravelOption;
  currency: string;
  onSelectSeats: (option: TravelOption) => void;
  passengersCount: number;
}

export const TravelCard: React.FC<TravelCardProps> = ({
  option,
  currency,
  onSelectSeats,
  passengersCount,
}) => {
  const [expanded, setExpanded] = useState(false);

  const getModeIcon = () => {
    switch (option.mode) {
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

  const getModeLabel = () => {
    switch (option.mode) {
      case 'train':
        return 'Train';
      case 'flight':
        return 'Flight';
      case 'bus':
        return 'Bus';
      case 'car':
        return 'Cab / Car';
    }
  };

  const availableSeats = option.seatsAvailable;
  const isLowAvailability = availableSeats <= 5;
  const isModerateAvailability = availableSeats > 5 && availableSeats <= 15;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Top Header Row */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
            {getModeIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm sm:text-base">
                {option.operatorName}
              </span>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {option.serviceNumber}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>{getModeLabel()}</span>
              <span aria-hidden="true">·</span>
              <span className="truncate max-w-[200px] sm:max-w-none">{option.vehicleModel}</span>
            </div>
          </div>
        </div>

        {/* Rating & Eco highlight */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-1 rounded-lg border border-amber-200 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{option.rating.toFixed(1)}</span>
            <span className="text-slate-400 text-[11px] font-normal">({option.reviewCount})</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 text-[11px] font-medium">
            <Leaf className="w-3 h-3 text-emerald-600" />
            <span>{option.co2EmissionsKg} kg CO₂</span>
          </div>
        </div>
      </div>

      {/* Main Body: Times, Seat Availability, Price */}
      <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Timing and Route line */}
        <div className="md:col-span-6 flex items-center justify-between gap-2 sm:gap-4">
          {/* Departure */}
          <div className="text-left min-w-[90px]">
            <div className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {option.departureTime}
            </div>
            <div className="text-xs font-semibold text-slate-800 truncate max-w-[120px]">
              {option.fromCity}
            </div>
            <div className="text-[11px] text-slate-400 truncate max-w-[130px]">
              {option.fromStation}
            </div>
          </div>

          {/* Duration line */}
          <div className="flex-1 flex flex-col items-center px-2">
            <span className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {option.durationText}
            </span>
            <div className="w-full flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-400"></div>
              <div className="flex-1 h-[2px] bg-slate-300 relative">
                {option.routeType === 'direct' ? (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white px-1 text-[10px] font-medium text-emerald-600 uppercase">
                    Direct
                  </span>
                ) : (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white px-1 text-[10px] font-medium text-amber-600 uppercase">
                    1 Stop
                  </span>
                )}
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-slate-800"></div>
            </div>
            <span className="text-[10px] text-slate-400 mt-1">
              {option.punctualityRate}% on-time rate
            </span>
          </div>

          {/* Arrival */}
          <div className="text-right min-w-[90px]">
            <div className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {option.arrivalTime}
            </div>
            <div className="text-xs font-semibold text-slate-800 truncate max-w-[120px]">
              {option.toCity}
            </div>
            <div className="text-[11px] text-slate-400 truncate max-w-[130px]">
              {option.toStation}
            </div>
          </div>
        </div>

        {/* Seat Availability Urgency Meter */}
        <div className="md:col-span-3 border-y md:border-y-0 md:border-l border-slate-100 py-3 md:py-0 md:px-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-600 flex items-center gap-1">
              <Armchair className="w-3.5 h-3.5 text-slate-500" />
              Seat Availability
            </span>
            <span
              className={`font-bold text-xs ${
                isLowAvailability
                  ? 'text-rose-600'
                  : isModerateAvailability
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              }`}
            >
              {availableSeats} left
            </span>
          </div>

          {/* Availability Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-1.5">
            <div
              className={`h-full rounded-full transition-all ${
                isLowAvailability
                  ? 'bg-rose-500'
                  : isModerateAvailability
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, (availableSeats / option.totalSeats) * 100)}%` }}
            ></div>
          </div>

          <div className="text-[11px] text-slate-500">
            {isLowAvailability ? (
              <span className="text-rose-600 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-rose-500" /> High Demand! Book soon
              </span>
            ) : (
              <span>Instant direct seat allocation</span>
            )}
          </div>
        </div>

        {/* Price & Book Action */}
        <div className="md:col-span-3 flex md:flex-col items-center md:items-end justify-between gap-2">
          <div className="text-left md:text-right">
            <div className="flex items-baseline md:justify-end gap-1.5">
              {option.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatCurrency(option.originalPrice, currency)}
                </span>
              )}
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {formatCurrency(option.price, currency)}
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              per traveler · taxes included
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectSeats(option)}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-sky-600/20 hover:shadow-sky-600/30 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span>Select Seats</span>
          </button>
        </div>
      </div>

      {/* Amenities & Expand Footer */}
      <div className="px-4 sm:px-5 py-2.5 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-3 overflow-x-auto py-0.5">
          {option.amenities.slice(0, 4).map((amenity, idx) => (
            <span key={idx} className="flex items-center gap-1 text-[11px] text-slate-600 shrink-0">
              <CheckCircle2 className="w-3 h-3 text-sky-600 shrink-0" />
              {amenity}
            </span>
          ))}
          {option.amenities.length > 4 && (
            <span className="text-[11px] text-slate-400">+{option.amenities.length - 4} more</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-medium text-sky-700 hover:text-sky-900 flex items-center gap-1 transition-colors ml-auto"
        >
          <span>{expanded ? 'Hide Details' : 'View Schedule & Reviews'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expandable Details Drawer */}
      {expanded && (
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200/80 text-xs text-slate-700 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cancellation Policy */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Cancellation & Refunds</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {option.cancellationPolicy}
              </p>
            </div>

            {/* Baggage Policy */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                <Luggage className="w-4 h-4 text-indigo-600" />
                <span>Luggage Allowance</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {option.baggagePolicy}
              </p>
            </div>

            {/* Onboard Features */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>On-time History</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Rated {option.cleanlinessScore}/5 for cleanliness with a {option.punctualityRate}% 
                on-time departure reliability index across verified passenger logs.
              </p>
            </div>
          </div>

          {/* Passenger Reviews */}
          <div>
            <div className="font-bold text-slate-900 mb-2 flex items-center justify-between">
              <span>Verified Traveler Reviews ({option.reviews.length})</span>
              <span className="text-slate-500 font-normal text-[11px]">
                Overall {option.rating} out of 5.0
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {option.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-3 rounded-xl border border-slate-200 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-900">{rev.author}</span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{rev.rating}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-[11px] italic">"{rev.comment}"</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">{rev.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
