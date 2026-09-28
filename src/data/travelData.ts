import { TravelOption, TravelMode, Seat } from '../types/travel';

export const POPULAR_CITIES = [
  { name: 'New York', code: 'NYC', country: 'USA' },
  { name: 'Washington DC', code: 'WAS', country: 'USA' },
  { name: 'San Francisco', code: 'SFO', country: 'USA' },
  { name: 'Los Angeles', code: 'LAX', country: 'USA' },
  { name: 'London', code: 'LON', country: 'UK' },
  { name: 'Paris', code: 'PAR', country: 'France' },
  { name: 'Tokyo', code: 'TYO', country: 'Japan' },
  { name: 'Osaka', code: 'OSA', country: 'Japan' },
  { name: 'Berlin', code: 'BER', country: 'Germany' },
  { name: 'Amsterdam', code: 'AMS', country: 'Netherlands' },
  { name: 'Mumbai', code: 'BOM', country: 'India' },
  { name: 'Goa', code: 'GOI', country: 'India' },
  { name: 'Chicago', code: 'CHI', country: 'USA' },
  { name: 'Boston', code: 'BOS', country: 'USA' },
];

export const POPULAR_ROUTES = [
  { from: 'New York', to: 'Washington DC' },
  { from: 'London', to: 'Paris' },
  { from: 'San Francisco', to: 'Los Angeles' },
  { from: 'Tokyo', to: 'Osaka' },
  { from: 'Berlin', to: 'Amsterdam' },
  { from: 'Mumbai', to: 'Goa' },
];

// Generate seats for flight: 6 seats per row (A B C _ D E F)
export function generateFlightSeats(rows = 8): Seat[] {
  const seats: Seat[] = [];
  const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
  for (let r = 1; r <= rows; r++) {
    const isExitRow = r === 5;
    const isPremium = r <= 2;
    for (const c of cols) {
      const isBooked = (r * 7 + c.charCodeAt(0)) % 4 === 0 || (r === 3 && c === 'B');
      const isWindow = c === 'A' || c === 'F';
      const isAisle = c === 'C' || c === 'D';
      seats.push({
        id: `seat-${r}${c}`,
        label: `${r}${c}`,
        row: r,
        col: c,
        tier: isPremium ? 'business' : isExitRow ? 'premium' : 'economy',
        priceDelta: isPremium ? 45 : isExitRow ? 20 : isWindow ? 10 : 0,
        status: isBooked ? 'booked' : 'available',
        type: isWindow ? 'window' : isAisle ? 'aisle' : 'middle',
      });
    }
  }
  return seats;
}

// Generate seats for train: 2x2 or cabin berths
export function generateTrainSeats(coach = 'C2', rows = 6): Seat[] {
  const seats: Seat[] = [];
  const cols = ['A', 'B', 'C', 'D'];
  for (let r = 1; r <= rows; r++) {
    for (const c of cols) {
      const isBooked = (r * 5 + c.charCodeAt(0)) % 3 === 0;
      const isWindow = c === 'A' || c === 'D';
      const isTable = r % 2 === 0;
      seats.push({
        id: `train-${coach}-${r}${c}`,
        label: `${coach}-${r}${c}`,
        row: r,
        col: c,
        tier: r <= 2 ? 'first' : 'standard',
        priceDelta: r <= 2 ? 25 : isWindow ? 8 : 0,
        status: isBooked ? 'booked' : 'available',
        type: isWindow ? 'window' : 'aisle',
      });
    }
  }
  return seats;
}

// Generate seats for bus: lower & upper deck or 2x1 sleeper
export function generateBusSeats(): Seat[] {
  const seats: Seat[] = [];
  // Lower deck: 12 seats
  for (let r = 1; r <= 5; r++) {
    ['L1', 'L2', 'L3'].forEach((c, idx) => {
      const isBooked = (r * 3 + idx) % 4 === 1;
      seats.push({
        id: `bus-lower-${r}-${c}`,
        label: `L${r}-${c}`,
        row: r,
        col: c,
        deck: 'lower',
        tier: 'sleeper',
        priceDelta: idx === 0 ? 12 : 5,
        status: isBooked ? 'booked' : 'available',
        type: idx === 0 ? 'window' : idx === 2 ? 'aisle' : 'berth_lower',
      });
    });
  }
  // Upper deck: 12 sleeper berths
  for (let r = 1; r <= 5; r++) {
    ['U1', 'U2', 'U3'].forEach((c, idx) => {
      const isBooked = (r * 4 + idx) % 5 === 0;
      seats.push({
        id: `bus-upper-${r}-${c}`,
        label: `U${r}-${c}`,
        row: r,
        col: c,
        deck: 'upper',
        tier: 'sleeper',
        priceDelta: 15,
        status: isBooked ? 'booked' : 'available',
        type: 'berth_upper',
      });
    });
  }
  return seats;
}

// Generate seats for intercity car: 4 seats (Front, Rear Left, Rear Middle, Rear Right)
export function generateCarSeats(): Seat[] {
  return [
    {
      id: 'car-front-pax',
      label: 'Front Passenger (Co-Pilot)',
      row: 1,
      col: 'F',
      tier: 'premium',
      priceDelta: 10,
      status: 'available',
      type: 'window',
    },
    {
      id: 'car-rear-left',
      label: 'Rear Left (Window)',
      row: 2,
      col: 'L',
      tier: 'standard',
      priceDelta: 5,
      status: 'available',
      type: 'window',
    },
    {
      id: 'car-rear-mid',
      label: 'Rear Middle',
      row: 2,
      col: 'M',
      tier: 'standard',
      priceDelta: 0,
      status: 'available',
      type: 'middle',
    },
    {
      id: 'car-rear-right',
      label: 'Rear Right (Window)',
      row: 2,
      col: 'R',
      tier: 'standard',
      priceDelta: 5,
      status: 'available',
      type: 'window',
    },
  ];
}

// Helper to count available seats from seats array
function countAvailableSeats(seats: Seat[]): number {
  return seats.filter((s) => s.status === 'available').length;
}

export function generateTravelsForRoute(from: string, to: string, date: string): TravelOption[] {
  const cleanFrom = from.trim() || 'New York';
  const cleanTo = to.trim() || 'Washington DC';
  const travelDate = date || '2026-10-15';

  const flightSeats1 = generateFlightSeats(8);
  const flightSeats2 = generateFlightSeats(9);
  const trainSeats1 = generateTrainSeats('Coach A1', 7);
  const trainSeats2 = generateTrainSeats('Coach B3', 8);
  const busSeats1 = generateBusSeats();
  const busSeats2 = generateBusSeats();
  const carSeats1 = generateCarSeats();
  const carSeats2 = generateCarSeats();

  const options: TravelOption[] = [
    // 1. High Speed Train
    {
      id: `train-${cleanFrom.toLowerCase()}-${cleanTo.toLowerCase()}-1`,
      mode: 'train',
      operatorName: 'Acela Express / Eurostar High-Speed',
      operatorLogo: 'Train',
      serviceNumber: 'EXP-8419',
      vehicleModel: 'Velaro E-320 Electric High-Speed (300 km/h)',
      fromCity: cleanFrom,
      fromStation: `${cleanFrom} Central Grand Station`,
      toCity: cleanTo,
      toStation: `${cleanTo} Union Terminal`,
      departureTime: '07:15 AM',
      arrivalTime: '10:30 AM',
      departureDate: travelDate,
      durationMinutes: 195,
      durationText: '3h 15m',
      routeType: 'direct',
      price: 68,
      originalPrice: 85,
      currency: 'USD',
      seatsAvailable: countAvailableSeats(trainSeats1),
      totalSeats: trainSeats1.length,
      rating: 4.8,
      reviewCount: 1420,
      punctualityRate: 97,
      cleanlinessScore: 4.9,
      co2EmissionsKg: 14,
      amenities: ['High-speed WiFi', 'Power Outlets (AC & USB)', 'Silent Coach Option', 'Cafe Bar & Meals', 'Spacious Legroom'],
      tags: ['Best Value', 'Eco Friendly', 'City Center to City Center'],
      cancellationPolicy: 'Free cancellation up to 4 hours before departure for 100% refund voucher or 90% cash.',
      baggagePolicy: '2 large suitcases + 1 personal bag included for free with no weight restrictions.',
      seats: trainSeats1,
      reviews: [
        {
          id: 'rev-1',
          author: 'Eleanor Vance',
          rating: 5,
          date: '3 days ago',
          comment: 'Spotless train, incredible city center arrival. Smooth ride with great WiFi throughout.',
          verified: true,
        },
        {
          id: 'rev-2',
          author: 'Marcus Brody',
          rating: 4.5,
          date: '1 week ago',
          comment: 'Much faster and less stressful than airport security lines. Arrived 4 minutes early.',
          verified: true,
        },
      ],
    },

    // 2. Direct Express Flight
    {
      id: `flight-${cleanFrom.toLowerCase()}-${cleanTo.toLowerCase()}-1`,
      mode: 'flight',
      operatorName: 'SkyWings Direct Shuttle',
      operatorLogo: 'Plane',
      serviceNumber: 'SW-4190',
      vehicleModel: 'Airbus A321neo Quiet Jet',
      fromCity: cleanFrom,
      fromStation: `${cleanFrom} Int'l Airport (JFK/LHR)`,
      toCity: cleanTo,
      toStation: `${cleanTo} Int'l Terminal (IAD/CDG)`,
      departureTime: '08:45 AM',
      arrivalTime: '10:05 AM',
      departureDate: travelDate,
      durationMinutes: 80,
      durationText: '1h 20m',
      routeType: 'direct',
      price: 139,
      originalPrice: 175,
      currency: 'USD',
      seatsAvailable: countAvailableSeats(flightSeats1),
      totalSeats: flightSeats1.length,
      rating: 4.6,
      reviewCount: 2890,
      punctualityRate: 91,
      cleanlinessScore: 4.7,
      co2EmissionsKg: 112,
      amenities: ['In-flight Entertainment', 'Complimentary Beverages', 'Overhead Storage', 'Mobile Check-in', 'USB Fast Charge'],
      tags: ['Fastest Option', 'Morning Departure'],
      cancellationPolicy: 'Full refund within 24 hours of booking; 80% refund up to 24h prior.',
      baggagePolicy: '1 cabin bag (8kg) included. Checked bag (23kg) available for $25.',
      seats: flightSeats1,
      reviews: [
        {
          id: 'rev-3',
          author: 'Sophia Chen',
          rating: 5,
          date: 'Yesterday',
          comment: 'Quick boarding, seats were comfortable and landed ahead of schedule. Great crew.',
          verified: true,
        },
        {
          id: 'rev-4',
          author: 'David Kim',
          rating: 4,
          date: '5 days ago',
          comment: 'Good flight, but remember to calculate transit time to airport.',
          verified: true,
        },
      ],
    },

    // 3. Luxury Intercity Bus
    {
      id: `bus-${cleanFrom.toLowerCase()}-${cleanTo.toLowerCase()}-1`,
      mode: 'bus',
      operatorName: 'FlixPrime Voyager Express',
      operatorLogo: 'Bus',
      serviceNumber: 'FP-204',
      vehicleModel: 'Volvo 9900 Multi-Axle Royal Sleeper & Recliner',
      fromCity: cleanFrom,
      fromStation: `${cleanFrom} Port Authority Bus Hub`,
      toCity: cleanTo,
      toStation: `${cleanTo} Central Metro Bus Depot`,
      departureTime: '09:00 AM',
      arrivalTime: '01:30 PM',
      departureDate: travelDate,
      durationMinutes: 270,
      durationText: '4h 30m',
      routeType: 'direct',
      price: 28,
      originalPrice: 38,
      currency: 'USD',
      seatsAvailable: countAvailableSeats(busSeats1),
      totalSeats: busSeats1.length,
      rating: 4.4,
      reviewCount: 940,
      punctualityRate: 88,
      cleanlinessScore: 4.5,
      co2EmissionsKg: 22,
      amenities: ['Panoramic Windows', 'Individual AC Vents', 'Charging Sockets', 'Free 5G WiFi', 'On-board Restroom'],
      tags: ['Cheapest', 'Student Friendly', 'Direct Highway Route'],
      cancellationPolicy: 'Free cancellation up to 6 hours before departure with 100% wallet refund.',
      baggagePolicy: '1 check-in bag under carriage (up to 20kg) + 1 backpack inside bus included free.',
      seats: busSeats1,
      reviews: [
        {
          id: 'rev-5',
          author: 'Liam Jenkins',
          rating: 4,
          date: '4 days ago',
          comment: 'Clean bus, driver was very safe and polite. Seats reclined nicely for a nap.',
          verified: true,
        },
      ],
    },

    // 4. Premium Intercity Private Car / Cab
    {
      id: `car-${cleanFrom.toLowerCase()}-${cleanTo.toLowerCase()}-1`,
      mode: 'car',
      operatorName: 'VoyageRide Premium Intercity Cab',
      operatorLogo: 'Car',
      serviceNumber: 'VR-CAB-77',
      vehicleModel: 'Tesla Model Y / Lexus ES Hybrid Sedan (4 Pax)',
      fromCity: cleanFrom,
      fromStation: 'Doorstep Pickup (Any Location)',
      toCity: cleanTo,
      toStation: 'Doorstep Drop (Any Location)',
      departureTime: 'Flexible (Choose any time)',
      arrivalTime: '3h 45m after pickup',
      departureDate: travelDate,
      durationMinutes: 225,
      durationText: '3h 45m',
      routeType: 'direct',
      price: 95,
      originalPrice: 120,
      currency: 'USD',
      seatsAvailable: countAvailableSeats(carSeats1),
      totalSeats: carSeats1.length,
      rating: 4.9,
      reviewCount: 630,
      punctualityRate: 99,
      cleanlinessScore: 5.0,
      co2EmissionsKg: 35,
      amenities: ['Door-to-door Pickup & Drop', 'Chilled Mineral Water', 'Highway Tolls Included', 'Bluetooth Music Control', 'Rest Stop Flexibility'],
      tags: ['Door to Door', 'Private Comfort', 'Flexible Timing'],
      cancellationPolicy: 'Free cancellation up to 2 hours before scheduled pickup time.',
      baggagePolicy: 'Entire vehicle trunk (up to 3 large suitcases + 2 duffels) included.',
      seats: carSeats1,
      reviews: [
        {
          id: 'rev-6',
          author: 'Elena Rostova',
          rating: 5,
          date: '2 days ago',
          comment: 'Chauffeur was 10 mins early, car was spotless with cold drinks. Pure luxury and comfort.',
          verified: true,
        },
      ],
    },

    // 5. Afternoon Train - Regional Panoramic
    {
      id: `train-${cleanFrom.toLowerCase()}-${cleanTo.toLowerCase()}-2`,
      mode: 'train',
      operatorName: 'National Rail Scenic Horizon',
      operatorLogo: 'Train',
      serviceNumber: 'NR-102',
      vehicleModel: 'Bombardier Double-Decker Regional Coach',
      fromCity: cleanFrom,
      fromStation: `${cleanFrom} South Station`,
      toCity: cleanTo,
      toStation: `${cleanTo} Central Station`,
      departureTime: '01:40 PM',
      arrivalTime: '05:10 PM',
      departureDate: travelDate,
      durationMinutes: 210,
      durationText: '3h 30m',
      routeType: 'direct',
      price: 54,
      originalPrice: 65,
      currency: 'USD',
      seatsAvailable: countAvailableSeats(trainSeats2),
      totalSeats: trainSeats2.length,
      rating: 4.7,
      reviewCount: 810,
      punctualityRate: 94,
      cleanlinessScore: 4.6,
      co2EmissionsKg: 16,
      amenities: ['Panoramic Windows', 'Quiet Zone', 'Luggage Racks', 'Bicycle Space', 'Snack Trolley'],
      tags: ['Scenic Views', 'Spacious Seats'],
      cancellationPolicy: 'Refundable with $5 admin fee up to 12 hours before trip.',
      baggagePolicy: 'Unlimited personal baggage and pushchairs included.',
      seats: trainSeats2,
      reviews: [
        {
          id: 'rev-7',
          author: 'Arjun Mehta',
          rating: 4.5,
          date: '6 days ago',
          comment: 'Lovely scenic route. Very relaxing way to travel and work on a laptop.',
          verified: true,
        },
      ],
    },

    // 6. Evening Flight - StarJet Express
    {
      id: `flight-${cleanFrom.toLowerCase()}-${cleanTo.toLowerCase()}-2`,
      mode: 'flight',
      operatorName: 'AeroConnect StarJet',
      operatorLogo: 'Plane',
      serviceNumber: 'AC-820',
      vehicleModel: 'Boeing 737 MAX-9',
      fromCity: cleanFrom,
      fromStation: `${cleanFrom} Int'l Airport`,
      toCity: cleanTo,
      toStation: `${cleanTo} Int'l Terminal`,
      departureTime: '05:30 PM',
      arrivalTime: '06:55 PM',
      departureDate: travelDate,
      durationMinutes: 85,
      durationText: '1h 25m',
      routeType: 'direct',
      price: 165,
      originalPrice: 195,
      currency: 'USD',
      seatsAvailable: countAvailableSeats(flightSeats2),
      totalSeats: flightSeats2.length,
      rating: 4.7,
      reviewCount: 3100,
      punctualityRate: 93,
      cleanlinessScore: 4.8,
      co2EmissionsKg: 118,
      amenities: ['High-speed Wi-Fi', 'Complimentary Meal', 'Extra Recline', 'Priority Boarding Option', 'Power at Every Seat'],
      tags: ['Evening Flight', 'Frequent Flyer Perks'],
      cancellationPolicy: 'Free date change up to 48 hours before departure.',
      baggagePolicy: '1 cabin bag + 1 checked bag (23kg) included in ticket.',
      seats: flightSeats2,
      reviews: [
        {
          id: 'rev-8',
          author: 'Chloe Martin',
          rating: 5,
          date: '3 days ago',
          comment: 'Smoothest evening flight ever. In-flight WiFi let me finish my workday.',
          verified: true,
        },
      ],
    },

    // 7. Night Bus - Sleeper Deluxe
    {
      id: `bus-${cleanFrom.toLowerCase()}-${cleanTo.toLowerCase()}-2`,
      mode: 'bus',
      operatorName: 'NightRider Starlight Sleeper',
      operatorLogo: 'Bus',
      serviceNumber: 'NR-88',
      vehicleModel: 'Scania Irizar i8 Premium Sleeper Pods',
      fromCity: cleanFrom,
      fromStation: `${cleanFrom} North Terminal`,
      toCity: cleanTo,
      toStation: `${cleanTo} Downtown Hub`,
      departureTime: '11:00 PM',
      arrivalTime: '04:15 AM',
      departureDate: travelDate,
      durationMinutes: 315,
      durationText: '5h 15m',
      routeType: 'direct',
      price: 35,
      originalPrice: 45,
      currency: 'USD',
      seatsAvailable: countAvailableSeats(busSeats2),
      totalSeats: busSeats2.length,
      rating: 4.5,
      reviewCount: 480,
      punctualityRate: 91,
      cleanlinessScore: 4.7,
      co2EmissionsKg: 20,
      amenities: ['Full Flat Beds', 'Privacy Curtains', 'Fresh Blanket & Pillow', 'Reading Light', 'Charging USB'],
      tags: ['Overnight Sleeper', 'Save Hotel Cost'],
      cancellationPolicy: 'Cancel up to 2 hours before trip for 85% refund.',
      baggagePolicy: '2 large suitcases in luggage bay.',
      seats: busSeats2,
      reviews: [
        {
          id: 'rev-9',
          author: 'Oliver Smith',
          rating: 4.5,
          date: '1 week ago',
          comment: 'Slept like a baby in the upper berth pod. Curtains gave great privacy.',
          verified: true,
        },
      ],
    },

    // 8. Shared Intercity Car / Van (BlaBla / Shared Ride)
    {
      id: `car-${cleanFrom.toLowerCase()}-${cleanTo.toLowerCase()}-2`,
      mode: 'car',
      operatorName: 'RideShare Intercity Pro',
      operatorLogo: 'Car',
      serviceNumber: 'RS-EXP-12',
      vehicleModel: 'Honda Odyssey / Toyota Sienna Minivan (6 Pax)',
      fromCity: cleanFrom,
      fromStation: `${cleanFrom} Downtown Pickup Point`,
      toCity: cleanTo,
      toStation: `${cleanTo} City Center Drop`,
      departureTime: '10:30 AM',
      arrivalTime: '02:45 PM',
      departureDate: travelDate,
      durationMinutes: 255,
      durationText: '4h 15m',
      routeType: '1-stop',
      stopStation: 'Rest Area & Coffee Break (20 min)',
      price: 42,
      originalPrice: 50,
      currency: 'USD',
      seatsAvailable: countAvailableSeats(carSeats2),
      totalSeats: carSeats2.length,
      rating: 4.6,
      reviewCount: 320,
      punctualityRate: 95,
      cleanlinessScore: 4.8,
      co2EmissionsKg: 28,
      amenities: ['AC Climate Control', 'Rest Stop at Highway Diner', 'Music & Conversation', 'Spacious Seating'],
      tags: ['Carpool', 'Social & Friendly', 'Budget Friendly'],
      cancellationPolicy: 'Free cancellation up to 6 hours before departure.',
      baggagePolicy: '1 medium suitcase + 1 backpack per passenger.',
      seats: carSeats2,
      reviews: [
        {
          id: 'rev-10',
          author: 'Priya Sharma',
          rating: 5,
          date: 'Yesterday',
          comment: 'Very pleasant driver, clean vehicle, and the coffee stop was right on time.',
          verified: true,
        },
      ],
    },
  ];

  return options;
}

export const INITIAL_CURRENCIES: Record<string, { symbol: string; rate: number; name: string }> = {
  USD: { symbol: '$', rate: 1, name: 'US Dollar' },
  EUR: { symbol: '€', rate: 0.92, name: 'Euro' },
  GBP: { symbol: '£', rate: 0.79, name: 'British Pound' },
  INR: { symbol: '₹', rate: 83.5, name: 'Indian Rupee' },
};
