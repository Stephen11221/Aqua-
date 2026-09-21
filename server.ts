import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store for live customer bookings, branch locations, and inquiries
const SERVICES_DATA = [
  {
    id: 'express',
    name: 'Express Hydro Wash',
    category: 'exterior',
    price: 1500,
    estimatedMinutes: 12,
    tagline: 'High-velocity touchless wash for light road film & dust',
    features: [
      'High-pressure optical contour rinse (1,500 PSI)',
      'Citrus bio-degradable pre-soak emulsion',
      'Dual-arch undercarriage chassis flush',
      'Spot-free reverse osmosis pure water rinse',
      'Heated 45-HP hurricane blower dry'
    ],
    popular: false
  },
  {
    id: 'deluxe',
    name: 'Deluxe Foam & Wheels Armor',
    category: 'exterior',
    price: 3200,
    estimatedMinutes: 20,
    tagline: 'Deep dirt encapsulation and high-gloss wheel detailing',
    features: [
      'All Express Hydro wash steps',
      'Triple-foam cherry blizzard conditioning bath',
      'Rotary alloy wheel & brake dust blast',
      'Silicone-free hydrophobic tire dress & shine',
      'Bug, tar and tree sap chemical spot dissolver',
      'Rust-inhibitor chassis undercoat sealant'
    ],
    popular: true
  },
  {
    id: 'ceramic',
    name: 'Ceramic Shield Pro & Graphene',
    category: 'protection',
    price: 5800,
    estimatedMinutes: 30,
    tagline: 'Molecular hydrophobic shield, 9H UV lock & mirror clarity',
    features: [
      'All Deluxe Foam & Wheels wash stages',
      'Atomized nano-ceramic coating spray application',
      'Graphene oxide water-beading booster',
      'Extreme windshield & window Rain-X glass seal',
      'Synthetic paint seal with 60-day hydrophobic warranty',
      'Microfiber hand-buffed perimeter touch-up'
    ],
    popular: false
  },
  {
    id: 'diamond',
    name: 'Diamond Showroom Auto Spa',
    category: 'full_detail',
    price: 9800,
    estimatedMinutes: 45,
    tagline: 'Master exterior restoration, cabin ozone spa & leather feed',
    features: [
      'Complete Ceramic Shield Pro multi-step wash',
      'Engine bay heated dry-vapor degreasing & dress',
      'Full cabin HEPA vacuuming and trunk deep sweep',
      'Hospital-grade molecular ozone air odor elimination',
      'Nourishing pH-balanced leather conditioning balm',
      'Exterior rubber trim UV restoration sealant'
    ],
    popular: false
  },
  {
    id: 'interior_spa',
    name: 'Interior Deep Detailing & Ozone Spa',
    category: 'interior',
    price: 4500,
    estimatedMinutes: 35,
    tagline: 'Complete cabin sanitization, fabric extraction & leather nourish',
    features: [
      'Deep carpet and fabric hot water extraction',
      'Antimicrobial steam cleaning of vents and dash',
      'Molecular ozone chamber sterilization (eliminates allergens & bacteria)',
      'Rich UV-blocking leather and vinyl protectant',
      'Streak-free interior crystal glass polish'
    ],
    popular: false
  },
  {
    id: 'fleet_corp',
    name: 'Executive Fleet & Commercial Care',
    category: 'commercial',
    price: 12000,
    estimatedMinutes: 60,
    tagline: 'Dedicated bay turnaround for corporate fleets & executive luxury',
    features: [
      'Multi-vehicle priority queue access',
      'Complete interior & exterior premium detailing',
      'Monthly computerized service audit logs',
      'Dedicated lead technician assignment',
      'Flexible corporate billing with VAT invoice'
    ],
    popular: false
  }
];

const LOCATIONS_DATA = [
  {
    id: 'loc-westlands',
    name: 'Westlands Flagship Auto Spa',
    address: 'Ring Road Parklands, Westlands, Nairobi',
    phone: '+254 746 145 712',
    hours: 'Monday – Sunday: 6:30 AM – 9:30 PM',
    bays: 4,
    features: ['Touchless Hydro Bays', 'Ceramic Curing Booth', 'Customer Lounge with Wi-Fi & Espresso']
  },
  {
    id: 'loc-kilimani',
    name: 'Kilimani Studio & Detail Lounge',
    address: 'Argwings Kodhek Rd (near Yaya Centre), Nairobi',
    phone: '+254 723 456 234',
    hours: 'Monday – Sunday: 7:00 AM – 9:00 PM',
    bays: 3,
    features: ['Precision Soft-Cloth Tunnel', 'Interior Steam Bays', 'VIP Co-Working Lounge']
  },
  {
    id: 'loc-karen',
    name: 'Karen Boutique Detail Sanctuary',
    address: 'Ngong Road, Karen Triangle, Nairobi',
    phone: '+254 722 345 678',
    hours: 'Monday – Sunday: 7:00 AM – 8:30 PM',
    bays: 3,
    features: ['Master Paint Correction', 'Graphene Application Lab', 'Secure Overnight Vehicle Storage']
  },
  {
    id: 'loc-mombasa-rd',
    name: 'Mombasa Road Fleet Express',
    address: 'Near Nextgen Mall / Eka Hotel, Nairobi',
    phone: '+254 733 456 789',
    hours: '24 Hours / 7 Days a Week',
    bays: 6,
    features: ['High-Speed 5-Minute Express Tunnel', 'Heavy SUV & Commercial Bay', '24/7 Service']
  }
];

interface StoredBooking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleType: string;
  vehicleMakeModel: string;
  vehicleColor: string;
  licensePlate: string;
  packageId: string;
  packageName: string;
  addons: string[];
  totalAmount: number;
  date: string;
  timeSlot: string;
  bayNumber: number;
  status: string;
  currentStage: string;
  stageProgress: number;
  paymentMethod: string;
  paymentStatus: string;
  notes?: string;
  createdAt: string;
}

const bookingsStore: StoredBooking[] = [
  {
    id: 'AG-9021',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@example.com',
    customerPhone: '+254 712 345 678',
    vehicleType: 'sedan',
    vehicleMakeModel: 'BMW M3 Competition',
    vehicleColor: '#1e3a8a',
    licensePlate: 'KDF 892Z',
    packageId: 'ceramic',
    packageName: 'Ceramic Shield Pro & Graphene',
    addons: ['rainx'],
    totalAmount: 7000,
    date: 'Today',
    timeSlot: '10:00 AM',
    bayNumber: 1,
    status: 'in_progress',
    currentStage: 'pressure_wash',
    stageProgress: 42,
    paymentMethod: 'stripe_card',
    paymentStatus: 'paid',
    notes: 'Please pay extra attention to front carbon splitter.',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: 'AG-9022',
    customerName: 'Dr. Sarah Jenkins',
    customerEmail: 's.jenkins@example.com',
    customerPhone: '+254 722 987 654',
    vehicleType: 'suv',
    vehicleMakeModel: 'Range Rover Sport',
    vehicleColor: '#0f172a',
    licensePlate: 'KCY 441B',
    packageId: 'diamond',
    packageName: 'Diamond Showroom Auto Spa',
    addons: ['ozone', 'leather'],
    totalAmount: 15060,
    date: 'Today',
    timeSlot: '10:45 AM',
    bayNumber: 2,
    status: 'booked',
    currentStage: 'idle',
    stageProgress: 0,
    paymentMethod: 'stripe_card',
    paymentStatus: 'paid',
    notes: 'Allergy patient: thorough ozone air clean requested.',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  }
];

const contactInquiries: any[] = [];

// ==================== API ROUTES ====================

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'AquaGlow Auto Spa & Detailing API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 2. Services catalog
app.get('/api/services', (req: Request, res: Response) => {
  res.json({
    success: true,
    currency: 'KES',
    services: SERVICES_DATA
  });
});

// 3. Locations
app.get('/api/locations', (req: Request, res: Response) => {
  res.json({
    success: true,
    locations: LOCATIONS_DATA
  });
});

// 4. Bookings
app.get('/api/bookings', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: bookingsStore.length,
    bookings: bookingsStore
  });
});

app.post('/api/bookings', (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.customerName || !data.customerPhone || !data.packageId) {
      return res.status(400).json({ error: 'Missing required booking fields (name, phone, packageId)' });
    }

    const newId = `AG-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomBay = Math.floor(Math.random() * 4) + 1;

    const newBooking: StoredBooking = {
      id: data.id || newId,
      customerName: data.customerName,
      customerEmail: data.customerEmail || 'customer@aquaglow.co.ke',
      customerPhone: data.customerPhone,
      vehicleType: data.vehicleType || 'sedan',
      vehicleMakeModel: data.vehicleMakeModel || 'Vehicle',
      vehicleColor: data.vehicleColor || '#1e3a8a',
      licensePlate: data.licensePlate || 'KAA 001A',
      packageId: data.packageId,
      packageName: data.packageName || 'Precision Wash',
      addons: Array.isArray(data.addons) ? data.addons : [],
      totalAmount: Number(data.totalAmount) || 1500,
      date: data.date || 'Today',
      timeSlot: data.timeSlot || '11:00 AM',
      bayNumber: randomBay,
      status: 'booked',
      currentStage: 'idle',
      stageProgress: 0,
      paymentMethod: data.paymentMethod || 'stripe_card',
      paymentStatus: data.paymentStatus || 'paid',
      notes: data.notes || '',
      createdAt: new Date().toISOString()
    };

    bookingsStore.unshift(newBooking);

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: newBooking
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to create booking' });
  }
});

app.patch('/api/bookings/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, currentStage, stageProgress } = req.body;

  const bIndex = bookingsStore.findIndex(b => b.id === id);
  if (bIndex === -1) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  if (status) bookingsStore[bIndex].status = status;
  if (currentStage) bookingsStore[bIndex].currentStage = currentStage;
  if (typeof stageProgress === 'number') bookingsStore[bIndex].stageProgress = stageProgress;

  return res.json({
    success: true,
    booking: bookingsStore[bIndex]
  });
});

// 5. Contact / Quote request
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, phone, message, subject, vehicleCount } = req.body;
  if (!name || (!email && !phone)) {
    return res.status(400).json({ error: 'Name and contact info are required' });
  }

  const newInquiry = {
    id: `INQ-${Date.now()}`,
    name,
    email,
    phone,
    subject: subject || 'General Inquiry',
    vehicleCount: vehicleCount || 1,
    message: message || '',
    createdAt: new Date().toISOString()
  };

  contactInquiries.push(newInquiry);

  return res.json({
    success: true,
    message: 'Thank you for reaching out! A detailing specialist will contact you shortly.',
    inquiryId: newInquiry.id
  });
});

// 6. Live Telemetry & Stats
app.get('/api/stats', (req: Request, res: Response) => {
  res.json({
    success: true,
    activeBays: 4,
    baysOccupied: bookingsStore.filter(b => b.status === 'in_progress').length,
    washesCompletedToday: 48,
    averageWaitMinutes: 8,
    customerSatisfactionScore: 99.4
  });
});

// ==================== VITE MIDDLEWARE / STATIC ====================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AquaGlow Car Wash Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
