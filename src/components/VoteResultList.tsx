import IndexBadge from './IndexBadge';
import type { Candidate } from '../types';

function barColor(index: number, total: number) {
  const hue = Math.round((index / total) * 360);
  return `hsl(${hue}, 65%, 48%)`;
}

type Props = {
  candidates: Candidate[];
  votes: Record<string, number>;
  ballotCount: number;
};

export default function VoteResultList({ candidates, votes, ballotCount }: Props) {
  return (
    <div>
      {candidates.map((c, index) => {
        const voteCount = votes[c.id] ?? 0;
        const pct = ballotCount ? (voteCount / ballotCount) * 100 : 0;
        return (
          <div key={c.id} className='bg-white shadow rounded-xl px-4 py-4 text-lg mt-3'>
            <div className='flex justify-between items-center mb-2'>
              <span className='flex items-center gap-2'>
                <IndexBadge index={index + 1} />
                {c.name}
              </span>
              <span className='text-sm text-gray-500'>{voteCount} Phiếu</span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2'>
              <div className='h-2 rounded-full transition-all duration-300' style={{ width: `${pct}%`, backgroundColor: barColor(index, candidates.length) }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

