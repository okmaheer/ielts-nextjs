import type { Metadata } from 'next';
import {
  fetchSubmissionMeta,
  getCategoryLabel,
} from '../../../../../../lib/fetchTestMeta';
import ResultsClient from './ResultsClient';

type Props = {
  params: Promise<{ submissionId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { submissionId } = await params;
  const meta = await fetchSubmissionMeta(submissionId);
  const testName = meta?.name ?? `Test #${submissionId}`;
  const category = meta ? getCategoryLabel(meta.category) : 'Writing';

  return {
    title: `IELTS ${category} Writing ${testName} - Results | IELTS Prep & Practice`,
    description: `View your IELTS ${category} Writing ${testName} results with AI evaluation and expert review.`,
  };
}

export default function WritingTestResultsPage() {
  return <ResultsClient />;
}
