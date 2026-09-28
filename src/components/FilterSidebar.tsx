import React from 'react';
import { Filter, SlidersHorizontal, RotateCcw, Star, Clock, Zap, Check } from 'lucide-react';
import { TravelMode } from '../types/travel';
import { formatCurrency } from '../utils/travelUtils';

interface FilterSidebarProps {
  sortBy: string;
  setSortBy: (sort: any) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  priceCeiling: number;
  minRating: number;
  setMinRating: (rating: number) => void;
  timeSlot: string;
  setTimeSlot: (slot: any) => void;
  selectedAmenities: string[];
  toggleAmenity: (amenity: string) => void;
  directOnly: boolean;
  setDirectOnly: (direct: boolean) => void;
  highAvailabilityOnly: boolean;
  setHighAvailabilityOnly: (val: boolean) => void;
  onReset: () => void;
  currency: string;
}

const COMMON_AMENITIES = [
  'WiFi',
  'Power Outlets',
  'Cafe Bar & Meals',
  'Air Conditioning',
  'Extra Legroom',
  'Sleeper Pods',
  'Door-to-door Pickup',
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  sortBy,
  setSortBy,
  maxPrice,
  setMaxPrice,
  priceCeiling,
  minRating,
  setMinRating,
  timeSlot,
  setTimeSlot,
  selectedAmenities,
  toggleAmenity,
  directOnly,
  setDirectOnly,
  highAvailabilityOnly,
  setHighAvailabilityOnly,
  onReset,
  currency,
}) => {
  return (
    <aside className="bg-white rounded-2xl border border-slate-200 p-5 space-y-6 text-slate-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
          <SlidersHorizontal className="w-4 h-4 text-sky-600" />
          <span>Filters & Sorting</span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-sky-600 hover:text-sky-800 flex items-center gap-1 font-medium transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500"
        >
          <option value="price_asc">Price: Lowest first</option>
          <option value="duration_asc">Duration: Fastest first</option>
          <option value="rating_desc">Customer Rating: Highest</option>
          <option value="seats_desc">Seat Availability: Most seats</option>
          <option value="departure_asc">Departure: Earliest first</option>
        </select>
      </div>

      {/* Max Price Slider */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
          <span className="uppercase tracking-wider text-slate-500">Max Price</span>
          <span className="text-sky-700 text-sm font-extrabold">
            {formatCurrency(maxPrice, currency)}
          </span>
        </div>
        <input
          type="range"
          min="20"
          max={priceCeiling}
          step="5"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>{formatCurrency(20, currency)}</span>
          <span>{formatCurrency(priceCeiling, currency)}</span>
        </div>
      </div>

      {/* Departure Time Slots */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Departure Time
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { id: 'all', label: 'All Day' },
            { id: 'morning', label: 'Morning (06:00 - 12:00)' },
            { id: 'afternoon', label: 'Afternoon (12:00 - 18:00)' },
            { id: 'evening', label: 'Evening (18:00 - 24:00)' },
          ].map((slot) => (
            <button
              key={slot.id}
              type="button"
              onClick={() => setTimeSlot(slot.id)}
              className={`p-2 rounded-xl text-left border transition-all text-[11px] font-medium ${
                timeSlot === slot.id
                  ? 'border-sky-500 bg-sky-50 text-sky-900 font-semibold'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {slot.label}
            </button>
          ))}
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Minimum Rating
        </label>
        <div className="flex items-center gap-1.5">
          {[
            { val: 0, label: 'Any' },
            { val: 4.0, label: '4.0★+' },
            { val: 4.5, label: '4.5★+' },
            { val: 4.8, label: '4.8★+' },
          ].map((r) => (
            <button
              key={r.val}
              type="button"
              onClick={() => setMinRating(r.val)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                minRating === r.val
                  ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Toggles */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">
            Direct Routes Only
          </span>
          <input
            type="checkbox"
            checked={directOnly}
            onChange={(e) => setDirectOnly(e.target.checked)}
            className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer group">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">
              High Availability Only
            </span>
            <span className="text-[10px] text-slate-400">&gt; 10 seats guaranteed</span>
          </div>
          <input
            type="checkbox"
            checked={highAvailabilityOnly}
            onChange={(e) => setHighAvailabilityOnly(e.target.checked)}
            className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
          />
        </label>
      </div>

      {/* Amenities checklist */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Amenities
        </label>
        <div className="space-y-1.5">
          {COMMON_AMENITIES.map((amenity) => {
            const isSelected = selectedAmenities.includes(amenity);
            return (
              <label
                key={amenity}
                className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 hover:text-slate-900 select-none"
              >
                <div
                  onClick={() => toggleAmenity(amenity)}
                  className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                    isSelected
                      ? 'bg-sky-600 border-sky-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span onClick={() => toggleAmenity(amenity)}>{amenity}</span>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
