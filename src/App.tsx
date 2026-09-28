/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { FilterSidebar } from './components/FilterSidebar';
import { TravelCard } from './components/TravelCard';
import { SeatSelectorModal } from './components/SeatSelectorModal';
import { CheckoutModal } from './components/CheckoutModal';
import { ETicketModal } from './components/ETicketModal';
import { ComparisonMatrix } from './components/ComparisonMatrix';
import { MyBookingsView } from './components/MyBookingsView';
import { LiveNotificationTicker } from './components/LiveNotificationTicker';
import { TravelOption, TravelMode, Seat, Booking } from './types/travel';
import { generateTravelsForRoute, POPULAR_ROUTES } from './data/travelData';
import { getStoredBookings, saveBooking, formatCurrency } from './utils/travelUtils';
import {
  Train,
  Plane,
  Bus,
  Car,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Armchair,
  SlidersHorizontal,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'search' | 'matrix' | 'bookings'>('search');
  const [currency, setCurrency] = useState<string>('USD');

  // Search parameters
  const [fromCity, setFromCity] = useState('New York');
  const [toCity, setToCity] = useState('Washington DC');
  const [departureDate, setDepartureDate] = useState('2026-10-15');
  const [returnDate, setReturnDate] = useState('');
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [passengers, setPassengers] = useState(1);
  const [selectedMode, setSelectedMode] = useState<'all' | TravelMode>('all');

  // Raw generated travel options
  const [travelOptions, setTravelOptions] = useState<TravelOption[]>(() =>
    generateTravelsForRoute('New York', 'Washington DC', '2026-10-15')
  );

  // Filters
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'duration_asc' | 'rating_desc' | 'seats_desc' | 'departure_asc'>('price_asc');
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [minRating, setMinRating] = useState<number>(0);
  const [timeSlot, setTimeSlot] = useState<string>('all');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [directOnly, setDirectOnly] = useState<boolean>(false);
  const [highAvailabilityOnly, setHighAvailabilityOnly] = useState<boolean>(false);

  // Modals state
  const [seatModalOption, setSeatModalOption] = useState<TravelOption | null>(null);
  const [checkoutData, setCheckoutData] = useState<{ option: TravelOption; selectedSeats: Seat[] } | null>(null);
  const [activeETicket, setActiveETicket] = useState<Booking | null>(null);
  const [showConfirmationToast, setShowConfirmationToast] = useState<string | null>(null);

  // Bookings list from storage
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const stored = getStoredBookings();
    if (stored.length > 0) return stored;

    // Provide one initial demo booking so the user can immediately test PNR tracking & e-tickets
    const initialDemoOptions = generateTravelsForRoute('London', 'Paris', '2026-10-12');
    const demoTrain = initialDemoOptions[0];
    const demoBooking: Booking = {
      id: 'demo-booking-1',
      pnr: 'VH-789410',
      travelOption: demoTrain,
      passengers: [
        {
          id: 'demo-pax-1',
          fullName: 'Venkat Bhavya Jami',
          age: 26,
          gender: 'female',
          idType: 'passport',
          idNumber: 'P98241088',
          seatId: 'train-demo-1',
          seatLabel: 'Coach A1 - 12A',
        },
      ],
      selectedSeatLabels: ['Coach A1 - 12A'],
      baseFare: 68,
      seatSelectionFee: 8,
      taxesAndFees: 8,
      insuranceCost: 9,
      carbonOffsetCost: 2,
      discount: 15,
      totalAmount: 80,
      currency: 'USD',
      status: 'CONFIRMED',
      bookedAt: '2026-09-27T14:20:00Z',
      travelDate: '2026-10-12',
      paymentMethod: 'card',
      transactionId: 'TXN-LONPAR-9821',
      contactEmail: 'venkatabhavyajami@gmail.com',
      contactPhone: '+1 (555) 948-2019',
    };
    saveBooking(demoBooking);
    return [demoBooking];
  });

  // Re-generate travels when fromCity, toCity, or date changes
  const executeSearch = () => {
    const list = generateTravelsForRoute(fromCity, toCity, departureDate);
    setTravelOptions(list);
  };

  const handleResetFilters = () => {
    setSortBy('price_asc');
    setMaxPrice(250);
    setMinRating(0);
    setTimeSlot('all');
    setSelectedAmenities([]);
    setDirectOnly(false);
    setHighAvailabilityOnly(false);
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  // Price ceiling calculation
  const priceCeiling = useMemo(() => {
    if (travelOptions.length === 0) return 250;
    const maxVal = Math.max(...travelOptions.map((o) => o.price));
    return Math.ceil(maxVal * 1.2);
  }, [travelOptions]);

  // Filtered and sorted travel options
  const filteredOptions = useMemo(() => {
    return travelOptions
      .filter((opt) => {
        // Mode filter
        if (selectedMode !== 'all' && opt.mode !== selectedMode) return false;
        // Price filter
        if (opt.price > maxPrice) return false;
        // Rating filter
        if (minRating > 0 && opt.rating < minRating) return false;
        // Direct routes filter
        if (directOnly && opt.routeType !== 'direct') return false;
        // High availability filter
        if (highAvailabilityOnly && opt.seatsAvailable < 10) return false;
        // Amenities filter
        if (selectedAmenities.length > 0) {
          const hasAll = selectedAmenities.every((amenity) =>
            opt.amenities.some((a) => a.toLowerCase().includes(amenity.toLowerCase()))
          );
          if (!hasAll) return false;
        }
        // Time slot filter
        if (timeSlot !== 'all') {
          const hour = parseInt(opt.departureTime.split(':')[0], 10);
          const isPM = opt.departureTime.includes('PM');
          const normalizedHour = isPM && hour !== 12 ? hour + 12 : !isPM && hour === 12 ? 0 : hour;

          if (timeSlot === 'morning' && (normalizedHour < 6 || normalizedHour >= 12)) return false;
          if (timeSlot === 'afternoon' && (normalizedHour < 12 || normalizedHour >= 18)) return false;
          if (timeSlot === 'evening' && (normalizedHour < 18 || normalizedHour >= 24)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'duration_asc') return a.durationMinutes - b.durationMinutes;
        if (sortBy === 'rating_desc') return b.rating - a.rating;
        if (sortBy === 'seats_desc') return b.seatsAvailable - a.seatsAvailable;
        if (sortBy === 'departure_asc') return a.durationMinutes - b.durationMinutes; // relative
        return 0;
      });
  }, [
    travelOptions,
    selectedMode,
    maxPrice,
    minRating,
    directOnly,
    highAvailabilityOnly,
    selectedAmenities,
    timeSlot,
    sortBy,
  ]);

  // Handle seat selection and checkout steps
  const handleOpenSeatSelector = (option: TravelOption) => {
    setSeatModalOption(option);
  };

  const handleProceedToCheckout = (selectedSeats: Seat[]) => {
    if (!seatModalOption) return;
    setCheckoutData({
      option: seatModalOption,
      selectedSeats,
    });
    setSeatModalOption(null);
  };

  const handleBookingSuccess = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setCheckoutData(null);
    setActiveETicket(newBooking);
    setShowConfirmationToast(`Booking confirmed! PNR ${newBooking.pnr} issued.`);

    // Update available seats in current view
    setTravelOptions((prev) =>
      prev.map((opt) => {
        if (opt.id === newBooking.travelOption.id) {
          return {
            ...opt,
            seatsAvailable: Math.max(0, opt.seatsAvailable - newBooking.selectedSeatLabels.length),
          };
        }
        return opt;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-sky-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currency={currency}
        setCurrency={setCurrency}
        bookingsCount={bookings.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Live Notification Bar */}
        <LiveNotificationTicker />

        {/* Confirmation Toast Notification */}
        {showConfirmationToast && (
          <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between text-xs sm:text-sm font-semibold animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-200" />
              <span>{showConfirmationToast}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowConfirmationToast(null)}
              className="text-emerald-100 hover:text-white text-xs underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* TAB 1: SEARCH & BOOK TRAVELS */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            {/* Search Box */}
            <SearchBar
              fromCity={fromCity}
              setFromCity={setFromCity}
              toCity={toCity}
              setToCity={setToCity}
              departureDate={departureDate}
              setDepartureDate={setDepartureDate}
              returnDate={returnDate}
              setReturnDate={setReturnDate}
              isRoundTrip={isRoundTrip}
              setIsRoundTrip={setIsRoundTrip}
              passengers={passengers}
              setPassengers={setPassengers}
              selectedMode={selectedMode}
              setSelectedMode={setSelectedMode}
              onSearch={executeSearch}
            />

            {/* Quick Mode Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  mode: 'train',
                  name: 'Trains',
                  icon: <Train className="w-4 h-4 text-sky-600" />,
                  count: travelOptions.filter((t) => t.mode === 'train').length,
                  bestPrice: Math.min(...travelOptions.filter((t) => t.mode === 'train').map((t) => t.price)),
                },
                {
                  mode: 'flight',
                  name: 'Flights',
                  icon: <Plane className="w-4 h-4 text-indigo-600" />,
                  count: travelOptions.filter((t) => t.mode === 'flight').length,
                  bestPrice: Math.min(...travelOptions.filter((t) => t.mode === 'flight').map((t) => t.price)),
                },
                {
                  mode: 'bus',
                  name: 'Buses',
                  icon: <Bus className="w-4 h-4 text-emerald-600" />,
                  count: travelOptions.filter((t) => t.mode === 'bus').length,
                  bestPrice: Math.min(...travelOptions.filter((t) => t.mode === 'bus').map((t) => t.price)),
                },
                {
                  mode: 'car',
                  name: 'Cabs & Cars',
                  icon: <Car className="w-4 h-4 text-amber-600" />,
                  count: travelOptions.filter((t) => t.mode === 'car').length,
                  bestPrice: Math.min(...travelOptions.filter((t) => t.mode === 'car').map((t) => t.price)),
                },
              ].map((m) => (
                <button
                  key={m.mode}
                  type="button"
                  onClick={() => setSelectedMode(selectedMode === m.mode ? 'all' : (m.mode as TravelMode))}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedMode === m.mode
                      ? 'bg-sky-50/90 border-sky-400 ring-2 ring-sky-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                      {m.icon}
                      {m.name}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {m.count} options
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    from <strong className="text-slate-900 font-extrabold">{formatCurrency(m.bestPrice, currency)}</strong>
                  </div>
                </button>
              ))}
            </div>

            {/* Results Grid with Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Sidebar Filters */}
              <div className="lg:col-span-4 xl:col-span-3">
                <FilterSidebar
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  priceCeiling={priceCeiling}
                  minRating={minRating}
                  setMinRating={setMinRating}
                  timeSlot={timeSlot}
                  setTimeSlot={setTimeSlot}
                  selectedAmenities={selectedAmenities}
                  toggleAmenity={toggleAmenity}
                  directOnly={directOnly}
                  setDirectOnly={setDirectOnly}
                  highAvailabilityOnly={highAvailabilityOnly}
                  setHighAvailabilityOnly={setHighAvailabilityOnly}
                  onReset={handleResetFilters}
                  currency={currency}
                />
              </div>

              {/* Travel Cards List */}
              <div className="lg:col-span-8 xl:col-span-9 space-y-4">
                {/* Result header info */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 shadow-2xs">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">
                      {filteredOptions.length} Travel Options Available
                    </span>{' '}
                    <span>
                      for {fromCity} → {toCity} on {departureDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Comparing:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedMode === 'all' ? 'All Transit Modes' : selectedMode.toUpperCase()}
                    </span>
                  </div>
                </div>

                {filteredOptions.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                      <Armchair className="w-7 h-7" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">
                      No travels matched your filters
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Try expanding your price range, clearing amenities filters, or switching to "All Modes".
                    </p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold transition-colors"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  filteredOptions.map((opt) => (
                    <TravelCard
                      key={opt.id}
                      option={opt}
                      currency={currency}
                      onSelectSeats={handleOpenSeatSelector}
                      passengersCount={passengers}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FARE & MODE COMPARISON MATRIX */}
        {activeTab === 'matrix' && (
          <ComparisonMatrix
            fromCity={fromCity}
            toCity={toCity}
            travels={travelOptions}
            currency={currency}
            onSelectMode={(mode) => {
              setSelectedMode(mode);
              setActiveTab('search');
            }}
          />
        )}

        {/* TAB 3: MY BOOKINGS & PNR STATUS */}
        {activeTab === 'bookings' && (
          <MyBookingsView
            bookings={bookings}
            setBookings={setBookings}
            onViewETicket={(b) => setActiveETicket(b)}
            currency={currency}
            onStartBooking={() => setActiveTab('search')}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-16 bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <span className="text-base font-bold text-white tracking-tight">
                Voyage<span className="text-sky-400">Hub</span>
              </span>
              <p className="text-slate-400 text-xs leading-relaxed">
                Direct carrier multi-modal booking platform. Real-time seats availability, pricing schedules, verified ratings, and integrated 3D Secure checkout.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
                Transit Modes
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>High-Speed Intercity Trains</li>
                <li>Domestic & Regional Flights</li>
                <li>Luxury AC Sleeper Buses</li>
                <li>Door-to-door Private Cabs & Carpools</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
                Booking Guarantees
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>Direct Official Ticket Allocation</li>
                <li>Zero Hidden Convenience Fees</li>
                <li>Instant Digital E-Ticket & QR Code</li>
                <li>100% Refund Protection with VoyageCare</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
                Supported Gateways
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                PCI-DSS Level 1 Encrypted: Visa, Mastercard, American Express, Instant UPI, Apple Pay, Google Pay, NetBanking across 50+ major banks.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-[11px]">
            <span>© 2026 VoyageHub Technologies Inc. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span aria-hidden="true">·</span>
              <span>Terms of Service</span>
              <span aria-hidden="true">·</span>
              <span>Carrier Agreements</span>
            </div>
          </div>
        </div>
      </footer>

      {/* MODAL 1: INTERACTIVE SEAT SELECTOR */}
      {seatModalOption && (
        <SeatSelectorModal
          option={seatModalOption}
          passengersCount={passengers}
          currency={currency}
          onClose={() => setSeatModalOption(null)}
          onProceedToCheckout={handleProceedToCheckout}
        />
      )}

      {/* MODAL 2: DIRECT PAYMENT & PASSENGER CHECKOUT */}
      {checkoutData && (
        <CheckoutModal
          option={checkoutData.option}
          selectedSeats={checkoutData.selectedSeats}
          currency={currency}
          onClose={() => setCheckoutData(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* MODAL 3: ELECTRONIC BOARDING PASS / TICKET VIEW */}
      {activeETicket && (
        <ETicketModal
          booking={activeETicket}
          onClose={() => setActiveETicket(null)}
        />
      )}
    </div>
  );
}
