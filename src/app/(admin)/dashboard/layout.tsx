import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - IELTS Writing Tests',
  description:
    'View your IELTS writing test progress, scores, and expert reviews on your personal dashboard.',
  openGraph: {
    title: 'Dashboard - IELTS Writing Tests',
    description:
      'View your IELTS writing test progress, scores, and expert reviews on your personal dashboard.',
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
