import { useState } from 'react';
import { useBallot } from '../hooks/useBallot';
import { useErrorBanner } from '../hooks/useErrorBanner';
import { vibrate } from '../utils/haptics';
import ScreenLayout from '../components/ScreenLayout';
import ErrorBanner from '../components/ErrorBanner';
import IndexBadge from '../components/IndexBadge';
import type { Candidate, Screen } from '../types';

type Props = { navigate: (screen: Screen) => void };

export default function Setup({ navigate }: Props) {
  const { state, dispatch } = useBallot();
  const [name, setName] = useState('');
  const [list, setList] = useState<Candidate[]>(state.candidates);
  const { errorMsg, showError } = useErrorBanner();

  function addCandidate() {
    vibrate();
    if (!name.trim()) return;
    setList([...list, { id: crypto.randomUUID(), name: name.trim() }]);
    setName('');
  }

  function remove(id: string) {
    vibrate();
    setList(list.filter((c) => c.id !== id));
  }

  function start() {
    vibrate();
    if (!list.length) {
      showError('Vui lòng nhập ít nhất 1 ứng viên trước khi bắt đầu.');
      return;
    }
    dispatch({ type: 'SET_CANDIDATES', payload: list });
    navigate('count');
  }

  return (
    <ScreenLayout>
      <h1 className='text-2xl font-bold text-center mb-1'>ĐẾM PHIẾU BẦU</h1>
      <p className='text-sm text-gray-400 italic text-center mb-1'>Khu Phố An Bình 2 - Phường Long An</p>
      <button onClick={() => navigate('guide')} className='h-10 text-blue-500 text-sm underline underline-offset-2 mb-4'>
        Hướng dẫn sử dụng
      </button>
      <ErrorBanner message={errorMsg} />

      <div className='flex gap-2 mb-4'>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addCandidate()}
          placeholder='Nhập tên ứng viên'
          className='flex-1 p-3 text-lg border rounded-xl'
        />
        <button onClick={addCandidate} className='px-4 bg-green-600 text-white font-bold rounded-xl active:scale-95 transition-all duration-100 active:bg-green-700'>
          + THÊM
        </button>
      </div>

      <div className='flex-1 overflow-y-auto'>
        {list.map((c, i) => (
          <div key={c.id} className='flex justify-between px-4 py-4 text-lg bg-white rounded-xl shadow mb-3'>
            <span className='flex items-center gap-2'>
              <IndexBadge index={i + 1} />
              {c.name}
            </span>
            <button onClick={() => remove(c.id)} className='text-red-600 font-bold text-xl px-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-5 h-5'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <polyline points='3 6 5 6 21 6' />
                <path d='M19 6l-1 14H6L5 6' />
                <path d='M10 11v6' />
                <path d='M14 11v6' />
                <path d='M9 6V4h6v2' />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <button onClick={start} className='mt-4 h-16 bg-green-600 text-white text-xl font-bold rounded-xl active:scale-95 active:bg-green-700 transition-all duration-100'>
        BẮT ĐẦU KIỂM PHIẾU
      </button>
      <button onClick={() => navigate('history')} className='mt-2 h-12 bg-blue-600 text-white text-lg font-bold rounded-xl'>
        XEM LỊCH SỬ KIỂM PHIẾU
      </button>
    </ScreenLayout>
  );
}

