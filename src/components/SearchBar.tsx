import React, { useState } from 'react';
import { ArrowRightLeft, Calendar, MapPin, Users, Train, Bus, Plane, Car, Search, Sparkles } from 'lucide-react';
import { TravelMode } from '../types/travel';
import { POPULAR_CITIES, POPULAR_ROUTES } from '../data/travelData';

interface SearchBarProps {
  fromCity: string;
  setFromCity: (city: string) => void;
  toCity: string;
  setToCity: (city: string) => void;
  departureDate: string;
  setDepartureDate: (date: string) => void;
  returnDate: string;
  setReturnDate: (date: string) => void;
  isRoundTrip: boolean;
  setIsRoundTrip: (round: boolean) => void;
  passengers: number;
  setPassengers: (count: number) => void;
  selectedMode: 'all' | TravelMode;
  setSelectedMode: (mode: 'all' | TravelMode) => void;
  onSearch: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  fromCity,
  setFromCity,
  toCity,
  setToCity,
  departureDate,
  setDepartureDate,
  returnDate,
  setReturnDate,
  isRoundTrip,
  setIsRoundTrip,
  passengers,
  setPassengers,
  selectedMode,
  setSelectedMode,
  onSearch,
}) => {
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [showPaxDropdown, setShowPaxDropdown] = useState(false);

  const swapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handleSelectRoute = (from: string, to: string) => {
    setFromCity(from);
    setToCity(to);
    onSearch();
  };

  const filteredFromCities = POPULAR_CITIES.filter((c) =>
    c.name.toLowerCase().includes(fromCity.toLowerCase())
  );

  const filteredToCities = POPULAR_CITIES.filter((c) =>
    c.name.toLowerCase().includes(toCity.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 p-4 sm:p-6 text-slate-800">
      {/* Travel Mode Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setSelectedMode('all')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
              selectedMode === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <span>All Modes</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMode('train')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
              selectedMode === 'train'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Train className="w-4 h-4 text-sky-600" />
            <span>Trains</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMode('flight')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
              selectedMode === 'flight'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Plane className="w-4 h-4 text-indigo-600" />
            <span>Flights</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMode('bus')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
              selectedMode === 'bus'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Bus className="w-4 h-4 text-emerald-600" />
            <span>Buses</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMode('car')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
              selectedMode === 'car'
                ? 'bg-white text-amber-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Car className="w-4 h-4 text-amber-600" />
            <span>Cabs & Cars</span>
          </button>
        </div>

        {/* Trip Type Toggle */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
            <input
              type="radio"
              name="tripType"
              checked={!isRoundTrip}
              onChange={() => setIsRoundTrip(false)}
              className="text-sky-600 focus:ring-sky-500 w-3.5 h-3.5"
            />
            <span>One Way</span>
          </label>
          <span className="text-slate-300">|</span>
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
            <input
              type="radio"
              name="tripType"
              checked={isRoundTrip}
              onChange={() => setIsRoundTrip(true)}
              className="text-sky-600 focus:ring-sky-500 w-3.5 h-3.5"
            />
            <span>Round Trip</span>
          </label>
        </div>
      </div>

      {/* Main Form Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Origin */}
        <div className="md:col-span-3 relative">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Leaving From
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4 text-sky-600" />
            </div>
            <input
              type="text"
              value={fromCity}
              onChange={(e) => {
                setFromCity(e.target.value);
                setShowFromDropdown(true);
              }}
              onFocus={() => setShowFromDropdown(true)}
              placeholder="Origin city (e.g. New York)"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
            />
          </div>

          {/* Autocomplete dropdown */}
          {showFromDropdown && (
            <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-56 overflow-y-auto">
              <div className="p-1">
                {filteredFromCities.length > 0 ? (
                  filteredFromCities.map((city) => (
                    <button
                      key={city.name}
                      type="button"
                      onClick={() => {
                        setFromCity(city.name);
                        setShowFromDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-sky-50 rounded-lg flex items-center justify-between transition-colors"
                    >
                      <span className="font-semibold text-slate-800">{city.name}</span>
                      <span className="text-slate-400 text-[11px]">
                        {city.code} · {city.country}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-xs text-slate-400">Press enter to search "{fromCity}"</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Swap Button */}
        <div className="md:col-span-1 flex justify-center -my-2 md:my-0">
          <button
            type="button"
            onClick={swapCities}
            title="Swap Origin and Destination"
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-sky-100 border border-slate-200 hover:border-sky-300 text-slate-600 hover:text-sky-600 flex items-center justify-center transition-all duration-200 shadow-sm"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Destination */}
        <div className="md:col-span-3 relative">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Going To
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>
            <input
              type="text"
              value={toCity}
              onChange={(e) => {
                setToCity(e.target.value);
                setShowToDropdown(true);
              }}
              onFocus={() => setShowToDropdown(true)}
              placeholder="Destination (e.g. Washington DC)"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
            />
          </div>

          {/* Autocomplete dropdown */}
          {showToDropdown && (
            <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-56 overflow-y-auto">
              <div className="p-1">
                {filteredToCities.length > 0 ? (
                  filteredToCities.map((city) => (
                    <button
                      key={city.name}
                      type="button"
                      onClick={() => {
                        setToCity(city.name);
                        setShowToDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 rounded-lg flex items-center justify-between transition-colors"
                    >
                      <span className="font-semibold text-slate-800">{city.name}</span>
                      <span className="text-slate-400 text-[11px]">
                        {city.code} · {city.country}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-xs text-slate-400">Press enter to search "{toCity}"</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Departure & Return Dates */}
        <div className={isRoundTrip ? "md:col-span-2 relative" : "md:col-span-2 relative"}>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Travel Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Calendar className="w-4 h-4 text-slate-500" />
            </div>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full pl-9 pr-2 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
            />
          </div>
        </div>

        {/* Passengers & Search Button */}
        <div className="md:col-span-3 flex items-end gap-2">
          {/* Passenger dropdown */}
          <div className="flex-1 relative">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Travelers
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPaxDropdown(!showPaxDropdown)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 text-left flex items-center justify-between hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>
                    {passengers} {passengers === 1 ? 'Adult' : 'Travelers'}
                  </span>
                </div>
              </button>

              {showPaxDropdown && (
                <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg p-3">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-semibold text-slate-700">Total Passengers</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={passengers <= 1}
                        onClick={() => setPassengers(Math.max(1, passengers - 1))}
                        className="w-7 h-7 rounded-lg border border-slate-300 flex items-center justify-center font-bold text-slate-600 disabled:opacity-40 hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-bold text-slate-900">{passengers}</span>
                      <button
                        type="button"
                        disabled={passengers >= 6}
                        onClick={() => setPassengers(Math.min(6, passengers + 1))}
                        className="w-7 h-7 rounded-lg border border-slate-300 flex items-center justify-center font-bold text-slate-600 disabled:opacity-40 hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPaxDropdown(false)}
                    className="w-full py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Search Button */}
          <button
            type="button"
            onClick={onSearch}
            className="flex-1 py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm rounded-xl shadow-md shadow-sky-600/20 hover:shadow-sky-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer h-[42px]"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Popular Route Shortcuts */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
        <span className="flex items-center gap-1 text-slate-400 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Popular Routes:
        </span>
        {POPULAR_ROUTES.map((route) => (
          <button
            key={`${route.from}-${route.to}`}
            type="button"
            onClick={() => handleSelectRoute(route.from, route.to)}
            className="text-slate-600 hover:text-sky-700 hover:bg-sky-50 px-2.5 py-1 rounded-md transition-colors text-[11px] font-medium"
          >
            {route.from} → {route.to}
          </button>
        ))}
      </div>
    </div>
  );
};
