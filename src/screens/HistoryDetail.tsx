import { useEffect } from "react";
import VoteResultList from "../components/VoteResultList";
import ScreenLayout from "../components/ScreenLayout";
import { buildResultText, shareResult } from "../utils/share";
import { useAnalytics, ScreenName } from "../analytics";
import type { HistoryRecord, Screen } from "../types";

type Props = {
  record: HistoryRecord;
  navigate: (screen: Screen) => void;
};

export default function HistoryDetail({ record, navigate }: Props) {
  const { trackScreenView, trackResults, updateActivity } = useAnalytics();

  // Track screen view when component mounts
  useEffect(() => {
    trackScreenView(ScreenName.HISTORY_DETAIL);
  }, [trackScreenView]);

  async function handleShare() {
    updateActivity();

    const text = buildResultText({
      title: "KẾT QUẢ",
      time: record.time,
      candidates: record.candidates,
      votes: record.votes,
      ballotCount: record.ballotCount,
    });

    try {
      await shareResult(text);

      // Determine share method based on browser support
      const method = typeof navigator.share === "function" ? "native" : "clipboard";

      // Track successful share
      trackResults.shared(method, record.candidates.length, record.ballotCount, "history_record");
    } catch (error) {
      console.error("Share failed:", error);
    }
  }

  function handleBackClick() {
    updateActivity();
    navigate("history");
  }
  return (
    <ScreenLayout>
      <h2 className="text-2xl font-bold text-center mb-2">KẾT QUẢ KIỂM PHIẾU</h2>

      <div className="text-center text-sm text-gray-600 mb-3">
        {new Date(record.time).toLocaleString("vi-VN")}
      </div>

      <div className="text-center text-lg mb-4">
        Tổng số phiếu: <b>{record.ballotCount}</b>
      </div>

      <div className="flex-1 overflow-y-auto">
        <VoteResultList
          candidates={record.candidates}
          votes={record.votes}
          ballotCount={record.ballotCount}
        />
      </div>

      <button
        onClick={handleShare}
        className="mt-6 w-full h-14 bg-green-600 text-white text-lg font-bold rounded-xl active:scale-95 transition-all duration-100 active:bg-green-700"
      >
        CHIA SẺ KẾT QUẢ
      </button>

      <button
        onClick={handleBackClick}
        className="mt-2 w-full h-14 bg-gray-600 text-white text-lg font-bold rounded-xl active:scale-95 transition-all duration-100 active:bg-gray-700"
      >
        QUAY LẠI
      </button>
    </ScreenLayout>
  );
}
