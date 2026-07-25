import Image from 'next/image';

export default function ConciergeHero({
  photoUrl,
  propertyName,
  badge,
  welcome,
}: {
  photoUrl: string;
  propertyName: string;
  badge: string;
  welcome: string;
}) {
  return (
    <section className="relative flex h-[60vh] min-h-[420px] items-end">
      <div className="absolute inset-0">
        <Image src={photoUrl} alt={propertyName} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      <div className="relative z-10 w-full px-4 pb-10 text-center text-white">
        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm">
          {badge}
        </span>
        <h1 className="mt-4 font-serif text-4xl font-bold md:text-5xl">{propertyName}</h1>
        <p className="mt-2 font-sans text-lg text-white/90">{welcome}</p>
      </div>
    </section>
  );
}
