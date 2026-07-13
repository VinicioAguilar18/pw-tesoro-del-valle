import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

// Since we have a dynamic `[locale]` layout, this file is only here to satisfy Next.js' requirements.
export default function RootLayout({ children }: Props) {
  return children;
}
