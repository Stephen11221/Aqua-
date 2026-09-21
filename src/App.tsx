import React, { useState, useEffect } from 'react';
import { 
  Droplets, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  ChevronRight, 
  RotateCw, 
  Zap, 
  Award, 
  Car,
  CheckCircle2,
  Sliders,
  Calendar,
  Waves
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  Booking, 
  ChatMessage, 
  UserProfile, 
  WashStageId, 
  VehicleType 
} from './types';
import { 
  INITIAL_BOOKINGS, 
  INITIAL_MESSAGES, 
  WASH_PACKAGES, 
  WASH_STAGES, 
  VEHICLE_OPTIONS 
} from './data/packages';
import { CarWash3D } from './components/ThreeCanvas/CarWash3D';
import { BookingModal } from './components/Booking/BookingModal';
import { LiveWashTracker } from './components/LiveTracker/LiveWashTracker';
import { ReviewsSection } from './components/Reviews/ReviewsSection';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { MessagingDrawer } from './components/Messaging/MessagingDrawer';
import { UserAuthModal } from './components/Auth/UserAuthModal';
import { 
  NotificationBanner, 
  InAppNotification, 
  triggerSystemPushNotification 
} from './components/Notifications/NotificationBanner';
import { Navbar, WebsiteView } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { soundManager } from './utils/audio';
import { RealShowcaseSection } from './components/Showcase/RealShowcaseSection';
import { RealCarAnimationBanner } from './components/Home/RealCarAnimationBanner';
import { ProfessionalHero } from './components/Home/ProfessionalHero';
import { ProfessionalServicesShowcase } from './components/Home/ProfessionalServicesShowcase';
import { HowItWorksProcess } from './components/Home/HowItWorksProcess';
import { LocationsAndContact } from './components/Home/LocationsAndContact';
import { CustomerTrustAndFAQ } from './components/Home/CustomerTrustAndFAQ';
import { WebsiteFooter } from './components/Home/WebsiteFooter';
import { formatKES } from './utils/currency';

export default function App() {
  // Navigation & Modal Views
  const [currentView, setCurrentView] = useState<WebsiteView>('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Core Data States
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [activeBookingId, setActiveBookingId] = useState<string>(INITIAL_BOOKINGS[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [hasPushPermission, setHasPushPermission] = useState<boolean>(false);

  // 3D Canvas Synced Parameters
  const [active3DStage, setActive3DStage] = useState<WashStageId>('pre_soak');
  const [vehicle3DType, setVehicle3DType] = useState<VehicleType>('sedan');
  const [vehicle3DColor, setVehicle3DColor] = useState<string>('#1e3a8a');

  // User Authentication Profile
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'usr-1',
    name: 'Marcus Vance',
    email: 'm.vance@example.com',
    role: 'customer',
    phone: '(555) 342-8891',
    loyaltyPoints: 420,
    savedVehicles: [
      { makeModel: 'BMW M3 Competition', type: 'sedan', plate: '7XYZ892', color: '#1e3a8a' },
      { makeModel: 'Porsche Macan GTS', type: 'suv', plate: '9LUV202', color: '#0f172a' }
    ]
  });

  const activeBooking = bookings.find(b => b.id === activeBookingId) || bookings[0] || null;

  // Check browser push notification support and fetch bookings from server
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setHasPushPermission(true);
    }

    // Connect to server API if available
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => {
        if (data && data.bookings && Array.isArray(data.bookings) && data.bookings.length > 0) {
          setBookings(data.bookings);
          setActiveBookingId(data.bookings[0].id);
        }
      })
      .catch(() => {
        // Fallback gracefully to INITIAL_BOOKINGS
      });
  }, []);

  const handleRequestPushPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setHasPushPermission(true);
        triggerPushAlert(
          'Push Notifications Enabled',
          'You will receive live alerts when your car reaches each wash milestone and completes service.'
        );
      }
    }
  };

  const triggerPushAlert = (title: string, message: string, type: 'status_update' | 'completion' | 'message' = 'status_update') => {
    const newNotif: InAppNotification = {
      id: 'notif-' + Date.now(),
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setNotifications(prev => [newNotif, ...prev.slice(0, 4)]);
    triggerSystemPushNotification(title, message);

    // Auto-dismiss after 6 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
    }, 6000);
  };

  // Synchronize 3D preview with active booking
  useEffect(() => {
    if (activeBooking) {
      setVehicle3DType(activeBooking.vehicleType);
      setVehicle3DColor(activeBooking.vehicleColor);
      setActive3DStage(activeBooking.currentStage);
    }
  }, [activeBookingId]);

  // Handle stage change from Admin or Live Tracker
  const handleUpdateBookingStatus = (bookingId: string, newStatus: Booking['status'], newStage: WashStageId) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        const updatedProgress = newStage === 'completed' 
          ? 100 
          : Math.min(95, Math.max(20, Math.floor((WASH_STAGES.findIndex(s => s.id === newStage) / WASH_STAGES.length) * 100)));

        return {
          ...b,
          status: newStatus,
          currentStage: newStage,
          stageProgress: updatedProgress
        };
      }
      return b;
    }));

    if (bookingId === activeBookingId) {
      setActive3DStage(newStage);

      const stageInfo = WASH_STAGES.find(s => s.id === newStage);
      const stageName = stageInfo ? stageInfo.name : newStage;

      if (newStage === 'completed') {
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch {
          // Ignore
        }
        triggerPushAlert(
          'Vehicle Ready for Pickup! 🚗✨',
          `${activeBooking?.vehicleMakeModel} in Bay ${activeBooking?.bayNumber} is spotless and ready in the express pickup lane!`,
          'completion'
        );

        // Append concierge message
        setMessages(prev => [
          ...prev,
          {
            id: 'msg-' + Date.now(),
            sender: 'technician',
            senderName: `Bay ${activeBooking?.bayNumber} Lead`,
            text: `Your ${activeBooking?.vehicleMakeModel} is completely finished and passed final inspection. Keys are at the customer desk!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        triggerPushAlert(
          `Wash Stage: ${stageName}`,
          `Bay ${activeBooking?.bayNumber} transitioned to ${stageName}.`
        );
      }
    }
  };

  // Customer creates a new booking
  const handleBookingCreated = (newBooking: Booking) => {
    // Send to backend server
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBooking)
    }).catch(() => {
      // Offline / client fallback
    });

    setBookings(prev => [newBooking, ...prev]);
    setActiveBookingId(newBooking.id);
    setVehicle3DType(newBooking.vehicleType);
    setVehicle3DColor(newBooking.vehicleColor);
    setActive3DStage(newBooking.currentStage);

    triggerPushAlert(
      'Service Booking Confirmed!',
      `${newBooking.packageName} confirmed for ${newBooking.vehicleMakeModel} in Bay #${newBooking.bayNumber}. Payment processed in Kenyan Shillings (KES).`
    );

    // Switch view to tracker to view live progress!
    setCurrentView('tracker');
  };

  // Messaging handler
  const handleSendMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: currentUser.role === 'admin' ? 'technician' : 'customer',
      senderName: currentUser.name,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);

    // Simulated automated smart reply from bay technician if customer sent message
    if (currentUser.role === 'customer') {
      setTimeout(() => {
        const reply: ChatMessage = {
          id: 'msg-' + (Date.now() + 1),
          sender: 'technician',
          senderName: 'Bay 1 Lead: Alex R.',
          text: `Got your message, ${currentUser.name.split(' ')[0]}! We're monitoring your ${activeBooking?.vehicleMakeModel || 'car'} closely on telemetry. Looking spotless!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, reply]);
        soundManager.playNotificationChime();
        triggerPushAlert(
          'New Message from Bay Technician',
          reply.text,
          'message'
        );
      }, 2200);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16 md:pb-0">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onSelectView={setCurrentView}
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenMessages={() => setIsMessagesOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        activeBooking={activeBooking}
        unreadMessagesCount={messages.filter(m => m.sender === 'technician').length > 0 ? 1 : 0}
      />

      {/* Main Content Body */}
      <main className="flex-1 flex flex-col">
        {/* VIEW 1: HOME PAGE (Professional Car Wash Services Website) */}
        {currentView === 'home' && (
          <div className="flex-1 flex flex-col">
            {/* Professional Hero Section with Real Car Wash Photo & Trust Badges */}
            <ProfessionalHero
              onOpenBooking={() => setIsBookingOpen(true)}
              onBrowseServices={() => setCurrentView('services')}
              onLaunch3D={() => setCurrentView('3d_wash')}
              onViewLiveCCTV={() => setCurrentView('showcase')}
            />

            {/* Real Car Interactive Cleaning Animation (Water jets, Snow Foam, Ceramic Gloss) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
              <RealCarAnimationBanner
                onOpenBooking={() => setIsBookingOpen(true)}
                onExplore3D={() => setCurrentView('3d_wash')}
              />
            </div>

            {/* Professional Wash Services & Pricing Showcase */}
            <div id="services-preview-section">
              <ProfessionalServicesShowcase
                onSelectPackageToBook={(pkgId) => setIsBookingOpen(true)}
              />
            </div>

            {/* 4-Step Touchless Wash Process */}
            <HowItWorksProcess />

            {/* Photorealistic 3D Environment, CCTV Video Streams & Before/After Slider */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
              <RealShowcaseSection
                onSelectStage={(stage: WashStageId) => {
                  setActive3DStage(stage);
                  setCurrentView('3d_wash');
                }}
                onOpenBooking={() => setIsBookingOpen(true)}
              />
            </div>

            {/* Customer Trust, Guarantee & FAQ Section */}
            <CustomerTrustAndFAQ
              onLaunch3D={() => setCurrentView('3d_wash')}
              onOpenBooking={() => setIsBookingOpen(true)}
            />

            {/* Nairobi Locations, Operating Hours & Contact / Fleet Inquiries */}
            <LocationsAndContact />
          </div>
        )}

        {/* VIEW: Dedicated Services & Pricing Menu */}
        {currentView === 'services' && (
          <div className="flex-1 flex flex-col py-6">
            <ProfessionalServicesShowcase
              onSelectPackageToBook={(pkgId) => setIsBookingOpen(true)}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
              <RealCarAnimationBanner
                onOpenBooking={() => setIsBookingOpen(true)}
                onExplore3D={() => setCurrentView('3d_wash')}
              />
            </div>
            <HowItWorksProcess />
          </div>
        )}

        {/* VIEW: Nairobi Locations, Hours & Inquiries */}
        {currentView === 'locations' && (
          <div className="flex-1 flex flex-col py-6">
            <LocationsAndContact />
          </div>
        )}

        {/* VIEW: Dedicated 3D Bay Studio Simulator */}
        {currentView === '3d_wash' && (
          <div className="flex-1 flex flex-col">
            {/* 3D Interactive Canvas Stage */}
            <div className="relative w-full h-[62vh] sm:h-[68vh] min-h-[460px] bg-slate-950">
              <CarWash3D
                initialVehicle={vehicle3DType}
                carColor={vehicle3DColor}
                activeStage={active3DStage}
                onStageChange={(stage) => {
                  setActive3DStage(stage);
                  if (activeBooking && activeBooking.status === 'in_progress') {
                    handleUpdateBookingStatus(activeBooking.id, stage === 'completed' ? 'completed' : 'in_progress', stage);
                  }
                }}
              />
            </div>

            {/* Real Car Interactive Cleaning Animation Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
              <RealCarAnimationBanner
                onOpenBooking={() => setIsBookingOpen(true)}
                onExplore3D={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>

            {/* Quick Service Packages & Capabilities Section */}
            <div className="bg-slate-950/90 border-t border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
              <ProfessionalServicesShowcase
                onSelectPackageToBook={(pkgId) => setIsBookingOpen(true)}
              />
            </div>
          </div>
        )}

        {/* VIEW: Dedicated Live CCTV Feeds & Real Showcase View */}
        {currentView === 'showcase' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
            <RealShowcaseSection
              onSelectStage={(stage: WashStageId) => {
                setActive3DStage(stage);
                setCurrentView('3d_wash');
              }}
              onOpenBooking={() => setIsBookingOpen(true)}
            />
          </div>
        )}

        {/* VIEW 2: Live Wash Tracker */}
        {currentView === 'tracker' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
            <LiveWashTracker
              activeBooking={activeBooking}
              onOpenMessages={() => setIsMessagesOpen(true)}
              onSelect3DStage={(stage) => {
                setActive3DStage(stage);
                setCurrentView('3d_wash');
              }}
              onAdvanceStage={(newStage) => {
                if (activeBooking) {
                  handleUpdateBookingStatus(
                    activeBooking.id,
                    newStage === 'completed' ? 'completed' : 'in_progress',
                    newStage
                  );
                }
              }}
              onRequestNotificationPermission={handleRequestPushPermission}
              hasPushPermission={hasPushPermission}
            />

            {/* Embedded Mini 3D Preview inside Tracker View */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Active Bay 3D Camera Feed</h4>
                  <p className="text-xs text-slate-400">Interactive live visual of your vehicle in Bay #{activeBooking?.bayNumber || 1}</p>
                </div>
                <button
                  onClick={() => setCurrentView('3d_wash')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold flex items-center gap-1"
                >
                  <span>Full Screen Studio</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="h-80 rounded-2xl overflow-hidden border border-slate-800">
                <CarWash3D
                  initialVehicle={activeBooking?.vehicleType || 'sedan'}
                  carColor={activeBooking?.vehicleColor || '#1e3a8a'}
                  activeStage={activeBooking?.currentStage || 'pre_soak'}
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: Customer Reviews */}
        {currentView === 'reviews' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <ReviewsSection />
          </div>
        )}

        {/* VIEW 4: Admin Dashboard */}
        {currentView === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <AdminDashboard
              bookings={bookings}
              onUpdateBookingStatus={handleUpdateBookingStatus}
              onOpenMessagesForBooking={(b) => {
                setActiveBookingId(b.id);
                setIsMessagesOpen(true);
              }}
            />
          </div>
        )}

        {/* Global Website Footer */}
        <WebsiteFooter
          onSelectView={setCurrentView}
          onOpenBooking={() => setIsBookingOpen(true)}
        />
      </main>

      {/* Mobile Sticky Navigation */}
      <MobileNav
        currentView={currentView}
        onSelectView={setCurrentView}
        onOpenBooking={() => setIsBookingOpen(true)}
        activeBooking={activeBooking}
        unreadMessagesCount={messages.length > 0 ? 1 : 0}
        onOpenMessages={() => setIsMessagesOpen(true)}
      />

      {/* Booking Modal with Stripe Integration */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onBookingCreated={handleBookingCreated}
      />

      {/* Messaging Concierge Drawer */}
      <MessagingDrawer
        isOpen={isMessagesOpen}
        onClose={() => setIsMessagesOpen(false)}
        messages={messages}
        onSendMessage={handleSendMessage}
        customerName={currentUser.name}
      />

      {/* User Authentication & Profile Modal */}
      <UserAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onUpdateUser={setCurrentUser}
      />

      {/* Push Notification In-App Toast Feeds */}
      <NotificationBanner
        notifications={notifications}
        onDismiss={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
      />
    </div>
  );
}
