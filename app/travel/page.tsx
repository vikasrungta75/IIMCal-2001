'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Plane, Train, Car, Hotel, Home, Save, CheckCircle } from 'lucide-react';

export default function TravelPage() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    arrivalDate: '', arrivalTime: '', arrivalMode: 'flight',
    departureDate: '', departureTime: '', departureMode: 'flight',
    flightTrainNumber: '', accommodationRequired: true,
    accommodationPreference: 'campus', roomSharing: false,
    dietaryPreference: 'vegetarian', specialRequirements: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/profile').then(r => r.json()),
      fetch('/api/travel').then(r => r.json()),
    ]).then(([u, t]) => {
      setUser(u);
      if (t) setForm((p: any) => ({ ...p, ...t }));
      setLoading(false);
    });
  }, []);

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/travel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const ModeBtn = ({ mode, current, onChange, icon: Icon, label }: any) => (
    <button type="button" onClick={() => onChange(mode)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${current === mode ? 'border-navy text-navy bg-navy/5' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
      style={current === mode ? { borderColor: '#003366', color: '#003366', background: 'rgba(0,51,102,0.05)' } : {}}>
      <Icon size={15} />
      {label}
    </button>
  );

  if (loading) return <><Navbar user={null} /><div className="pt-32 text-center text-gray-500">Loading…</div></>;

  return (
    <>
      <Navbar user={{ username: user?.username, fullName: user?.fullName, isAdmin: !!user?.isAdmin }} />
      <main className="pt-20 pb-12 px-4 max-w-3xl mx-auto">
        <div className="mt-6 mb-8">
          <h1 className="font-display text-2xl font-bold mb-1" style={{ color: '#003366' }}>Travel & Accommodation</h1>
          <p className="text-gray-500 text-sm">Help us plan logistics by sharing your travel details for the Silver Jubilee.</p>
        </div>

        {saved && (
          <div className="mb-6 px-4 py-3 rounded-lg text-sm text-green-700 bg-green-50 border border-green-200 flex items-center gap-2">
            <CheckCircle size={16} /> Travel details saved successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Arrival */}
          <div className="iimc-card p-6">
            <h2 className="font-semibold text-lg mb-5 flex items-center gap-2" style={{ color: '#003366' }}>
              <span className="text-xl">🛬</span> Arrival Details
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Mode of Travel</label>
                <div className="flex flex-wrap gap-2">
                  <ModeBtn mode="flight" current={form.arrivalMode} onChange={(v: string) => set('arrivalMode', v)} icon={Plane} label="Flight" />
                  <ModeBtn mode="train" current={form.arrivalMode} onChange={(v: string) => set('arrivalMode', v)} icon={Train} label="Train" />
                  <ModeBtn mode="car" current={form.arrivalMode} onChange={(v: string) => set('arrivalMode', v)} icon={Car} label="Car / Road" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Arrival Date</label>
                  <input className="iimc-input" type="date" min="2025-11-13" max="2025-11-15" value={form.arrivalDate} onChange={e => set('arrivalDate', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Arrival Time</label>
                  <input className="iimc-input" type="time" value={form.arrivalTime} onChange={e => set('arrivalTime', e.target.value)} />
                </div>
              </div>
              {(form.arrivalMode === 'flight' || form.arrivalMode === 'train') && (
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">
                    {form.arrivalMode === 'flight' ? 'Flight Number' : 'Train Number / Name'}
                  </label>
                  <input className="iimc-input" placeholder={form.arrivalMode === 'flight' ? 'e.g. AI 201' : 'e.g. 12313 Coromandel Express'} value={form.flightTrainNumber} onChange={e => set('flightTrainNumber', e.target.value)} />
                </div>
              )}
            </div>
          </div>

          {/* Departure */}
          <div className="iimc-card p-6">
            <h2 className="font-semibold text-lg mb-5 flex items-center gap-2" style={{ color: '#003366' }}>
              <span className="text-xl">🛫</span> Departure Details
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Mode of Travel</label>
                <div className="flex flex-wrap gap-2">
                  <ModeBtn mode="flight" current={form.departureMode} onChange={(v: string) => set('departureMode', v)} icon={Plane} label="Flight" />
                  <ModeBtn mode="train" current={form.departureMode} onChange={(v: string) => set('departureMode', v)} icon={Train} label="Train" />
                  <ModeBtn mode="car" current={form.departureMode} onChange={(v: string) => set('departureMode', v)} icon={Car} label="Car / Road" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Departure Date</label>
                  <input className="iimc-input" type="date" min="2025-11-15" max="2025-11-17" value={form.departureDate} onChange={e => set('departureDate', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Departure Time</label>
                  <input className="iimc-input" type="time" value={form.departureTime} onChange={e => set('departureTime', e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* Accommodation */}
          <div className="iimc-card p-6">
            <h2 className="font-semibold text-lg mb-5 flex items-center gap-2" style={{ color: '#003366' }}>
              <span className="text-xl">🏨</span> Accommodation
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Do you need accommodation?</label>
                <div className="flex gap-3">
                  {[true, false].map((val) => (
                    <button key={String(val)} type="button" onClick={() => set('accommodationRequired', val)}
                      className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-medium transition-all`}
                      style={form.accommodationRequired === val ? { borderColor: '#003366', color: '#003366', background: 'rgba(0,51,102,0.05)' } : { borderColor: '#e5e7eb', color: '#6b7280' }}>
                      {val ? 'Yes, arrange for me' : 'No, I\'ll manage'}
                    </button>
                  ))}
                </div>
              </div>

              {form.accommodationRequired && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Preference</label>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => set('accommodationPreference', 'campus')}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 text-sm font-medium transition-all"
                        style={form.accommodationPreference === 'campus' ? { borderColor: '#003366', color: '#003366', background: 'rgba(0,51,102,0.05)' } : { borderColor: '#e5e7eb', color: '#6b7280' }}>
                        <Home size={15} /> On-Campus Guest House
                      </button>
                      <button type="button" onClick={() => set('accommodationPreference', 'hotel')}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 text-sm font-medium transition-all"
                        style={form.accommodationPreference === 'hotel' ? { borderColor: '#003366', color: '#003366', background: 'rgba(0,51,102,0.05)' } : { borderColor: '#e5e7eb', color: '#6b7280' }}>
                        <Hotel size={15} /> Hotel (with shuttle)
                      </button>
                    </div>
                  </div>

                  {form.accommodationPreference === 'campus' && (
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Room Sharing</label>
                      <div className="flex gap-3">
                        {[false, true].map((val) => (
                          <button key={String(val)} type="button" onClick={() => set('roomSharing', val)}
                            className="flex-1 py-2.5 rounded-lg border-2 text-sm font-medium transition-all"
                            style={form.roomSharing === val ? { borderColor: '#003366', color: '#003366', background: 'rgba(0,51,102,0.05)' } : { borderColor: '#e5e7eb', color: '#6b7280' }}>
                            {val ? 'Happy to share' : 'Single room'}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Dietary & Special */}
          <div className="iimc-card p-6">
            <h2 className="font-semibold text-lg mb-5 flex items-center gap-2" style={{ color: '#003366' }}>
              <span className="text-xl">🍽️</span> Preferences
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Dietary Preference</label>
                <div className="flex flex-wrap gap-2">
                  {['vegetarian', 'non-vegetarian', 'vegan', 'jain', 'no-preference'].map(d => (
                    <button key={d} type="button" onClick={() => set('dietaryPreference', d)}
                      className="px-4 py-2 rounded-lg border-2 text-sm capitalize font-medium transition-all"
                      style={form.dietaryPreference === d ? { borderColor: '#003366', color: '#003366', background: 'rgba(0,51,102,0.05)' } : { borderColor: '#e5e7eb', color: '#6b7280' }}>
                      {d.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">Special Requirements</label>
                <textarea className="iimc-input resize-none" rows={3}
                  placeholder="Wheelchair access, allergies, medical needs, or any other requirements…"
                  value={form.specialRequirements}
                  onChange={e => set('specialRequirements', e.target.value)} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving}
            className="gold-btn w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
            {saving ? <div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving…' : 'Save Travel Details'}
          </button>
        </form>

        {/* Info Box */}
        <div className="mt-6 rounded-xl p-5 text-sm" style={{ background: 'rgba(0,51,102,0.05)', border: '1px solid rgba(0,51,102,0.1)' }}>
          <h3 className="font-semibold mb-2" style={{ color: '#003366' }}>📍 Getting to IIMC Joka Campus</h3>
          <ul className="space-y-1 text-gray-600 text-sm">
            <li>• <strong>Airport (NSCBI):</strong> ~1.5 hours by taxi/cab</li>
            <li>• <strong>Howrah Station:</strong> ~1 hour by taxi/cab</li>
            <li>• <strong>Sealdah Station:</strong> ~1.5 hours by taxi/cab</li>
            <li>• <strong>Address:</strong> Diamond Harbour Road, Joka, Kolkata 700104</li>
            <li>• <strong>Campus pickup</strong> will be arranged for Nov 14 arrivals. Shuttle from partner hotels on all days.</li>
          </ul>
        </div>
      </main>
    </>
  );
}
