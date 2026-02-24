/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react';
import { BallotContext } from '../context/BallotContext';

export default function Report({ go }: { go: (screen: 'setup' | 'count' | 'report') => void }) {
  const { state, dispatch } = useContext(BallotContext);

  return (
    <div className='min-h-screen bg-gray-50 p-4 flex flex-col bg-gray-100'>
      <h2 className='text-2xl font-bold text-center mb-2'>KẾT QUẢ CUỐI CÙNG</h2>

      <div className='text-center text-lg mb-4'>
        Tổng số phiếu: <b>{state.ballotCount}</b>
      </div>

      <div className=''>
        {state.candidates.map((c: any, index: number) => (
          <div key={c.id} className='bg-white shadow rounded-xl px-4 py-4 text-lg mt-3'>
            <div className='flex justify-between items-center mb-2'>
              <span>
                {index + 1}: {c.name}
              </span>
              <span className='text-sm text-gray-500'>{state.votes[c.id] ?? 0} Phiếu</span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-3'>
              <div
                className='bg-green-500 h-4 rounded-full transition-all duration-300'
                style={{ width: `${state.ballotCount ? ((state.votes[c.id] ?? 0) / state.ballotCount) * 100 : 0}%` }}
              ></div>
            </div>
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
        className='mt-6 w-full h-16 bg-blue-600 text-white text-xl font-bold rounded-xl active:scale-95 transition-all duration-100 active:bg-blue-700'
      >
        PHIÊN KIỂM PHIẾU MỚI
      </button>
    </div>
  );
}

