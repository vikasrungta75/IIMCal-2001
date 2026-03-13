/**
 * IIMC Silver Jubilee — Data Layer
 * 
 * TWO PROFILES:
 * - Admin: username/password only, isAdmin=true, sees only /admin
 * - Students: OAuth only (Google/Microsoft), status: pending|approved|rejected
 */

export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  fullName: string;
  batch: string;
  programme: string;
  phone?: string;
  company?: string;
  designation?: string;
  city?: string;
  country?: string;
  bio?: string;
  linkedIn?: string;
  createdAt: string;
  isAdmin?: boolean;
  // Student approval workflow
  status?: 'pending' | 'approved' | 'rejected';
  profileSubmitted?: boolean; // true once student fills & submits profile
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  oauthProvider?: 'google' | 'azure-ad'; // which OAuth they used
}

export interface TravelInfo {
  userId: string;
  arrivalDate: string;
  arrivalTime: string;
  arrivalMode: string;
  departureDate: string;
  departureTime: string;
  departureMode: string;
  flightTrainNumber?: string;
  accommodationRequired: boolean;
  accommodationPreference: string;
  roomSharing: boolean;
  dietaryPreference: string;
  specialRequirements?: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  createdAt: string;
  pinned: boolean;
}

// Use globalThis to persist data across hot reloads in the same serverless instance
// For true persistence across deployments, migrate to Vercel KV or a database
const g = globalThis as any;
if (!g.__iimcUsers) g.__iimcUsers = new Map<string, User>();
if (!g.__iimcTravel) g.__iimcTravel = new Map<string, TravelInfo>();
if (!g.__iimcAnnouncements) g.__iimcAnnouncements = new Map<string, Announcement>();
const users: Map<string, User> = g.__iimcUsers;
const travelStore: Map<string, TravelInfo> = g.__iimcTravel;
const announcementsStore: Map<string, Announcement> = g.__iimcAnnouncements;

if (!g.__iimcSeeded) g.__iimcSeeded = false;
function seed() {
  if (g.__iimcSeeded) return;
  g.__iimcSeeded = true;

  // ── ADMIN ACCOUNT ──
  // Username: iimcadmin2025
  // Password: Joka@Admin2025
  const ADMIN_HASH = '$2a$10$2O5OMgJao691f2wynEamKu4uy38gTrjH6zgTMIkgVv9Zq2D4QShq.';

  users.set('iimcadmin2025', {
    id: 'admin-001',
    username: 'iimcadmin2025',
    password: ADMIN_HASH,
    email: 'admin@iimcal.ac.in',
    fullName: 'Event Administrator',
    batch: '1999',
    programme: 'MBA',
    company: 'IIM Calcutta',
    designation: 'Silver Jubilee Coordinator',
    city: 'Kolkata',
    country: 'India',
    isAdmin: true,
    status: 'approved',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  });

  // ── DUMMY TEST STUDENTS (pre-approved) ──
  // These simulate students who have registered via OAuth and been approved
  const DEMO_HASH = '$2a$10$5pn2Y.47D9qXKPZ6OdIaAupYnPDj5cF9ydagaWMuBT7UEmkAO69d6'; // admin123

  const alumni = [
    { id:'u-001', username:'rahul.sharma.test', email:'rahul.test@gmail.com', fullName:'Rahul Kumar Sharma', batch:'1999', programme:'MBA', company:'McKinsey & Company', designation:'Senior Partner', city:'Mumbai', country:'India', bio:'Strategy consulting and cricket!', linkedIn:'https://linkedin.com', status:'approved' as const, oauthProvider:'google' as const },
    { id:'u-002', username:'priya.mehra.test', email:'priya.test@outlook.com', fullName:'Priya Mehra', batch:'2000', programme:'MBA', company:'Goldman Sachs', designation:'Managing Director', city:'New York', country:'USA', bio:'25 years of finance across three continents.', status:'approved' as const, oauthProvider:'azure-ad' as const },
    { id:'u-003', username:'amit.bose.pending', email:'amit.pending@gmail.com', fullName:'Amit Bose', batch:'1999', programme:'MBA', company:'Tata Sons', designation:'Group CFO', city:'Kolkata', country:'India', bio:'', status:'pending' as const, oauthProvider:'google' as const },
  ];

  alumni.forEach(a => {
    users.set(a.username, {
      ...a,
      password: DEMO_HASH,
      profileSubmitted: a.status === 'approved',
      createdAt: new Date(Date.now() - Math.random() * 10 * 86400000).toISOString(),
      phone: '+91 98765 43210',
    });
  });

  travelStore.set('u-001', { userId:'u-001', arrivalDate:'2027-12-12', arrivalTime:'14:30', arrivalMode:'flight', departureDate:'2027-12-14', departureTime:'17:00', departureMode:'flight', flightTrainNumber:'AI 870', accommodationRequired:true, accommodationPreference:'campus', roomSharing:false, dietaryPreference:'vegetarian', updatedAt: new Date().toISOString() });

  const anns: Announcement[] = [
    { id:'ann-001', title:'🎉 Welcome to the Silver Jubilee Portal!', content:`Dear Batch 1999-2001 Alumni,\n\nWelcome to the official portal for IIM Calcutta's 25th Silver Jubilee Alumni Meet!\n\nThis is a momentous occasion — reconnect with batchmates, relive the legendary Joka experience, and celebrate 25 years of extraordinary journeys.\n\nEvent: December 12–14, 2027 | IIM Calcutta Campus, Joka, Kolkata\n\nPlease complete your profile and travel details at the earliest.\n\nWarm regards,\nSilver Jubilee Organising Committee`, category:'important', author:'Organising Committee', createdAt: new Date(Date.now()-14*86400000).toISOString(), pinned:true },
    { id:'ann-002', title:'📅 Full Event Schedule — Dec 12–14, 2027', content:`DAY 1 — THURSDAY, NOV 14 (Arrival)\n• 2:00 PM — Registration & check-in at MDC\n• 4:00 PM — Campus nostalgia walk\n• 6:30 PM — Welcome cocktails at AC Auditorium Lawn\n• 8:00 PM — Dinner & informal catch-up\n\nDAY 2 — FRIDAY, NOV 15 (Main Event)\n• 9:00 AM — Inaugural ceremony\n• 10:30 AM — "25 Years of Leadership" panel discussion\n• 1:00 PM — Lunch\n• 3:00 PM — Sports: cricket, badminton, football\n• 5:00 PM — Batch photo session\n• 7:00 PM — Gala Dinner & Silver Jubilee Awards Night\n• 9:00 PM — DJ Night\n\nDAY 3 — SATURDAY, NOV 16 (Farewell)\n• 9:00 AM — Breakfast\n• 10:30 AM — Alumni chapter meetings\n• 12:00 PM — Farewell lunch\n• 2:00 PM — Departures`, category:'event', author:'Event Committee', createdAt: new Date(Date.now()-10*86400000).toISOString(), pinned:true },
    { id:'ann-003', title:'🏨 Accommodation Options & Booking Deadline Oct 15', content:`ON-CAMPUS (Limited — 40 rooms)\n• IIM Calcutta Guest House, Joka\n• ₹3,500/night | Twin sharing ₹2,200/person\n• Includes breakfast\n\nPARTNER HOTELS (shuttle provided)\n• The LaLiT Great Eastern Kolkata ⭐⭐⭐⭐⭐\n• Swissotel Kolkata ⭐⭐⭐⭐⭐\n• Novotel Kolkata ⭐⭐⭐⭐\n\nMention "IIMC Silver Jubilee" for special rates.\nDeadline: October 15, 2025`, category:'logistics', author:'Logistics Team', createdAt: new Date(Date.now()-7*86400000).toISOString(), pinned:false },
    { id:'ann-004', title:'✈️ Travel & Airport Transfer Details', content:`GETTING TO JOKA CAMPUS\nAddress: Diamond Harbour Road, Joka, Kolkata 700104\n\nFrom Airport (NSCBI): ~35 km | ~1.5 hours | Ola/Uber available\nFrom Howrah Station: ~20 km | ~1 hour\nFrom Sealdah Station: ~22 km | ~1.15 hours\n\nCAMPUS PICKUP (Dec 12 only)\nFree pickup from airport at 3 PM & 6 PM batches.\nUpdate your flight details in the Travel section to be included.`, category:'logistics', author:'Logistics Team', createdAt: new Date(Date.now()-5*86400000).toISOString(), pinned:false },
  ];
  anns.forEach(a => announcementsStore.set(a.id, a));
}

seed();

export const db = {
  users: {
    findByUsername: (u: string) => users.get(u.toLowerCase()),
    findById: (id: string) => Array.from(users.values()).find(u => u.id === id),
    findByEmail: (email: string) => Array.from(users.values()).find(u => u.email?.toLowerCase() === email?.toLowerCase()),
    create: (user: User) => { users.set(user.username.toLowerCase(), user); return user; },
    update: (username: string, data: Partial<User>) => {
      const u = users.get(username.toLowerCase());
      if (!u) return null;
      const updated = { ...u, ...data };
      users.set(username.toLowerCase(), updated);
      return updated;
    },
    getAll: (): Omit<User,'password'>[] =>
      Array.from(users.values())
        .filter(u => !u.isAdmin)
        .map(({ password, ...r }) => r)
        .sort((a, b) => a.fullName.localeCompare(b.fullName)),
    // Only approved students for directory
    getAllApproved: (): Omit<User,'password'>[] =>
      Array.from(users.values())
        .filter(u => !u.isAdmin && u.status === 'approved')
        .map(({ password, ...r }) => r)
        .sort((a, b) => a.fullName.localeCompare(b.fullName)),
    getPending: (): Omit<User,'password'>[] =>
      Array.from(users.values())
        .filter(u => !u.isAdmin && u.status === 'pending' && u.profileSubmitted)
        .map(({ password, ...r }) => r)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    count: () => Array.from(users.values()).filter(u => !u.isAdmin && u.status === 'approved').length,
    countPending: () => Array.from(users.values()).filter(u => !u.isAdmin && u.status === 'pending' && u.profileSubmitted).length,
    approve: (username: string) => {
      const u = users.get(username.toLowerCase());
      if (!u) return null;
      const updated = { ...u, status: 'approved' as const, approvedAt: new Date().toISOString() };
      users.set(username.toLowerCase(), updated);
      return updated;
    },
    reject: (username: string, reason: string) => {
      const u = users.get(username.toLowerCase());
      if (!u) return null;
      const updated = { ...u, status: 'rejected' as const, rejectionReason: reason };
      users.set(username.toLowerCase(), updated);
      return updated;
    },
  },
  travel: {
    get: (userId: string) => travelStore.get(userId),
    upsert: (info: TravelInfo) => { travelStore.set(info.userId, info); return info; },
    getAll: () => Array.from(travelStore.values()),
    count: () => travelStore.size,
    countWithAccommodation: () => Array.from(travelStore.values()).filter(t => t.accommodationRequired).length,
  },
  announcements: {
    getAll: () => Array.from(announcementsStore.values()).sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }),
    create: (a: Announcement) => { announcementsStore.set(a.id, a); return a; },
    delete: (id: string) => announcementsStore.delete(id),
    count: () => announcementsStore.size,
  },
};
