'use client';

import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/utils/hooks';

export default function CursorBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-br from-blue-50/20 via-purple-50/15 to-indigo-50/20 dark:from-blue-950/20 dark:via-purple-950/15 dark:to-indigo-950/20" />
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Main cursor gradient */}
      <div 
        className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl transition-all duration-300 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(99, 102, 241, 0.25) 35%, rgba(79, 70, 229, 0.15) 70%, transparent 100%)',
          transform: `translate(${mousePosition.x - 192}px, ${mousePosition.y - 192}px)`,
          filter: 'blur(40px)',
        }}
      />
      
      {/* Secondary glow */}
      <div 
        className="absolute w-64 h-64 rounded-full opacity-15 blur-2xl transition-all duration-500 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.15) 50%, transparent 100%)',
          transform: `translate(${mousePosition.x - 128}px, ${mousePosition.y - 128}px)`,
          filter: 'blur(30px)',
        }}
      />

      {/* Ambient background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/15 via-purple-50/10 to-indigo-50/15 dark:from-blue-950/15 dark:via-purple-950/10 dark:to-indigo-950/15" />
      
      {/* Subtle noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] mix-blend-multiply dark:mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}