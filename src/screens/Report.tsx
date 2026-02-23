/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react';
import { BallotContext } from '../context/BallotContext';

export default function Report({ go }: { go: (screen: 'setup' | 'count' | 'report') => void }) {
  const { state, dispatch } = useContext(BallotContext);

  return (
    <div className='min-h-screen bg-gray-50 p-4'>
      <h2 className='text-2xl font-bold text-center mb-2'>KẾT QUẢ CUỐI CÙNG</h2>

      <div className='text-center text-lg mb-4'>
        Tổng số phiếu: <b>{state.ballotCount}</b>
      </div>

      <div className='bg-white rounded-xl shadow divide-y'>
        {state.candidates.map((c: any, index: number) => (
          <div key={c.id} className='flex justify-between px-4 py-4 text-lg'>
            <span>
              {index + 1}: {c.name}
            </span>
            <b>{state.votes[c.id]}</b>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          if (confirm('Bạn có chắc chắn muốn bắt đầu kiểm phiếu mới?')) {
            if (navigator?.vibrate) {
              navigator.vibrate(20);
            }
            dispatch({ type: 'RESET' });
            go('setup');
          }
        }}
        className='mt-6 w-full h-16 bg-blue-600 text-white text-xl font-bold rounded-xl active:scale-98 transition-all duration-100 active:bg-blue-700'
      >
        PHIÊN KIỂM PHIẾU MỚI
      </button>
    </div>
  );
}

