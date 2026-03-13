'use client';
import { useState, useEffect } from 'react';

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      };
    };
    setTimeLeft(calc());
    const t = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  if (!mounted) return null;

  return (
    <div className="flex justify-center gap-4 mt-8">
      {[
        { val: timeLeft.days, label: 'Days' },
        { val: timeLeft.hours, label: 'Hours' },
        { val: timeLeft.minutes, label: 'Minutes' },
        { val: timeLeft.seconds, label: 'Seconds' },
      ].map(({ val, label }) => (
        <div key={label} className="text-center">
          <div className="w-20 h-20 rounded-xl flex items-center justify-center font-display text-3xl font-bold text-white pulse-gold"
            style={{ background: 'rgba(200,169,81,0.15)', border: '1.5px solid rgba(200,169,81,0.35)' }}>
            {String(val).padStart(2, '0')}
          </div>
          <div className="text-xs mt-2 tracking-widest uppercase" style={{ color: '#C8A951' }}>{label}</div>
        </div>
      ))}
    </div>
  );
}
