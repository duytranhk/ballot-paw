/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from 'react';
import { BallotContext } from '../context/BallotContext';

export default function Setup({ go }: { go: (screen: 'setup' | 'count' | 'report') => void }) {
  const { state, dispatch } = useContext(BallotContext);
  const [name, setName] = useState('');
  const [list, setList] = useState<any[]>(state.candidates);

  function addCandidate() {
    if (navigator?.vibrate) {
      navigator.vibrate(20);
    }
    if (!name.trim()) return;
    setList([...list, { id: crypto.randomUUID(), name: name.trim() }]);
    setName('');
  }

  function remove(id: string) {
    if (navigator?.vibrate) {
      navigator.vibrate(20);
    }
    setList(list.filter((c) => c.id !== id));
  }

  function start() {
    if (navigator?.vibrate) {
      navigator.vibrate(20);
    }
    if (!list.length) return alert('Vui lòng nhập ít nhất 1 ứng viên');
    dispatch({ type: 'SET_CANDIDATES', payload: list });
    go('count');
  }

  return (
    <div className='min-h-screen p-4 flex flex-col bg-gray-50'>
      <h1 className='text-2xl font-bold text-center mb-4'>HỆ THỐNG ĐẾM PHIẾU BẦU</h1>

      <div className='flex gap-2 mb-4'>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder='Nhập tên ứng viên' className='flex-1 p-3 text-lg border rounded-xl' />
        <button onClick={addCandidate} className='px-4 bg-green-600 text-white font-bold rounded-xl active:scale-98 transition-all duration-100 active:bg-green-700'>
          + THÊM
        </button>
      </div>

      <div className='flex-1 bg-white rounded-xl shadow divide-y overflow-y-auto'>
        {list.map((c, i) => (
          <div key={c.id} className='flex justify-between items-center px-4 py-3 text-lg'>
            <span>
              {i + 1}. {c.name}
            </span>
            <button onClick={() => remove(c.id)} className='text-red-600 font-bold text-xl px-2'>
              ✕
            </button>
          </div>
        ))}
      </div>

      <button onClick={start} className='mt-4 h-16 bg-green-600 text-white text-xl font-bold rounded-xl active:scale-98 active:bg-green-700 transition-all duration-100'>
        BẮT ĐẦU KIỂM PHIẾU
      </button>
    </div>
  );
}

