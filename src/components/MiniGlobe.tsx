import { useEffect, useRef } from 'react';

interface MiniGlobeProps {
  accentHex: string;
  reducedMotion: boolean;
}

export function MiniGlobe({ accentHex, reducedMotion }: MiniGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = 60;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Network mesh vertices on a sphere
    const nodes: { lat: number; lon: number; hub: boolean }[] = [
      { lat: 0.25, lon: 0.2, hub: true },
      { lat: 0.55, lon: 1.4, hub: false },
      { lat: -0.35, lon: 2.3, hub: true },
      { lat: 0.1, lon: 3.3, hub: false },
      { lat: -0.5, lon: 4.5, hub: true },
      { lat: 0.45, lon: 5.3, hub: false },
      { lat: -0.1, lon: 0.9, hub: false },
      { lat: 0.72, lon: 3.8, hub: false },
    ];

    const edges: [number, number][] = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 0],
      [0, 6],
      [6, 2],
      [1, 7],
      [7, 3],
    ];

    let angle = 0.5;
    let raf = 0;

    const project = (lat: number, lon: number, rot: number, r: number, cx: number, cy: number) => {
      const l = lon + rot;
      const x = Math.cos(lat) * Math.sin(l);
      const y = Math.sin(lat);
      const z = Math.cos(lat) * Math.cos(l);
      return { px: cx + x * r, py: cy - y * r, z };
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;
      const radius = 24;

      // Outer wireframe ring
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#08090d';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Subtle equator & meridian ellipses
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius, radius * 0.34, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.stroke();

      const projected = nodes.map((n) => ({
        ...project(n.lat, n.lon, angle, radius * 0.86, cx, cy),
        hub: n.hub,
      }));

      // Mesh links
      for (const [a, b] of edges) {
        const na = projected[a];
        const nb = projected[b];
        if (na.z < -0.25 && nb.z < -0.25) continue;
        ctx.beginPath();
        ctx.moveTo(na.px, na.py);
        ctx.lineTo(nb.px, nb.py);
        ctx.strokeStyle = na.hub || nb.hub ? `${accentHex}88` : 'rgba(255,255,255,0.14)';
        ctx.lineWidth = na.hub || nb.hub ? 1.15 : 0.8;
        ctx.stroke();
      }

      // Nodes
      for (const p of projected) {
        if (p.z < -0.15) continue;
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.hub ? 2.4 : 1.4, 0, Math.PI * 2);
        ctx.fillStyle = p.hub ? accentHex : `rgba(228, 228, 231, ${0.35 + p.z * 0.5})`;
        ctx.fill();
      }
    };

    const tick = () => {
      if (!reducedMotion) {
        angle += 0.011;
      }
      draw();
      if (!reducedMotion) {
        raf = requestAnimationFrame(tick);
      }
    };

    tick();
    return () => cancelAnimationFrame(raf);
  }, [accentHex, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 60, height: 60 }}
      className="shrink-0"
      aria-hidden="true"
    />
  );
}
