import Image from "next/image";
import { siteById } from "@/data/atlas";
import { artworkFor, photoFor } from "@/data/media";

type Props = { siteId: string; sizes?: string; priority?: boolean; color?: boolean; className?: string };

/**
 * The site's photograph in monochrome (colour on hover/intent). If the place has
 * no photograph — it no longer exists — show its period image instead, and
 * failing that a typographic plate of the address.
 */
export default function SitePhoto({ siteId, sizes = "100vw", priority, color, className = "" }: Props) {
  const site = siteById(siteId);
  const photo = photoFor(siteId);
  if (photo) {
    return (
      <Image
        src={photo.src}
        alt={site?.name ?? ""}
        fill
        sizes={sizes}
        priority={priority}
        className={`photo photo-zoom object-cover ${color ? "is-color" : ""} ${className}`}
      />
    );
  }
  const art = artworkFor(siteId);
  if (art) {
    return <Image src={art.src} alt={`${art.title} — ${art.artist}`} fill sizes={sizes} priority={priority} className={`photo-zoom object-cover ${className}`} />;
  }
  return (
    <div className={`absolute inset-0 flex flex-col justify-between bg-paper-2 p-5 ${className}`}>
      <span className="label text-mute">{site?.arrondissement}</span>
      <span className="display text-[clamp(26px,4vw,52px)] leading-[0.95] text-ink-2 italic">{site?.address}</span>
    </div>
  );
}
