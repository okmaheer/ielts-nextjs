import type { Metadata } from 'next';
import {
  fetchTestMeta,
  getCategoryLabel,
} from '../../../../../../../../lib/fetchTestMeta';
import AcademicInstructionsClient from './AcademicInstructionsClient';

type Props = {
  params: Promise<{ testId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { testId } = await params;
  const meta = await fetchTestMeta(testId);
  const testName = meta?.name ?? `Test #${testId}`;
  const category = meta ? getCategoryLabel(meta.category) : 'Academic';

  return {
    title: `IELTS Writing ${testName} (${category}) - Instructions | IELTS Prep & Practice`,
    description: `Instructions for IELTS ${category} Writing ${testName}. Review test rules before starting.`,
  };
}

export default async function AcademicWritingTestInstructionsPage({
  params,
}: Props) {
  const { testId } = await params;
  return <AcademicInstructionsClient testId={testId} />;
}
