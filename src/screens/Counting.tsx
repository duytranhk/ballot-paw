/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from 'react';
import { BallotContext } from '../context/BallotContext';

export default function Counting({ go }: { go: (screen: 'setup' | 'count' | 'report') => void }) {
  const { state, dispatch } = useContext(BallotContext);
  const [disapproved, setDisapproved] = useState<string[]>([]);

  function toggle(id: string) {
    setDisapproved((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));
  }

  function countBallot() {
    if (disapproved.length === 0) {
      const proceed = confirm('Bạn chưa loại ứng viên nào. Bạn có chắc chắn muốn tiếp tục?');
      if (!proceed) return;
    }

    const approved = state.candidates.filter((c: any) => !disapproved.includes(c.id)).map((c: any) => c.id);
    dispatch({ type: 'COUNT_BALLOT', payload: approved });
    setDisapproved([]);
  }

  function next() {
    countBallot();
    setDisapproved([]);
  }

  function finish() {
    if (confirm('Bạn có chắc chắn muốn kết thúc kiểm phiếu?')) {
      countBallot();
      go('report');
    }
  }

  return (
    <div className='min-h-screen flex flex-col bg-gray-100'>
      <div className='bg-blue-600 text-white p-4 text-xl text-center font-bold'>Phiếu bầu số {state.ballotCount + 1}</div>

      <div className='text-center text-lg py-2'>
        Chạm để <b className='text-red-600'>LOẠI</b> ứng viên
      </div>

      <div className='flex-1 overflow-y-auto p-3 space-y-3'>
        {state.candidates.map((c: any, index: number) => (
          <button
            key={c.id}
            onClick={() => toggle(c.id)}
            className={`w-full h-16 rounded-xl flex items-center justify-between px-4 text-lg font-semibold border
              ${disapproved.includes(c.id) ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-800'}`}
          >
            <span>{`${index + 1}: ${c.name}`}</span>
            <span className='text-2xl'>{disapproved.includes(c.id) ? '❌' : '✔'}</span>
          </button>
        ))}
      </div>

      <div className='p-3 space-y-3'>
        <button onClick={next} className='w-full h-16 bg-green-600 text-white text-xl font-bold rounded-xl'>
          LƯU VÀ TIẾP TỤC
        </button>

        <button onClick={finish} className='w-full h-14 bg-yellow-500 text-white text-lg font-bold rounded-xl'>
          KẾT THÚC KIỂM PHIẾU
        </button>
      </div>
    </div>
  );
}

