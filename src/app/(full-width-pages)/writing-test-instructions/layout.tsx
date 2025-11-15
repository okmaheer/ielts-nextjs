// app/(full-width-pages)/writing-test-instructions/layout.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Test Instructions | IELTS Writing Practice',
  description:
    'Read the test instructions carefully before starting your IELTS writing test. Understand the format, rules, and requirements for Task 1 and Task 2.',
  keywords: [
    'IELTS Instructions',
    'Writing Test Rules',
    'Test Guidelines',
    'IELTS Format',
    'Academic Writing',
    'General Training',
  ],
  openGraph: {
    title: 'Test Instructions | IELTS Writing Practice',
    description:
      'Read the test instructions carefully before starting your IELTS writing test.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Test Instructions | IELTS Writing Practice',
    description:
      'Read the test instructions carefully before starting your IELTS writing test.',
  },
};

export default function InstructionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
