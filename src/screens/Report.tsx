import { useState, useEffect } from "react";
import { useBallot } from "../hooks/useBallot";
import { vibrate } from "../utils/haptics";
import { buildResultText, shareResult } from "../utils/share";
import { useAnalytics, ScreenName } from "../analytics";
import ScreenLayout from "../components/ScreenLayout";
import VoteResultList from "../components/VoteResultList";
import ConfirmModal from "../components/ConfirmModal";
import type { Screen } from "../types";

type Props = { navigate: (screen: Screen) => void };

export default function Report({ navigate }: Props) {
  const { state, dispatch } = useBallot();
  const [showConfirm, setShowConfirm] = useState(false);
  const { trackScreenView, trackResults, updateActivity } = useAnalytics();

  // Track screen view when component mounts
  useEffect(() => {
    trackScreenView(ScreenName.REPORT);
    trackResults.viewed();
  }, [trackScreenView, trackResults]);

  function handleConfirm() {
    setShowConfirm(false);
    updateActivity();
    vibrate();
    dispatch({ type: "RESET" });
    navigate("setup");
  }

  async function handleShare() {
    updateActivity();

    const text = buildResultText({
      title: "KẾT QUẢ CUỐI CÙNG",
      time: Date.now(),
      candidates: state.candidates,
      votes: state.votes,
      ballotCount: state.ballotCount,
    });

    try {
      await shareResult(text);

      // Determine share method based on browser support
      const method = typeof navigator.share === "function" ? "native" : "clipboard";

      // Track successful share
      trackResults.shared(method, state.candidates.length, state.ballotCount);
    } catch (error) {
      console.error("Share failed:", error);
    }
  }

  return (
    <ScreenLayout>
      {showConfirm && (
        <ConfirmModal
          message="Bạn muốn bắt đầu phiên kiểm phiếu mới?"
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <h2 className="text-2xl font-bold text-center mb-2">KẾT QUẢ CUỐI CÙNG</h2>

      <div className="text-center text-lg mb-4">
        Tổng số phiếu: <b>{state.ballotCount}</b>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto">
        <VoteResultList
          candidates={state.candidates}
          votes={state.votes}
          ballotCount={state.ballotCount}
        />
      </div>

      <button
        onClick={handleShare}
        className="mt-6 w-full h-14 bg-green-600 text-white text-lg font-bold rounded-xl active:scale-95 transition-all duration-100 active:bg-green-700"
      >
        CHIA SẺ KẾT QUẢ
      </button>

      <button
        onClick={() => setShowConfirm(true)}
        className="mt-2 w-full h-13 bg-blue-600 text-white text-xl font-bold rounded-xl active:scale-95 transition-all duration-100 active:bg-blue-700"
      >
        PHIÊN KIỂM PHIẾU MỚI
      </button>
    </ScreenLayout>
  );
}
