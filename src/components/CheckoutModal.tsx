import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Building2,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Tag,
  AlertCircle,
  Smartphone,
  Info,
} from 'lucide-react';
import { TravelOption, Seat, Passenger, Booking } from '../types/travel';
import { formatCurrency, generatePNR, generateTransactionId, saveBooking } from '../utils/travelUtils';

interface CheckoutModalProps {
  option: TravelOption;
  selectedSeats: Seat[];
  currency: string;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  option,
  selectedSeats,
  currency,
  onClose,
  onBookingSuccess,
}) => {
  // Step state: 'details' -> 'payment' -> 'otp' -> 'processing'
  const [step, setStep] = useState<'details' | 'payment' | 'otp' | 'processing'>('details');

  // Contact details
  const [email, setEmail] = useState('traveler@voyagehub.com');
  const [phone, setPhone] = useState('+1 (555) 234-8901');

  // Passengers
  const [passengers, setPassengers] = useState<Passenger[]>(() =>
    selectedSeats.map((seat, index) => ({
      id: `pax-${index + 1}`,
      fullName: index === 0 ? 'Alex Mercer' : `Traveler ${index + 1}`,
      age: 28 + index * 4,
      gender: 'male',
      idType: 'passport',
      idNumber: `P${78945612 + index * 33}`,
      seatId: seat.id,
      seatLabel: seat.label,
    }))
  );

  // Extras & Promo
  const [insuranceSelected, setInsuranceSelected] = useState(true);
  const [carbonOffsetSelected, setCarbonOffsetSelected] = useState(true);
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPct: number } | null>({
    code: 'VOYAGE20',
    discountPct: 20,
  });
  const [promoError, setPromoError] = useState('');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | 'wallet'>('card');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8920');
  const [cardHolder, setCardHolder] = useState('ALEX MERCER');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('834');
  const [upiId, setUpiId] = useState('alex@okaxis');
  const [selectedBank, setSelectedBank] = useState('JPMorgan Chase Bank');

  // OTP Simulation
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');

  // Financial calculations
  const baseFare = option.price * selectedSeats.length;
  const seatFees = selectedSeats.reduce((acc, s) => acc + s.priceDelta, 0);
  const taxes = Math.round((baseFare + seatFees) * 0.1);
  const insuranceCost = insuranceSelected ? 9 * selectedSeats.length : 0;
  const carbonOffsetCost = carbonOffsetSelected ? 2 * selectedSeats.length : 0;

  const rawSubtotal = baseFare + seatFees + taxes + insuranceCost + carbonOffsetCost;
  const discountAmount = appliedPromo ? Math.round(rawSubtotal * (appliedPromo.discountPct / 100)) : 0;
  const grandTotal = Math.max(1, rawSubtotal - discountAmount);

  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    if (code === 'VOYAGE20') {
      setAppliedPromo({ code: 'VOYAGE20', discountPct: 20 });
    } else if (code === 'SAVE10') {
      setAppliedPromo({ code: 'SAVE10', discountPct: 10 });
    } else if (code === 'FIRSTTRIP') {
      setAppliedPromo({ code: 'FIRSTTRIP', discountPct: 15 });
    } else {
      setPromoError('Invalid coupon code. Try VOYAGE20 or FIRSTTRIP');
    }
  };

  const updatePassenger = (index: number, field: keyof Passenger, value: any) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate passengers
    for (const p of passengers) {
      if (!p.fullName.trim() || !p.idNumber.trim()) {
        alert('Please fill out all passenger details before continuing.');
        return;
      }
    }
    if (!email.trim() || !phone.trim()) {
      alert('Please provide contact email and phone number for ticket delivery.');
      return;
    }
    setStep('payment');
  };

  const handleInitiatePayment = () => {
    // Open 3D Secure OTP verification
    setOtpCode('');
    setOtpError('');
    setStep('otp');
  };

  const handleVerifyOtpAndComplete = () => {
    if (otpCode.length < 4) {
      setOtpError('Please enter a valid OTP code (e.g. 849201)');
      return;
    }

    setStep('processing');

    setTimeout(() => {
      const pnr = generatePNR();
      const txnId = generateTransactionId();

      const newBooking: Booking = {
        id: `book-${Date.now()}`,
        pnr,
        travelOption: option,
        passengers,
        selectedSeatLabels: selectedSeats.map((s) => s.label),
        baseFare,
        seatSelectionFee: seatFees,
        taxesAndFees: taxes,
        insuranceCost,
        carbonOffsetCost,
        discount: discountAmount,
        totalAmount: grandTotal,
        currency,
        status: 'CONFIRMED',
        bookedAt: new Date().toISOString(),
        travelDate: option.departureDate,
        paymentMethod,
        transactionId: txnId,
        contactEmail: email,
        contactPhone: phone,
      };

      saveBooking(newBooking);
      onBookingSuccess(newBooking);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg">
                Direct Booking Checkout
              </span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                <Lock className="w-3 h-3" /> 256-Bit SSL Encrypted
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {option.operatorName} · {option.fromCity} to {option.toCity} · {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''}
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

        {/* Stepper Indicator */}
        <div className="bg-slate-100/80 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 'details'
                  ? 'bg-sky-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              1
            </span>
            <span className={step === 'details' ? 'text-sky-900 font-bold' : ''}>
              Passenger Details
            </span>
          </div>

          <div className="h-0.5 w-12 bg-slate-300 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 'payment'
                  ? 'bg-sky-600 text-white'
                  : step === 'otp' || step === 'processing'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-300 text-slate-700'
              }`}
            >
              2
            </span>
            <span
              className={
                step === 'payment' ? 'text-sky-900 font-bold' : ''
              }
            >
              Payment Gateway
            </span>
          </div>

          <div className="h-0.5 w-12 bg-slate-300 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 'otp' || step === 'processing'
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-300 text-slate-700'
              }`}
            >
              3
            </span>
            <span className={step === 'otp' ? 'text-sky-900 font-bold' : ''}>
              Verification & Ticket
            </span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-slate-800">
          {/* STEP 1: PASSENGER & CONTACT DETAILS */}
          {step === 'details' && (
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              {/* Contact Information */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-sky-600" />
                  Primary Contact (Ticket & PNR will be sent here)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Mobile Number (with country code) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* Passenger Forms */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Passenger Information ({passengers.length})
                </h3>

                {passengers.map((pax, idx) => (
                  <div
                    key={pax.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-900">
                        Passenger #{idx + 1}
                      </span>
                      <span className="text-xs font-semibold bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                        Seat: {pax.seatLabel}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-5">
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          Full Name (as on Govt ID) *
                        </label>
                        <input
                          type="text"
                          required
                          value={pax.fullName}
                          onChange={(e) =>
                            updatePassenger(idx, 'fullName', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          Age *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="110"
                          required
                          value={pax.age}
                          onChange={(e) =>
                            updatePassenger(idx, 'age', Number(e.target.value))
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          Gender
                        </label>
                        <select
                          value={pax.gender}
                          onChange={(e) =>
                            updatePassenger(idx, 'gender', e.target.value)
                          }
                          className="w-full px-2 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-sky-500"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          Govt ID / Passport # *
                        </label>
                        <input
                          type="text"
                          required
                          value={pax.idNumber}
                          onChange={(e) =>
                            updatePassenger(idx, 'idNumber', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add-ons & Extras */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={insuranceSelected}
                      onChange={(e) => setInsuranceSelected(e.target.checked)}
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        VoyageCare Travel Insurance
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Trip cancellation, medical emergencies & baggage loss coverage
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    +{formatCurrency(9 * selectedSeats.length, currency)}
                  </span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={carbonOffsetSelected}
                      onChange={(e) => setCarbonOffsetSelected(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        100% Certified Carbon Neutral Offset
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Plant trees to neutralize {option.co2EmissionsKg} kg of journey emissions
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    +{formatCurrency(2 * selectedSeats.length, currency)}
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Back to Seats
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-sky-600/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Payment Gateway</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: INTEGRATED PAYMENT GATEWAY */}
          {step === 'payment' && (
            <div className="space-y-6">
              {/* Fare Summary Accordion */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900 pb-2 border-b border-slate-200">
                  <span>Fare Summary ({passengers.length} Passenger{passengers.length > 1 ? 's' : ''})</span>
                  <span className="text-sm font-black text-sky-900">
                    {formatCurrency(grandTotal, currency)}
                  </span>
                </div>

                <div className="space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Base Fare ({option.price} × {passengers.length})</span>
                    <span>{formatCurrency(baseFare, currency)}</span>
                  </div>
                  {seatFees > 0 && (
                    <div className="flex justify-between text-amber-700">
                      <span>Seat Selection Add-on</span>
                      <span>+{formatCurrency(seatFees, currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Carrier Surcharge & Terminal Taxes</span>
                    <span>+{formatCurrency(taxes, currency)}</span>
                  </div>
                  {insuranceSelected && (
                    <div className="flex justify-between">
                      <span>VoyageCare Insurance</span>
                      <span>+{formatCurrency(insuranceCost, currency)}</span>
                    </div>
                  )}
                  {carbonOffsetSelected && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Green Travel Offset</span>
                      <span>+{formatCurrency(carbonOffsetCost, currency)}</span>
                    </div>
                  )}
                  {appliedPromo && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Promo Discount ({appliedPromo.code} -{appliedPromo.discountPct}%)</span>
                      <span>-{formatCurrency(discountAmount, currency)}</span>
                    </div>
                  )}
                </div>

                {/* Promo Code Input */}
                <div className="pt-2 border-t border-slate-200 flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (VOYAGE20)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold uppercase focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold text-xs transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-[11px] text-rose-600">{promoError}</p>}
              </div>

              {/* Payment Methods Tabs */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center justify-between">
                  <span>Select Payment Method</span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    PCI-DSS Level 1 Certified
                  </span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 text-xs font-semibold ${
                      paymentMethod === 'card'
                        ? 'border-sky-600 bg-sky-50 text-sky-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-sky-600" />
                    <span>Credit / Debit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 text-xs font-semibold ${
                      paymentMethod === 'upi'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-emerald-600" />
                    <span>Instant UPI & QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 text-xs font-semibold ${
                      paymentMethod === 'netbanking'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    <span>Net Banking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 text-xs font-semibold ${
                      paymentMethod === 'wallet'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    <span>Wallets (GPay/Apple)</span>
                  </button>
                </div>

                {/* Card Payment Form */}
                {paymentMethod === 'card' && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4532 0000 0000 8920"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-sky-500"
                        />
                        <span className="absolute right-3 top-2.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                          VISA / MC
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full px-2 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-center font-bold focus:outline-none focus:border-sky-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="•••"
                            className="w-full px-2 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-center font-bold focus:outline-none focus:border-sky-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI / QR Code */}
                {paymentMethod === 'upi' && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-4">
                    <div className="inline-block p-3 bg-white rounded-2xl border border-slate-300 shadow-sm">
                      <div className="w-36 h-36 bg-slate-900 rounded-xl p-2 flex flex-col items-center justify-center text-white relative">
                        {/* High-fidelity SVG QR Simulator */}
                        <svg className="w-full h-full text-white" viewBox="0 0 100 100" fill="currentColor">
                          <rect x="10" y="10" width="25" height="25" fill="white" />
                          <rect x="15" y="15" width="15" height="15" fill="#0f172a" />
                          <rect x="19" y="19" width="7" height="7" fill="white" />

                          <rect x="65" y="10" width="25" height="25" fill="white" />
                          <rect x="70" y="15" width="15" height="15" fill="#0f172a" />
                          <rect x="74" y="19" width="7" height="7" fill="white" />

                          <rect x="10" y="65" width="25" height="25" fill="white" />
                          <rect x="15" y="70" width="15" height="15" fill="#0f172a" />
                          <rect x="19" y="74" width="7" height="7" fill="white" />

                          <rect x="45" y="20" width="10" height="20" fill="white" />
                          <rect x="40" y="55" width="20" height="10" fill="white" />
                          <rect x="70" y="65" width="15" height="15" fill="white" />
                          <rect x="55" y="75" width="10" height="10" fill="white" />
                        </svg>
                        <span className="absolute bottom-1 bg-slate-900/90 text-[9px] px-1 font-mono text-sky-400">
                          Scan & Pay
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-600">
                      Scan QR code with Google Pay, PhonePe, Paytm, or any banking app
                    </div>
                    <div className="max-w-xs mx-auto">
                      <label className="block text-xs font-semibold text-slate-700 mb-1 text-left">
                        Or enter UPI Virtual Payment Address (VPA)
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@okhdfcbank"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                )}

                {/* Net Banking */}
                {paymentMethod === 'netbanking' && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <label className="block text-xs font-medium text-slate-700">
                      Select Your Financial Institution
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-sky-500"
                    >
                      <option value="JPMorgan Chase Bank">JPMorgan Chase Bank, N.A.</option>
                      <option value="Bank of America">Bank of America</option>
                      <option value="Wells Fargo">Wells Fargo Financial</option>
                      <option value="Citibank">Citibank Global</option>
                      <option value="HSBC Premier">HSBC Premier Banking</option>
                      <option value="Barclays UK">Barclays Corporate</option>
                      <option value="HDFC Bank">HDFC Bank NetBanking</option>
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="BNP Paribas">BNP Paribas</option>
                      <option value="Deutsche Bank">Deutsche Bank</option>
                    </select>
                    <p className="text-[11px] text-slate-500">
                      You will be securely redirected to {selectedBank} portal for instant authentication.
                    </p>
                  </div>
                )}

                {/* Wallets */}
                {paymentMethod === 'wallet' && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    {['Apple Pay (Biometric Fast Checkout)', 'Google Pay (1-Click Instant)', 'PayPal Express Checkout'].map(
                      (w, idx) => (
                        <label
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-100/60 cursor-pointer"
                        >
                          <span className="text-xs font-semibold text-slate-800">{w}</span>
                          <input
                            type="radio"
                            name="walletType"
                            defaultChecked={idx === 0}
                            className="text-sky-600 focus:ring-sky-500"
                          />
                        </label>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Back to Passenger Details
                </button>
                <button
                  type="button"
                  onClick={handleInitiatePayment}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Pay {formatCurrency(grandTotal, currency)} & Confirm</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: 3D SECURE OTP SIMULATION MODAL */}
          {step === 'otp' && (
            <div className="max-w-md mx-auto py-6 text-center space-y-5">
              <div className="w-14 h-14 bg-sky-100 text-sky-700 rounded-2xl mx-auto flex items-center justify-center border border-sky-200 shadow-sm">
                <ShieldCheck className="w-8 h-8 text-sky-600" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Bank 3D Secure Verification
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  A 6-digit one-time password (OTP) was sent to your registered mobile phone ending in <strong>•••• 8901</strong>.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Merchant: VoyageHub Travel Booking</span>
                  <span>Amount: {formatCurrency(grandTotal, currency)}</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 text-left">
                    Enter 6-digit OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit code"
                    className="w-full text-center tracking-[0.5em] font-mono text-lg font-black py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500"
                  />
                  {otpError && <p className="text-xs text-rose-600 mt-1">{otpError}</p>}
                </div>

                {/* Auto-fill Helper for User testing */}
                <button
                  type="button"
                  onClick={() => setOtpCode('849201')}
                  className="w-full py-1.5 bg-sky-50 text-sky-700 border border-sky-200 rounded-lg text-xs font-bold hover:bg-sky-100 transition-colors"
                >
                  ⚡ Auto-fill Test OTP: 849201
                </button>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel & Change Payment
                </button>
                <button
                  type="button"
                  onClick={handleVerifyOtpAndComplete}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Authorize Payment
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PROCESSING LOADER */}
          {step === 'processing' && (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto"></div>
              <h3 className="text-base font-bold text-slate-900">
                Processing Secure Transaction...
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Communicating with transit ticketing authority, reserving seats {selectedSeats.map(s => s.label).join(', ')}, and issuing your digital boarding pass.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
