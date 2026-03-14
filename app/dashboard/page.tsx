import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { User, Plane, Bell, Users, Calendar, MapPin, Award, Clock } from 'lucide-react';

const IMGS = {
  campus: '/images/campus.jpg',
  howrah: '/images/howrah.jpg',
  victoria: '/images/victoria.jpg',
};

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect('/login');
  if (session.isAdmin) redirect('/admin');

  // Look up user - try username first, fall back to email
  let user = session.username ? await db.users.findByUsername(session.username) : null;
  if (!user && session.email) user = await db.users.findByEmail(session.email);
  if (!user) redirect('/login');

  // Always use DB status (not JWT - JWT can be stale)
  if (!user.profileSubmitted) redirect('/complete-profile');
  if (user.status === 'rejected') redirect('/login?error=rejected');
  if (user.status !== 'approved') redirect('/pending');

  const [travel, announcements, alumniCount, annCount] = await Promise.all([
    db.travel.get(user.id),
    db.announcements.getAll(),
    db.users.count(),
    db.announcements.count(),
  ]);
  const latestAnns = announcements.slice(0, 3);
  const profileComplete = !!(user.company && user.phone && user.city);

  return (
    <>
      <Navbar user={{ username: user.username, fullName: user.fullName, isAdmin: false }} />
      <main className="pb-12 max-w-7xl mx-auto">

        {/* Hero Banner */}
        <div className="relative overflow-hidden" style={{ minHeight: 240 }}>
          <img src={IMGS.campus} alt="IIM Calcutta Campus"
            className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: 'center 40%' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,51,102,0.93) 0%, rgba(0,26,51,0.88) 100%)' }} />
          <div className="relative z-10 px-6 pt-28 pb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <div className="badge-gold inline-block mb-3">Silver Jubilee 2026</div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
                Welcome back, {user.fullName.split(' ')[0]}! 🎓
              </h1>
              <p className="text-blue-200">
                {user.programme} · Batch {user.batch} &nbsp;·&nbsp; {user.company || 'Update your profile'}
              </p>
            </div>
            <div className="text-right hidden md:block">
              <div className="text-6xl font-display font-black" style={{ color: '#C8A951' }}>25</div>
              <div className="text-blue-300 text-sm">Years of Excellence</div>
            </div>
          </div>
        </div>

        <div className="px-4 mt-6">
          {/* Event date card */}
          <div className="iimc-card p-5 mb-6 flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,51,102,0.1)' }}>
                <Calendar size={20} style={{ color: '#003366' }} />
              </div>
              <div>
                <div className="font-semibold" style={{ color: '#003366' }}>Event: December 12–14, 2026</div>
                <div className="text-sm text-gray-500 flex items-center gap-1"><MapPin size={12} /> Joka Campus, Kolkata</div>
              </div>
            </div>
            <div className="flex gap-3">
              {[{val:'3',label:'Days'},{val:'Dec',label:'Month'},{val:'2026',label:'Year'}].map(({val,label}) => (
                <div key={label} className="text-center px-4 py-2 rounded-lg" style={{ background: '#f0ebe0' }}>
                  <div className="font-display text-xl font-bold" style={{ color: '#003366' }}>{val}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Profile alert */}
          {!profileComplete && (
            <div className="rounded-xl p-4 mb-6 flex items-center gap-3 justify-between"
              style={{ background: 'rgba(200,169,81,0.1)', border: '1px solid rgba(200,169,81,0.3)' }}>
              <div className="flex items-center gap-3">
                <div className="text-2xl">⚠️</div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: '#8a6b1a' }}>Your profile is incomplete</div>
                  <div className="text-xs text-gray-600">Add your phone, company and location so batchmates can find you.</div>
                </div>
              </div>
              <Link href="/profile" className="gold-btn px-4 py-2 rounded-lg text-sm whitespace-nowrap">Complete Profile</Link>
            </div>
          )}

          {/* Quick actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { href: '/profile', icon: User, label: 'My Profile', desc: 'Update your info', color: '#003366' },
              { href: '/travel', icon: Plane, label: 'Travel & Stay', desc: travel ? 'Details saved ✓' : 'Add travel plans', color: travel ? '#166534' : '#003366' },
              { href: '/announcements', icon: Bell, label: 'Announcements', desc: `${annCount} updates`, color: '#8B0000' },
              { href: '/alumni', icon: Users, label: 'Alumni Directory', desc: `${alumniCount} registered`, color: '#003366' },
            ].map(({ href, icon: Icon, label, desc, color }) => (
              <Link key={href} href={href} className="iimc-card p-5 block hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}15` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <div className="font-semibold text-sm mb-0.5" style={{ color: '#1a1a2e' }}>{label}</div>
                <div className="text-xs text-gray-500">{desc}</div>
              </Link>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Announcements */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-bold" style={{ color: '#003366' }}>Latest Announcements</h2>
                  <Link href="/announcements" className="text-sm font-medium hover:underline" style={{ color: '#003366' }}>View all →</Link>
                </div>
                <div className="space-y-4">
                  {latestAnns.map((a) => (
                    <div key={a.id} className="iimc-card p-5">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-base leading-snug" style={{ color: '#1a1a2e' }}>{a.title}</h3>
                        {a.pinned && <span className="badge-gold shrink-0">Pinned</span>}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">{a.content.split('\n')[0]}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock size={12} />
                        {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kolkata strip */}
              <div className="iimc-card p-5">
                <h3 className="font-display text-lg font-bold mb-4" style={{ color: '#003366' }}>📍 The City of Joy Awaits</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[{img:IMGS.howrah,label:'Howrah Bridge'},{img:IMGS.victoria,label:'Victoria Memorial'},{img:IMGS.campus,label:'Joka Campus'}].map(({img,label}) => (
                    <div key={label} className="relative rounded-xl overflow-hidden" style={{ height: 110 }}>
                      <img src={img} alt={label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />
                      <p className="absolute bottom-2 left-2 text-white text-xs font-semibold">{label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">December 12–14, 2026 · Diamond Harbour Road, Joka, Kolkata</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="iimc-card p-5">
                <h3 className="font-display text-lg font-bold mb-4" style={{ color: '#003366' }}>Event Schedule</h3>
                <div className="space-y-3">
                  {[{day:'Dec 12',event:'Arrival & Welcome Dinner',icon:'🛬'},{day:'Dec 13',event:'Main Event & Gala Night',icon:'🎉'},{day:'Dec 14',event:'Farewell & Departures',icon:'🛫'}].map(({day,event,icon}) => (
                    <div key={day} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: '#f8f4ec' }}>
                      <span className="text-2xl">{icon}</span>
                      <div>
                        <div className="text-xs font-semibold" style={{ color: '#C8A951' }}>{day}</div>
                        <div className="text-sm font-medium" style={{ color: '#003366' }}>{event}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="iimc-card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #003366, #C8A951)' }}>
                    {user.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: '#003366' }}>{user.fullName}</div>
                    <div className="text-xs text-gray-500">@{user.username}</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  {[
                    {label:'Batch',value:user.batch},
                    {label:'Programme',value:user.programme},
                    {label:'Company',value:user.company||'—'},
                    {label:'Location',value:user.city?`${user.city}, ${user.country}`:'—'},
                    {label:'Travel',value:travel?'✅ Submitted':'⏳ Pending'},
                  ].map(({label,value}) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-medium text-right" style={{ color: '#003366' }}>{value}</span>
                    </div>
                  ))}
                </div>
                <Link href="/profile" className="mt-4 block text-center navy-btn py-2 rounded-lg text-sm">Edit Profile</Link>
              </div>

              <div className="rounded-xl overflow-hidden relative" style={{ minHeight: 160 }}>
                <img src={IMGS.campus} alt="IIMC Campus" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,51,102,0.95), rgba(0,26,51,0.95))' }} />
                <div className="relative z-10 p-5 text-center">
                  <Award size={28} className="mx-auto mb-2" style={{ color: '#C8A951' }} />
                  <div className="font-display text-2xl font-bold text-white mb-1">25 Years</div>
                  <div style={{ color: '#C8A951' }} className="text-sm">of Joka Brotherhood</div>
                  <div className="gold-divider mt-3" />
                  <p className="text-blue-200 text-xs mt-3 font-crimson italic">"The bonds forged at Joka last a lifetime"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
