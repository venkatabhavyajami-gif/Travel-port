import React from 'react';
import {
  Train,
  Bus,
  Plane,
  Car,
  Clock,
  DollarSign,
  Star,
  Leaf,
  Armchair,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { TravelOption, TravelMode } from '../types/travel';
import { formatCurrency } from '../utils/travelUtils';

interface ComparisonMatrixProps {
  fromCity: string;
  toCity: string;
  travels: TravelOption[];
  currency: string;
  onSelectMode: (mode: TravelMode) => void;
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({
  fromCity,
  toCity,
  travels,
  currency,
  onSelectMode,
}) => {
  // Aggregate metrics per mode
  const modes: TravelMode[] = ['train', 'flight', 'bus', 'car'];

  const modeData = modes.map((mode) => {
    const list = travels.filter((t) => t.mode === mode);
    if (list.length === 0) {
      return {
        mode,
        count: 0,
        minPrice: 0,
        maxPrice: 0,
        minDuration: 'N/A',
        totalSeats: 0,
        avgRating: 0,
        co2: 0,
        available: false,
      };
    }

    const prices = list.map((t) => t.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const totalSeats = list.reduce((acc, t) => acc + t.seatsAvailable, 0);
    const avgRating = (
      list.reduce((acc, t) => acc + t.rating, 0) / list.length
    ).toFixed(1);
    const minDurationObj = list.reduce((prev, curr) =>
      prev.durationMinutes < curr.durationMinutes ? prev : curr
    );

    return {
      mode,
      count: list.length,
      minPrice,
      maxPrice,
      minDuration: minDurationObj.durationText,
      totalSeats,
      avgRating: Number(avgRating),
      co2: minDurationObj.co2EmissionsKg,
      available: true,
    };
  });

  const getModeTitle = (mode: TravelMode) => {
    switch (mode) {
      case 'train':
        return 'High-Speed Train';
      case 'flight':
        return 'Commercial Flight';
      case 'bus':
        return 'Intercity Sleeper Bus';
      case 'car':
        return 'Intercity Cab / Carpool';
    }
  };

  const getModeIcon = (mode: TravelMode) => {
    switch (mode) {
      case 'train':
        return <Train className="w-6 h-6 text-sky-600" />;
      case 'flight':
        return <Plane className="w-6 h-6 text-indigo-600" />;
      case 'bus':
        return <Bus className="w-6 h-6 text-emerald-600" />;
      case 'car':
        return <Car className="w-6 h-6 text-amber-600" />;
    }
  };

  const getBestForKicker = (mode: TravelMode) => {
    switch (mode) {
      case 'train':
        return 'Best Overall Value & Comfort';
      case 'flight':
        return 'Fastest Travel Time';
      case 'bus':
        return 'Lowest Fare Guaranteed';
      case 'car':
        return 'Door-to-Door Private Privacy';
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white border border-slate-700/80 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              Side-by-Side Multi-Modal Analysis
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Compare All Travel Options: {fromCity} → {toCity}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Evaluate real-time seat availability, price ranges, transit times, passenger ratings, and carbon impact.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {modeData.map((item) => (
          <div
            key={item.mode}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                  {getModeIcon(item.mode)}
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Departures
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {item.count} scheduled
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-bold text-sky-700 mb-0.5">
                {getBestForKicker(item.mode)}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-4">
                {getModeTitle(item.mode)}
              </h3>

              {/* Specs List */}
              <div className="space-y-3 text-xs border-t border-slate-100 pt-3">
                {/* Price */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    Starting Price
                  </span>
                  <span className="font-black text-slate-900 text-sm">
                    {formatCurrency(item.minPrice, currency)}
                  </span>
                </div>

                {/* Duration */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Fastest Time
                  </span>
                  <span className="font-bold text-slate-800">
                    {item.minDuration}
                  </span>
                </div>

                {/* Available Seats */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Armchair className="w-3.5 h-3.5 text-slate-400" />
                    Seats Available
                  </span>
                  <span className="font-bold text-emerald-600">
                    {item.totalSeats} seats open
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    Avg Rating
                  </span>
                  <span className="font-bold text-slate-800">
                    {item.avgRating} / 5.0
                  </span>
                </div>

                {/* Eco footprint */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    CO₂ Emissions
                  </span>
                  <span className="font-semibold text-slate-700">
                    {item.co2} kg / pax
                  </span>
                </div>
              </div>
            </div>

            {/* Filter Action */}
            <button
              type="button"
              onClick={() => onSelectMode(item.mode)}
              className="mt-5 w-full py-2 px-3 bg-slate-900 hover:bg-sky-600 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Explore {item.count} {getModeTitle(item.mode)}s</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Decision Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            Detailed Decision Matrix
          </h3>
          <p className="text-xs text-slate-500">
            Compare key travel logistics at a glance before confirming your booking.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Feature</th>
                <th className="p-3">🚆 High-Speed Train</th>
                <th className="p-3">✈️ Commercial Flight</th>
                <th className="p-3">🚌 Intercity Bus</th>
                <th className="p-3">🚗 Private / Shared Cab</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="p-3 font-semibold text-slate-900">Boarding Hassle</td>
                <td className="p-3 text-emerald-600 font-medium">Walk-on 5m prior</td>
                <td className="p-3 text-amber-600 font-medium">TSA Airport Security 2h</td>
                <td className="p-3 text-emerald-600 font-medium">Quick 10m depot boarding</td>
                <td className="p-3 text-emerald-600 font-medium">Direct doorstep pickup</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">Luggage Allowance</td>
                <td className="p-3">Unlimited free bags</td>
                <td className="p-3">1 carry-on (extra for checked)</td>
                <td className="p-3">1 trunk bag + 1 cabin</td>
                <td className="p-3">Full car boot (3 bags)</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">WiFi & Work</td>
                <td className="p-3 text-emerald-600 font-medium">Continuous 5G WiFi + Table</td>
                <td className="p-3">Limited or paid WiFi</td>
                <td className="p-3">Standard 4G WiFi</td>
                <td className="p-3">Personal hotspot / mobile</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">Punctuality</td>
                <td className="p-3 font-bold text-slate-900">97% on-time</td>
                <td className="p-3 font-bold text-slate-900">91% (weather sensitive)</td>
                <td className="p-3 font-bold text-slate-900">88% (traffic dependent)</td>
                <td className="p-3 font-bold text-slate-900">99% flexible schedule</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">Direct Payment</td>
                <td className="p-3 text-emerald-600 font-bold">Instant Gate E-Ticket</td>
                <td className="p-3 text-emerald-600 font-bold">Instant Boarding Pass</td>
                <td className="p-3 text-emerald-600 font-bold">Instant Mobile Ticket</td>
                <td className="p-3 text-emerald-600 font-bold">Driver Dispatched Confirmation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
