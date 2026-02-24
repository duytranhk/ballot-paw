import type { Candidate } from '../types';

export function buildResultText(params: { title: string; time?: number; candidates: Candidate[]; votes: Record<string, number>; ballotCount: number }): string {
  const { title, time, candidates, votes, ballotCount } = params;

  const lines: string[] = [];
  lines.push(title);
  if (time) lines.push(new Date(time).toLocaleString('vi-VN'));
  lines.push(`Tổng số phiếu: ${ballotCount}`);
  lines.push('');

  candidates.forEach((c, i) => {
    const count = votes[c.id] ?? 0;
    const pct = ballotCount ? ((count / ballotCount) * 100).toFixed(1) : '0.0';
    lines.push(`${i + 1}. ${c.name}: ${count} phiếu (${pct}%)`);
  });

  return lines.join('\n');
}

export async function shareResult(text: string): Promise<void> {
  if (navigator.share) {
    await navigator.share({ text });
  } else {
    await navigator.clipboard.writeText(text);
    alert('Đã sao chép kết quả vào clipboard!');
  }
}

