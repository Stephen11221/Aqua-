import { WashPackage, WashAddon, WashStageInfo, VehicleOption, Booking, Review, ChatMessage, RevenueDataPoint, PackageRevenueData } from '../types';

export const VEHICLE_OPTIONS: VehicleOption[] = [
  {
    id: 'sedan',
    name: 'Sedan / Hatchback',
    category: 'Standard Size',
    iconName: 'Car',
    sizeMultiplier: 1.0,
    basePriceMultiplier: 1.0,
    description: 'Compact cars, sedans, coupes & standard wagons'
  },
  {
    id: 'suv',
    name: 'SUV / Crossover',
    category: 'Mid-Size',
    iconName: 'Shield',
    sizeMultiplier: 1.15,
    basePriceMultiplier: 1.2,
    description: 'Mid to full-size SUVs, crossovers & compact pickups'
  },
  {
    id: 'coupe',
    name: 'Sports Coupe / Exotic',
    category: 'Performance',
    iconName: 'Zap',
    sizeMultiplier: 0.95,
    basePriceMultiplier: 1.15,
    description: 'Low-clearance sports cars, GTs and convertibles'
  },
  {
    id: 'truck',
    name: 'Truck / Large Van',
    category: 'Heavy Duty',
    iconName: 'Truck',
    sizeMultiplier: 1.3,
    basePriceMultiplier: 1.35,
    description: 'Full-size pickup trucks, commercial vans & 7-seater SUVs'
  }
];

export const WASH_STAGES: WashStageInfo[] = [
  {
    id: 'idle',
    name: 'Vehicle Staged & Ready',
    shortName: 'Staged',
    description: 'Vehicle parked in bay, optical alignment complete',
    durationSeconds: 15,
    icon: 'CheckCircle2',
    color: 'text-slate-400'
  },
  {
    id: 'pre_soak',
    name: 'Citrus Pre-Soak & Loosening',
    shortName: 'Pre-Soak',
    description: 'Enzymatic citrus mist dissolves road grime and bug residue',
    durationSeconds: 25,
    icon: 'Droplets',
    color: 'text-amber-400'
  },
  {
    id: 'foam_cannon',
    name: 'Tri-Color Snow Foam Curtain',
    shortName: 'Snow Foam',
    description: 'High-density pH-balanced thick foam blanket coats the paint',
    durationSeconds: 30,
    icon: 'CloudRain',
    color: 'text-pink-400'
  },
  {
    id: 'pressure_wash',
    name: '360° High-Pressure Hydro Jet',
    shortName: 'Hydro Blast',
    description: '1500 PSI oscillating water jets strip loosened dirt and road salt',
    durationSeconds: 35,
    icon: 'Waves',
    color: 'text-cyan-400'
  },
  {
    id: 'brush_scrub',
    name: 'Microfiber Contour Roller Scrub',
    shortName: 'Contour Scrub',
    description: 'Soft-touch neoglide foam brushes follow body curves gently',
    durationSeconds: 40,
    icon: 'RotateCw',
    color: 'text-emerald-400'
  },
  {
    id: 'wheel_blast',
    name: 'Alloy Wheel & Undercarriage Wash',
    shortName: 'Wheel & Underbody',
    description: 'High-pressure undercarriage blaster and rotary alloy scrubbers',
    durationSeconds: 30,
    icon: 'Disc',
    color: 'text-indigo-400'
  },
  {
    id: 'ceramic_wax',
    name: 'Graphene Ceramic Gloss Sealant',
    shortName: 'Ceramic Seal',
    description: 'Hydrophobic fluoropolymer wax locks in deep mirror reflection',
    durationSeconds: 25,
    icon: 'Sparkles',
    color: 'text-yellow-400'
  },
  {
    id: 'turbo_dry',
    name: 'High-Velocity Heated Air Dry',
    shortName: 'Turbo Dry',
    description: '180 MPH heated air knives push every water bead off crevices',
    durationSeconds: 30,
    icon: 'Wind',
    color: 'text-sky-400'
  },
  {
    id: 'completed',
    name: 'Sparkling Clean & Ready for Pickup!',
    shortName: 'Ready',
    description: 'Service completed, final technician inspection passed',
    durationSeconds: 10,
    icon: 'Award',
    color: 'text-green-400'
  }
];

export const WASH_PACKAGES: WashPackage[] = [
  {
    id: 'express',
    name: 'Express Hydro',
    tagline: 'Fast touchless wash for light road dust',
    price: 1500,
    estimatedMinutes: 12,
    features: [
      'Citrus Pre-Soak mist',
      'High-Pressure Hydro Blast',
      'Spot-free reverse osmosis rinse',
      'High-Velocity Air Dry',
      'Tire rinse'
    ],
    stagesIncluded: ['pre_soak', 'pressure_wash', 'turbo_dry']
  },
  {
    id: 'deluxe',
    name: 'Deluxe Foam & Wheels',
    tagline: 'Our most popular wash for weekly road upkeep',
    price: 3200,
    estimatedMinutes: 20,
    popular: true,
    features: [
      'Citrus Pre-Soak + Tri-Color Snow Foam',
      'Microfiber Contour Roller Scrub',
      'Rotary Alloy Wheel Scrub & Undercarriage Blast',
      'Triple-foam condition polish',
      'Spot-free rinse & 360° Turbo Dry'
    ],
    stagesIncluded: ['pre_soak', 'foam_cannon', 'pressure_wash', 'brush_scrub', 'wheel_blast', 'turbo_dry']
  },
  {
    id: 'ceramic',
    name: 'Ceramic Shield Pro',
    tagline: 'Long-lasting hydrophobic shine and UV armor',
    price: 5800,
    estimatedMinutes: 30,
    features: [
      'All Deluxe Wash features',
      'Dual-action wheel barrel & rim detailing',
      'Graphene Ceramic Gloss Sealant coat',
      'Rain-X exterior glass windshield repellent',
      'Satin tire dressing & micro-towel hand wipe'
    ],
    stagesIncluded: ['pre_soak', 'foam_cannon', 'pressure_wash', 'brush_scrub', 'wheel_blast', 'ceramic_wax', 'turbo_dry']
  },
  {
    id: 'diamond',
    name: 'Diamond Concierge Auto Spa',
    tagline: 'Master exterior restoration and showroom treatment',
    price: 9800,
    estimatedMinutes: 45,
    features: [
      'Full Ceramic Shield multi-step wash',
      'Double Graphene ceramic thermal curing',
      'Full interior high-power vacuum & trunk cleaning',
      'Ozone interior anti-microbial air purification',
      'Hand-waxed alloy wheels & chrome restoration',
      'Complimentary fragrance spritz & espresso'
    ],
    stagesIncluded: ['pre_soak', 'foam_cannon', 'pressure_wash', 'brush_scrub', 'wheel_blast', 'ceramic_wax', 'turbo_dry']
  }
];

export const WASH_ADDONS: WashAddon[] = [
  {
    id: 'ozone',
    name: 'Ozone Cabin Sanitization',
    price: 1500,
    description: 'Hospital-grade molecular ozone eliminates 99.9% odors, bacteria and allergens',
    icon: 'Wind'
  },
  {
    id: 'rainx',
    name: 'Rain-X Complete Hydrophobic Glass',
    price: 1200,
    description: 'Extreme water-beading chemical film for windshield and side windows',
    icon: 'ShieldCheck'
  },
  {
    id: 'engine',
    name: 'Engine Bay Steam Degreasing',
    price: 2500,
    description: 'Gentle heated vapor degreasing to remove oil film and road salt safely',
    icon: 'Zap'
  },
  {
    id: 'leather',
    name: 'Leather Guard & UV Conditioning',
    price: 1800,
    description: 'pH-balanced nourishing balm prevents cracking and restores supple feel',
    icon: 'Sparkles'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'AQ-9421',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@example.com',
    customerPhone: '(555) 342-8891',
    vehicleType: 'sedan',
    vehicleMakeModel: 'BMW M3 Competition',
    vehicleColor: '#1e3a8a',
    licensePlate: '7XYZ892',
    packageId: 'ceramic',
    packageName: 'Ceramic Shield Pro',
    addons: ['rainx'],
    totalAmount: 7000,
    date: 'Today',
    timeSlot: '10:00 AM',
    bayNumber: 1,
    status: 'in_progress',
    currentStage: 'brush_scrub',
    stageProgress: 68,
    startTime: Date.now() - 12 * 60 * 1000,
    createdAt: '2026-09-21 09:40',
    paymentMethod: 'stripe_card',
    paymentStatus: 'paid',
    notes: 'Please be careful around front carbon fiber lip.'
  },
  {
    id: 'AQ-9422',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@example.com',
    customerPhone: '(555) 781-9920',
    vehicleType: 'suv',
    vehicleMakeModel: 'Porsche Cayenne Turbo',
    vehicleColor: '#0f172a',
    licensePlate: 'CA-9092L',
    packageId: 'diamond',
    packageName: 'Diamond Concierge Auto Spa',
    addons: ['ozone', 'leather'],
    totalAmount: 15060,
    date: 'Today',
    timeSlot: '10:45 AM',
    bayNumber: 2,
    status: 'in_progress',
    currentStage: 'foam_cannon',
    stageProgress: 40,
    startTime: Date.now() - 6 * 60 * 1000,
    createdAt: '2026-09-21 10:15',
    paymentMethod: 'apple_pay',
    paymentStatus: 'paid',
    notes: 'Needs pet hair vacuum in rear boot.'
  },
  {
    id: 'AQ-9423',
    customerName: 'David Chen',
    customerEmail: 'd.chen@example.com',
    customerPhone: '(555) 612-4411',
    vehicleType: 'truck',
    vehicleMakeModel: 'Ford F-150 Raptor',
    vehicleColor: '#78350f',
    licensePlate: 'TEX-8147',
    packageId: 'deluxe',
    packageName: 'Deluxe Foam & Wheels',
    addons: [],
    totalAmount: 4320,
    date: 'Today',
    timeSlot: '11:30 AM',
    bayNumber: 3,
    status: 'booked',
    currentStage: 'idle',
    stageProgress: 0,
    createdAt: '2026-09-21 08:30',
    paymentMethod: 'stripe_card',
    paymentStatus: 'paid'
  },
  {
    id: 'AQ-9419',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@example.com',
    customerPhone: '(555) 902-1234',
    vehicleType: 'coupe',
    vehicleMakeModel: 'Audi RS5 Coupe',
    vehicleColor: '#dc2626',
    licensePlate: '9AUD401',
    packageId: 'ceramic',
    packageName: 'Ceramic Shield Pro',
    addons: ['rainx'],
    totalAmount: 7870,
    date: 'Today',
    timeSlot: '09:15 AM',
    bayNumber: 1,
    status: 'completed',
    currentStage: 'completed',
    stageProgress: 100,
    createdAt: '2026-09-21 08:50',
    paymentMethod: 'stripe_card',
    paymentStatus: 'paid'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    customerName: 'Liam Patterson',
    rating: 5,
    date: 'Yesterday',
    vehicleType: 'sedan',
    packageName: 'Ceramic Shield Pro',
    comment: 'The 3D live tracker in the app was so cool to watch while waiting in the customer lounge. Paint came out looking like liquid glass. The graphene coat is genuinely hydrophobic—water literally flew off driving on the highway.',
    tags: ['Liquid Glass Shine', 'Hydrophobic Finish', 'App Live Tracker'],
    verifiedWash: true,
    avatarBg: 'bg-indigo-600',
    likes: 19
  },
  {
    id: 'rev-2',
    customerName: 'Chloe Henderson',
    rating: 5,
    date: '2 days ago',
    vehicleType: 'suv',
    packageName: 'Diamond Concierge Auto Spa',
    comment: 'Best auto detailing in the city. The technician messaged me right when they started the ozone interior treatment. Smells like a brand new showroom car. Stripe checkout was instant.',
    tags: ['Showroom Fresh', 'Ozone Treatment', 'Fast Messaging'],
    verifiedWash: true,
    avatarBg: 'bg-emerald-600',
    likes: 14
  },
  {
    id: 'rev-3',
    customerName: 'Jordan Miller',
    rating: 5,
    date: '3 days ago',
    vehicleType: 'truck',
    packageName: 'Deluxe Foam & Wheels',
    comment: 'Brought in my Raptor covered in mud from a camping weekend. The undercarriage blast and rotary wheel scrubbing saved me hours. Rims are shining with zero brake dust residue.',
    tags: ['Mud Removal', 'Clean Rims', 'Great Value'],
    verifiedWash: true,
    avatarBg: 'bg-amber-600',
    likes: 8
  },
  {
    id: 'rev-4',
    customerName: 'Sophia Al-Mansoor',
    rating: 5,
    date: '5 days ago',
    vehicleType: 'coupe',
    packageName: 'Ceramic Shield Pro',
    comment: 'Very meticulous handling with low-profile sports cars. The soft-touch microfiber rollers didn’t leave a single swirl mark. Highly recommended!',
    tags: ['No Swirl Marks', 'Gentle On Paint', 'Five Stars'],
    verifiedWash: true,
    avatarBg: 'bg-rose-600',
    likes: 22
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'system',
    senderName: 'AquaGlow Bot',
    text: 'Welcome to AquaGlow Concierge. Your car wash status updates and live technician messages will appear here.',
    timestamp: '09:40 AM'
  },
  {
    id: 'msg-2',
    sender: 'technician',
    senderName: 'Bay 1 Lead: Alex R.',
    text: 'Hello Marcus! We’ve staged your BMW M3 in Bay 1. Noticed the note about the carbon front lip—we have dialed the contour rollers to low-clearance mode.',
    timestamp: '09:43 AM',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'msg-3',
    sender: 'customer',
    senderName: 'Marcus Vance',
    text: 'Awesome, thank you so much Alex! Appreciate the extra care.',
    timestamp: '09:45 AM'
  },
  {
    id: 'msg-4',
    sender: 'technician',
    senderName: 'Bay 1 Lead: Alex R.',
    text: 'Now applying the tri-color snow foam and starting the alloy wheel deep barrel blast. Looking razor sharp!',
    timestamp: '09:48 AM',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
  }
];

export const REVENUE_CHART_DATA: RevenueDataPoint[] = [
  { day: 'Mon', revenue: 184000, washes: 38, tips: 24000 },
  { day: 'Tue', revenue: 218000, washes: 44, tips: 28000 },
  { day: 'Wed', revenue: 253000, washes: 51, tips: 34000 },
  { day: 'Thu', revenue: 273000, washes: 55, tips: 40000 },
  { day: 'Fri', revenue: 369000, washes: 72, tips: 55000 },
  { day: 'Sat', revenue: 474000, washes: 96, tips: 75000 },
  { day: 'Sun', revenue: 427000, washes: 85, tips: 64000 }
];

export const PACKAGE_POPULARITY: PackageRevenueData[] = [
  { name: 'Deluxe Foam & Wheels', value: 42, revenue: 1856000, color: '#38bdf8' },
  { name: 'Ceramic Shield Pro', value: 31, revenue: 2378000, color: '#818cf8' },
  { name: 'Diamond Auto Spa', value: 16, revenue: 2060000, color: '#f43f5e' },
  { name: 'Express Hydro', value: 11, revenue: 272000, color: '#34d399' }
];

export const HOURLY_BAY_TRAFFIC = [
  { hour: '08 AM', washes: 6, capacity: 8 },
  { hour: '09 AM', washes: 8, capacity: 8 },
  { hour: '10 AM', washes: 8, capacity: 8 },
  { hour: '11 AM', washes: 7, capacity: 8 },
  { hour: '12 PM', washes: 8, capacity: 8 },
  { hour: '01 PM', washes: 7, capacity: 8 },
  { hour: '02 PM', washes: 6, capacity: 8 },
  { hour: '03 PM', washes: 8, capacity: 8 },
  { hour: '04 PM', washes: 8, capacity: 8 },
  { hour: '05 PM', washes: 7, capacity: 8 },
  { hour: '06 PM', washes: 5, capacity: 8 }
];
