import { notFound } from 'next/navigation';
import { getTranslations, getLocale } from 'next-intl/server';
import {
  getPropertyByAccessCode,
  getGuideSections,
  getAllRecommendations,
} from '@/lib/queries/concierge';
import { getPhotoUrl } from '@/lib/photos';
import ConciergeHero from '@/components/concierge/ConciergeHero';
import EntryCard from '@/components/concierge/EntryCard';
import WifiCard from '@/components/concierge/WifiCard';
import SectionGrid from '@/components/concierge/SectionGrid';
import RecommendationsSection from '@/components/concierge/RecommendationsSection';
import FeedbackForm from '@/components/concierge/FeedbackForm';

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function ConciergePage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { code } = await params;

  const property = await getPropertyByAccessCode(code);
  if (!property) {
    notFound();
  }

  const [guideSections, recommendations, locale, t] = await Promise.all([
    getGuideSections(property.id),
    getAllRecommendations(property.id),
    getLocale(),
    getTranslations('Concierge'),
  ]);

  const entrySection = guideSections.find((s) => s.slug === 'entrada');
  const wifiSection = guideSections.find((s) => s.slug === 'wifi');
  const otherSections = guideSections.filter((s) => s.slug !== 'entrada' && s.slug !== 'wifi');

  const heroPhoto = property.hero_photo_url ?? getPhotoUrl('la-rana/gallery/hero-vista-dron.webp');

  return (
    <main className="flex-1">
      <ConciergeHero
        photoUrl={heroPhoto}
        propertyName={property.name}
        badge={t('badge')}
        welcome={t('welcome')}
      />

      <div className="relative z-10 mx-auto -mt-10 max-w-3xl px-4">
        {entrySection && (
          <EntryCard
            code={code}
            checkinTime={property.checkin_time}
            copy={{
              title: t('entry.title'),
              checkin: t('checkin'),
              checkinFrom: t('checkinFrom'),
              reveal: t('entry.reveal'),
              doorCode: t('entry.doorCode'),
              copyLabel: t('copy'),
              copiedLabel: t('copied'),
              unavailableLabel: t('unavailable'),
            }}
          />
        )}
      </div>

      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-10">
        {wifiSection && (
          <WifiCard
            code={code}
            copy={{
              title: t('wifi.title'),
              reveal: t('wifi.reveal'),
              network: t('wifi.network'),
              password: t('wifi.password'),
              copyLabel: t('copy'),
              copiedLabel: t('copied'),
              unavailableLabel: t('unavailable'),
            }}
          />
        )}

        <SectionGrid sections={otherSections} locale={locale} closeLabel={t('close')} />
      </div>

      <RecommendationsSection
        recommendations={recommendations}
        locale={locale}
        title={t('recommendations.title')}
        subtitle={t('recommendations.subtitle')}
        howToGetThereLabel={t('recommendations.howToGetThere')}
        groupLabels={{
          food: t('recommendations.groups.food'),
          tours: t('recommendations.groups.tours'),
          services: t('recommendations.groups.services'),
        }}
      />

      <FeedbackForm
        code={code}
        copy={{
          title: t('feedback.title'),
          subtitle: t('feedback.subtitle'),
          rating: t('feedback.rating'),
          likedMost: t('feedback.likedMost'),
          toImprove: t('feedback.toImprove'),
          guideClarity: t('feedback.guideClarity'),
          wouldReturn: t('feedback.wouldReturn'),
          optionYes: t('feedback.optionYes'),
          optionSomewhat: t('feedback.optionSomewhat'),
          optionNo: t('feedback.optionNo'),
          optionMaybe: t('feedback.optionMaybe'),
          name: t('feedback.name'),
          submit: t('feedback.submit'),
          submitting: t('feedback.submitting'),
          successTitle: t('feedback.successTitle'),
          successMessage: t('feedback.successMessage'),
          error: t('feedback.error'),
        }}
      />
    </main>
  );
}
