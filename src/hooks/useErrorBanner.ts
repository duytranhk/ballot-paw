import { useState, useRef } from "react";

export function useErrorBanner(durationMs = 3000) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showError(msg: string) {
    if (timer.current) clearTimeout(timer.current);
    setErrorMsg(msg);
    timer.current = setTimeout(() => setErrorMsg(null), durationMs);
  }

  function clearError() {
    if (timer.current) clearTimeout(timer.current);
    setErrorMsg(null);
  }

  return { errorMsg, showError, clearError };
}
