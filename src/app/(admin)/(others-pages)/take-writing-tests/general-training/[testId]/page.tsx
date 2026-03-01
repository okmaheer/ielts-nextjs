import type { Metadata } from 'next';
import {
  fetchTestMeta,
  getCategoryLabel,
} from '../../../../../../../lib/fetchTestMeta';
import TakeTestClient from './TakeTestClient';

type Props = {
  params: Promise<{ testId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { testId } = await params;
  const meta = await fetchTestMeta(testId);
  const testName = meta?.name ?? `Test #${testId}`;
  const category = meta ? getCategoryLabel(meta.category) : 'General Training';

  return {
    title: `IELTS Writing ${testName} (${category}) | IELTS Prep & Practice`,
    description: `Take IELTS ${category} Writing ${testName} with timed tasks, AI evaluation and expert review.`,
  };
}

export default function TakeWritingTestPage() {
  return <TakeTestClient />;
}
