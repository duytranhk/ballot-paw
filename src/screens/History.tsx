import { useState, useEffect } from "react";
import { useBallot } from "../hooks/useBallot";
import { useAnalytics, ScreenName } from "../analytics";
import ScreenLayout from "../components/ScreenLayout";
import ConfirmModal from "../components/ConfirmModal";
import type { HistoryRecord, Screen } from "../types";

type Props = {
  navigate: (screen: Screen) => void;
  onOpenRecord: (record: HistoryRecord) => void;
};

export default function History({ navigate, onOpenRecord }: Props) {
  const { state, dispatch } = useBallot();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const { trackScreenView, trackHistory, updateActivity } = useAnalytics();

  // Track screen view when component mounts
  useEffect(() => {
    trackScreenView(ScreenName.HISTORY);
  }, [trackScreenView]);

  function handleOpenRecord(record: HistoryRecord) {
    updateActivity();
    trackHistory.detailViewed(record.id);
    onOpenRecord(record);
  }

  function handleDeleteConfirm() {
    if (pendingDeleteId) {
      updateActivity();
      trackHistory.deleted(pendingDeleteId);
      dispatch({ type: "DELETE_HISTORY", payload: pendingDeleteId });
    }
    setPendingDeleteId(null);
  }

  function handleBackClick() {
    updateActivity();
    navigate("setup");
  }

  return (
    <ScreenLayout>
      <h2 className="text-2xl font-bold text-center mb-4">LỊCH SỬ KIỂM PHIẾU</h2>

      {!state.history.length && (
        <div className="text-center text-gray-500">Chưa có dữ liệu kiểm phiếu</div>
      )}

      <div className="flex-1 space-y-3 overflow-y-auto">
        {state.history.map((h, i) => (
          <div key={h.id} className="w-full bg-white rounded-xl shadow flex items-center">
            <button
              onClick={() => handleOpenRecord(h)}
              className="flex-1 p-4 flex justify-between items-center active:scale-95 transition text-left"
            >
              <div>
                <div className="font-bold">Lần kiểm phiếu #{state.history.length - i}</div>
                <div className="text-sm text-gray-600">
                  {new Date(h.time).toLocaleString("vi-VN")}
                </div>
              </div>
              <div className="text-lg font-bold">{h.ballotCount} phiếu</div>
            </button>
            <button
              onClick={() => setPendingDeleteId(h.id)}
              className="px-4 py-4 text-red-500 active:text-red-700 active:scale-95 transition-all duration-100"
              aria-label="Xoá"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleBackClick}
        className="mt-6 w-full h-14 bg-gray-600 text-white text-lg font-bold rounded-xl active:scale-95 transition-all duration-100 active:bg-gray-700"
      >
        QUAY LẠI
      </button>

      {pendingDeleteId && (
        <ConfirmModal
          message="Xoá lịch sử kiểm phiếu?"
          description="Hành động này không thể hoàn tác."
          confirmLabel="Xoá"
          cancelLabel="Huỷ"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </ScreenLayout>
  );
}
