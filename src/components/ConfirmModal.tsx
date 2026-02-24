type Props = {
  message: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
};

export default function ConfirmModal({ message, description, onConfirm, onCancel, confirmLabel = 'Xác nhận', cancelLabel = 'Huỷ' }: Props) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6'>
      <div className='w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-5'>
        <div className='flex flex-col gap-1 text-center'>
          <p className='text-lg font-semibold text-gray-800'>{message}</p>
          {description && <p className='text-sm text-gray-500'>{description}</p>}
        </div>
        <div className='flex gap-3'>
          <button onClick={onCancel} className='flex-1 h-12 rounded-xl border border-gray-300 text-gray-700 font-bold text-base active:scale-95 transition-all duration-100'>
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className='flex-1 h-12 rounded-xl bg-yellow-500 text-white font-bold text-base active:scale-95 active:bg-yellow-600 transition-all duration-100'
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

