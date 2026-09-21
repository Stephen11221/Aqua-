import React, { useState } from 'react';
import { 
  X, 
  Car, 
  Check, 
  Sparkles, 
  Clock, 
  Shield, 
  Calendar, 
  ChevronRight, 
  ChevronLeft,
  CreditCard,
  Plus
} from 'lucide-react';
import { VehicleType, Booking } from '../../types';
import { VEHICLE_OPTIONS, WASH_PACKAGES, WASH_ADDONS } from '../../data/packages';
import { StripePaymentModal } from './StripePaymentModal';
import { formatKES } from '../../utils/currency';

export interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingCreated: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onBookingCreated
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>('sedan');
  const [vehicleMakeModel, setVehicleMakeModel] = useState('Tesla Model 3');
  const [licensePlate, setLicensePlate] = useState('7LUV390');
  const [vehicleColor, setVehicleColor] = useState('#1e3a8a');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('deluxe');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['rainx']);
  
  // Date & Time
  const [selectedDate, setSelectedDate] = useState('Today, Sep 21');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('11:45 AM');
  
  // Customer Info
  const [customerName, setCustomerName] = useState('Alex Rivera');
  const [customerEmail, setCustomerEmail] = useState('alex.rivera@example.com');
  const [customerPhone, setCustomerPhone] = useState('(555) 234-5678');
  const [notes, setNotes] = useState('');

  // Stripe Modal state
  const [isStripeOpen, setIsStripeOpen] = useState(false);

  if (!isOpen) return null;

  const currentPackage = WASH_PACKAGES.find(p => p.id === selectedPackageId) || WASH_PACKAGES[1];
  const vehicleOpt = VEHICLE_OPTIONS.find(v => v.id === selectedVehicleType) || VEHICLE_OPTIONS[0];

  // Price calculations
  const basePrice = currentPackage.price * vehicleOpt.basePriceMultiplier;
  const addonsTotal = selectedAddons.reduce((acc, addId) => {
    const addon = WASH_ADDONS.find(a => a.id === addId);
    return acc + (addon ? addon.price : 0);
  }, 0);
  const grandTotal = basePrice + addonsTotal;

  const toggleAddon = (addonId: string) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter(id => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  const handleOpenStripe = () => {
    setIsStripeOpen(true);
  };

  const handlePaymentSuccess = (paymentDetails: {
    transactionId: string;
    method: 'stripe_card' | 'apple_pay' | 'google_pay';
  }) => {
    setIsStripeOpen(false);

    const newBooking: Booking = {
      id: 'AQ-' + Math.floor(1000 + Math.random() * 9000),
      customerName,
      customerEmail,
      customerPhone,
      vehicleType: selectedVehicleType,
      vehicleMakeModel,
      vehicleColor,
      licensePlate: licensePlate.toUpperCase(),
      packageId: currentPackage.id,
      packageName: currentPackage.name,
      addons: selectedAddons,
      totalAmount: Math.round(grandTotal * 100) / 100,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      bayNumber: Math.floor(Math.random() * 3) + 1,
      status: 'in_progress',
      currentStage: 'pre_soak',
      stageProgress: 15,
      startTime: Date.now(),
      createdAt: new Date().toISOString().substring(0, 16).replace('T', ' '),
      paymentMethod: paymentDetails.method,
      paymentStatus: 'paid',
      notes
    };

    onBookingCreated(newBooking);
    onClose();
  };

  const availableSlots = [
    '09:30 AM', '10:15 AM', '11:00 AM', '11:45 AM', '01:15 PM', '02:00 PM', '03:30 PM', '04:15 PM'
  ];

  return (
    <div id="booking-portal-modal" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header with Step Progress */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Step {step} of 3</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              {step === 1 && 'Select Vehicle & Wash Package'}
              {step === 2 && 'Custom Add-ons & Scheduling'}
              {step === 3 && 'Review & Stripe Checkout'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: Vehicle & Package */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Vehicle Chassis Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  1. Vehicle Chassis Class
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {VEHICLE_OPTIONS.map((v) => (
                    <button
                      key={v.id}
                      id={`booking-chassis-${v.id}`}
                      onClick={() => setSelectedVehicleType(v.id)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        selectedVehicleType === v.id
                          ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white">{v.name.split('/')[0]}</span>
                        {selectedVehicleType === v.id && (
                          <span className="w-4 h-4 rounded-full bg-cyan-500 text-black flex items-center justify-center text-[10px]">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{v.category}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Vehicle Identification Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Make & Model</label>
                  <input
                    type="text"
                    value={vehicleMakeModel}
                    onChange={(e) => setVehicleMakeModel(e.target.value)}
                    placeholder="e.g. BMW M4, Ford F-150"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">License Plate</label>
                  <input
                    type="text"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                    placeholder="e.g. 7XYZ892"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white uppercase focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              {/* Wash Package Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  2. Select Wash Treatment
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {WASH_PACKAGES.map((pkg) => {
                    const isSelected = selectedPackageId === pkg.id;
                    const calculatedPkgPrice = pkg.price * vehicleOpt.basePriceMultiplier;

                    return (
                      <div
                        key={pkg.id}
                        id={`booking-pkg-${pkg.id}`}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
                          isSelected
                            ? 'bg-slate-800/90 border-cyan-400 shadow-xl shadow-cyan-500/10'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {pkg.popular && (
                          <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[10px] font-extrabold uppercase tracking-wide shadow-md">
                            Most Popular
                          </span>
                        )}

                        <div className="flex justify-between items-start mb-1.5">
                          <h4 className="font-bold text-white text-base">{pkg.name}</h4>
                          <span className="text-lg font-extrabold text-cyan-400 font-display">
                            {formatKES(calculatedPkgPrice)}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 mb-3">{pkg.tagline}</p>

                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-3 font-medium">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          <span>~{pkg.estimatedMinutes} mins bay time</span>
                        </div>

                        <ul className="space-y-1 text-xs text-slate-300">
                          {pkg.features.slice(0, 3).map((f, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                              <span className="line-clamp-1">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Add-ons & Scheduling */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Optional Add-on Spa Treatments */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Enhance With Premium Add-ons
                </label>
                <div className="space-y-2.5">
                  {WASH_ADDONS.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        id={`booking-addon-${addon.id}`}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isChecked
                            ? 'bg-cyan-500/10 border-cyan-500 text-white'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${
                            isChecked ? 'bg-cyan-500 border-cyan-400 text-black' : 'border-slate-700 bg-slate-900'
                          }`}>
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-white block">{addon.name}</span>
                            <span className="text-xs text-slate-400">{addon.description}</span>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-cyan-400 font-display whitespace-nowrap ml-3">
                          +{formatKES(addon.price)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Date & Time Slot Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Select Bay Arrival Window
                </label>
                <div className="flex gap-2 mb-3">
                  {['Today, Sep 21', 'Tomorrow, Sep 22', 'Wednesday, Sep 23'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDate(d)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium border transition-colors ${
                        selectedDate === d
                          ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      id={`slot-${slot.replace(/\s+/g, '-')}`}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                        selectedTimeSlot === slot
                          ? 'bg-slate-800 border-cyan-400 text-cyan-300 font-bold shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Technician Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Low front lip, please do not use heavy tire gloss"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Customer Details & Confirmation */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Customer Contact Inputs */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Customer & Notifications Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Mobile Phone (for SMS / push)</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Detailed Bill of Service in Kenyan Shillings */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="font-bold text-white text-sm">
                    Order Summary
                  </h4>
                  <span className="text-[11px] font-semibold text-cyan-400">Currency: Kenyan Shillings (KES)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>{currentPackage.name} ({vehicleOpt.name.split('/')[0]})</span>
                  <span className="font-mono text-white">{formatKES(basePrice)}</span>
                </div>
                {selectedAddons.map((addId) => {
                  const addon = WASH_ADDONS.find(a => a.id === addId);
                  if (!addon) return null;
                  return (
                    <div key={addId} className="flex justify-between text-slate-400">
                      <span>+ {addon.name}</span>
                      <span className="font-mono text-slate-200">{formatKES(addon.price)}</span>
                    </div>
                  );
                })}
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                  <span>Total Due Today:</span>
                  <span className="text-base text-cyan-400 font-display">{formatKES(grandTotal)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          {step > 1 ? (
            <button
              id="btn-booking-back"
              onClick={() => setStep((step - 1) as 1 | 2 | 3)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              id="btn-booking-next"
              onClick={() => setStep((step + 1) as 1 | 2 | 3)}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="btn-open-stripe-checkout"
              onClick={handleOpenStripe}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
            >
              <CreditCard className="w-4 h-4" />
              Pay {formatKES(grandTotal)} with Stripe
            </button>
          )}
        </div>
      </div>

      {/* Stripe Payment Modal Integration */}
      <StripePaymentModal
        isOpen={isStripeOpen}
        onClose={() => setIsStripeOpen(false)}
        bookingSummary={{
          packageName: currentPackage.name,
          vehicleMakeModel,
          licensePlate,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          basePrice,
          addonsPrice: addonsTotal,
          totalAmount: grandTotal,
          addonsList: selectedAddons
        }}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};
