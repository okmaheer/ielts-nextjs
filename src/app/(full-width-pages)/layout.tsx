// app/(full-width-pages)/(home)/layout.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IELTS Writing Practice Tests | AI + Expert Review',
  description:
    'Master IELTS Writing with AI-powered instant feedback and expert human review. Practice Academic and General Training tests under real exam conditions.',
  keywords: [
    'IELTS',
    'Writing Test',
    'IELTS Practice',
    'Academic Writing',
    'General Training',
    'AI Feedback',
    'Expert Review',
  ],
  openGraph: {
    title: 'IELTS Writing Practice Tests | AI + Expert Review',
    description:
      'Master IELTS Writing with AI-powered instant feedback and expert human review.',
    type: 'website',
  },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
