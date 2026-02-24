/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react';
import { BallotContext } from '../context/BallotContext';

export default function History({ go, open }: { go: (screen: 'setup' | 'count' | 'report') => void; open: (record: any) => void }) {
  const { state } = useContext(BallotContext);

  return (
    <div className='min-h-screen bg-gray-50 p-4 flex flex-col bg-gray-100'>
      <h2 className='text-2xl font-bold text-center mb-4'>LỊCH SỬ KIỂM PHIẾU</h2>

      {!state.history?.length && <div className='text-center text-gray-500'>Chưa có dữ liệu kiểm phiếu</div>}

      <div className='space-y-3'>
        {state.history?.map((h: any, i: number) => (
          <button key={h.id} onClick={() => open(h)} className='w-full p-4 bg-white rounded-xl shadow flex justify-between items-center active:scale-95 transition'>
            <div className='text-left'>
              <div className='font-bold'>Lần kiểm phiếu #{state.history.length - i}</div>
              <div className='text-sm text-gray-600'>{new Date(h.time).toLocaleString('vi-VN')}</div>
            </div>
            <div className='text-lg font-bold'>{h.ballotCount} phiếu</div>
          </button>
        ))}
      </div>

      <button
        onClick={() => go('setup')}
        className='mt-6 w-full h-14 bg-gray-600 text-white text-lg font-bold rounded-xl active:scale-95 transition-all duration-100 active:bg-gray-700'
      >
        QUAY LẠI
      </button>
    </div>
  );
}

