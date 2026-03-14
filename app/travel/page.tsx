'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Plane, Train, Car, Hotel, Home, Save, CheckCircle, MapPin, Clock } from 'lucide-react';

const IMGS = {
  howrah: '/images/howrah.jpg',
  kolkataTaxi: '/images/taxi.jpg',
  victoria: '/images/victoria.jpg',
  campus: '/images/campus.jpg',
};

const travelModeIcon = (mode: string) => {
  if (mode === 'flight') return <Plane size={16} />;
  if (mode === 'train') return <Train size={16} />;
  return <Car size={16} />;
};

export default function TravelPage() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    arrivalDate: '2026-12-12', arrivalTime: '14:00', arrivalMode: 'flight',
    departureDate: '2026-12-14', departureTime: '15:00', departureMode: 'flight',
    flightTrainNumber: '', accommodationRequired: false, accommodationPreference: 'campus',
    roomSharing: false, dietaryPreference: 'vegetarian', specialRequirements: '',
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/travel').then(r => r.json()),
      fetch('/api/profile').then(r => r.json()),
    ]).then(([travel, profile]) => {
      if (!profile || profile.error) { window.location.href = '/login'; return; }
      setUser(profile);
      if (travel && !travel.error) setForm((p: any) => ({ ...p, ...travel }));
      setLoading(false);
    }).catch(() => { window.location.href = '/login'; });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/travel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const field = (label: string, el: React.ReactNode) => (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: '#003366' }}>{label}</label>
      {el}
    </div>
  );

  const sel = (key: string, opts: [string, string][]) => (
    <select className="iimc-input" value={(form as any)[key]} onChange={e => setForm((p: any) => ({ ...p, [key]: e.target.value }))}>
      {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );

  return (
    <>
      <Navbar user={user ? { username: user.username, fullName: user.fullName, isAdmin: user.isAdmin } : null} />

      {/* Hero */}
      <div className="relative pt-16" style={{ height: 220 }}>
        <img src={IMGS.howrah} alt="Howrah Bridge" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,51,102,0.90), rgba(0,80,0,0.7))' }} />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <Plane size={36} style={{ color: '#C8A951' }} className="mb-3" />
          <h1 className="font-display text-4xl font-bold text-white mb-2">Travel & Accommodation</h1>
          <p style={{ color: '#E8D5A3' }} className="font-crimson text-lg">Help us plan your journey to Joka</p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-10">

        {/* Getting Here Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {[
            { img: IMGS.kolkataTaxi, icon: '🚕', title: 'From Airport', desc: 'NSCBI → Joka: ~35 km, ~1.5 hrs via Ola/Uber. Campus pickup on Dec 12 at 3 PM & 6 PM.' },
            { img: IMGS.howrah, icon: '🚂', title: 'From Station', desc: 'Howrah Station → Joka: ~20 km, ~1 hr. Sealdah → Joka: ~22 km, ~1.15 hrs.' },
            { img: IMGS.campus, icon: '🏫', title: 'Campus Address', desc: 'Diamond Harbour Road, Joka, Kolkata – 700 104. On the southern outskirts of the city.' },
          ].map(({ img, icon, title, desc }) => (
            <div key={title} className="iimc-card overflow-hidden">
              <div className="relative" style={{ height: 100 }}>
                <img src={img} alt={title} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'rgba(0,26,51,0.6)' }} />
                <div className="absolute bottom-2 left-3 flex items-center gap-2">
                  <span className="text-xl">{icon}</span>
                  <span className="font-semibold text-white text-sm">{title}</span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading your travel details…</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Arrival */}
              <div className="iimc-card p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,51,102,0.1)' }}>
                    <Plane size={18} style={{ color: '#003366' }} />
                  </div>
                  <h2 className="font-display text-lg font-bold" style={{ color: '#003366' }}>Arrival Details</h2>
                </div>
                <div className="space-y-4">
                  {field('Arrival Date', <input type="date" className="iimc-input" value={form.arrivalDate} onChange={e => setForm(p => ({ ...p, arrivalDate: e.target.value }))} />)}
                  {field('Arrival Time', <input type="time" className="iimc-input" value={form.arrivalTime} onChange={e => setForm(p => ({ ...p, arrivalTime: e.target.value }))} />)}
                  {field('Mode of Travel', sel('arrivalMode', [['flight', '✈️ Flight'], ['train', '🚂 Train'], ['car', '🚗 Car/Road']]))}
                  {field('Flight / Train Number (Optional)', <input className="iimc-input" placeholder="e.g. AI 870 or 12301" value={form.flightTrainNumber} onChange={e => setForm(p => ({ ...p, flightTrainNumber: e.target.value }))} />)}
                </div>
              </div>

              {/* Departure */}
              <div className="iimc-card p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,51,102,0.1)' }}>
                    <Plane size={18} style={{ color: '#003366', transform: 'scaleX(-1)' }} />
                  </div>
                  <h2 className="font-display text-lg font-bold" style={{ color: '#003366' }}>Departure Details</h2>
                </div>
                <div className="space-y-4">
                  {field('Departure Date', <input type="date" className="iimc-input" value={form.departureDate} onChange={e => setForm(p => ({ ...p, departureDate: e.target.value }))} />)}
                  {field('Departure Time', <input type="time" className="iimc-input" value={form.departureTime} onChange={e => setForm(p => ({ ...p, departureTime: e.target.value }))} />)}
                  {field('Mode of Travel', sel('departureMode', [['flight', '✈️ Flight'], ['train', '🚂 Train'], ['car', '🚗 Car/Road']]))}
                  {field('Dietary Preference', sel('dietaryPreference', [['vegetarian', '🥗 Vegetarian'], ['non-vegetarian', '🍗 Non-Vegetarian'], ['vegan', '🌱 Vegan'], ['jain', '🙏 Jain']]))}
                </div>
              </div>

              {/* Accommodation */}
              <div className="iimc-card p-6 lg:col-span-2">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,51,102,0.1)' }}>
                    <Hotel size={18} style={{ color: '#003366' }} />
                  </div>
                  <h2 className="font-display text-lg font-bold" style={{ color: '#003366' }}>Accommodation</h2>
                </div>

                {/* Accommodation photo strip */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { img: IMGS.campus, label: 'On-Campus MDC', detail: '₹3,500/night · Incl. breakfast' },
                    { img: IMGS.victoria, label: 'Partner Hotels', detail: 'LaLiT, Swissotel, Novotel' },
                    { img: IMGS.kolkataTaxi, label: 'Shuttle Service', detail: 'Hotels ↔ Campus, daily' },
                  ].map(({ img, label, detail }) => (
                    <div key={label} className="rounded-xl overflow-hidden border border-gray-100">
                      <div className="relative" style={{ height: 80 }}>
                        <img src={img} alt={label} className="w-full h-full object-cover" />
                        <div className="absolute inset-0" style={{ background: 'rgba(0,26,51,0.5)' }} />
                        <p className="absolute bottom-1.5 left-2 text-white text-xs font-semibold">{label}</p>
                      </div>
                      <div className="p-2 text-xs text-gray-500 text-center">{detail}</div>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <label className="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
                    style={{ borderColor: form.accommodationRequired ? '#003366' : '#e5e7eb', background: form.accommodationRequired ? 'rgba(0,51,102,0.05)' : 'white' }}>
                    <input type="checkbox" checked={form.accommodationRequired} onChange={e => setForm(p => ({ ...p, accommodationRequired: e.target.checked }))} className="w-4 h-4 accent-navy" />
                    <div>
                      <div className="font-medium text-sm" style={{ color: '#003366' }}>Need Accommodation</div>
                      <div className="text-xs text-gray-500">Book a spot for Dec 12–14</div>
                    </div>
                  </label>
                  {form.accommodationRequired && (
                    <>
                      {field('Preference', sel('accommodationPreference', [['campus', '🏫 On-Campus MDC'], ['hotel', '🏨 Partner Hotel'], ['self', '🏠 Self-arranged']]))}
                      <label className="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
                        style={{ borderColor: form.roomSharing ? '#003366' : '#e5e7eb' }}>
                        <input type="checkbox" checked={form.roomSharing} onChange={e => setForm(p => ({ ...p, roomSharing: e.target.checked }))} className="w-4 h-4 accent-navy" />
                        <div>
                          <div className="font-medium text-sm" style={{ color: '#003366' }}>Open to Sharing</div>
                          <div className="text-xs text-gray-500">Reduce cost by sharing room</div>
                        </div>
                      </label>
                    </>
                  )}
                </div>

                <div className="mt-4">
                  {field('Special Requirements / Notes', <textarea className="iimc-input" rows={2} placeholder="Accessibility needs, medical requirements, or anything else…" value={form.specialRequirements} onChange={e => setForm(p => ({ ...p, specialRequirements: e.target.value }))} />)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-8">
              <p className="text-xs text-gray-400 flex items-center gap-1"><Clock size={11} /> Last saved automatically</p>
              <button type="submit" disabled={saving}
                className="gold-btn px-8 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-60">
                {saved ? <><CheckCircle size={18} /> Saved!</> : saving ? 'Saving…' : <><Save size={18} /> Save Travel Details</>}
              </button>
            </div>
          </form>
        )}
      </main>
    </>
  );
}
