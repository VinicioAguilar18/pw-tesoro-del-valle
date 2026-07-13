import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('Landing.hero');
  const navT = useTranslations('Layout.nav');

  return (
    <main className="flex-1 flex flex-col justify-center items-center px-4 py-20 bg-background text-foreground">
      {/* Anchor targets to test scroll positioning */}
      <section id="home" className="w-full max-w-4xl flex flex-col items-center text-center gap-6 my-12">
        <span className="text-sm font-semibold tracking-widest text-secondary uppercase bg-primary/10 px-3 py-1 rounded-full">
          Valle Azul &middot; San Carlos &middot; Costa Rica
        </span>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary max-w-2xl leading-tight">
          {t('welcome')}
        </h1>
        <p className="text-lg md:text-xl text-text-secondary max-w-xl font-sans">
          {t('subtitle')}
        </p>
        <div className="h-px w-24 bg-primary/20 my-2"></div>
        <p className="text-xl md:text-2xl font-serif italic text-primary max-w-2xl px-4">
          &ldquo;{t('tagline')}&rdquo;
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://airbnb.com/h/luxuryrainforestretreat"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-3.5 shadow-md transition-all hover:scale-105"
          >
            {navT('book')}
          </a>
          <a
            href="#accommodation"
            className="rounded-full border border-primary/20 text-primary hover:bg-primary/5 font-semibold px-8 py-3.5 transition-all"
          >
            {navT('accommodation')}
          </a>
        </div>
      </section>

      {/* Provisional Sections for Anchors testing */}
      <section id="accommodation" className="w-full max-w-4xl border-t border-primary/10 pt-20 pb-12 my-12">
        <h2 className="text-3xl font-serif font-bold text-primary mb-4 text-center">
          {navT('accommodation')}
        </h2>
        <p className="text-center text-text-secondary max-w-lg mx-auto font-sans">
          Próximamente: Detalle completo del Alojamiento La Rana y su entorno.
        </p>
      </section>

      <section id="zone" className="w-full max-w-4xl border-t border-primary/10 pt-20 pb-12 my-12">
        <h2 className="text-3xl font-serif font-bold text-primary mb-4 text-center">
          {navT('zone')}
        </h2>
        <p className="text-center text-text-secondary max-w-lg mx-auto font-sans">
          Próximamente: Actividades en la zona de Valle Azul, La Fortuna y Volcán Arenal.
        </p>
      </section>

      <section id="location" className="w-full max-w-4xl border-t border-primary/10 pt-20 pb-12 my-12">
        <h2 className="text-3xl font-serif font-bold text-primary mb-4 text-center">
          {navT('location')}
        </h2>
        <p className="text-center text-text-secondary max-w-lg mx-auto font-sans">
          Próximamente: Mapa interactivo, indicaciones y enlaces a Waze / Google Maps.
        </p>
      </section>
    </main>
  );
}
