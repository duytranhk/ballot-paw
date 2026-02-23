import React from 'react';
import { BallotContext } from '../context/BallotContext';

export default function Setup({ go }: { go: (screen: 'setup' | 'count' | 'report') => void }) {
  const { dispatch } = React.useContext(BallotContext);
  const [text, setText] = React.useState('');

  function start() {
    const names = text
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    if (names.length === 0) return alert('Vui long nhập danh sách ứng viên, mỗi ứng viên trên một dòng');

    const candidates = names.map((name, i) => ({ id: String(i), name }));
    dispatch({ type: 'SET_CANDIDATES', payload: candidates });
    go('count');
  }

  return (
    <div className='min-h-screen p-4 flex flex-col bg-gray-50'>
      <h1 className='text-2xl font-bold text-center mb-4'>ĐẾM PHIẾU BẦU</h1>

      <label className='text-lg font-semibold mb-2'>Nhập danh sách ứng viên (mỗi ứng viên trên một dòng):</label>
      <textarea
        className='border rounded p-2 mb-4 h-48 resize-none'
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Ví dụ:\nNguyễn Văn A\nTrần Thị B\nLê Văn C'
      />

      <button className='mt-4 h-16 bg-green-600 text-white text-xl font-bold rounded-xl' onClick={start}>
        BẮT ĐẦU KIỂM PHIẾU
      </button>
    </div>
  );
}

