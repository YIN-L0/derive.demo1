import Image from "next/image";
import type { Artwork } from "@/lib/media";

/** A public-domain artwork shown like a mounted plate: matted, in colour, with a museum caption. */
export default function ArtPlate({ art, sizes = "(min-width: 768px) 420px, 100vw" }: { art: Artwork; sizes?: string }) {
  return (
    <figure>
      <p className="label mb-2 text-mute">From the period</p>
      <div className="bg-paper-2 p-4 md:p-5">
        <Image
          src={art.image}
          alt={`${art.title} — ${art.artist}, ${art.year}`}
          width={art.width}
          height={art.height}
          sizes={sizes}
          className="mx-auto h-auto max-h-[420px] w-auto max-w-full shadow-[0_1px_0_rgba(0,0,0,0.08),0_12px_28px_-14px_rgba(0,0,0,0.35)]"
        />
      </div>
      <figcaption className="mt-3">
        <p>
          <span className="display text-[17px] italic">{art.title}</span>
        </p>
        <p className="label mt-1 text-mute">
          {art.artist} · {art.year} · {art.medium}
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-2">{art.note}</p>
        <a href={art.source} target="_blank" rel="noreferrer" className="label mt-2 inline-block text-[9px] text-mute underline-offset-2 hover:underline">
          {art.license} · Wikimedia Commons
        </a>
      </figcaption>
    </figure>
  );
}
