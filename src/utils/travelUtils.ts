import { Booking, TravelOption } from '../types/travel';
import { INITIAL_CURRENCIES } from '../data/travelData';

export function formatCurrency(amount: number, currencyCode: string = 'USD'): string {
  const curr = INITIAL_CURRENCIES[currencyCode] || INITIAL_CURRENCIES.USD;
  const converted = Math.round(amount * curr.rate);
  return `${curr.symbol}${converted.toLocaleString()}`;
}

export function generatePNR(prefix = 'VH'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomStr = '';
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${randomStr}`;
}

export function generateTransactionId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `TXN-${ts}-${rand}`;
}

const LOCAL_STORAGE_BOOKINGS_KEY = 'voyagehub_user_bookings';

export function getStoredBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load bookings from localStorage', e);
    return [];
  }
}

export function saveBooking(booking: Booking): void {
  try {
    const bookings = getStoredBookings();
    const updated = [booking, ...bookings];
    localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save booking to localStorage', e);
  }
}

export function cancelBookingInStorage(bookingId: string, refundAmount: number): Booking[] {
  try {
    const bookings = getStoredBookings();
    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'CANCELLED' as const,
          cancellationRefund: refundAmount,
          cancelledAt: new Date().toISOString(),
        };
      }
      return b;
    });
    localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to update cancelled booking', e);
    return [];
  }
}
