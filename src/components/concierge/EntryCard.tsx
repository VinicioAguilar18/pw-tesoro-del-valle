import { Key } from 'lucide-react';
import RevealButton from './RevealButton';
import { revealDoorCode } from '@/lib/actions/concierge';

export default function EntryCard({
  code,
  checkinTime,
  copy,
}: {
  code: string;
  checkinTime: string | null;
  copy: {
    title: string;
    checkin: string;
    checkinFrom: string;
    reveal: string;
    doorCode: string;
    copyLabel: string;
    copiedLabel: string;
    unavailableLabel: string;
  };
}) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-background p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/20">
          <Key className="h-5 w-5 text-primary" />
        </span>
        <div>
          <h3 className="font-serif text-lg font-bold text-primary">{copy.title}</h3>
          {checkinTime && (
            <p className="font-sans text-sm text-text-secondary">
              {copy.checkin} {copy.checkinFrom} {checkinTime}
            </p>
          )}
        </div>
      </div>

      <RevealButton
        triggerLabel={copy.reveal}
        fields={[{ key: 'doorCode', label: copy.doorCode }]}
        onReveal={revealDoorCode.bind(null, code)}
        copyLabel={copy.copyLabel}
        copiedLabel={copy.copiedLabel}
        unavailableLabel={copy.unavailableLabel}
      />
    </div>
  );
}
