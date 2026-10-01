import Image from "next/image";
import { imageFor } from "@/lib/media";
import { placeById } from "@/data/places";

type Props = {
  id: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  color?: boolean;
};

/** Monochrome editorial photograph; falls back to a typographic plate when no licensed image exists. */
export default function Photo({ id, alt, sizes = "100vw", priority, className = "", color }: Props) {
  const src = imageFor(id);
  if (!src) {
    const place = placeById(id);
    return (
      <div className={`absolute inset-0 flex flex-col justify-between bg-paper-2 p-5 ${className}`}>
        <span className="label text-mute">No. {place?.arrondissement}</span>
        <span className="display text-[clamp(28px,4vw,56px)] leading-[0.95] text-ink-2 italic">
          {place?.address ?? alt}
        </span>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`photo photo-zoom object-cover ${color ? "is-color" : ""} ${className}`}
    />
  );
}
