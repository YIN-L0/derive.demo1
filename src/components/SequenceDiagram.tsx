import { siteById, storiesForWork } from "@/data/atlas";
import type { WorkId } from "@/data/types";

/**
 * The work's places drawn at their true positions, joined in story order.
 * Jumps the film makes (documented in the atlas) are drawn in the accent colour,
 * so the gap between screen continuity and real geography is visible at a glance.
 */
export default function SequenceDiagram({ workId, labels }: { workId: WorkId; labels: { jump: string; seine: string } }) {
  const seq = storiesForWork(workId).map((s) => ({ story: s, site: siteById(s.siteId)! }));
  const W = 600;
  const H = 360;
  const pad = 36;
  const lats = seq.map((x) => x.site.lat);
  const lngs = seq.map((x) => x.site.lng);
  const k = Math.cos((48.85 * Math.PI) / 180);
  const [minX, maxX] = [Math.min(...lngs) * k, Math.max(...lngs) * k];
  const [minY, maxY] = [Math.min(...lats), Math.max(...lats)];
  const scale = Math.min((W - pad * 2) / (maxX - minX), (H - pad * 2) / (maxY - minY));
  const ox = (W - (maxX - minX) * scale) / 2;
  const oy = (H - (maxY - minY) * scale) / 2;
  const pt = (lat: number, lng: number) => [ox + (lng * k - minX) * scale, H - (oy + (lat - minY) * scale)] as const;

  // A rough line for the Seine through this stretch, for orientation only.
  const seine = [
    [48.8585, 2.3385],
    [48.8545, 2.3445],
    [48.8522, 2.3505],
    [48.8506, 2.3555],
    [48.8495, 2.3608],
    [48.8462, 2.3665],
    [48.8425, 2.3712],
  ].map(([a, b]) => pt(a, b).join(",")).join(" ");
  const [seineX, seineY] = pt(48.8492, 2.3628);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={labels.jump}>
      <polyline points={seine} fill="none" stroke="var(--line)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <text x={seineX + 10} y={seineY + 26} className="fill-mute" fontSize="11" fontStyle="italic">
        {labels.seine}
      </text>
      {seq.map(({ story, site }, i) => {
        if (i === 0) return null;
        const prev = seq[i - 1].site;
        const [x1, y1] = pt(prev.lat, prev.lng);
        const [x2, y2] = pt(site.lat, site.lng);
        return story.jump ? (
          <line key={story.id} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--accent)" strokeWidth="1.6" strokeDasharray="2 6" strokeLinecap="round" />
        ) : (
          <line key={story.id} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink)" strokeWidth="1" />
        );
      })}
      {seq.map(({ story, site }) => {
        const [x, y] = pt(site.lat, site.lng);
        return (
          <g key={story.id}>
            <circle cx={x} cy={y} r="11" fill={story.jump ? "var(--accent)" : "var(--paper)"} stroke={story.jump ? "var(--accent)" : "var(--ink)"} />
            <text x={x} y={y + 3.5} textAnchor="middle" fontSize="10" fontWeight="600" fill={story.jump ? "#fff" : "var(--ink)"}>
              {story.order}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
