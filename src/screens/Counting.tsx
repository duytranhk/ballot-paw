import { useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import ErrorBanner from '../components/ErrorBanner';
import IndexBadge from '../components/IndexBadge';
import ScreenLayout from '../components/ScreenLayout';
import { useBallot } from '../hooks/useBallot';
import { useErrorBanner } from '../hooks/useErrorBanner';
import type { Screen } from '../types';
import { vibrate } from '../utils/haptics';

type Props = { navigate: (screen: Screen) => void };

export default function Counting({ navigate }: Props) {
  const { state, dispatch } = useBallot();
  const [disapproved, setDisapproved] = useState<string[]>([]);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [ballotKey, setBallotKey] = useState(0);
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('left');
  const { errorMsg, showError } = useErrorBanner();

  const hasPrevious = state.ballotCount > 0;

  function toggle(id: string) {
    setDisapproved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function validateDisapproved(): boolean {
    if (disapproved.length === 0) {
      showError(`Phiếu bầu số ${state.ballotCount + 1} không hợp lệ — vui lòng loại ít nhất 1 ứng viên.`);
      return false;
    }
    return true;
  }

  function countBallot() {
    const approved = state.candidates.filter((c) => !disapproved.includes(c.id)).map((c) => c.id);
    dispatch({ type: 'COUNT_BALLOT', payload: approved });
    setDisapproved([]);
  }

  function previous() {
    vibrate();
    const lastApproved = state.ballotLog[state.ballotLog.length - 1];
    const restored = state.candidates.filter((c) => !lastApproved.includes(c.id)).map((c) => c.id);
    setSlideDir('right');
    setBallotKey((k) => k + 1);
    dispatch({ type: 'UNDO_BALLOT' });
    setDisapproved(restored);
  }

  function next() {
    vibrate();
    if (!validateDisapproved()) return;
    setSlideDir('left');
    setBallotKey((k) => k + 1);
    countBallot();
  }

  function finish() {
    vibrate();
    setShowFinishConfirm(true);
  }

  function handleFinishConfirm() {
    setShowFinishConfirm(false);
    if (disapproved.length > 0) {
      setSlideDir('left');
      setBallotKey((k) => k + 1);
      countBallot();
    }
    dispatch({ type: 'SAVE_HISTORY' });
    navigate('report');
  }

  return (
    <ScreenLayout>
      {showFinishConfirm && (
        <ConfirmModal
          message={disapproved.length === 0 ? `Phiếu bầu số ${state.ballotCount + 1} chưa được kiểm. Tiếp tục kết thúc?` : 'Kết thúc kiểm phiếu?'}
          description={disapproved.length === 0 ? 'Phiếu chưa kiểm sẽ không được tính vào kết quả.' : 'Hành động này sẽ lưu kết quả và không thể hoàn tác.'}
          confirmLabel='Kết thúc'
          onConfirm={handleFinishConfirm}
          onCancel={() => setShowFinishConfirm(false)}
        />
      )}

      <div className='bg-blue-600 text-white p-4 text-xl text-center font-bold'>Phiếu bầu số {state.ballotCount + 1}</div>

      <div className='text-center text-lg py-2'>
        Chạm để <b className='text-red-600'>LOẠI</b> ứng viên
      </div>

      <ErrorBanner message={errorMsg} />

      <div key={ballotKey} className={`flex-1 overflow-y-auto p-3 space-y-3 ${slideDir === 'left' ? 'animate-slide-from-right' : 'animate-slide-from-left'}`}>
        {state.candidates.map((c, index) => (
          <button
            key={c.id}
            onClick={() => toggle(c.id)}
            className={`w-full h-16 rounded-xl flex items-center justify-between px-4 text-lg font-semibold border active:scale-95 transition-all duration-100
              ${disapproved.includes(c.id) ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-800'}`}
          >
            <span className='flex items-center gap-3'>
              <IndexBadge index={index + 1} />
              {c.name}
            </span>
            <span className='text-2xl'>{disapproved.includes(c.id) ? '❌' : '✔'}</span>
          </button>
        ))}
      </div>

      <div className='p-3 space-y-3'>
        <div className='flex gap-3'>
          {hasPrevious && (
            <button onClick={previous} className='flex-1 h-14 bg-gray-500 text-white text-md font-bold rounded-xl active:scale-95 active:bg-gray-600 transition-all duration-100'>
              ◀ PHIẾU TRƯỚC
            </button>
          )}
          <button onClick={next} className='flex-1 h-14 bg-green-600 text-white text-md font-bold rounded-xl active:scale-95 active:bg-green-700 transition-all duration-100'>
            PHIẾU KẾ TIẾP ▶
          </button>
        </div>

        <button onClick={finish} className='w-full h-14 bg-yellow-500 text-white text-lg font-bold rounded-xl active:scale-95 active:bg-yellow-600 transition-all duration-100'>
          KẾT THÚC KIỂM PHIẾU
        </button>
      </div>
    </ScreenLayout>
  );
}

