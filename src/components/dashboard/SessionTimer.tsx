// Session timer — shows elapsed time since login
'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function SessionTimer() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1.5 rounded-lg bg-gray-100 dark:bg-white/10 px-2.5 py-1.5 text-xs text-gray-500 dark:text-gray-400">
      <Clock className="h-3.5 w-3.5" />
      {formatElapsed(elapsed)}
    </div>
  );
}
