/**
 * IIMC Silver Jubilee — Data Layer
 * In-memory store seeded with rich sample data.
 * For production persistence, replace with Vercel KV or Supabase.
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

const users = new Map<string, User>();
const travelStore = new Map<string, TravelInfo>();
const announcementsStore = new Map<string, Announcement>();

let seeded = false;
function seed() {
  if (seeded) return;
  seeded = true;

  const ADMIN_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'; // admin123
  const DEMO_HASH  = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'; // same for demo

  users.set('admin', {
    id: 'admin-001', username: 'admin', password: ADMIN_HASH,
    email: 'admin@iimcal.ac.in', fullName: 'Event Administrator',
    batch: '1999', programme: 'MBA', company: 'IIM Calcutta',
    designation: 'Event Coordinator', city: 'Kolkata', country: 'India',
    isAdmin: true, createdAt: new Date(Date.now() - 30*86400000).toISOString(),
  });

  const alumni = [
    { id:'u-001', username:'rahulsharma', email:'rahul@example.com', fullName:'Rahul Kumar Sharma',   batch:'1999', programme:'MBA',  company:'McKinsey & Company',  designation:'Senior Partner',    city:'Mumbai',    country:'India',     bio:'Strategy consulting and cricket!', linkedIn:'https://linkedin.com' },
    { id:'u-002', username:'priyamehra',  email:'priya@example.com', fullName:'Priya Mehra',           batch:'2000', programme:'MBA',  company:'Goldman Sachs',        designation:'Managing Director', city:'New York',  country:'USA',       bio:'25 years of finance across three continents.' },
    { id:'u-003', username:'amitbose',    email:'amit@example.com',  fullName:'Amit Bose',             batch:'1999', programme:'MBA',  company:'Tata Sons',            designation:'Group CFO',         city:'Kolkata',   country:'India',     bio:'Joka forever! Still remember the LAN gaming nights.' },
    { id:'u-004', username:'snehaverma', email:'sneha@example.com', fullName:'Sneha Verma',            batch:'2001', programme:'MBA',  company:'Unilever',             designation:'VP Marketing',      city:'Singapore', country:'Singapore', bio:'Brand building across Asia Pacific.' },
    { id:'u-005', username:'karthiknair', email:'karthik@example.com',fullName:'Karthik Nair',         batch:'2000', programme:'MBA',  company:'Google',               designation:'Director of Product',city:'Bangalore',country:'India',     bio:'Building products that matter.',  linkedIn:'https://linkedin.com' },
    { id:'u-006', username:'ritakapoor', email:'rita@example.com',  fullName:'Rita Kapoor',            batch:'1999', programme:'MBA',  company:'Sequoia Capital India', designation:'General Partner',   city:'Delhi',     country:'India' },
    { id:'u-007', username:'deepakjoshi',email:'deepak@example.com', fullName:'Deepak Joshi',          batch:'2001', programme:'MBAEx',company:'Infosys',              designation:'CTO',               city:'Hyderabad', country:'India',     bio:'Tech leadership and digital transformation.' },
    { id:'u-008', username:'ananyadas',  email:'ananya@example.com', fullName:'Ananya Das',            batch:'2000', programme:'MBA',  company:'WHO',                  designation:'Senior Advisor',    city:'Geneva',    country:'Switzerland',bio:'Health policy & international development.' },
  ];

  alumni.forEach(a => {
    users.set(a.username, { ...a, password: DEMO_HASH, createdAt: new Date(Date.now() - Math.random()*10*86400000).toISOString() });
  });

  travelStore.set('u-001', { userId:'u-001', arrivalDate:'2025-11-14', arrivalTime:'14:30', arrivalMode:'flight', departureDate:'2025-11-16', departureTime:'17:00', departureMode:'flight', flightTrainNumber:'AI 870', accommodationRequired:true, accommodationPreference:'campus', roomSharing:false, dietaryPreference:'vegetarian', updatedAt: new Date().toISOString() });
  travelStore.set('u-003', { userId:'u-003', arrivalDate:'2025-11-14', arrivalTime:'10:00', arrivalMode:'car', departureDate:'2025-11-16', departureTime:'14:00', departureMode:'car', accommodationRequired:false, accommodationPreference:'hotel', roomSharing:false, dietaryPreference:'non-vegetarian', updatedAt: new Date().toISOString() });

  const anns: Announcement[] = [
    { id:'ann-001', title:'🎉 Welcome to the Silver Jubilee Portal!', content:`Dear Batch 1999-2001 Alumni,\n\nWelcome to the official portal for IIM Calcutta's 25th Silver Jubilee Alumni Meet!\n\nThis is a momentous occasion — reconnect with batchmates, relive the legendary Joka experience, and celebrate 25 years of extraordinary journeys.\n\nEvent: November 14–16, 2025 | IIM Calcutta Campus, Joka, Kolkata\n\nPlease complete your profile and travel details at the earliest.\n\nWarm regards,\nSilver Jubilee Organising Committee`, category:'important', author:'Organising Committee', createdAt: new Date(Date.now()-14*86400000).toISOString(), pinned:true },
    { id:'ann-002', title:'📅 Full Event Schedule — Nov 14–16, 2025', content:`DAY 1 — THURSDAY, NOV 14 (Arrival)\n• 2:00 PM — Registration & check-in at MDC\n• 4:00 PM — Campus nostalgia walk\n• 6:30 PM — Welcome cocktails at AC Auditorium Lawn\n• 8:00 PM — Dinner & informal catch-up\n\nDAY 2 — FRIDAY, NOV 15 (Main Event)\n• 9:00 AM — Inaugural ceremony\n• 10:30 AM — "25 Years of Leadership" panel discussion\n• 1:00 PM — Lunch\n• 3:00 PM — Sports: cricket, badminton, football\n• 5:00 PM — Batch photo session\n• 7:00 PM — Gala Dinner & Silver Jubilee Awards Night\n• 9:00 PM — DJ Night\n\nDAY 3 — SATURDAY, NOV 16 (Farewell)\n• 9:00 AM — Breakfast\n• 10:30 AM — Alumni chapter meetings\n• 12:00 PM — Farewell lunch\n• 2:00 PM — Departures`, category:'event', author:'Event Committee', createdAt: new Date(Date.now()-10*86400000).toISOString(), pinned:true },
    { id:'ann-003', title:'🏨 Accommodation Options & Booking Deadline Oct 15', content:`ON-CAMPUS (Limited — 40 rooms)\n• IIM Calcutta Guest House, Joka\n• ₹3,500/night | Twin sharing ₹2,200/person\n• Includes breakfast\n• Priority: International attendees\n\nPARTNER HOTELS (shuttle provided)\n• The LaLiT Great Eastern Kolkata ⭐⭐⭐⭐⭐ — 45 min\n• Swissotel Kolkata ⭐⭐⭐⭐⭐ — 40 min\n• Novotel Kolkata ⭐⭐⭐⭐ — 35 min\n\nMention "IIMC Silver Jubilee" for special rates.\nDeadline: October 15, 2025`, category:'logistics', author:'Logistics Team', createdAt: new Date(Date.now()-7*86400000).toISOString(), pinned:false },
    { id:'ann-004', title:'✈️ Travel & Airport Transfer Details', content:`GETTING TO JOKA CAMPUS\nAddress: Diamond Harbour Road, Joka, Kolkata 700104\n\nFrom Airport (NSCBI): ~35 km | ~1.5 hours | Ola/Uber available\nFrom Howrah Station: ~20 km | ~1 hour\nFrom Sealdah Station: ~22 km | ~1.15 hours\n\nCAMPUS PICKUP (Nov 14 only)\nFree pickup from airport at 3 PM & 6 PM batches.\nUpdate your flight details in the Travel section to be included.\n\nNote: Ola/Uber is most reliable. Avoid relying on local autos for this route.`, category:'logistics', author:'Logistics Team', createdAt: new Date(Date.now()-5*86400000).toISOString(), pinned:false },
    { id:'ann-005', title:'📸 Memory Book & Video Tribute — Submit by Oct 31', content:`We're creating two Silver Jubilee keepsakes:\n\n1. COMMEMORATIVE MEMORY BOOK (hardbound)\n• Your "Then & Now" photo\n• 100-word message to batchmates\n• Career highlights\n\n2. VIDEO TRIBUTE\n• 15–30 second video message from each alumnus\n\nSubmit to: silverjubilee2025@gmail.com\nSubject: [Your Name] – Memory Submission\nDeadline: October 31, 2025\n\nEvery attendee gets a copy at the event!`, category:'general', author:'Media Team', createdAt: new Date(Date.now()-3*86400000).toISOString(), pinned:false },
    { id:'ann-006', title:'🏆 Silver Jubilee Award Nominations Open', content:`AWARD CATEGORIES\n• Distinguished Leader — Outstanding leadership in business/public service\n• Entrepreneurship Excellence — Built something remarkable\n• Global Impact — Made a difference at the global stage\n• Social Champion — Dedicated to social causes\n• Academic & Intellectual Contribution\n\nNOMINATE by emailing: silverjubilee2025@gmail.com\nSubject: Award Nomination – [Category] – [Nominee Name]\nInclude a 200-word write-up.\nDeadline: October 20, 2025\n\nAwardees felicitated at Gala Dinner, Nov 15.`, category:'event', author:'Awards Committee', createdAt: new Date(Date.now()-2*86400000).toISOString(), pinned:false },
  ];
  anns.forEach(a => announcementsStore.set(a.id, a));
}

seed();

export const db = {
  users: {
    findByUsername: (u: string) => users.get(u.toLowerCase()),
    findById: (id: string) => Array.from(users.values()).find(u => u.id === id),
    findByEmail: (email: string) => Array.from(users.values()).find(u => u.email === email),
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
    count: () => Array.from(users.values()).filter(u => !u.isAdmin).length,
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
