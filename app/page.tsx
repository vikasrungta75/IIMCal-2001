import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Countdown from '@/components/Countdown';
import SafeImage from '@/components/SafeImage';

// Free-use image URLs from Wikimedia Commons and official IIMC sources
const IMAGES = {
  campusMain: '/images/campus.jpg',
  auditorium: '/images/campus.jpg',
  logo: '/images/logo.svg',
  logoWhite: '/images/logo-white.svg',
  // Kolkata landmarks - Wikimedia Commons free use
  howrahBridge: '/images/howrah.jpg',
  victoriaMemorial: '/images/victoria.jpg',
  kolkataStreet: '/images/taxi.jpg',
  // Additional Kolkata landmarks
  edenGardens: '/images/eden.jpg',
  durgaPuja: '/images/durga.jpg',
  scienceCity: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Science_City%2C_Kolkata.jpg/1280px-Science_City%2C_Kolkata.jpg',
  kolkataGhat: '/images/prinsep.jpg',
  streetFood: '/images/taxi.jpg',
};

export default async function HomePage() {
  const session = await getSession();
  // Only redirect approved users - pending/unapproved can still view homepage
  if (session?.username && !session.isAdmin) {
    const { db } = await import('@/lib/db');
    const user = await db.users.findByUsername(session.username);
    if (user?.status === 'approved') redirect('/dashboard');
  }
  if (session?.isAdmin) redirect('/admin');

  return (
    <>
      <Navbar user={null} />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center"
        style={{ background: 'linear-gradient(160deg,#003366 0%,#001a33 45%,#0a1628 100%)' }}>
        {/* Background campus video */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            style={{ opacity: 0.75 }}
          >
            <source src="/images/campus.webm" type="video/webm" />
            {/* Fallback to static image if video not supported */}
            <img src={IMAGES.campusMain} alt="IIM Calcutta Campus" className="w-full h-full object-cover" />
          </video>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg,rgba(0,51,102,0.55) 0%,rgba(0,26,51,0.50) 100%)' }} />
        </div>
        {/* Dot grid pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(200,169,81,0.08) 1px, transparent 0)',
          backgroundSize: '48px 48px',
        }} />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20">
          <div className="flex justify-center mb-8">
            <SafeImage src={IMAGES.logoWhite} alt="IIM Calcutta" className="h-20 w-auto object-contain" />
          </div>

          <div className="inline-flex items-center gap-3 mb-6 px-6 py-2.5 rounded-full border"
            style={{ borderColor: 'rgba(200,169,81,0.4)', background: 'rgba(200,169,81,0.08)' }}>
            <span className="font-display font-black text-3xl" style={{ color: '#C8A951' }}>25</span>
            <div className="w-px h-6 opacity-40" style={{ background: '#C8A951' }} />
            <span className="text-sm tracking-widest uppercase font-medium" style={{ color: '#E8D5A3' }}>Silver Jubilee</span>
          </div>

          <h1 className="font-display font-black text-5xl md:text-7xl text-white mb-3 leading-tight">
            Alumni Meet
            <span className="block" style={{ WebkitTextFillColor: 'transparent', WebkitTextStroke: '1.5px #C8A951' }}>2026</span>
          </h1>

          <p className="font-crimson text-xl md:text-2xl mb-2" style={{ color: '#C8A951' }}>
            Celebrating Silver Jubilee — Batch 2001
          </p>
          <p className="text-blue-200 text-base md:text-lg mb-10">
            December 12–14, 2026 &nbsp;|&nbsp; Joka Campus, Kolkata
          </p>

          <Countdown targetDate="2026-12-12T09:00:00+05:30" />

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link href="/register" className="gold-btn px-9 py-4 rounded-xl text-base font-semibold inline-block shadow-lg">
              Register Now — It's Free
            </Link>
            <Link href="/login" className="px-9 py-4 rounded-xl text-base font-medium border-2 text-white transition-all inline-block hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
              Login to Portal
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 opacity-60 mt-10 pb-10">
          <div className="w-px h-12" style={{ background: 'linear-gradient(180deg, transparent, #C8A951)' }} />
          <p className="text-xs tracking-widest uppercase text-blue-300">Scroll to explore</p>
        </div>
      </section>

      {/* ── ABOUT IIMC ── */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="badge-gold inline-block mb-4">Est. 1961</div>
          <h2 className="font-display text-4xl font-bold mb-3" style={{ color: '#003366' }}>
            IIM Calcutta — A Legacy of Excellence
          </h2>
          <div className="gold-divider w-24 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img src={IMAGES.campusMain} alt="IIM Calcutta MDC Building"
              className="rounded-2xl w-full object-cover shadow-2xl" style={{ maxHeight: 400 }} />
            <div className="absolute -bottom-4 -right-4 w-28 h-28 rounded-xl overflow-hidden border-4 border-white shadow-xl hidden md:block">
              <img src={IMAGES.logo} alt="IIMC Logo" className="w-full h-full object-contain bg-white p-2" />
            </div>
          </div>
          <div>
            <p className="font-crimson text-xl leading-relaxed mb-5" style={{ color: '#444' }}>
              Established on <strong>November 14, 1961</strong>, IIM Calcutta was the first Indian Institute of Management in the country. Nestled in the verdant Joka campus, it has nurtured generations of business leaders, entrepreneurs, and change-makers.
            </p>
            <p className="text-base leading-relaxed mb-6 text-gray-600">
              The first to achieve <strong>Triple Crown accreditation</strong> — AACSB, AMBA, and EQUIS — joining an elite global club of just 73 business schools worldwide. India's only CEMS partner and ranked <strong>#1 by BT-MDRA Best B-School Survey 2024</strong>.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { num: '#1', label: 'BT-MDRA Best B-School 2024' },
                { num: '45,000+', label: 'Alumni Worldwide' },
                { num: 'Triple', label: 'Crown Accredited' },
                { num: '1961', label: 'First IIM of India' },
              ].map(({ num, label }) => (
                <div key={label} className="iimc-card p-4 text-center">
                  <div className="font-display text-2xl font-bold mb-1" style={{ color: '#003366' }}>{num}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CAMPUS VIDEO SECTION ── */}
      <section className="py-20 px-4" style={{ background: '#003366' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-white mb-3">Take a Virtual Tour</h2>
            <p style={{ color: '#C8A951' }} className="font-crimson text-xl">Relive the magic of Joka campus</p>
            <div className="gold-divider w-24 mx-auto mt-4" />
          </div>
          {/* YouTube embed of IIM Calcutta campus tour - official IIM C video */}
          <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '16/9', position: 'relative' }}>
            <iframe
              src="https://www.youtube.com/embed/GpEgQslgHoo?rel=0&modestbranding=1"
              title="IIM Calcutta Campus Tour"
              className="w-full h-full"
              style={{ border: 'none', minHeight: 360 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="text-center text-blue-300 text-xs mt-4">Official IIM Calcutta Campus Tour</p>
        </div>
      </section>

      {/* ── KOLKATA GALLERY ── */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl font-bold mb-3" style={{ color: '#003366' }}>The City of Joy Awaits</h2>
          <p className="text-gray-500 font-crimson text-xl">Kolkata — Where history, culture and intellect converge</p>
          <div className="gold-divider w-24 mx-auto mt-4" />
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { img: IMAGES.howrahBridge, title: 'Howrah Bridge', desc: 'The iconic cantilever bridge over the Hooghly — a symbol of Kolkata known worldwide.' },
            { img: IMAGES.victoriaMemorial, title: 'Victoria Memorial', desc: 'A stunning marble monument built in memory of Queen Victoria, now a premier museum.' },
            { img: IMAGES.kolkataStreet, title: 'The City\'s Soul', desc: 'Kolkata\'s iconic yellow taxis, roll shops, and warm adda culture make it one of a kind.' },
            { img: IMAGES.edenGardens, title: 'Eden Gardens', desc: 'One of the world\'s most iconic cricket stadiums. Home to unforgettable matches and roaring crowds.' },
            { img: IMAGES.durgaPuja, title: 'Durga Puja', desc: 'UNESCO Intangible Cultural Heritage — 10 days of spectacular pandals, music and celebration.' },
            { img: IMAGES.kolkataGhat, title: 'Prinsep Ghat', desc: 'A serene riverside promenade along the Hooghly, perfect for evening walks and sunsets.' },
          ].map(({ img, title, desc }) => (
            <div key={title} className="rounded-2xl overflow-hidden shadow-lg group">
              <div className="relative overflow-hidden" style={{ height: 220 }}>
                <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,26,51,0.85) 0%, transparent 60%)' }} />
                <h3 className="absolute bottom-4 left-4 font-display text-xl font-bold text-white">{title}</h3>
              </div>
              <div className="p-4" style={{ background: 'white' }}>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '🎓', title: 'The Joka Campus', desc: '135 acres of greenery in Joka. Iconic buildings, the famous MDC, seven lakes, and every corner holding a memory.' },
            { icon: '🍽️', title: 'Culture & Cuisine', desc: 'Rosogolla, mishti doi, kathi rolls. Durga Puja pandals, live Rabindra Sangeet, and the legendary adda culture.' },
            { icon: '🚕', title: 'Getting Around', desc: 'Yellow taxis, Ola/Uber, trams, and the Kolkata Metro make the city beautifully navigable from the airport to Joka.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="iimc-card p-6">
              <div className="text-4xl mb-3">{icon}</div>
              <h4 className="font-semibold text-lg mb-2" style={{ color: '#003366' }}>{title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ALUMNI VOICES VIDEO ── */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="badge-gold inline-block mb-4">Class of 2001</div>
          <h2 className="font-display text-4xl font-bold mb-3" style={{ color: '#003366' }}>Alumni Voices</h2>
          <p className="text-gray-500 font-crimson text-xl">Stories from the Joka family</p>
          <div className="gold-divider w-24 mx-auto mt-4" />
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '16/9', position: 'relative' }}>
            <iframe
              src="https://www.youtube.com/embed/1tzHtrdXFe4?rel=0&modestbranding=1"
              title="IIM Calcutta Alumni Stories"
              className="w-full h-full"
              style={{ border: 'none', minHeight: 260 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div>
            <h3 className="font-display text-3xl font-bold mb-4" style={{ color: '#003366' }}>
              25 Years of Making a Difference
            </h3>
            <p className="font-crimson text-xl leading-relaxed mb-5" style={{ color: '#444' }}>
              From the boardrooms of Mumbai to the corridors of global institutions — Batch 2001 has left an indelible mark on every field they touched.
            </p>
            <div className="space-y-3">
              {[
                { icon: '🌍', text: 'Alumni in 40+ countries across 6 continents' },
                { icon: '🏆', text: 'CEOs, MDs and founders across Fortune 500 companies' },
                { icon: '🤝', text: '25 years of friendships, partnerships and brotherhood' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#f8f4ec' }}>
                  <span className="text-2xl">{icon}</span>
                  <span className="text-sm font-medium" style={{ color: '#003366' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── EVENT HIGHLIGHTS ── */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg,#003366 0%,#001a33 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold text-white mb-3">3 Days of Memories</h2>
            <p style={{ color: '#C8A951' }} className="font-crimson text-xl">December 12–14, 2026 at Joka</p>
            <div className="gold-divider w-24 mx-auto mt-4" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '🎭', title: 'Cultural Evening', desc: 'Relive legendary IIMC nights — music, dance, and laughter' },
              { icon: '💼', title: 'Panel Discussions', desc: '25 years of achievement — share stories, insights, wisdom' },
              { icon: '🏆', title: 'Awards Ceremony', desc: 'Honouring batchmates who made exceptional impact' },
              { icon: '📸', title: 'Memory Walk', desc: 'Guided campus tour with Then & Now photo ops' },
              { icon: '⚽', title: 'Sports Day', desc: 'Cricket, football, badminton on the iconic IIMC grounds' },
              { icon: '🍽️', title: 'Gala Dinner', desc: 'Grand banquet under stars at AC Auditorium lawn' },
              { icon: '📚', title: 'Memory Book', desc: 'Silver Jubilee keepsake capturing 25 years' },
              { icon: '🤝', title: 'Networking Lounge', desc: 'Reconnect, collaborate, and forge new partnerships' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="rounded-xl p-5 text-center border" style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(200,169,81,0.2)' }}>
                <div className="text-3xl mb-3">{icon}</div>
                <h4 className="font-semibold text-white mb-1.5">{title}</h4>
                <p className="text-xs text-blue-200 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 text-center" style={{ background: 'linear-gradient(135deg,#f5f0e8,#ede7d8)' }}>
        <div className="max-w-2xl mx-auto">
          <SafeImage src={IMAGES.logo} alt="IIMC" className="h-16 mx-auto mb-6 object-contain" />
          <h2 className="font-display text-4xl font-bold mb-4" style={{ color: '#003366' }}>Ready to Reunite?</h2>
          <p className="text-gray-600 text-lg mb-8 font-crimson">
            Register now to secure your spot. Sign in with your Google or Microsoft account — no new password needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="gold-btn px-10 py-4 rounded-xl text-base font-semibold inline-block">
              Register for Silver Jubilee
            </Link>
            <Link href="/login" className="px-10 py-4 rounded-xl text-base font-medium border-2 inline-block transition-all hover:bg-gray-50"
              style={{ borderColor: '#003366', color: '#003366' }}>
              Sign in with Google / Microsoft
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-4 text-center" style={{ background: '#001a33', color: '#8899aa' }}>
        <div className="max-w-4xl mx-auto">
          <SafeImage src={IMAGES.logoWhite} alt="IIMC" className="h-10 mx-auto mb-4 opacity-60 object-contain" />
          <p className="text-sm mb-2">IIM Calcutta Silver Jubilee Alumni Meet 2026</p>
          <p className="text-xs">Diamond Harbour Road, Joka, Kolkata – 700 104 &nbsp;|&nbsp;
            <a href="https://www.iimcal.ac.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">www.iimcal.ac.in</a>
          </p>
          <div className="mt-4 text-xs opacity-40">
            Images: Wikimedia Commons (free use) · © 2026 IIM Calcutta Alumni Association. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
