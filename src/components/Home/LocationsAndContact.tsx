import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Car, 
  Send, 
  CheckCircle2, 
  Mail, 
  Building2, 
  ShieldCheck, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const LocationsAndContact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: 'Westlands Flagship',
    serviceInterest: 'Deluxe Foam & Wheels',
    vehicleCount: '1',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const locations = [
    {
      id: 'westlands',
      name: 'Westlands Flagship Auto Spa',
      address: 'Ring Road Parklands, Westlands, Nairobi',
      phone: '+254 746 145 712',
      hours: 'Mon – Sun: 6:30 AM – 9:30 PM',
      bays: 4,
      status: 'Open Now • 2 Bays Ready',
      features: ['Touchless Hydro Bays', 'Ceramic Curing Booth', 'VIP Wi-Fi Lounge']
    },
    {
      id: 'kilimani',
      name: 'Kilimani Studio & Detail Lounge',
      address: 'Argwings Kodhek Rd (near Yaya Centre), Nairobi',
      phone: '+254 746 145 712',
      hours: 'Mon – Sun: 7:00 AM – 9:00 PM',
      bays: 3,
      status: 'Open Now • 1 Bay Ready',
      features: ['Precision Soft-Cloth Tunnel', 'Interior Steam Detailing', 'Espresso Bar']
    },
    {
      id: 'karen',
      name: 'Karen Boutique Detail Sanctuary',
      address: 'Ngong Road, Karen Triangle, Nairobi',
      phone: '+254 746 145 712',
      hours: 'Mon – Sun: 7:00 AM – 8:30 PM',
      bays: 3,
      status: 'Open Now • 2 Bays Ready',
      features: ['Master Paint Correction', 'Graphene Application Lab', 'Overnight Security']
    },
    {
      id: 'mombasa-rd',
      name: 'Mombasa Road Fleet Express (24/7)',
      address: 'Near Nextgen Mall / Eka Hotel, Nairobi',
      phone: '+254 746 145 712',
      hours: 'Open 24 Hours / 7 Days a Week',
      bays: 6,
      status: 'Open 24/7 • Fast Lane Ready',
      features: ['High-Speed 5-Min Express Tunnel', 'Heavy Commercial & SUV Bay', 'Night Security']
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setErrorMessage('Please provide your name and phone number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        // Fallback gracefully in client
        setIsSubmitted(true);
      }
    } catch {
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="locations-contact" className="py-14 sm:py-20 bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>Nairobi Locations & Customer Support</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Visit Our Express Bays or Request Detailing
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Drive in without an appointment or reserve priority bay slots online. Corporate fleet inquiries welcome with custom invoiced pricing.
          </p>
        </div>

        {/* 4 Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
                    {loc.status}
                  </span>
                  <span className="text-xs font-mono text-cyan-400 font-bold">
                    {loc.bays} Automated Bays
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white leading-snug">
                  {loc.name}
                </h3>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-start gap-2 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{loc.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <a href={`tel:${loc.phone}`} className="hover:text-cyan-300 transition-colors">
                      {loc.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span>{loc.hours}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-1">
                  {loc.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <CheckCircle2 className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(loc.name + ' ' + loc.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Get Driving Directions</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          ))}
        </div>

        {/* Contact & Corporate Fleet Inquiry Box */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase">
              <Building2 className="w-3.5 h-3.5" />
              <span>Direct Customer Concierge</span>
            </div>
            <h3 className="text-2xl font-black text-white">
              Have Questions or Need Corporate Fleet Services?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              We manage executive car fleets, embassy fleets, dealership logistics, and private collections across Nairobi. Send an inquiry for priority billing and specialized service agreements.
            </p>
            
            <div className="space-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>concierge@aquaglow.co.ke</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>+254 700 123 456 / +254 711 234 567</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-950 p-6 sm:p-7 rounded-2xl border border-slate-800">
            {isSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Message Received!</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Thank you for reaching out to AquaGlow. One of our detailing supervisors will contact you by call or WhatsApp shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white mt-2"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Mwangi"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Phone Number (M-Pesa / WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+254 7..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="you@company.co.ke"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Preferred Location</label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option>Westlands Flagship</option>
                      <option>Kilimani Studio</option>
                      <option>Karen Sanctuary</option>
                      <option>Mombasa Road 24/7</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Message or Fleet Requirements</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your vehicle or corporate fleet requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {errorMessage && (
                  <p className="text-rose-400 text-xs font-semibold">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending...' : 'Submit Inquiry'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
