import { Activity, Pause, Play, Radio, Router, Server, ShieldCheck, Wifi, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NETWORK_LINKS, NETWORK_NODES } from '../data/portfolioData';
import type { NetworkNode } from '../types/portfolio';
import { playClickSound, playPingSound } from '../utils/sound';

interface NetworkTopologySectionProps {
  reducedMotion: boolean;
  soundEnabled: boolean;
}

const NODE_ICONS: Record<string, typeof Router> = {
  isp: Radio,
  router: Router,
  switch: ShieldCheck,
  workstations: Monitor,
  ap: Wifi,
  server: Server,
};

export function NetworkTopologySection({
  reducedMotion,
  soundEnabled,
}: NetworkTopologySectionProps) {
  const [selectedNode, setSelectedNode] = useState<NetworkNode>(NETWORK_NODES[1]);
  const [packetFlowActive, setPacketFlowActive] = useState<boolean>(true);
  const [pingResult, setPingResult] = useState<string | null>(null);
  const [packetTick, setPacketTick] = useState<number>(0);

  const shouldAnimate = packetFlowActive && !reducedMotion;

  useEffect(() => {
    if (!shouldAnimate) return;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setPacketTick((prev) => (prev + dt * 0.48) % 1);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [shouldAnimate]);

  const handleRunPing = () => {
    playPingSound(soundEnabled);
    setPingResult(
      `PING ${selectedNode.label} (${selectedNode.ip}): 4 packets transmitted, 4 received, simulated RTT 1.8ms`,
    );
  };

  return (
    <section id="network" className="scroll-reveal py-14 border-t border-white/8">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-mono text-[var(--accent-bright)]">
            Infrastructure &amp; Topology Demonstration
          </p>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
            Networking &amp; Infrastructure Lab
          </h2>
          <p className="mt-2 text-sm text-zinc-400 max-w-2xl">
            Interactive sample office topology illustrating VLAN segmentation, gateway routing, and endpoint distribution. Built around my practical interest in network engineering and hands-on event router setup experience at DOST-FNRI.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              playClickSound(soundEnabled);
              setPacketFlowActive((prev) => !prev);
            }}
            disabled={reducedMotion}
            className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-[#16161b] px-3.5 py-2 text-xs font-medium text-zinc-200 whitespace-nowrap transition-colors hover:border-[var(--accent-border)] disabled:opacity-50"
          >
            {shouldAnimate ? <Pause className="h-3.5 w-3.5 text-[var(--accent-bright)]" /> : <Play className="h-3.5 w-3.5 text-[var(--accent-bright)]" />}
            <span>{reducedMotion ? 'Motion Reduced' : shouldAnimate ? 'Pause Packets' : 'Resume Packets'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Interactive SVG Network Diagram */}
        <div className="bento-card lg:col-span-8 p-5 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/8">
            <span className="text-xs font-mono text-zinc-400">
              Sample Office Network Topology (Simulated Lab)
            </span>
            <span className="text-xs text-zinc-400">
              Click any node to inspect subnet &amp; VLAN
            </span>
          </div>

          <div className="relative mt-4 w-full overflow-x-auto rounded-xl border border-white/8 bg-[#0b0b0f] p-3">
            <svg
              viewBox="0 0 790 330"
              className="w-full min-w-[580px] h-auto"
              role="img"
              aria-label="Interactive sample office network topology diagram"
            >
              <defs>
                <pattern id="topoGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="790" height="330" fill="url(#topoGrid)" rx="10" />

              {/* Links */}
              {NETWORK_LINKS.map((link, idx) => {
                const fromNode = NETWORK_NODES.find((n) => n.id === link.from);
                const toNode = NETWORK_NODES.find((n) => n.id === link.to);
                if (!fromNode || !toNode) return null;

                const isHighlighted =
                  selectedNode.id === fromNode.id || selectedNode.id === toNode.id;

                const t = (packetTick + idx * 0.19) % 1;
                const px = fromNode.x + (toNode.x - fromNode.x) * t;
                const py = fromNode.y + (toNode.y - fromNode.y) * t;

                const midX = (fromNode.x + toNode.x) / 2;
                const midY = (fromNode.y + toNode.y) / 2;

                return (
                  <g key={link.id}>
                    <line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={isHighlighted ? 'var(--accent-bright)' : 'rgba(255,255,255,0.18)'}
                      strokeWidth={isHighlighted ? 2.2 : 1.5}
                      strokeDasharray={link.protocol.includes('WAN') ? '5 4' : undefined}
                    />
                    <text
                      x={midX}
                      y={midY - 8}
                      textAnchor="middle"
                      fill="#71717a"
                      fontSize="9"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {link.bandwidth}
                    </text>

                    {shouldAnimate && (
                      <circle
                        cx={px}
                        cy={py}
                        r={4}
                        fill="var(--accent-bright)"
                      />
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {NETWORK_NODES.map((node) => {
                const selected = selectedNode.id === node.id;
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => {
                      setSelectedNode(node);
                      setPingResult(null);
                      playClickSound(soundEnabled);
                    }}
                    className="cursor-pointer"
                    role="button"
                    tabIndex={0}
                    aria-label={`Inspect ${node.label}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedNode(node);
                        setPingResult(null);
                      }
                    }}
                  >
                    <rect
                      x={-68}
                      y={-30}
                      width={136}
                      height={60}
                      rx={10}
                      fill={selected ? '#1c1418' : '#14141a'}
                      stroke={selected ? 'var(--accent-bright)' : 'rgba(255,255,255,0.16)'}
                      strokeWidth={selected ? 2 : 1}
                    />
                    <text
                      x={0}
                      y={-5}
                      textAnchor="middle"
                      fill="#f4f4f5"
                      fontSize="11"
                      fontWeight="600"
                      fontFamily="Plus Jakarta Sans, sans-serif"
                    >
                      {node.label}
                    </text>
                    <text
                      x={0}
                      y={14}
                      textAnchor="middle"
                      fill="#a1a1aa"
                      fontSize="9.5"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {node.vlan}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Node Inspector & Real Experience Callout */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <div className="bento-card p-5 flex-1 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-[var(--accent-bright)]">
                  Node Inspector ({selectedNode.status})
                </span>
                {(() => {
                  const Icon = NODE_ICONS[selectedNode.id] || Activity;
                  return <Icon className="h-4 w-4 text-[var(--accent-bright)]" />;
                })()}
              </div>

              <h3 className="mt-2 font-display text-lg font-bold text-zinc-100">
                {selectedNode.label}
              </h3>
              <p className="text-xs text-zinc-400">{selectedNode.role}</p>

              <dl className="mt-4 space-y-2.5 border-t border-white/8 pt-3 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-zinc-400">IP / Subnet</dt>
                  <dd className="font-mono text-zinc-200">{selectedNode.ip}</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-zinc-400">Segment</dt>
                  <dd className="font-mono text-zinc-200">{selectedNode.vlan}</dd>
                </div>
              </dl>

              <p className="mt-3 text-xs leading-relaxed text-zinc-300">
                {selectedNode.notes}
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleRunPing}
                className="w-full rounded-xl border border-[var(--accent-border)] bg-[var(--accent-muted)] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[var(--accent)]"
              >
                Simulate Ping Check
              </button>
              {pingResult && (
                <div className="rounded-lg border border-white/10 bg-[#0b0b0f] p-2.5 font-mono text-[11px] text-zinc-300">
                  {pingResult}
                </div>
              )}
            </div>
          </div>

          <div className="bento-card p-5">
            <h4 className="font-display text-sm font-bold text-zinc-100">
              Actual Networking &amp; Hardware Exposure
            </h4>
            <ul className="mt-2.5 space-y-1.5 text-xs text-zinc-300">
              <li>· Assisted router setup &amp; configuration for a DOST-FNRI agency event</li>
              <li>· Troubleshot desktop NIC, peripheral, and printer connectivity</li>
              <li>· Assembled working PC from recovered RAM &amp; storage drives</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
