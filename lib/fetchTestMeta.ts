const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api';

type TestMeta = {
  name: string;
  category: number; // 1 = academic, 2 = general training
};

export async function fetchTestMeta(testId: string): Promise<TestMeta | null> {
  try {
    const res = await fetch(`${API_URL}/take-test/writing/${testId}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.test ?? null;
  } catch {
    return null;
  }
}

export async function fetchSubmissionMeta(
  submissionId: string
): Promise<TestMeta | null> {
  try {
    const res = await fetch(
      `${API_URL}/take-test/writing/submission/${submissionId}/meta`,
      {
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.test ?? null;
  } catch {
    return null;
  }
}

export function getCategoryLabel(category: number): string {
  return category === 1 ? 'Academic' : 'General Training';
}
