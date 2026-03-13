import { useState, useEffect, useRef } from "react";
import ConfirmModal from "../components/ConfirmModal";
import ErrorBanner from "../components/ErrorBanner";
import IndexBadge from "../components/IndexBadge";
import ScreenLayout from "../components/ScreenLayout";
import { useBallot } from "../hooks/useBallot";
import { useErrorBanner } from "../hooks/useErrorBanner";
import { useAnalytics, ScreenName } from "../analytics";
import type { Screen } from "../types";
import { vibrate } from "../utils/haptics";

type Props = { navigate: (screen: Screen) => void };

export default function Counting({ navigate }: Props) {
  const { state, dispatch } = useBallot();
  const [approved, setApproved] = useState<string[]>([]);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [ballotKey, setBallotKey] = useState(0);
  const [slideDir, setSlideDir] = useState<"left" | "right">("left");
  const { errorMsg, showError } = useErrorBanner();
  const { trackScreenView, trackCounting, trackError, updateActivity } = useAnalytics();

  // Track ballot timing
  const ballotStartTime = useRef<number>(0);
  const sessionStartTime = useRef<number>(0);
  const undoCount = useRef<number>(0);

  const hasPrevious = state.ballotCount > 0;

  // Track screen view and counting start when component mounts
  useEffect(() => {
    trackScreenView(ScreenName.COUNTING);
    trackCounting.start(state.candidates.length);
    const now = Date.now();
    sessionStartTime.current = now;
    ballotStartTime.current = now;
  }, [trackScreenView, trackCounting, state.candidates.length]);

  function toggle(id: string) {
    updateActivity();
    setApproved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function validateDisapproved(): boolean {
    if (approved.length === 0) {
      const error = `Phiếu bầu số ${state.ballotCount + 1} không hợp lệ — vui lòng chọn ít nhất 1 ứng viên.`;
      showError(error);

      // Track validation error
      trackError("no_approvals", error, "counting");
      return false;
    }
    return true;
  }

  function countBallot() {
    const disapprovedCount = state.candidates.length - approved.length;

    // Calculate time spent on this ballot
    const timeSpent = (Date.now() - ballotStartTime.current) / 1000;

    // Track ballot completion
    trackCounting.ballotCounted(
      state.ballotCount + 1,
      disapprovedCount,
      approved.length,
      timeSpent,
    );

    dispatch({ type: "COUNT_BALLOT", payload: approved });
    setApproved([]);

    // Reset ballot timer for next ballot
    ballotStartTime.current = Date.now();
  }

  function previous() {
    updateActivity();
    vibrate();

    const lastApproved = state.ballotLog[state.ballotLog.length - 1];

    // Track undo action
    trackCounting.ballotUndo(state.ballotCount, "user_initiated");
    undoCount.current++;

    setSlideDir("right");
    setBallotKey((k) => k + 1);
    dispatch({ type: "UNDO_BALLOT" });
    setApproved(lastApproved);

    // Reset ballot timer
    ballotStartTime.current = Date.now();
  }

  function next() {
    updateActivity();
    vibrate();
    if (!validateDisapproved()) return;
    setSlideDir("left");
    setBallotKey((k) => k + 1);
    countBallot();
  }

  function finish() {
    updateActivity();
    vibrate();
    setShowFinishConfirm(true);
  }

  function handleFinishConfirm() {
    setShowFinishConfirm(false);

    // Count final ballot if needed
    if (approved.length > 0) {
      setSlideDir("left");
      setBallotKey((k) => k + 1);
      countBallot();
    }

    // Calculate session duration
    const sessionDuration = (Date.now() - sessionStartTime.current) / 1000;

    // Track counting completion
    trackCounting.complete(
      state.ballotCount + (approved.length > 0 ? 1 : 0), // Include final ballot if counted
      state.candidates.length,
      sessionDuration,
      undoCount.current,
    );

    dispatch({ type: "SAVE_HISTORY" });
    navigate("report");
  }

  return (
    <ScreenLayout>
      {showFinishConfirm && (
        <ConfirmModal
          message={
            approved.length === 0
              ? `Phiếu bầu số ${state.ballotCount + 1} chưa được kiểm. Tiếp tục kết thúc?`
              : "Kết thúc kiểm phiếu?"
          }
          description={
            approved.length === 0
              ? "Phiếu chưa kiểm sẽ không được tính vào kết quả."
              : "Hành động này sẽ lưu kết quả và không thể hoàn tác."
          }
          confirmLabel="Kết thúc"
          onConfirm={handleFinishConfirm}
          onCancel={() => setShowFinishConfirm(false)}
        />
      )}

      <div className="bg-blue-600 text-white p-4 text-xl text-center font-bold">
        Phiếu bầu số {state.ballotCount + 1}
      </div>

      <div className="text-center text-lg py-2">
        Chạm để <b className="text-green-700">CHỌN</b> ứng viên được bầu
      </div>

      <ErrorBanner message={errorMsg} />

      <div
        key={ballotKey}
        className={`flex-1 overflow-y-auto p-3 space-y-3 ${slideDir === "left" ? "animate-slide-from-right" : "animate-slide-from-left"}`}
      >
        {state.candidates.map((c, index) => (
          <button
            key={c.id}
            onClick={() => toggle(c.id)}
            className={`w-full h-16 rounded-xl flex items-center justify-between px-4 text-lg font-semibold border active:scale-95 transition-all duration-100
              ${approved.includes(c.id) ? "bg-green-100 border-green-400 text-green-800" : ""}`}
          >
            <span className="flex items-center gap-3">
              <IndexBadge index={index + 1} />
              {c.name}
            </span>
            <span className="text-2xl">{approved.includes(c.id) ? "✔" : ""}</span>
          </button>
        ))}
      </div>

      <div className="p-3 space-y-3">
        <div className="flex gap-3">
          {hasPrevious && (
            <button
              onClick={previous}
              className="flex-1 h-14 bg-gray-500 text-white text-md font-bold rounded-xl active:scale-95 active:bg-gray-600 transition-all duration-100"
            >
              ◀ PHIẾU TRƯỚC
            </button>
          )}
          <button
            onClick={next}
            className="flex-1 h-14 bg-green-600 text-white text-md font-bold rounded-xl active:scale-95 active:bg-green-700 transition-all duration-100"
          >
            PHIẾU KẾ TIẾP ▶
          </button>
        </div>

        <button
          onClick={finish}
          className="w-full h-14 bg-yellow-500 text-white text-lg font-bold rounded-xl active:scale-95 active:bg-yellow-600 transition-all duration-100"
        >
          KẾT THÚC KIỂM PHIẾU
        </button>
      </div>
    </ScreenLayout>
  );
}
