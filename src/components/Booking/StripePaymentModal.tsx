import React, { useState } from 'react';
import { 
  CreditCard, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  X,
  FileText,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/audio';
import { formatKES } from '../../utils/currency';

export interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingSummary: {
    packageName: string;
    vehicleMakeModel: string;
    licensePlate: string;
    date: string;
    timeSlot: string;
    basePrice: number;
    addonsPrice: number;
    totalAmount: number;
    addonsList: string[];
  };
  onPaymentSuccess: (paymentDetails: {
    transactionId: string;
    method: 'stripe_card' | 'apple_pay' | 'google_pay';
    timestamp: string;
  }) => void;
}

export const StripePaymentModal: React.FC<StripePaymentModalProps> = ({
  isOpen,
  onClose,
  bookingSummary,
  onPaymentSuccess
}) => {
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('889');
  const [postalCode, setPostalCode] = useState('94103');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [receiptId, setReceiptId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'stripe_card' | 'apple_pay'>('stripe_card');

  if (!isOpen) return null;

  const handleProcessPayment = (method: 'stripe_card' | 'apple_pay') => {
    setIsProcessing(true);
    setPaymentMethod(method);

    // Simulate Stripe payment gateway latency & verification
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
      const newTxId = 'pi_' + Math.random().toString(36).substring(2, 11).toUpperCase();
      setReceiptId(newTxId);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Ignore
      }

      soundManager.playNotificationChime();

      onPaymentSuccess({
        transactionId: newTxId,
        method,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }, 1400);
  };

  return (
    <div id="stripe-payment-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="stripe-modal-card" 
        className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 shadow-2xl overflow-hidden relative"
      >
        {/* Close Button */}
        {!isProcessing && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {!isCompleted ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-display">Secure Stripe Checkout</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  Encrypted 256-bit TLS connection to Stripe
                </p>
              </div>
            </div>

            {/* Order Summary Pill */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 mb-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-sm font-semibold text-white">{bookingSummary.packageName}</h4>
                  <p className="text-xs text-slate-400">
                    {bookingSummary.vehicleMakeModel} • {bookingSummary.licensePlate}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-cyan-400 font-display">
                    {formatKES(bookingSummary.totalAmount)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">KES (incl. local VAT)</span>
                </div>
              </div>

              <div className="text-xs text-slate-400 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span>Appointment Window:</span>
                <span className="text-slate-200 font-medium">{bookingSummary.date} @ {bookingSummary.timeSlot}</span>
              </div>
            </div>

            {/* Apple / Google Pay / M-Pesa Express Button */}
            <div className="mb-4">
              <button
                id="btn-apple-pay"
                disabled={isProcessing}
                onClick={() => handleProcessPayment('apple_pay')}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-black font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>Pay with M-Pesa Express / Apple Pay</span>
              </button>
            </div>

            <div className="relative flex py-2 items-center mb-4">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                Or pay with credit / debit card
              </span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* Stripe Card Elements Container */}
            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                    placeholder="4242 •••• •••• 4242"
                  />
                  <div className="absolute right-3 top-2.5 flex items-center gap-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white">VISA</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-600 text-white">MC</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Expiration</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">CVC / CVV</label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                    placeholder="CVC"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Billing Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  placeholder="ZIP / Postal"
                />
              </div>
            </div>

            {/* Pay Button */}
            <button
              id="btn-stripe-submit"
              disabled={isProcessing}
              onClick={() => handleProcessPayment('stripe_card')}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authorizing with Stripe...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Pay {formatKES(bookingSummary.totalAmount)}</span>
                </>
              )}
            </button>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Stripe Test Mode active. No real card will be charged.</span>
            </div>
          </div>
        ) : (
          /* Payment Receipt Success View */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-4 text-emerald-400 animate-in zoom-in-50 duration-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white font-display mb-1">Payment Successful!</h3>
            <p className="text-sm text-slate-300 mb-5">
              Your service slot has been confirmed and assigned to Wash Bay 1.
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left mb-6 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Stripe Charge Ref:</span>
                <span className="font-mono text-slate-200">{receiptId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment Method:</span>
                <span className="capitalize text-slate-200">{paymentMethod.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Amount Paid:</span>
                <span className="font-bold text-cyan-400">{formatKES(bookingSummary.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
                <span>Push Status Alerts:</span>
                <span className="text-emerald-400 font-semibold">Enabled</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                id="btn-print-receipt"
                onClick={() => window.print()}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4" />
                Print Receipt
              </button>
              <button
                id="btn-done-payment"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors"
              >
                Track Cleaning Live
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
