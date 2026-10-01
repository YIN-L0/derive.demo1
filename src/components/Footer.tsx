import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t hairline px-4 pt-14 pb-8 md:px-8">
      <div className="grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="display text-4xl tracking-[0.3em]">DÉRIVE</p>
          <p className="mt-4 max-w-sm text-mute">
            <em className="display text-[15px] not-italic">dérive</em> (n.) — an unplanned walk through a city, led by
            its atmosphere rather than a destination.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="label mb-2 text-mute">Explore</p>
          <Link href="/routes" className="label">Routes</Link>
          <Link href="/map" className="label">Map</Link>
          <Link href="/journal" className="label">Journal</Link>
          <Link href="/community" className="label">Community</Link>
        </div>
        <div className="flex flex-col gap-2">
          <p className="label mb-2 text-mute">Information</p>
          <Link href="/credits" className="label">Sources & photo credits</Link>
          <span className="label text-mute">Demo build · v0.1</span>
        </div>
      </div>
      <div className="mt-16 flex flex-wrap justify-between gap-4 text-mute">
        <span className="label">© 2026 Dérive</span>
        <span className="label">Summaries are original. No affiliation with the works or venues.</span>
      </div>
    </footer>
  );
}
