/* eslint-disable @typescript-eslint/no-explicit-any */
export default function HistoryDetail({ record, go }: any) {
  return (
    <div className='min-h-screen bg-gray-50 p-4 flex flex-col bg-gray-100'>
      <h2 className='text-2xl font-bold text-center mb-2'>KẾT QUẢ KIỂM PHIẾU</h2>

      <div className='text-center text-sm text-gray-600 mb-3'>{new Date(record.time).toLocaleString('vi-VN')}</div>

      <div className='text-center text-lg mb-4'>
        Tổng số phiếu: <b>{record.ballotCount}</b>
      </div>

      <div className='flex-1 overflow-y-auto p-3 space-y-3'>
        {record.candidates.map((c: any, index: number) => (
          <div key={c.id} className='bg-white shadow rounded-xl px-4 py-4 text-lg mt-3'>
            <div className='flex justify-between items-center mb-2'>
              <span>
                {index + 1}: {c.name}
              </span>
              <span className='text-sm text-gray-500'>{record.votes[c.id] ?? 0} Phiếu</span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-3'>
              <div
                className='bg-green-500 h-4 rounded-full transition-all duration-300'
                style={{ width: `${record.ballotCount ? ((record.votes[c.id] ?? 0) / record.ballotCount) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => go('history')} className='mt-6 w-full h-16 bg-blue-600 text-white text-xl font-bold rounded-xl active:scale-95 transition-all duration-100'>
        QUAY LẠI LỊCH SỬ
      </button>
    </div>
  );
}

