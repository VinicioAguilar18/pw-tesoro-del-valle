import { Wifi } from 'lucide-react';
import RevealButton from './RevealButton';
import { revealWifi } from '@/lib/actions/concierge';

export default function WifiCard({
  code,
  copy,
}: {
  code: string;
  copy: {
    title: string;
    reveal: string;
    network: string;
    password: string;
    copyLabel: string;
    copiedLabel: string;
    unavailableLabel: string;
  };
}) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D1FAE5]">
          <Wifi className="h-5 w-5 text-primary" />
        </span>
        <h3 className="font-serif text-lg font-bold text-primary">{copy.title}</h3>
      </div>

      <RevealButton
        triggerLabel={copy.reveal}
        fields={[
          { key: 'wifiName', label: copy.network },
          { key: 'wifiPassword', label: copy.password },
        ]}
        onReveal={revealWifi.bind(null, code)}
        copyLabel={copy.copyLabel}
        copiedLabel={copy.copiedLabel}
        unavailableLabel={copy.unavailableLabel}
      />
    </div>
  );
}
