export type TravelMode = 'flight' | 'train' | 'bus' | 'car';

export type SeatStatus = 'available' | 'booked' | 'selected' | 'ladies';
export type SeatType = 'window' | 'aisle' | 'middle' | 'berth_lower' | 'berth_upper' | 'side_lower' | 'side_upper' | 'driver' | 'standard';

export interface Seat {
  id: string;
  label: string; // e.g., "12A", "B3-14", "U-4"
  row: number;
  col: string;
  deck?: 'lower' | 'upper';
  tier: 'economy' | 'premium' | 'business' | 'first' | 'sleeper' | 'standard';
  priceDelta: number; // extra cost or 0
  status: SeatStatus;
  type: SeatType;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface TravelOption {
  id: string;
  mode: TravelMode;
  operatorName: string;
  operatorLogo: string; // SVG or icon code
  serviceNumber: string; // e.g. "DL-1048", "TR-8422", "FLX-301", "UBR-CITY"
  vehicleModel: string; // e.g. "Airbus A321neo", "Siemens Velaro High-Speed", "Volvo 9900 Luxury Sleeper", "Toyota Camry Hybrid / Tesla Model 3"
  fromCity: string;
  fromStation: string;
  toCity: string;
  toStation: string;
  departureTime: string; // e.g. "08:30 AM"
  arrivalTime: string;   // e.g. "11:45 AM"
  departureDate: string;
  durationMinutes: number;
  durationText: string;
  routeType: 'direct' | '1-stop';
  stopStation?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  seatsAvailable: number;
  totalSeats: number;
  rating: number;
  reviewCount: number;
  punctualityRate: number; // percentage e.g. 96%
  cleanlinessScore: number; // out of 5
  co2EmissionsKg: number; // for eco comparison
  amenities: string[];
  tags: string[];
  cancellationPolicy: string;
  baggagePolicy: string;
  seats: Seat[];
  reviews: Review[];
}

export interface Passenger {
  id: string;
  fullName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  idType: 'passport' | 'driving_license' | 'national_id' | 'student_id';
  idNumber: string;
  seatId?: string;
  seatLabel?: string;
}

export interface Booking {
  id: string;
  pnr: string;
  travelOption: TravelOption;
  passengers: Passenger[];
  selectedSeatLabels: string[];
  baseFare: number;
  seatSelectionFee: number;
  taxesAndFees: number;
  insuranceCost: number;
  carbonOffsetCost: number;
  discount: number;
  totalAmount: number;
  currency: string;
  status: 'CONFIRMED' | 'CANCELLED';
  bookedAt: string;
  travelDate: string;
  paymentMethod: 'card' | 'upi' | 'netbanking' | 'wallet';
  transactionId: string;
  contactEmail: string;
  contactPhone: string;
  cancellationRefund?: number;
  cancelledAt?: string;
}

export interface SearchFilterState {
  fromCity: string;
  toCity: string;
  departureDate: string;
  returnDate?: string;
  isRoundTrip: boolean;
  passengersCount: number;
  mode: 'all' | TravelMode;
  sortBy: 'price_asc' | 'price_desc' | 'duration_asc' | 'rating_desc' | 'seats_desc' | 'departure_asc';
  maxPrice?: number;
  minRating?: number;
  departureTimeSlot?: 'all' | 'morning' | 'afternoon' | 'evening' | 'night';
  amenities: string[];
  directOnly: boolean;
}
